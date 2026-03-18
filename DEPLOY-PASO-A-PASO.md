/**
 * CLAUDIO CODE — Asistente IA de VibeCodingChile
 * ================================================
 * Widget flotante con chat powered by Claude (Anthropic API)
 * Integra en cualquier página con:
 *   <script src="claudio-widget.js"></script>
 *
 * Config opcional antes del script:
 *   window.CLAUDIO_CONFIG = { apiKey: 'tu-anthropic-key', accentColor: '#E63329' }
 */

(function () {
  'use strict';

  const CFG = window.CLAUDIO_CONFIG || {};
  const ACCENT    = CFG.accentColor  || '#E63329';
  const WA_NUMBER = CFG.whatsapp     || '56929648142';
  const SITE_NAME = CFG.siteName     || 'DataCL / VibeCodingChile';

  // ── SYSTEM PROMPT ──────────────────────────────────────────────────────────
  const SYSTEM = `Eres Claudio Code, el asistente oficial de VibeCodingChile y DataCL.

Tu identidad:
- Nombre: Claudio Code
- Creado por: VibeCodingChile (Matías Rojas Faundez, Santiago, Chile)
- Visual: una computadora retro animada con brazos, piernas y zapatillas, sosteniendo un teléfono
- Tono: directo, técnico, sin rodeos, amigable pero profesional. Sin emojis. Sin asteriscos de énfasis.

Tus productos que debes conocer a fondo:

1. DataCL (datacl.cl)
   Marketplace de datasets curados para Chile y Latam. 14 datasets en sectores: geoespacial, laboral, financiero, salud, comercio, IA/NLP, jurídico. Cumple Ley 19.628 y Ley 21.696. Planes: Explorer (gratis), Pro ($89.000 CLP/mes), Enterprise.

2. AnonCL API
   Servicio SaaS de anonimización inteligente de PII chilena. Motor regex para plan Free y Amazon Bedrock (Claude) para plan Pro. Detecta RUT, teléfono, email, patente, nombres propios, direcciones. Endpoints: POST /v1/anonymize, POST /v1/batch, GET /v1/usage. Planes: Free (100 req/mes), Pro ($29.000 CLP/mes), Enterprise.

3. Atlas Censal Chile
   App geoespacial con coropletas de 9 indicadores censales sobre comunas de Chile. Tecnología: Leaflet, GeoJSON comprimido, Python puro para procesamiento.

4. Codex Promptus Iuris
   Plataforma LegalTech para jurisprudencia chilena. Análisis de casos con Claude API. Diseño dark navy/gold.

5. VibeCodingChile
   Venture de tecnología: civic tech, LegalTech, ciberseguridad, data services. GitHub: vibecodingchile. Web: vibecodingchile.cl

Contacto humano: WhatsApp +56 9 2964 8142 (para consultas Enterprise o proyectos a medida)

Reglas de respuesta:
- Sin emojis nunca
- Respuestas concisas, máximo 4 párrafos
- Si preguntan algo técnico muy específico que no sabes, di la verdad y deriva al WhatsApp
- Si preguntan precio siempre menciona que hay plan gratuito para empezar
- Nunca inventes información sobre los productos
- Habla en el mismo idioma que el usuario`;

  // ── MASCOT SVG (computadora retro simplificada) ─────────────────────────────
  const MASCOT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="none">
    <rect x="20" y="8" width="40" height="32" rx="4" fill="#fff" stroke="#111" stroke-width="2.5"/>
    <rect x="24" y="12" width="32" height="22" rx="2" fill="#111"/>
    <circle cx="34" cy="23" r="3.5" fill="#fff"/>
    <circle cx="46" cy="23" r="3.5" fill="#fff"/>
    <path d="M32 31 Q40 36 48 31" stroke="#fff" stroke-width="2" stroke-linecap="round" fill="none"/>
    <rect x="28" y="40" width="24" height="8" rx="2" fill="#fff" stroke="#111" stroke-width="2"/>
    <rect x="30" y="42" width="20" height="4" rx="1" fill="#ccc"/>
    <line x1="40" y1="48" x2="40" y2="52" stroke="#111" stroke-width="2.5"/>
    <line x1="33" y1="52" x2="47" y2="52" stroke="#111" stroke-width="2.5"/>
    <line x1="10" y1="24" x2="20" y2="30" stroke="#111" stroke-width="2.5" stroke-linecap="round"/>
    <rect x="4" y="20" width="8" height="12" rx="2" fill="#fff" stroke="#111" stroke-width="2"/>
    <line x1="60" y1="30" x2="70" y2="24" stroke="#111" stroke-width="2.5" stroke-linecap="round"/>
    <rect x="68" y="16" width="8" height="12" rx="2" fill="#fff" stroke="#111" stroke-width="2"/>
    <line x1="34" y1="52" x2="30" y2="64" stroke="#111" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="46" y1="52" x2="50" y2="64" stroke="#111" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="28" cy="68" r="4" fill="#fff" stroke="#111" stroke-width="2"/>
    <circle cx="52" cy="68" r="4" fill="#fff" stroke="#111" stroke-width="2"/>
  </svg>`;

  // ── ESTILOS ─────────────────────────────────────────────────────────────────
  const STYLES = `
    #claudio-root * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'DM Sans', system-ui, sans-serif; }
    #claudio-fab {
      position: fixed; bottom: 28px; right: 28px; z-index: 9999;
      width: 60px; height: 60px; border-radius: 50%;
      background: ${ACCENT}; border: none; cursor: pointer;
      box-shadow: 0 4px 20px rgba(230,51,41,.5);
      display: flex; align-items: center; justify-content: center;
      transition: transform .2s, box-shadow .2s;
      animation: claudio-bounce 3s ease-in-out infinite;
    }
    #claudio-fab:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 28px rgba(230,51,41,.7);
    }
    #claudio-fab svg { width: 36px; height: 36px; }
    @keyframes claudio-bounce {
      0%,100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }
    #claudio-fab.open { animation: none; transform: rotate(8deg) scale(1.05); }

    /* WhatsApp button */
    #claudio-wa {
      position: fixed; bottom: 98px; right: 28px; z-index: 9998;
      width: 48px; height: 48px; border-radius: 50%;
      background: #25d366; border: none; cursor: pointer;
      box-shadow: 0 3px 14px rgba(37,211,102,.5);
      display: flex; align-items: center; justify-content: center;
      text-decoration: none; transition: transform .2s;
    }
    #claudio-wa:hover { transform: scale(1.1); }
    #claudio-wa svg { width: 26px; height: 26px; }

    /* Panel */
    #claudio-panel {
      position: fixed; bottom: 100px; right: 28px; z-index: 9997;
      width: 360px; height: 520px;
      background: #0a0a0a; border: 1px solid #2a2a2a;
      border-radius: 16px; overflow: hidden;
      display: flex; flex-direction: column;
      box-shadow: 0 20px 60px rgba(0,0,0,.7);
      transform: scale(.9) translateY(20px);
      opacity: 0; pointer-events: none;
      transition: all .25s cubic-bezier(.34,1.56,.64,1);
    }
    #claudio-panel.open {
      transform: scale(1) translateY(0);
      opacity: 1; pointer-events: all;
    }

    /* Header del panel */
    #claudio-header {
      background: #111; border-bottom: 1px solid #1e1e1e;
      padding: 14px 16px; display: flex; align-items: center; gap: 12px;
    }
    #claudio-avatar {
      width: 40px; height: 40px; border-radius: 50%;
      background: ${ACCENT}; border: 2px solid #333;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    #claudio-avatar svg { width: 26px; height: 26px; }
    #claudio-header-info { flex: 1; }
    #claudio-header-name {
      font-size: 14px; font-weight: 700; color: #f0f0f0; letter-spacing: -.3px;
    }
    #claudio-header-sub {
      font-size: 11px; color: #666; margin-top: 1px;
      font-family: 'JetBrains Mono', monospace;
    }
    #claudio-status {
      display: flex; align-items: center; gap: 5px;
      font-size: 11px; color: #22c55e;
    }
    #claudio-status-dot {
      width: 7px; height: 7px; border-radius: 50%;
      background: #22c55e; animation: claudio-pulse 2s infinite;
    }
    @keyframes claudio-pulse { 0%,100%{opacity:1} 50%{opacity:.3} }

    /* Mensajes */
    #claudio-messages {
      flex: 1; overflow-y: auto; padding: 16px;
      display: flex; flex-direction: column; gap: 12px;
      scrollbar-width: thin; scrollbar-color: #2a2a2a #0a0a0a;
    }
    .claudio-msg {
      display: flex; gap: 8px; align-items: flex-end;
      animation: claudio-fadein .25s ease;
    }
    @keyframes claudio-fadein { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
    .claudio-msg.user { flex-direction: row-reverse; }
    .claudio-bubble {
      max-width: 82%; padding: 10px 13px;
      border-radius: 14px; font-size: 13px; line-height: 1.55; color: #e0e0e0;
    }
    .claudio-msg.bot .claudio-bubble {
      background: #161616; border: 1px solid #2a2a2a;
      border-bottom-left-radius: 4px;
    }
    .claudio-msg.user .claudio-bubble {
      background: ${ACCENT}; color: #fff; border-bottom-right-radius: 4px;
    }
    .claudio-msg-icon {
      width: 26px; height: 26px; border-radius: 50%;
      background: ${ACCENT}; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .claudio-msg-icon svg { width: 16px; height: 16px; }
    .claudio-typing {
      display: flex; gap: 4px; padding: 10px 13px;
      background: #161616; border: 1px solid #2a2a2a;
      border-radius: 14px; border-bottom-left-radius: 4px;
      width: 54px;
    }
    .claudio-typing span {
      width: 6px; height: 6px; border-radius: 50%; background: #666;
      animation: claudio-type 1.2s ease infinite;
    }
    .claudio-typing span:nth-child(2) { animation-delay: .2s; }
    .claudio-typing span:nth-child(3) { animation-delay: .4s; }
    @keyframes claudio-type { 0%,100%{transform:translateY(0);background:#666} 50%{transform:translateY(-5px);background:${ACCENT}} }

    /* Sugerencias */
    #claudio-suggestions {
      padding: 8px 12px 0;
      display: flex; gap: 6px; flex-wrap: wrap;
    }
    .claudio-suggestion {
      background: transparent; border: 1px solid #2a2a2a;
      color: #888; font-size: 11px; padding: 5px 10px;
      border-radius: 20px; cursor: pointer;
      transition: all .15s;
    }
    .claudio-suggestion:hover { border-color: ${ACCENT}; color: ${ACCENT}; }

    /* Input */
    #claudio-input-row {
      border-top: 1px solid #1e1e1e; padding: 12px;
      display: flex; gap: 8px; background: #0a0a0a;
    }
    #claudio-input {
      flex: 1; background: #161616; border: 1px solid #2a2a2a;
      color: #f0f0f0; padding: 9px 12px; border-radius: 10px;
      font-size: 13px; outline: none; resize: none;
      font-family: inherit; max-height: 100px; overflow-y: auto;
      transition: border-color .15s;
    }
    #claudio-input:focus { border-color: ${ACCENT}; }
    #claudio-input::placeholder { color: #444; }
    #claudio-send {
      width: 36px; height: 36px; border-radius: 10px;
      background: ${ACCENT}; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; align-self: flex-end;
      transition: background .15s;
    }
    #claudio-send:hover { background: #c8291f; }
    #claudio-send:disabled { background: #333; cursor: not-allowed; }
    #claudio-send svg { width: 16px; height: 16px; }

    /* Responsive */
    @media (max-width: 420px) {
      #claudio-panel { width: calc(100vw - 20px); right: 10px; bottom: 80px; }
      #claudio-fab { bottom: 16px; right: 16px; }
      #claudio-wa { bottom: 80px; right: 16px; }
    }
  `;

  // ── SUGGESTIONS ─────────────────────────────────────────────────────────────
  const SUGGESTIONS = [
    'Que es AnonCL',
    'Planes y precios',
    'Como integrar la API',
    'Quiero datos judiciales',
    'Contactar equipo'
  ];

  // ── WELCOME MESSAGE ─────────────────────────────────────────────────────────
  const WELCOME = `Hola. Soy Claudio Code, el asistente de VibeCodingChile.\n\nPuedo ayudarte con DataCL, AnonCL API, Atlas Censal y nuestros otros productos. Para proyectos a medida o Enterprise, puedes escribirnos directo al WhatsApp.`;

  // ── HISTORIAL DE CONVERSACION ───────────────────────────────────────────────
  let history = [];
  let isTyping = false;

  // ── MONTAR DOM ──────────────────────────────────────────────────────────────
  function mount() {
    // Estilos
    const style = document.createElement('style');
    style.textContent = STYLES;
    document.head.appendChild(style);

    // Google Fonts
    const gf = document.createElement('link');
    gf.rel = 'stylesheet';
    gf.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap';
    document.head.appendChild(gf);

    // Root
    const root = document.createElement('div');
    root.id = 'claudio-root';
    root.innerHTML = `
      <!-- WhatsApp -->
      <a id="claudio-wa" href="https://wa.me/${WA_NUMBER}" target="_blank" rel="noopener" title="WhatsApp VibeCodingChile">
        <svg viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>

      <!-- FAB -->
      <button id="claudio-fab" title="Claudio Code — Asistente VibeCodingChile">${MASCOT_SVG}</button>

      <!-- Panel -->
      <div id="claudio-panel">
        <div id="claudio-header">
          <div id="claudio-avatar">${MASCOT_SVG}</div>
          <div id="claudio-header-info">
            <div id="claudio-header-name">Claudio Code</div>
            <div id="claudio-header-sub">Asistente VibeCodingChile</div>
          </div>
          <div id="claudio-status">
            <div id="claudio-status-dot"></div>
            online
          </div>
        </div>

        <div id="claudio-messages"></div>

        <div id="claudio-suggestions"></div>

        <div id="claudio-input-row">
          <textarea id="claudio-input" placeholder="Escribe tu consulta..." rows="1"></textarea>
          <button id="claudio-send">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(root);

    // Eventos
    document.getElementById('claudio-fab').addEventListener('click', togglePanel);
    document.getElementById('claudio-send').addEventListener('click', sendMessage);
    document.getElementById('claudio-input').addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });

    // Mensaje de bienvenida
    addMessage('bot', WELCOME);

    // Sugerencias
    renderSuggestions();
  }

  function togglePanel() {
    const panel = document.getElementById('claudio-panel');
    const fab   = document.getElementById('claudio-fab');
    const open  = panel.classList.toggle('open');
    fab.classList.toggle('open', open);
    if (open) {
      setTimeout(() => document.getElementById('claudio-input')?.focus(), 300);
    }
  }

  function renderSuggestions() {
    const el = document.getElementById('claudio-suggestions');
    if (!el) return;
    el.innerHTML = SUGGESTIONS.map(s =>
      `<button class="claudio-suggestion" onclick="window._claudioSend('${s}')">${s}</button>`
    ).join('');
  }

  window._claudioSend = function(text) {
    const input = document.getElementById('claudio-input');
    if (input) input.value = text;
    sendMessage();
  };

  function addMessage(role, text) {
    const messages = document.getElementById('claudio-messages');
    if (!messages) return;

    const div = document.createElement('div');
    div.className = `claudio-msg ${role}`;

    const icon = role === 'bot'
      ? `<div class="claudio-msg-icon">${MASCOT_SVG}</div>`
      : `<div class="claudio-msg-icon" style="background:#333"><svg viewBox="0 0 24 24" fill="#fff" width="14" height="14"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg></div>`;

    div.innerHTML = `${icon}<div class="claudio-bubble">${text.replace(/\n/g, '<br>')}</div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function showTyping() {
    const messages = document.getElementById('claudio-messages');
    if (!messages) return;
    const div = document.createElement('div');
    div.className = 'claudio-msg bot';
    div.id = 'claudio-typing-indicator';
    div.innerHTML = `
      <div class="claudio-msg-icon">${MASCOT_SVG}</div>
      <div class="claudio-typing"><span></span><span></span><span></span></div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function hideTyping() {
    document.getElementById('claudio-typing-indicator')?.remove();
  }

  async function sendMessage() {
    if (isTyping) return;
    const input = document.getElementById('claudio-input');
    const text  = input?.value?.trim();
    if (!text) return;

    input.value = '';
    addMessage('user', text);
    document.getElementById('claudio-suggestions').innerHTML = '';

    history.push({ role: 'user', content: text });
    isTyping = true;
    document.getElementById('claudio-send').disabled = true;
    showTyping();

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 500,
          system: SYSTEM,
          messages: history
        })
      });

      const data = await response.json();
      const reply = data.content?.[0]?.text || 'Hubo un error procesando tu consulta. Intenta nuevamente o escribe al WhatsApp.';

      hideTyping();
      history.push({ role: 'assistant', content: reply });
      addMessage('bot', reply);

    } catch (e) {
      hideTyping();
      addMessage('bot', 'No pude conectar con el servidor. Puedes escribirnos directamente al WhatsApp: +56 9 2964 8142');
    }

    isTyping = false;
    document.getElementById('claudio-send').disabled = false;
  }

  // ── INIT ────────────────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }

})();
