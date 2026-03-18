"""
AnonCL — Backend de Anonimización Inteligente
==============================================
Stack: FastAPI + AWS Bedrock (Claude claude-sonnet-4-20250514 via boto3)
Deploy: AWS Lambda (Mangum) o uvicorn local

Variables de entorno:
  AWS_REGION          = us-east-1  (o la región donde tienes Bedrock habilitado)
  AWS_ACCESS_KEY_ID   = (desde IAM)
  AWS_SECRET_ACCESS_KEY = (desde IAM)
  ANON_API_KEYS       = key1,key2,key3  (tus API keys para clientes)
  RATE_LIMIT_FREE     = 100   (requests/mes plan free)
  RATE_LIMIT_PRO      = 10000 (requests/mes plan pro)

Instalación local:
  pip install fastapi uvicorn boto3 slowapi python-dotenv mangum

Deploy Lambda:
  pip install mangum
  handler = Mangum(app)
"""

import os
import re
import json
import time
import hashlib
import boto3

from fastapi import FastAPI, Request, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from dotenv import load_dotenv

load_dotenv()

# ─── CONFIG ──────────────────────────────────────────────────────────────────
AWS_REGION  = os.getenv("AWS_REGION", "us-east-1")
ANON_KEYS   = set(k.strip() for k in os.getenv("ANON_API_KEYS","").split(",") if k.strip())
BEDROCK_MODEL = "anthropic.claude-3-5-sonnet-20241022-v2:0"  # Disponible en Bedrock

# ─── FASTAPI ──────────────────────────────────────────────────────────────────
limiter = Limiter(key_func=get_remote_address)
app = FastAPI(
    title="AnonCL API",
    description="Anonimización inteligente de PII chilena — powered by Amazon Bedrock",
    version="1.0.0"
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(CORSMiddleware, allow_origins=["*"],
                   allow_methods=["*"], allow_headers=["*"])

# ─── BOTO3 BEDROCK CLIENT ────────────────────────────────────────────────────
bedrock = boto3.client(
    service_name="bedrock-runtime",
    region_name=AWS_REGION
)

# ─── REGEX FALLBACK (tier free) ──────────────────────────────────────────────
RUT_RE   = re.compile(r'\b\d{1,2}\.?(?:\d{3})\.?(?:\d{3})-[\dkK]\b')
PHONE_RE = re.compile(r'\b(?:\+?56\s?)?(?:9\s?)?\d{4}\s?\d{4}\b')
EMAIL_RE = re.compile(r'\b[\w\.-]+@[\w\.-]+\.[A-Za-z]{2,}\b')
PLATE_RE = re.compile(r'\b(?:[A-Z]{2}\s?-?\s?\d{4}|[A-Z]{4}\s?-?\s?\d{2})\b')

def regex_anonymize(text: str) -> dict:
    counts_pre = {
        "RUT_CL":  len(RUT_RE.findall(text)),
        "PHONE_CL": len(PHONE_RE.findall(text)),
        "EMAIL":   len(EMAIL_RE.findall(text)),
        "PLATE_CL": len(PLATE_RE.findall(text)),
    }
    out = RUT_RE.sub("[RUT_CL]", text)
    out = PHONE_RE.sub("[PHONE_CL]", out)
    out = EMAIL_RE.sub("[EMAIL]", out)
    out = PLATE_RE.sub("[PLATE_CL]", out)
    return {"text": out, "entities_found": counts_pre, "method": "regex"}


# ─── BEDROCK ANONYMIZE ────────────────────────────────────────────────────────
BEDROCK_PROMPT = """Eres un sistema experto en protección de datos personales según la Ley 19.628 y Ley 21.696 de Chile.

Tu tarea es anonimizar el texto recibido detectando y reemplazando TODA información personal identificable (PII), incluyendo:
- RUT chileno (ej: 12.345.678-K)
- Nombres propios de personas
- Números de teléfono (con o sin código país +56)
- Correos electrónicos
- Direcciones físicas (calles, números, comunas, ciudades)
- Patentes de vehículos chilenos
- Números de cuentas bancarias o tarjetas
- Información de salud o condición médica
- Información laboral identificable (cargo + empresa + nombre)
- Cualquier combinación de datos que permita identificar a una persona

Reglas estrictas:
1. Reemplaza cada entidad PII con una etiqueta descriptiva entre corchetes: [NOMBRE], [RUT_CL], [EMAIL], [TELEFONO_CL], [DIRECCION_CL], [PATENTE_CL], [CUENTA_BANCARIA], [INFO_SALUD], [INFO_LABORAL]
2. Mantén la coherencia: si una persona aparece varias veces, usa el mismo tag [NOMBRE_1], [NOMBRE_2], etc.
3. NO modifiques el texto más allá de los reemplazos de PII
4. NO agregues comentarios ni explicaciones al texto anonimizado
5. Preserva el formato, puntuación y estructura del texto original

Responde SOLO con un JSON válido, sin markdown, sin texto extra:
{
  "text_anonymized": "texto con PII reemplazada",
  "entities": [
    {"type": "NOMBRE", "original": "Juan Pérez", "replacement": "[NOMBRE_1]", "confidence": 0.99},
    ...
  ],
  "summary": {
    "total_entities": N,
    "by_type": {"NOMBRE": N, "RUT_CL": N, ...}
  }
}

Texto a anonimizar:
"""

async def bedrock_anonymize(text: str) -> dict:
    payload = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": BEDROCK_PROMPT + text
            }
        ]
    }
    response = bedrock.invoke_model(
        modelId=BEDROCK_MODEL,
        body=json.dumps(payload),
        contentType="application/json",
        accept="application/json"
    )
    body = json.loads(response["body"].read())
    raw  = body["content"][0]["text"].strip()

    # Parsear JSON de respuesta
    clean = raw.replace("```json","").replace("```","").strip()
    result = json.loads(clean)
    result["method"] = "bedrock-claude"
    result["model"]  = BEDROCK_MODEL
    return result


# ─── MODELOS ──────────────────────────────────────────────────────────────────
class AnonRequest(BaseModel):
    text: str
    mode: str = "auto"       # "regex" | "bedrock" | "auto"
    strict: bool = True
    context: Optional[str] = "general"  # "general"|"salud"|"judicial"|"banca"

class BatchRequest(BaseModel):
    texts: list[str]
    mode: str = "bedrock"
    context: Optional[str] = "general"


# ─── AUTH HELPER ─────────────────────────────────────────────────────────────
def get_tier(api_key: Optional[str]) -> str:
    """Retorna el tier según la API key. Sin key = free (demo limitado)."""
    if not api_key:
        return "demo"
    if api_key in ANON_KEYS:
        return "pro"   # Extender para multi-tier con DB
    raise HTTPException(status_code=401, detail="API Key inválida")


# ═════════════════════════════════════════════════════════════════════════════
# ENDPOINTS
# ═════════════════════════════════════════════════════════════════════════════

@app.get("/")
def root():
    return {
        "service": "AnonCL API",
        "version": "1.0.0",
        "docs": "/docs",
        "powered_by": "Amazon Bedrock + VibeCodingChile",
        "compliance": ["Ley 19.628", "Ley 21.696"]
    }


@app.get("/health")
def health():
    return {"status": "ok", "timestamp": int(time.time())}


# ── POST /v1/anonymize ────────────────────────────────────────────────────────
@app.post("/v1/anonymize")
@limiter.limit("60/minute")
async def anonymize(
    req: AnonRequest,
    request: Request,
    x_api_key: Optional[str] = Header(default=None)
):
    """
    Anonimiza texto con PII chilena.
    
    - **mode=regex**: rápido, determinístico, solo patrones estructurados
    - **mode=bedrock**: IA contextual, detecta nombres, direcciones, info inferida
    - **mode=auto**: regex para demo/free, bedrock para pro+
    
    Requiere X-Api-Key header para modo bedrock (plan Pro+).
    """
    tier = get_tier(x_api_key)

    # Límite demo
    if tier == "demo" and len(req.text) > 2000:
        raise HTTPException(status_code=402,
            detail="Demo limitado a 2.000 caracteres. Obtén una API Key en datacl.cl/planes")

    t0 = time.time()

    # Elegir motor
    use_bedrock = (req.mode == "bedrock") or (req.mode == "auto" and tier == "pro")

    if use_bedrock and tier == "demo":
        raise HTTPException(status_code=402,
            detail="Modo Bedrock requiere plan Pro. Ver datacl.cl/planes")

    try:
        if use_bedrock:
            result = await bedrock_anonymize(req.text)
        else:
            result = regex_anonymize(req.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error procesando: {str(e)}")

    ms = round((time.time() - t0) * 1000, 1)

    # Verificación estricta post-proceso
    pii_residual = {}
    if req.strict:
        anon_text = result.get("text_anonymized") or result.get("text","")
        pii_residual = {k:v for k,v in regex_anonymize(anon_text)["entities_found"].items() if v > 0}

    return {
        "ok":          True,
        "tier":        tier,
        "method":      result.get("method"),
        "text":        result.get("text_anonymized") or result.get("text"),
        "entities":    result.get("entities", []),
        "summary":     result.get("summary", {}),
        "pii_residual": pii_residual,
        "strict_pass": len(pii_residual) == 0,
        "ms":          ms,
        "compliance":  ["Ley 19.628 Chile", "Ley 21.696 Chile"]
    }


# ── POST /v1/batch ────────────────────────────────────────────────────────────
@app.post("/v1/batch")
@limiter.limit("10/minute")
async def batch_anonymize(
    req: BatchRequest,
    request: Request,
    x_api_key: Optional[str] = Header(default=None)
):
    """
    Anonimiza múltiples textos (máx 50 por request). Solo plan Pro+.
    """
    tier = get_tier(x_api_key)
    if tier == "demo":
        raise HTTPException(status_code=402, detail="Batch requiere plan Pro+")
    if len(req.texts) > 50:
        raise HTTPException(status_code=400, detail="Máximo 50 textos por batch")

    results = []
    for text in req.texts:
        try:
            r = await bedrock_anonymize(text)
            results.append({"ok": True, "text": r.get("text_anonymized",""), "entities": r.get("entities",[])})
        except Exception as e:
            results.append({"ok": False, "error": str(e)})

    return {"ok": True, "total": len(results), "results": results}


# ── GET /v1/usage ─────────────────────────────────────────────────────────────
@app.get("/v1/usage")
async def usage(x_api_key: Optional[str] = Header(default=None)):
    """Retorna el uso actual del mes (requiere API Key)."""
    tier = get_tier(x_api_key)
    # TODO: conectar con DynamoDB/Redis para tracking real
    return {
        "tier":           tier,
        "requests_used":  0,
        "requests_limit": 100 if tier=="demo" else 10000,
        "reset_date":     "2026-04-01",
        "note":           "Tracking real disponible con DynamoDB"
    }


# ─── LAMBDA HANDLER (para deploy en AWS) ─────────────────────────────────────
try:
    from mangum import Mangum
    handler = Mangum(app)
except ImportError:
    pass  # Solo necesario en Lambda

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("bedrock_handler:app", host="0.0.0.0", port=8001, reload=True)
