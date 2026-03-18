/* ═══════════════════════════════════════════════
 DATACHILE — Main App JS
 ═══════════════════════════════════════════════ */

'use strict';

// ── STATE ────────────────────────────────────────────────────────────────────
const state = {
 page: 'catalog',
 search: '',
 category: 'todos',
 license: 'todos',
 format: 'todos',
 sort: 'relevance',
 selectedPricing: {}, // datasetId → plan key
 featuredIndex: 0
};

// ── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
 renderNav();
 showPage('catalog');
 updateHeroStats();
});

// ── NAV ──────────────────────────────────────────────────────────────────────
function renderNav() {
 const nav = document.getElementById('main-nav');
 nav.innerHTML = `
 <a href="#" class="nav-logo" onclick="showPage('catalog'); return false;">
 Data<span class="accent">CL</span>
 <span class="tag">BETA</span>
 </a>
 <nav class="nav-links">
 <button class="nav-link active" id="nav-catalog" onclick="showPage('catalog')">Catálogo</button>
 <button class="nav-link" id="nav-anon" onclick="showPage('anon')" style="color:var(--red)"> AnonCL</button>
 <button class="nav-link" id="nav-api" onclick="showPage('api')">API Docs</button>
 <button class="nav-link" id="nav-pricing" onclick="showPage('pricing')">Planes</button>
 <button class="nav-link" id="nav-upload" onclick="showPage('upload')">Subir Dataset</button>
 </nav>
 <div class="nav-actions">
 <a class="nav-maker-credit" href="https://vibecodingchile.com" target="_blank" rel="noopener" title="VibeCodingChile & ClaudioCode">
 <span></span><span>VBC</span><span style="opacity:.4">×</span><span></span><span>CC</span>
 </a>
 <button class="btn btn-ghost btn-sm" onclick="toast('🚧 Próximamente disponible')">Ingresar</button>
 <button class="btn btn-primary btn-sm" onclick="toast(' ¡Registro muy pronto!')">Registrarse gratis</button>
 </div>
 `;
}

function setNavActive(page) {
 document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
 const el = document.getElementById(`nav-${page}`);
 if (el) el.classList.add('active');
}

// ── PAGES ────────────────────────────────────────────────────────────────────
function showPage(page) {
 state.page = page;
 setNavActive(page);
 const app = document.getElementById('app');

 const pages = {
 catalog: renderCatalogPage,
 api: renderAPIPage,
 pricing: renderPricingPage,
 upload: renderUploadPage,
 anon: renderAnonPage
 };

 app.innerHTML = '';
 (pages[page] || pages.catalog)();
 window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── CATALOG PAGE ─────────────────────────────────────────────────────────────
function renderCatalogPage() {
 const app = document.getElementById('app');
 app.innerHTML = `
 <!-- HERO -->
 <section class="hero">
 <div class="hero-bg-grid"></div>
 <div class="hero-glow hero-glow-1"></div>
 <div class="hero-glow hero-glow-2"></div>
 <div class="container">
 <div class="hero-content">
 <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:24px">
 <div class="hero-eyebrow" style="margin-bottom:0">Beta pública · Chile & Latam</div>
 <div class="hero-built-by">
 Construido por
 <a href="https://vibecodingchile.com" target="_blank" rel="noopener" class="hero-built-link">
 VibeCodingChile
 </a>
 &
 <span class="hero-built-link" style="cursor:default"> ClaudioCode</span>
 </div>
 </div>
 <h1 class="hero-title t-display">
 El mercado de<br>
 <span class="line2">datos de <em>Chile</em>.</span>
 </h1>
 <p class="hero-sub">Datasets curados, limpios y listos para usar. Para desarrolladores, investigadores y empresas que necesitan datos locales de calidad.</p>
 <div class="hero-cta">
 <button class="btn btn-primary btn-xl" onclick="document.getElementById('catalog-anchor').scrollIntoView({behavior:'smooth'})">
 Explorar datasets →
 </button>
 <button class="btn btn-ghost btn-lg" onclick="showPage('api')">Ver API docs</button>
 </div>
 <div class="hero-stats">
 <div class="hero-stat">
 <div class="stat-n" id="hs-datasets">48<span>+</span></div>
 <div class="stat-l">Datasets activos</div>
 </div>
 <div class="hero-stat">
 <div class="stat-n">7</div>
 <div class="stat-l">Sectores cubiertos</div>
 </div>
 <div class="hero-stat">
 <div class="stat-n" id="hs-dls">14K<span>+</span></div>
 <div class="stat-l">Descargas totales</div>
 </div>
 <div class="hero-stat">
 <div class="stat-n">API</div>
 <div class="stat-l">Acceso programático</div>
 </div>
 </div>
 </div>
 </div>
 </section>

 <!-- SEARCHBAR -->
 <div class="searchbar" id="catalog-anchor">
 <div class="container">
 <div class="searchbar-inner">
 <div class="search-row">
 <div class="search-field">
 <span class="search-icon-el">⌕</span>
 <input
 class="search-input"
 id="search-input"
 type="text"
 placeholder="Buscar datasets... (ej: bienes raíces, NLP, jurisprudencia)"
 value="${state.search}"
 oninput="onSearch(this.value)"
 autocomplete="off"
 >
 </div>
 </div>
 <div class="chip-row" id="sector-chips">
 ${renderChips()}
 </div>
 </div>
 </div>
 </div>

 <!-- CATALOG BODY -->
 <div class="container">
 <div class="catalog-layout">
 <!-- SIDEBAR -->
 ${renderSidebar()}

 <!-- MAIN -->
 <div>
 <div class="catalog-header">
 <div class="catalog-title-row">
 <h2>Datasets disponibles</h2>
 <div class="catalog-count" id="catalog-count"></div>
 </div>
 <div class="sort-wrap">
 <select onchange="onSort(this.value)">
 <option value="relevance">Más relevantes</option>
 <option value="rating">Mejor valorados</option>
 <option value="downloads">Más descargados</option>
 <option value="price-asc">Precio: menor a mayor</option>
 <option value="price-desc">Precio: mayor a menor</option>
 <option value="recent">Más recientes</option>
 </select>
 </div>
 </div>

 <!-- FEATURED -->
 <div class="featured-wrap" id="featured-wrap"></div>

 <!-- GRID -->
 <div class="dataset-grid" id="dataset-grid"></div>
 </div>
 </div>
 </div>
 `;

 renderCatalog();
}

function renderChips() {
 const sectors = [
 { id: 'todos', label: 'Todos' },
 { id: 'geo', label: ' Geoespacial' },
 { id: 'laboral', label: ' Laboral' },
 { id: 'financiero', label: ' Financiero' },
 { id: 'salud', label: ' Salud' },
 { id: 'comercio', label: ' Comercio' },
 { id: 'ia', label: ' IA / NLP' },
 { id: 'juridico', label: ' Jurídico' }
 ];
 return sectors.map(s => `
 <button class="chip ${state.category === s.id ? 'active' : ''}"
 onclick="onCategory('${s.id}')">${s.label}</button>
 `).join('');
}

function renderSidebar() {
 const licenseItems = [
 { id: 'todos', label: 'Todas las licencias', count: 14 },
 { id: 'comercial', label: 'Uso comercial', count: 8 },
 { id: 'dual', label: 'Dual (personal + com.)', count: 4 },
 { id: 'personal', label: 'Solo investigación', count: 2 }
 ];
 const formatItems = [
 { id: 'todos', label: 'Todos los formatos', count: 14 },
 { id: 'CSV', label: 'CSV / Excel', count: 10 },
 { id: 'JSON', label: 'JSON / API', count: 7 },
 { id: 'Parquet', label: 'Parquet', count: 9 },
 { id: 'GeoJSON', label: 'GeoJSON / Shapefile', count: 3 }
 ];

 return `
 <aside class="sidebar">
 <div class="sidebar-section">
 <div class="sidebar-label">Licencia</div>
 ${licenseItems.map(i => `
 <div class="sidebar-item ${state.license === i.id ? 'active' : ''}"
 onclick="onLicense('${i.id}')">
 ${i.label}
 <span class="sidebar-badge">${i.count}</span>
 </div>
 `).join('')}
 </div>
 <div class="sidebar-divider"></div>
 <div class="sidebar-section">
 <div class="sidebar-label">Formato</div>
 ${formatItems.map(i => `
 <div class="sidebar-item ${state.format === i.id ? 'active' : ''}"
 onclick="onFormat('${i.id}')">
 ${i.label}
 <span class="sidebar-badge">${i.count}</span>
 </div>
 `).join('')}
 </div>
 <div class="sidebar-divider"></div>
 <div class="sidebar-section">
 <div class="sidebar-label">API</div>
 <div class="sidebar-item" onclick="showPage('api')" style="color:#7DD3FC">Ver documentación →</div>
 </div>
 </aside>
 `;
}

function getFiltered() {
 let list = [...DATASETS];

 if (state.category !== 'todos') {
 list = list.filter(d => d.sector === state.category);
 }
 if (state.license !== 'todos') {
 list = list.filter(d => d.license === state.license);
 }
 if (state.format !== 'todos') {
 list = list.filter(d => d.format.some(f => f.includes(state.format)));
 }
 if (state.search) {
 const q = state.search.toLowerCase();
 list = list.filter(d =>
 d.title.toLowerCase().includes(q) ||
 d.shortDesc.toLowerCase().includes(q) ||
 d.tags.some(t => t.toLowerCase().includes(q)) ||
 d.sectorLabel.toLowerCase().includes(q)
 );
 }

 switch (state.sort) {
 case 'rating': list.sort((a,b) => b.rating - a.rating); break;
 case 'downloads': list.sort((a,b) => b.downloads - a.downloads); break;
 case 'price-asc': list.sort((a,b) => (a.pricePersonal||a.priceComercial||0) - (b.pricePersonal||b.priceComercial||0)); break;
 case 'price-desc':list.sort((a,b) => (b.priceComercial||0) - (a.priceComercial||0)); break;
 }

 return list;
}

function renderCatalog() {
 const filtered = getFiltered();
 const grid = document.getElementById('dataset-grid');
 const count = document.getElementById('catalog-count');
 const featuredWrap = document.getElementById('featured-wrap');
 if (!grid) return;

 count.textContent = `Mostrando ${filtered.length} de ${DATASETS.length} datasets`;

 // Featured
 const featured = filtered.find(d => d.featured) || filtered[0];
 if (featured && state.category === 'todos' && !state.search) {
 featuredWrap.innerHTML = `
 <div class="featured-card">
 <div class="featured-info">
 <div class="featured-title">${featured.title}</div>
 <div class="featured-desc">${featured.shortDesc}</div>
 <div style="display:flex;gap:12px;margin-top:12px;flex-wrap:wrap;align-items:center;">
 ${renderStars(featured.rating)}
 <span style="font-family:var(--font-mono);font-size:10px;color:var(--muted)">${featured.downloads.toLocaleString('es-CL')} descargas</span>
 <span class="license-tag license-${featured.license}">${featured.license.toUpperCase()}</span>
 </div>
 </div>
 <div class="featured-actions">
 <button class="btn btn-ghost btn-md" onclick="openModal('${featured.id}')">Ver detalles</button>
 <button class="btn btn-primary btn-md" onclick="openModal('${featured.id}')">
 ${featured.priceComercial ? `Desde $${(featured.pricePersonal||featured.priceComercial).toLocaleString('es-CL')} CLP` : 'Ver dataset'}
 </button>
 </div>
 </div>
 `;
 } else {
 featuredWrap.innerHTML = '';
 }

 // Grid
 if (filtered.length === 0) {
 grid.innerHTML = `
 <div class="empty-state">
 <div class="empty-icon"></div>
 <div class="empty-title">Sin resultados</div>
 <div class="empty-desc">Intenta con otros términos o cambia los filtros</div>
 </div>
 `;
 return;
 }

 grid.innerHTML = filtered.map(d => renderCard(d)).join('');
}

function renderCard(d) {
 const cfg = SECTOR_CONFIG[d.sector] || {};
 const priceStr = d.pricePersonal === 0
 ? '<span class="card-price free">Gratis</span>'
 : `<span class="card-price">$${(d.priceComercial||d.pricePersonal).toLocaleString('es-CL')}<sup> CLP</sup></span>`;

 return `
 <div class="dataset-card" onclick="openModal('${d.id}')">
 <div class="card-header">
 <span class="sector-tag" style="background:${cfg.bg};color:${cfg.color}">
 ${cfg.icon} ${d.sectorLabel}
 </span>
 <span class="license-tag license-${d.license}">${d.license.toUpperCase()}</span>
 </div>
 <div class="card-title">${d.title}</div>
 <div class="card-desc">${d.shortDesc}</div>
 <div class="card-meta">
 <span class="meta-pill"><span class="meta-pip"></span>${d.rows}</span>
 <span class="meta-pill"><span class="meta-pip"></span>${d.format[0]}</span>
 <span class="meta-pill"><span class="meta-pip"></span>${d.update}</span>
 <span class="meta-pill"><span class="meta-pip"></span>${d.region}</span>
 </div>
 <div class="card-footer">
 ${priceStr}
 <div style="display:flex;align-items:center;gap:10px;">
 ${renderStars(d.rating, d.reviews)}
 <button class="btn btn-surface btn-sm">Ver más</button>
 </div>
 </div>
 </div>
 `;
}

function renderStars(rating, reviews) {
 const full = Math.round(rating);
 const stars = '★'.repeat(full) + '☆'.repeat(5-full);
 return `<div class="stars">${stars} <span>${rating}${reviews ? ` (${reviews})` : ''}</span></div>`;
}

// ── MODAL ────────────────────────────────────────────────────────────────────
function openModal(id) {
 const d = DATASETS.find(x => x.id === id);
 if (!d) return;

 if (!state.selectedPricing[id]) {
 if (d.pricePersonal === 0) state.selectedPricing[id] = 'personal';
 else if (d.priceSuscripcion) state.selectedPricing[id] = 'comercial';
 else state.selectedPricing[id] = 'comercial';
 }

 const cfg = SECTOR_CONFIG[d.sector] || {};
 const modalEl = document.getElementById('modal-content');

 modalEl.innerHTML = `
 <div class="modal-header">
 <button class="modal-close" onclick="closeModal()">✕</button>
 <span class="sector-tag" style="background:${cfg.bg};color:${cfg.color}">${cfg.icon} ${d.sectorLabel}</span>
 <h2 class="modal-title">${d.title}</h2>
 <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-top:10px;">
 ${renderStars(d.rating, d.reviews)}
 <span style="font-family:var(--font-mono);font-size:11px;color:var(--muted)">${d.downloads.toLocaleString('es-CL')} descargas</span>
 <span class="license-tag license-${d.license}">${d.license.toUpperCase()}</span>
 <span style="font-family:var(--font-mono);font-size:11px;color:var(--muted)">Actualizado: ${d.lastUpdated}</span>
 </div>
 </div>

 <div class="modal-body">
 <p class="modal-desc">${d.longDesc}</p>

 <div class="modal-stats-grid">
 <div class="modal-stat-box">
 <div class="modal-stat-label">Tamaño</div>
 <div class="modal-stat-val">${d.rows}</div>
 </div>
 <div class="modal-stat-box">
 <div class="modal-stat-label">Archivo</div>
 <div class="modal-stat-val" style="font-size:13px">${d.fileSize}</div>
 </div>
 <div class="modal-stat-box">
 <div class="modal-stat-label">Actualización</div>
 <div class="modal-stat-val" style="font-size:13px">${d.update}</div>
 </div>
 <div class="modal-stat-box">
 <div class="modal-stat-label">Fuente</div>
 <div class="modal-stat-val" style="font-size:12px">${d.source}</div>
 </div>
 </div>

 <!-- FORMATS -->
 <div class="modal-section">
 <div class="modal-section-title">Formatos disponibles</div>
 <div style="display:flex;gap:8px;flex-wrap:wrap">
 ${d.format.map(f => `<span style="padding:4px 12px;background:var(--surface2);border:1px solid var(--border);border-radius:6px;font-family:var(--font-mono);font-size:11px;color:#7DD3FC">${f}</span>`).join('')}
 </div>
 </div>

 <!-- TAGS -->
 <div class="modal-section">
 <div class="modal-section-title">Etiquetas</div>
 <div style="display:flex;gap:6px;flex-wrap:wrap">
 ${d.tags.map(t => `<span style="padding:3px 10px;background:var(--surface2);border:1px solid var(--border);border-radius:4px;font-size:11px;color:var(--muted2)">${t}</span>`).join('')}
 </div>
 </div>

 <!-- FIELDS -->
 <div class="modal-section">
 <div class="modal-section-title">Esquema de campos (${d.fields.length} columnas)</div>
 <div style="max-height:260px;overflow-y:auto;border:1px solid var(--border);border-radius:var(--radius)">
 <table class="fields-table">
 <thead>
 <tr>
 <th>Campo</th>
 <th>Tipo</th>
 <th>Descripción</th>
 </tr>
 </thead>
 <tbody>
 ${d.fields.map(f => `
 <tr>
 <td><span class="field-name">${f.name}</span></td>
 <td><span class="field-type">${f.type}</span></td>
 <td class="field-desc">${f.desc}</td>
 </tr>
 `).join('')}
 </tbody>
 </table>
 </div>
 </div>

 <!-- SAMPLE DATA -->
 <div class="modal-section">
 <div class="modal-section-title">Muestra de datos</div>
 <div class="sample-wrap">
 <pre>${JSON.stringify(d.sampleData, null, 2)}</pre>
 </div>
 </div>

 <!-- USE CASES -->
 <div class="modal-section">
 <div class="modal-section-title">Casos de uso típicos</div>
 <ul class="use-cases">
 ${d.useCases.map(u => `<li>${u}</li>`).join('')}
 </ul>
 </div>

 <!-- PRICING -->
 <div class="modal-section">
 <div class="modal-section-title">Opciones de licencia</div>
 <div class="pricing-grid">
 ${renderPricingOptions(d)}
 </div>
 </div>

 <!-- BUY -->
 <div class="buy-btn-wrap">
 <button class="btn-buy" onclick="handleBuy('${d.id}')">
 ${getSelectedPriceLabel(d)}
 </button>
 <div class="btn-buy-note">
 Pago seguro · Factura electrónica · Acceso inmediato tras confirmación
 </div>
 </div>

 <!-- API -->
 <div class="modal-section" style="margin-top:20px;padding:16px;background:var(--surface2);border-radius:var(--radius);border:1px solid var(--border)">
 <div style="display:flex;justify-content:space-between;align-items:center">
 <div>
 <div class="modal-stat-label" style="margin-bottom:4px">Endpoint API</div>
 <code style="font-family:var(--font-mono);font-size:12px;color:#7DD3FC">${d.apiEndpoint}</code>
 </div>
 <button class="btn btn-ghost btn-sm" onclick="showPage('api')">Ver docs API</button>
 </div>
 </div>
 </div>
 `;

 document.getElementById('modal-backdrop').classList.add('open');
 document.body.style.overflow = 'hidden';
}

function renderPricingOptions(d) {
 const sel = state.selectedPricing[d.id];
 const opts = [];

 if (d.pricePersonal !== null) {
 opts.push({
 key: 'personal',
 label: 'Investigación / Personal',
 price: d.pricePersonal,
 desc: 'Uso académico, tesis y proyectos personales. No incluye uso en productos comerciales.'
 });
 }
 if (d.priceComercial !== null) {
 opts.push({
 key: 'comercial',
 label: 'Uso Comercial',
 price: d.priceComercial,
 desc: 'Integración en productos, servicios y apps comerciales. Acceso perpetuo a la versión actual.',
 badge: 'MÁS POPULAR'
 });
 }
 if (d.priceSuscripcion !== null) {
 opts.push({
 key: 'suscripcion',
 label: 'Suscripción',
 price: d.priceSuscripcion,
 isMonthly: true,
 desc: 'Siempre actualizado. Acceso a todas las versiones futuras durante la suscripción.'
 });
 }

 return opts.map(o => `
 <div class="pricing-card ${sel === o.key ? 'selected' : ''}"
 onclick="selectPricing('${d.id}', '${o.key}')">
 ${o.badge ? `<div class="pricing-badge">${o.badge}</div>` : ''}
 <div class="pricing-label">${o.label}</div>
 <div class="pricing-price ${o.price === 0 ? 'free' : ''}">
 ${o.price === 0 ? 'Gratis' : `$${o.price.toLocaleString('es-CL')}`}
 ${o.price > 0 ? `<sub> CLP${o.isMonthly ? '/mes' : ''}</sub>` : ''}
 </div>
 <div class="pricing-desc">${o.desc}</div>
 </div>
 `).join('');
}

function selectPricing(datasetId, plan) {
 state.selectedPricing[datasetId] = plan;
 // Re-render pricing section
 const d = DATASETS.find(x => x.id === datasetId);
 if (!d) return;
 document.querySelectorAll('.pricing-card').forEach((el, i) => {
 // Re-render via re-opening (simple approach)
 });
 openModal(datasetId);
}

function getSelectedPriceLabel(d) {
 const plan = state.selectedPricing[d.id];
 const prices = { personal: d.pricePersonal, comercial: d.priceComercial, suscripcion: d.priceSuscripcion };
 const price = prices[plan];
 if (price === 0) return '⬇ Descargar gratis';
 if (!price) return 'Consultar precio';
 return `Adquirir — $${price.toLocaleString('es-CL')} CLP${plan === 'suscripcion' ? '/mes' : ''}`;
}

function handleBuy(datasetId) {
 const d = DATASETS.find(x => x.id === datasetId);
 const plan = state.selectedPricing[datasetId];
 const prices = { personal: d.pricePersonal, comercial: d.priceComercial, suscripcion: d.priceSuscripcion };
 const price = prices[plan];

 if (price === 0) {
 toast('📥 Preparando descarga gratuita... (Checkout en construcción)');
 closeModal();
 return;
 }
 toast(' Redirigiendo a checkout... (Webpay/Stripe próximamente)');
 closeModal();
}

function closeModal() {
 document.getElementById('modal-backdrop').classList.remove('open');
 document.body.style.overflow = '';
}

// ── FILTER HANDLERS ──────────────────────────────────────────────────────────
function onSearch(val) {
 state.search = val;
 renderCatalog();
}
function onCategory(cat) {
 state.category = cat;
 document.getElementById('sector-chips').innerHTML = renderChips();
 renderCatalog();
}
function onLicense(lic) {
 state.license = lic;
 document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
 event.currentTarget.classList.add('active');
 renderCatalog();
}
function onFormat(fmt) {
 state.format = fmt;
 renderCatalog();
}
function onSort(val) {
 state.sort = val;
 renderCatalog();
}

// ── API PAGE ─────────────────────────────────────────────────────────────────
function renderAPIPage() {
 const app = document.getElementById('app');
 app.innerHTML = `
 <div class="page-wrap">
 <div class="api-page">
 <div class="container">
 <div style="max-width:760px;margin-bottom:48px">
 <div class="hero-eyebrow" style="margin-bottom:20px">Documentación técnica</div>
 <h1 class="t-display" style="font-size:clamp(40px,5vw,64px);letter-spacing:-2px;margin-bottom:16px">DataCL API</h1>
 <p style="font-size:16px;color:#999;line-height:1.6">REST API para acceder programáticamente a todos los datasets. Autenticación por API Key. Rate limit: 1.000 req/hora en plan Gratuito.</p>
 </div>

 <div class="api-grid">
 <nav class="api-nav-sticky">
 <div style="font-family:var(--font-mono);font-size:9px;text-transform:uppercase;letter-spacing:2px;color:var(--muted);margin-bottom:12px">Contenido</div>
 <a class="api-sidebar-item" href="#auth">Autenticación</a>
 <a class="api-sidebar-item" href="#datasets">GET /datasets</a>
 <a class="api-sidebar-item" href="#dataset-detail">GET /datasets/:id</a>
 <a class="api-sidebar-item" href="#download">GET /datasets/:id/download</a>
 <a class="api-sidebar-item" href="#search">GET /datasets/search</a>
 <a class="api-sidebar-item" href="#sectors">GET /sectors</a>
 <a class="api-sidebar-item" href="#errors">Errores</a>
 <a class="api-sidebar-item" href="#sdks">SDKs</a>
 <div style="margin-top:20px;padding-top:16px;border-top:1px solid var(--border)">
 <button class="btn btn-outline-red btn-sm" style="width:100%" onclick="showPage('pricing')">Ver planes API</button>
 </div>
 </nav>

 <div>
 <!-- AUTH -->
 <div class="api-section" id="auth">
 <div class="api-section-title">Autenticación</div>
 <p class="api-section-desc">Todas las peticiones requieren un header <code style="font-family:var(--font-mono);color:#7DD3FC">X-API-Key</code> con tu clave de acceso. Obtén tu API key gratis registrándote.</p>
 <div class="code-block">
 <div class="code-lang">curl</div>
 <pre><span class="comment"># Ejemplo de petición autenticada</span>
curl -X GET "https://api.datachile.io/v1/datasets" \\
 -H <span class="string">"X-API-Key: dcl_live_xxxxxxxxxxxxxxxx"</span> \\
 -H <span class="string">"Content-Type: application/json"</span></pre>
 </div>
 <div class="code-block">
 <div class="code-lang">python</div>
 <pre><span class="comment"># Python SDK (pip install datachile)</span>
<span class="key">import</span> datachile

client = datachile.Client(api_key=<span class="string">"dcl_live_xxx"</span>)
datasets = client.datasets.list(sector=<span class="string">"financiero"</span>)
<span class="key">print</span>(datasets)</pre>
 </div>
 </div>

 <!-- LIST -->
 <div class="api-section" id="datasets">
 <div class="api-section-title">Listar datasets</div>
 <div class="endpoint-row">
 <span class="method-badge method-get">GET</span>
 <span class="endpoint-url">/v1/datasets</span>
 </div>
 <p class="api-section-desc">Retorna el catálogo completo de datasets disponibles con metadata básica. Soporta filtros y paginación.</p>
 <table class="param-table" style="margin-bottom:16px">
 <thead><tr><th>Parámetro</th><th>Tipo</th><th>Requerido</th><th>Descripción</th></tr></thead>
 <tbody>
 <tr><td class="param-name">sector</td><td>string</td><td class="param-opt">opcional</td><td>Filtrar por sector: geo, laboral, financiero, salud, comercio, ia, juridico</td></tr>
 <tr><td class="param-name">license</td><td>string</td><td class="param-opt">opcional</td><td>Filtrar por licencia: personal, comercial, dual</td></tr>
 <tr><td class="param-name">format</td><td>string</td><td class="param-opt">opcional</td><td>Filtrar por formato: CSV, JSON, Parquet, GeoJSON</td></tr>
 <tr><td class="param-name">limit</td><td>integer</td><td class="param-opt">opcional</td><td>Resultados por página (default: 20, max: 100)</td></tr>
 <tr><td class="param-name">offset</td><td>integer</td><td class="param-opt">opcional</td><td>Offset para paginación</td></tr>
 </tbody>
 </table>
 <div class="code-block">
 <div class="code-lang">json</div>
 <pre>{
 <span class="key">"data"</span>: [
 {
 <span class="key">"id"</span>: <span class="string">"fin-001"</span>,
 <span class="key">"title"</span>: <span class="string">"Transacciones Inmobiliarias RM 2018–2024"</span>,
 <span class="key">"sector"</span>: <span class="string">"financiero"</span>,
 <span class="key">"rows"</span>: <span class="string">"2.4M transacciones"</span>,
 <span class="key">"format"</span>: [<span class="string">"CSV"</span>, <span class="string">"Parquet"</span>],
 <span class="key">"license"</span>: <span class="string">"comercial"</span>,
 <span class="key">"price_personal_clp"</span>: <span class="num">90000</span>,
 <span class="key">"price_comercial_clp"</span>: <span class="num">190000</span>,
 <span class="key">"rating"</span>: <span class="num">4.8</span>,
 <span class="key">"downloads"</span>: <span class="num">748</span>
 }
 ],
 <span class="key">"meta"</span>: {
 <span class="key">"total"</span>: <span class="num">48</span>,
 <span class="key">"limit"</span>: <span class="num">20</span>,
 <span class="key">"offset"</span>: <span class="num">0</span>
 }
}</pre>
 </div>
 </div>

 <!-- DETAIL -->
 <div class="api-section" id="dataset-detail">
 <div class="api-section-title">Detalle de dataset</div>
 <div class="endpoint-row">
 <span class="method-badge method-get">GET</span>
 <span class="endpoint-url">/v1/datasets/:id</span>
 </div>
 <p class="api-section-desc">Retorna metadata completa de un dataset incluyendo schema de campos, muestra de datos y endpoints de descarga.</p>
 <div class="code-block">
 <div class="code-lang">curl</div>
 <pre>curl "https://api.datachile.io/v1/datasets/fin-001" \\
 -H <span class="string">"X-API-Key: dcl_live_xxx"</span></pre>
 </div>
 </div>

 <!-- DOWNLOAD -->
 <div class="api-section" id="download">
 <div class="api-section-title">Descargar dataset</div>
 <div class="endpoint-row">
 <span class="method-badge method-get">GET</span>
 <span class="endpoint-url">/v1/datasets/:id/download</span>
 </div>
 <p class="api-section-desc">Genera una URL de descarga firmada con validez de 15 minutos. Requiere licencia activa para el dataset solicitado.</p>
 <table class="param-table" style="margin-bottom:16px">
 <thead><tr><th>Parámetro</th><th>Tipo</th><th>Requerido</th><th>Descripción</th></tr></thead>
 <tbody>
 <tr><td class="param-name">format</td><td>string</td><td class="param-req">requerido</td><td>Formato deseado: CSV, Parquet, JSON, GeoJSON</td></tr>
 <tr><td class="param-name">columns</td><td>string</td><td class="param-opt">opcional</td><td>Columnas a incluir (separadas por coma). Default: todas</td></tr>
 <tr><td class="param-name">filter</td><td>string</td><td class="param-opt">opcional</td><td>Filtro SQL-like: ej. "region='Metropolitana'"</td></tr>
 </tbody>
 </table>
 <div class="code-block">
 <div class="code-lang">json</div>
 <pre>{
 <span class="key">"download_url"</span>: <span class="string">"https://cdn.datachile.io/signed/fin-001-2025.parquet?token=xxx"</span>,
 <span class="key">"expires_at"</span>: <span class="string">"2025-01-15T12:30:00Z"</span>,
 <span class="key">"file_size_bytes"</span>: <span class="num">1847291648</span>,
 <span class="key">"format"</span>: <span class="string">"Parquet"</span>,
 <span class="key">"rows"</span>: <span class="num">2400000</span>
}</pre>
 </div>
 </div>

 <!-- ERRORS -->
 <div class="api-section" id="errors">
 <div class="api-section-title">Códigos de error</div>
 <table class="param-table">
 <thead><tr><th>Código HTTP</th><th>Error</th><th>Descripción</th></tr></thead>
 <tbody>
 <tr><td><span class="field-type">400</span></td><td class="field-name">bad_request</td><td>Parámetros inválidos</td></tr>
 <tr><td><span class="field-type">401</span></td><td class="field-name">unauthorized</td><td>API key inválida o ausente</td></tr>
 <tr><td><span class="field-type">403</span></td><td class="field-name">license_required</td><td>No tienes licencia activa para este dataset</td></tr>
 <tr><td><span class="field-type">404</span></td><td class="field-name">not_found</td><td>Dataset no encontrado</td></tr>
 <tr><td><span class="field-type">429</span></td><td class="field-name">rate_limited</td><td>Límite de requests excedido</td></tr>
 <tr><td><span class="field-type">500</span></td><td class="field-name">server_error</td><td>Error interno — contáctanos</td></tr>
 </tbody>
 </table>
 </div>

 <!-- SDKs -->
 <div class="api-section" id="sdks">
 <div class="api-section-title">SDKs disponibles (próximamente)</div>
 <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
 ${['🐍 Python', ' Node.js', ' R'].map(sdk => `
 <div style="background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius);padding:16px;text-align:center">
 <div style="font-size:22px;margin-bottom:8px">${sdk.split(' ')[0]}</div>
 <div style="font-family:var(--font-display);font-size:14px;font-weight:700">${sdk.split(' ')[1]}</div>
 <div style="font-family:var(--font-mono);font-size:10px;color:var(--muted);margin-top:4px">Próximamente</div>
 </div>
 `).join('')}
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 `;
}

// ── PRICING PAGE ─────────────────────────────────────────────────────────────
function renderPricingPage() {
 const app = document.getElementById('app');
 app.innerHTML = `
 <div class="page-wrap">
 <div class="pricing-page">
 <div class="container">
 <div class="pricing-hero">
 <div class="hero-eyebrow" style="display:inline-flex;margin-bottom:20px">Planes y precios</div>
 <h1>Simple y transparente.</h1>
 <p>Paga solo por lo que usas. Todos los planes incluyen acceso inmediato tras el pago.</p>
 </div>

 <div class="plans-grid">
 <!-- FREE -->
 <div class="plan-card">
 <div class="plan-name">Explorer</div>
 <div class="plan-desc">Para investigadores y desarrolladores que quieren explorar los datos antes de comprometerse.</div>
 <div class="plan-price">$0 <sub>CLP</sub></div>
 <div class="plan-period">Para siempre gratis</div>
 <ul class="plan-features">
 <li><span class="check">✓</span> 5 datasets gratuitos incluidos</li>
 <li><span class="check">✓</span> API: 500 req/hora</li>
 <li><span class="check">✓</span> Muestra de datos de todos los datasets</li>
 <li><span class="check">✓</span> Documentación completa</li>
 <li><span class="cross">✗</span> Acceso a datasets de pago</li>
 <li><span class="cross">✗</span> Descargas completas</li>
 <li><span class="cross">✗</span> Soporte prioritario</li>
 </ul>
 <button class="btn btn-ghost btn-md" style="width:100%;margin-top:24px" onclick="toast(' Registro próximamente')">
 Empezar gratis
 </button>
 </div>

 <!-- PRO -->
 <div class="plan-card featured-plan">
 <div class="plan-badge">RECOMENDADO</div>
 <div class="plan-name">Pro</div>
 <div class="plan-desc">Para empresas y equipos que integran datos en sus productos y pipelines.</div>
 <div class="plan-price">$89.000 <sub>CLP</sub></div>
 <div class="plan-period">por mes · o $890.000 anual (ahorra 17%)</div>
 <ul class="plan-features">
 <li><span class="check">✓</span> Acceso a todo el catálogo</li>
 <li><span class="check">✓</span> API: 10.000 req/hora</li>
 <li><span class="check">✓</span> Descargas ilimitadas</li>
 <li><span class="check">✓</span> Licencia comercial incluida</li>
 <li><span class="check">✓</span> Actualizaciones automáticas</li>
 <li><span class="check">✓</span> Soporte por email (48h)</li>
 <li><span class="check">✓</span> Factura electrónica</li>
 </ul>
 <button class="btn btn-primary btn-md" style="width:100%;margin-top:24px" onclick="toast(' Checkout próximamente')">
 Suscribirse — $89K/mes
 </button>
 </div>

 <!-- ENTERPRISE -->
 <div class="plan-card">
 <div class="plan-name">Enterprise</div>
 <div class="plan-desc">Para organizaciones con necesidades específicas: volumen, SLA, datos a medida.</div>
 <div class="plan-price" style="font-size:32px">A medida</div>
 <div class="plan-period">según uso y requerimientos</div>
 <ul class="plan-features">
 <li><span class="check">✓</span> Todo lo de Pro</li>
 <li><span class="check">✓</span> API: sin límite</li>
 <li><span class="check">✓</span> Datasets a medida / custom</li>
 <li><span class="check">✓</span> SLA garantizado 99.9%</li>
 <li><span class="check">✓</span> Soporte dedicado (4h)</li>
 <li><span class="check">✓</span> Acceso SFTP / S3</li>
 <li><span class="check">✓</span> Contrato y NDA incluido</li>
 </ul>
 <button class="btn btn-ghost btn-md" style="width:100%;margin-top:24px" onclick="toast(' Envía un mail a hola@datachile.io')">
 Contactar ventas
 </button>
 </div>
 </div>

 <!-- DATASET PRICING NOTE -->
 <div style="max-width:680px;margin:0 auto;text-align:center;padding:0 20px">
 <div style="font-family:var(--font-mono);font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:16px">Compras individuales</div>
 <p style="font-size:14px;color:#999;line-height:1.7">También puedes adquirir datasets individuales sin suscripción. Cada dataset tiene sus propias licencias de uso personal y comercial. Accede al <button onclick="showPage('catalog')" style="background:none;border:none;color:var(--red);cursor:pointer;font-size:14px;text-decoration:underline">catálogo</button> para ver los precios por dataset.</p>
 </div>
 </div>
 </div>
 </div>
 `;
}

// ── UPLOAD PAGE ───────────────────────────────────────────────────────────────
function renderUploadPage() {
 const app = document.getElementById('app');
 app.innerHTML = `
 <div class="page-wrap">
 <div style="padding:80px 0 100px">
 <div class="container" style="max-width:720px">
 <div class="hero-eyebrow" style="display:inline-flex;margin-bottom:24px">Vende tus datos</div>
 <h1 class="t-display" style="font-size:clamp(36px,5vw,60px);letter-spacing:-2px;margin-bottom:20px">
 Monetiza tus<br><em style="color:var(--red)">datasets.</em>
 </h1>
 <p style="font-size:15px;color:#999;line-height:1.7;margin-bottom:48px">¿Tienes datos únicos sobre Chile o Latam? Publícalos en DataCL y llega a cientos de compradores. Tú defines el precio, nosotros ponemos la plataforma.</p>

 <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:48px">
 ${[
 { icon: '', title: '70% para ti', desc: 'El 70% de cada venta va directo a tu cuenta. Nosotros nos quedamos el 30% por la plataforma.' },
 { icon: '', title: 'Tú controlas', desc: 'Define el precio, las licencias permitidas y si quieres acceso gratuito para investigación.' },
 { icon: '', title: 'Analytics en tiempo real', desc: 'Ve cuántas descargas, desde dónde y cuánto has ganado en tu dashboard.' },
 { icon: '', title: 'Onboarding rápido', desc: 'Sube tu dataset, define los metadatos y en menos de 48h está publicado y listo para vender.' }
 ].map(item => `
 <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px">
 <div style="font-size:28px;margin-bottom:12px">${item.icon}</div>
 <div style="font-family:var(--font-display);font-size:16px;font-weight:700;margin-bottom:6px">${item.title}</div>
 <div style="font-size:13px;color:#999;line-height:1.55">${item.desc}</div>
 </div>
 `).join('')}
 </div>

 <div style="background:rgba(230,51,41,0.06);border:1px solid rgba(230,51,41,0.2);border-radius:var(--radius-xl);padding:40px;text-align:center">
 <div style="font-size:32px;margin-bottom:16px"></div>
 <div style="font-family:var(--font-display);font-size:22px;font-weight:700;margin-bottom:10px">El portal de proveedores está en construcción</div>
 <p style="font-size:14px;color:#999;margin-bottom:28px;max-width:380px;margin-left:auto;margin-right:auto">Si tienes un dataset para Chile o Latam, escríbenos y te damos acceso anticipado como proveedor fundador.</p>
 <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
 <button class="btn btn-primary btn-lg" onclick="toast(' Escríbenos a hola@datachile.io')">Contactar al equipo</button>
 <button class="btn btn-ghost btn-lg" onclick="showPage('catalog')">Ver catálogo actual</button>
 </div>
 </div>
 </div>
 </div>
 </div>
 `;
}

// ── HERO STATS ────────────────────────────────────────────────────────────────
function updateHeroStats() {
 // Animate numbers on first load
}

// ── TOAST ─────────────────────────────────────────────────────────────────────
let toastTimer;
function toast(msg, icon = '') {
 const existing = document.querySelector('.toast');
 if (existing) existing.remove();
 if (toastTimer) clearTimeout(toastTimer);

 const el = document.createElement('div');
 el.className = 'toast';
 el.innerHTML = `<span class="toast-icon">${icon}</span><span>${msg}</span>`;
 document.body.appendChild(el);
 toastTimer = setTimeout(() => el.remove(), 3100);
}

// ── KEYBOARD ──────────────────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
 if (e.key === 'Escape') closeModal();
 if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
 e.preventDefault();
 showPage('catalog');
 setTimeout(() => document.getElementById('search-input')?.focus(), 200);
 }
});

// ── MODAL BACKDROP CLICK ──────────────────────────────────────────────────────
document.getElementById('modal-backdrop')?.addEventListener('click', function(e) {
 if (e.target === this) closeModal();
});

// ══════════════════════════════════════════════════════════════════════════════
// ANONCL — Página de Anonimización SaaS (Amazon Bedrock)
// ══════════════════════════════════════════════════════════════════════════════

// Estado del módulo AnonCL
const anonState = {
 demoMode: true,
 strictMode: true,
 apiUrl: 'https://api.datacl.cl', // cambiar a tu endpoint real
 apiKey: '',
 lastResult: null
};

// Regex client-side (fallback demo)
const _RUT = /\b\d{1,2}\.?(?:\d{3})\.?(?:\d{3})-[\dkK]\b/g;
const _PHONE = /\b(?:\+?56\s?)?(?:9\s?)?\d{4}\s?\d{4}\b/g;
const _EMAIL = /\b[\w\.-]+@[\w\.-]+\.[A-Za-z]{2,}\b/g;
const _PLATE = /\b(?:[A-Z]{2}\s?-?\s?\d{4}|[A-Z]{4}\s?-?\s?\d{2})\b/g;

function _regexAnon(text) {
 let counts = { NOMBRE:0, RUT_CL: (text.match(_RUT)||[]).length, TELEFONO_CL: (text.match(_PHONE)||[]).length, EMAIL: (text.match(_EMAIL)||[]).length, PATENTE_CL: (text.match(_PLATE)||[]).length };
 let out = text.replace(new RegExp(_RUT.source,'g'),'[RUT_CL]').replace(new RegExp(_PHONE.source,'g'),'[TELEFONO_CL]').replace(new RegExp(_EMAIL.source,'g'),'[EMAIL]').replace(new RegExp(_PLATE.source,'g'),'[PATENTE_CL]');
 return { text, entities: counts, anon: out };
}

function renderAnonPage() {
 const app = document.getElementById('app');
 app.innerHTML = `
 <div class="page-wrap">
 <div class="container" style="max-width:860px;padding:60px 20px 80px">

 <!-- HERO -->
 <div style="text-align:center;margin-bottom:56px">
 <div class="hero-eyebrow" style="display:inline-flex;margin-bottom:16px;justify-content:center">
 Powered by Amazon Bedrock
 </div>
 <h1 style="font-size:clamp(32px,5vw,52px);letter-spacing:-1.5px;margin-bottom:16px">
 AnonCL<br><span class="accent">Anonimización inteligente</span><br>para Chile
 </h1>
 <p style="font-size:16px;color:#999;max-width:560px;margin:0 auto 32px;line-height:1.7">
 IA contextual que detecta PII que el regex no puede ver — nombres, direcciones, relaciones laborales. Cumple Ley 19.628 · Ley 21.696.
 </p>
 <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center">
 <span class="tag"> Claude via Bedrock</span>
 <span class="tag"> Ley 19.628</span>
 <span class="tag"> RUT · Teléfono · Patente</span>
 <span class="tag"> Contexto + Regex</span>
 <span class="tag"> SHA-256 Auditoría</span>
 </div>
 </div>

 <!-- CONFIG -->
 <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;margin-bottom:32px">
 <div style="font-family:var(--font-mono);font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:14px">Configuración API</div>
 <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
 <div>
 <label style="font-family:var(--font-mono);font-size:10px;color:var(--muted);display:block;margin-bottom:5px">ENDPOINT</label>
 <input id="anon-api-url" type="text" value="${anonState.apiUrl}"
 onchange="anonState.apiUrl=this.value"
 style="width:100%;background:var(--bg);border:1px solid var(--border);color:var(--text);padding:8px 12px;border-radius:6px;font-family:var(--font-mono);font-size:12px;outline:none">
 </div>
 <div>
 <label style="font-family:var(--font-mono);font-size:10px;color:var(--muted);display:block;margin-bottom:5px">API KEY (plan Pro)</label>
 <input id="anon-api-key" type="password" placeholder="anoncl_xxxxxxxxxxxxxxxx"
 onchange="anonState.apiKey=this.value"
 style="width:100%;background:var(--bg);border:1px solid var(--border);color:var(--text);padding:8px 12px;border-radius:6px;font-family:var(--font-mono);font-size:12px;outline:none">
 </div>
 </div>
 <div style="display:flex;gap:20px;margin-top:14px;flex-wrap:wrap">
 <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13px;color:#999">
 <input type="checkbox" id="chk-demo" checked onchange="anonState.demoMode=this.checked;updateAnonMode()"> Modo demo (client-side)
 </label>
 <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13px;color:#999">
 <input type="checkbox" id="chk-strict" checked onchange="anonState.strictMode=this.checked"> Modo estricto (bloquear PII residual)
 </label>
 </div>
 <div id="anon-mode-badge" style="margin-top:10px;font-family:var(--font-mono);font-size:11px;color:var(--red)">
 ● Demo activo — usando regex client-side
 </div>
 </div>

 <!-- DEMO LIVE -->
 <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;overflow:hidden;margin-bottom:32px">
 <div style="background:var(--bg);padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
 <div style="font-weight:600;font-size:14px"> Demo en vivo</div>
 <div style="display:flex;gap:8px">
 <button onclick="loadExample('basic')" style="background:none;border:1px solid var(--border);color:#999;padding:4px 12px;border-radius:4px;cursor:pointer;font-size:12px">Ejemplo básico</button>
 <button onclick="loadExample('judicial')" style="background:none;border:1px solid var(--border);color:#999;padding:4px 12px;border-radius:4px;cursor:pointer;font-size:12px">Ejemplo judicial</button>
 <button onclick="loadExample('empresa')" style="background:none;border:1px solid var(--border);color:#999;padding:4px 12px;border-radius:4px;cursor:pointer;font-size:12px">Ejemplo empresa</button>
 </div>
 </div>
 <div style="padding:20px">
 <label style="font-family:var(--font-mono);font-size:10px;color:var(--muted);display:block;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px">Texto de entrada</label>
 <textarea id="anon-input" rows="6"
 style="width:100%;background:var(--bg);border:1px solid var(--border);color:var(--text);padding:12px;border-radius:8px;font-family:var(--font-mono);font-size:13px;line-height:1.6;resize:vertical;outline:none"
 placeholder="Pega aquí el texto con datos personales...">Juan Pérez Soto, RUT 12.345.678-K, trabaja en Empresa Minera S.A. como Gerente de Operaciones. Su celular es +56 9 8765 4321 y su correo juan.perez@minera.cl. Vive en Av. Providencia 1234, depto 502, Santiago.</textarea>
 <div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap">
 <button onclick="runAnon()" id="btn-anon"
 style="background:var(--red);color:#fff;border:none;padding:10px 24px;border-radius:8px;font-weight:600;cursor:pointer;font-size:14px;display:flex;align-items:center;gap:8px">
 <span id="spin-anon" style="display:none"></span>
 Anonimizar
 </button>
 <button onclick="document.getElementById('anon-input').value=''"
 style="background:none;border:1px solid var(--border);color:#999;padding:10px 20px;border-radius:8px;cursor:pointer;font-size:13px">
 Limpiar
 </button>
 </div>
 </div>

 <!-- OUTPUT -->
 <div id="anon-output" style="display:none;border-top:1px solid var(--border)">
 <div id="anon-verdict-bar" style="padding:14px 20px;font-weight:600;font-size:14px"></div>
 <div style="padding:0 20px 20px">
 <label style="font-family:var(--font-mono);font-size:10px;color:var(--muted);display:block;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px">Texto anonimizado</label>
 <pre id="anon-text-out" style="background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:14px;font-family:var(--font-mono);font-size:13px;line-height:1.6;white-space:pre-wrap;word-break:break-word;color:#ccc;margin:0"></pre>
 <div id="anon-stats-out" style="margin-top:16px;display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:8px"></div>
 <div id="anon-entities-out" style="margin-top:16px"></div>
 </div>
 </div>
 </div>

 <!-- PRICING ANONCL -->
 <div style="margin-bottom:48px">
 <div style="text-align:center;margin-bottom:32px">
 <div class="hero-eyebrow" style="display:inline-flex;margin-bottom:12px;justify-content:center">Planes AnonCL API</div>
 <h2 style="font-size:28px;letter-spacing:-.5px">Paga solo por lo que usas</h2>
 </div>
 <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px">

 <!-- FREE -->
 <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:24px">
 <div style="font-size:13px;font-weight:600;color:#999;margin-bottom:8px">Free</div>
 <div style="font-size:32px;font-weight:700;letter-spacing:-1px;margin-bottom:4px">$0</div>
 <div style="font-size:12px;color:#666;margin-bottom:20px">Para siempre · sin tarjeta</div>
 <ul style="list-style:none;font-size:13px;color:#999;line-height:2">
 <li>✓ 100 requests/mes</li>
 <li>✓ Regex (RUT, email, fono, patente)</li>
 <li>✓ API pública</li>
 <li style="color:#444">✗ IA contextual (Bedrock)</li>
 <li style="color:#444">✗ Batch processing</li>
 <li style="color:#444">✗ Entidades nombradas</li>
 </ul>
 <button onclick="toast(' Registro próximamente')" style="width:100%;margin-top:20px;background:none;border:1px solid var(--border);color:#999;padding:10px;border-radius:8px;cursor:pointer;font-size:13px">Empezar gratis</button>
 </div>

 <!-- PRO -->
 <div style="background:var(--surface);border:1px solid var(--red);border-radius:12px;padding:24px;position:relative">
 <div style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--red);color:#fff;font-family:var(--font-mono);font-size:10px;padding:3px 14px;border-radius:20px;white-space:nowrap">RECOMENDADO</div>
 <div style="font-size:13px;font-weight:600;color:var(--red);margin-bottom:8px">Pro</div>
 <div style="font-size:32px;font-weight:700;letter-spacing:-1px;margin-bottom:4px">$29.000</div>
 <div style="font-size:12px;color:#666;margin-bottom:20px">CLP/mes · o $290.000 anual</div>
 <ul style="list-style:none;font-size:13px;color:#ccc;line-height:2">
 <li>✓ 10.000 requests/mes</li>
 <li>✓ <strong style="color:var(--red)">IA contextual Amazon Bedrock</strong></li>
 <li>✓ Nombres propios, direcciones</li>
 <li>✓ Batch hasta 50 textos</li>
 <li>✓ Reporte de entidades JSON</li>
 <li>✓ Dashboard de uso</li>
 </ul>
 <button onclick="toast(' Checkout próximamente — escribe a hola@datachile.io')" style="width:100%;margin-top:20px;background:var(--red);border:none;color:#fff;padding:10px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600">Suscribirse — $29K/mes</button>
 </div>

 <!-- ENTERPRISE -->
 <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:24px">
 <div style="font-size:13px;font-weight:600;color:#999;margin-bottom:8px">Enterprise</div>
 <div style="font-size:32px;font-weight:700;letter-spacing:-1px;margin-bottom:4px">A medida</div>
 <div style="font-size:12px;color:#666;margin-bottom:20px">Volumen · SLA · On-premise</div>
 <ul style="list-style:none;font-size:13px;color:#ccc;line-height:2">
 <li>✓ Requests ilimitados</li>
 <li>✓ Deploy privado (tu AWS)</li>
 <li>✓ Fine-tuning del modelo</li>
 <li>✓ Procesamiento batch S3</li>
 <li>✓ SLA 99.9% garantizado</li>
 <li>✓ Soporte dedicado</li>
 </ul>
 <button onclick="toast(' hola@datachile.io')" style="width:100%;margin-top:20px;background:none;border:1px solid var(--border);color:#999;padding:10px;border-radius:8px;cursor:pointer;font-size:13px">Contactar ventas</button>
 </div>
 </div>
 </div>

 <!-- CODE EXAMPLES -->
 <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;overflow:hidden">
 <div style="background:var(--bg);padding:16px 20px;border-bottom:1px solid var(--border);font-weight:600;font-size:14px">
 Integración API — 3 líneas de código
 </div>
 <div style="padding:20px">
 <div style="display:flex;gap:8px;margin-bottom:16px">
 <button onclick="showCodeTab('curl')" id="tab-curl" class="btn btn-ghost btn-sm" style="font-family:var(--font-mono)">curl</button>
 <button onclick="showCodeTab('python')" id="tab-python" class="btn btn-ghost btn-sm" style="font-family:var(--font-mono)">python</button>
 <button onclick="showCodeTab('node')" id="tab-node" class="btn btn-ghost btn-sm" style="font-family:var(--font-mono)">node.js</button>
 </div>
 <pre id="code-display" style="background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:16px;font-family:var(--font-mono);font-size:12px;line-height:1.7;overflow-x:auto;color:#ccc;margin:0">${getCodeExample('curl')}</pre>
 </div>
 </div>

 </div>
 </div>
 `;
}

function updateAnonMode(){
 const el = document.getElementById('anon-mode-badge');
 if (!el) return;
 if (anonState.demoMode) {
 el.textContent = '● Demo activo — usando regex client-side';
 el.style.color = 'var(--red)';
 } else {
 el.textContent = '● Modo API — conectando a ' + anonState.apiUrl;
 el.style.color = '#22c55e';
 }
}

const EXAMPLES = {
 basic: `Juan Pérez Soto, RUT 12.345.678-K, trabaja en Empresa Minera S.A. como Gerente de Operaciones. Su celular es +56 9 8765 4321 y su correo juan.perez@minera.cl. Vive en Av. Providencia 1234, depto 502, Santiago.`,
 judicial: `En causa RIT O-1234-2024 del 4° Juzgado de Letras del Trabajo de Santiago, la demandante María González Rojas, RUT 8.765.432-1, empleada de Comercial Los Robles Ltda., interpone demanda por despido injustificado contra don Carlos Muñoz Vargas, RUT 15.432.876-K, en su calidad de representante legal.`,
 empresa: `Informe confidencial — Empleado: Rodrigo Aburto Leiva, RUT 14.876.543-2, cargo: Analista Senior TI, sueldo bruto $2.450.000 CLP. Dirección: Pasaje Las Lilas 456, Villa Alemana. Teléfono de contacto: +56 9 7654 3210. Beneficiario seguro complementario: Sandra Leiva Mora (madre), patente vehículo BCDF32.`
};

function loadExample(key) {
 const el = document.getElementById('anon-input');
 if (el && EXAMPLES[key]) { el.value = EXAMPLES[key]; }
}

async function runAnon() {
 const text = document.getElementById('anon-input').value;
 if (!text.trim()) { toast('Escribe o pega un texto primero'); return; }

 document.getElementById('btn-anon').disabled = true;
 document.getElementById('spin-anon').style.display = 'inline';

 try {
 let result;

 if (anonState.demoMode) {
 // Client-side regex demo
 await new Promise(r => setTimeout(r, 400)); // simular latencia
 const r = _regexAnon(text);
 result = {
 ok: true, method: 'regex-demo',
 text: r.anon,
 entities: Object.entries(r.entities).filter(([,v])=>v>0).map(([k,v])=>({type:k,count:v})),
 summary: { total_entities: Object.values(r.entities).reduce((a,b)=>a+b,0), by_type: r.entities }
 };
 } else {
 // API real
 const resp = await fetch(anonState.apiUrl + '/v1/anonymize', {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 ...(anonState.apiKey ? {'X-Api-Key': anonState.apiKey} : {})
 },
 body: JSON.stringify({ text, mode: anonState.apiKey ? 'bedrock' : 'regex', strict: anonState.strictMode })
 });
 result = await resp.json();
 }

 renderAnonOutput(result);
 } catch(e) {
 toast('❌ Error: ' + e.message);
 }

 document.getElementById('btn-anon').disabled = false;
 document.getElementById('spin-anon').style.display = 'none';
}

function renderAnonOutput(result) {
 document.getElementById('anon-output').style.display = 'block';

 const verdict = document.getElementById('anon-verdict-bar');
 const isDemo = result.method === 'regex-demo';
 const isBedrock = result.method?.includes('bedrock');

 if (result.ok) {
 verdict.style.cssText = 'padding:14px 20px;font-weight:600;font-size:14px;background:rgba(34,197,94,.08);border-top:none;color:#22c55e';
 verdict.innerHTML = ` Anonimizado — ${isDemo ? ' Regex demo' : isBedrock ? ' Amazon Bedrock' : ' API'} · ${result.summary?.total_entities || 0} entidades PII detectadas`;
 } else {
 verdict.style.cssText = 'padding:14px 20px;font-weight:600;font-size:14px;background:rgba(230,51,41,.08);color:var(--red)';
 verdict.innerHTML = ' Bloqueado — PII residual detectada (modo estricto)';
 }

 document.getElementById('anon-text-out').textContent = result.text || '';

 // Stats
 const stats = result.summary?.by_type || {};
 const total = result.summary?.total_entities || 0;
 const statsHtml = Object.entries(stats).filter(([,v])=>v>0).map(([k,v])=>`
 <div style="background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:12px;text-align:center">
 <div style="font-family:var(--font-mono);font-size:22px;font-weight:700;color:var(--red)">${v}</div>
 <div style="font-size:11px;color:#666;margin-top:2px">${k}</div>
 </div>`).join('') + `
 <div style="background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:12px;text-align:center">
 <div style="font-family:var(--font-mono);font-size:22px;font-weight:700;color:#22c55e">${total}</div>
 <div style="font-size:11px;color:#666;margin-top:2px">TOTAL</div>
 </div>`;
 document.getElementById('anon-stats-out').innerHTML = statsHtml;

 // Entities (solo si vienen de Bedrock)
 const entities = result.entities || [];
 if (entities.length > 0 && entities[0].original) {
 const rows = entities.slice(0,8).map(e=>`
 <tr>
 <td style="padding:6px 10px;font-family:var(--font-mono);font-size:11px;color:var(--red)">${e.type}</td>
 <td style="padding:6px 10px;font-size:12px;color:#999">${e.original}</td>
 <td style="padding:6px 10px;font-family:var(--font-mono);font-size:11px;color:#22c55e">${e.replacement}</td>
 <td style="padding:6px 10px;font-size:11px;color:#555">${((e.confidence||0)*100).toFixed(0)}%</td>
 </tr>`).join('');
 document.getElementById('anon-entities-out').innerHTML = `
 <div style="font-family:var(--font-mono);font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Entidades detectadas</div>
 <table style="width:100%;border-collapse:collapse;font-size:13px">
 <thead><tr style="border-bottom:1px solid var(--border)">
 <th style="padding:6px 10px;text-align:left;font-size:11px;color:#555">Tipo</th>
 <th style="padding:6px 10px;text-align:left;font-size:11px;color:#555">Original</th>
 <th style="padding:6px 10px;text-align:left;font-size:11px;color:#555">Reemplazado</th>
 <th style="padding:6px 10px;text-align:left;font-size:11px;color:#555">Confianza</th>
 </tr></thead>
 <tbody>${rows}</tbody>
 </table>`;
 } else {
 document.getElementById('anon-entities-out').innerHTML = isDemo
 ? `<div style="font-size:12px;color:#555;font-style:italic"> El modo Bedrock (plan Pro) detecta adicionalmente nombres propios, direcciones y entidades contextuales</div>`
 : '';
 }
}

const CODE_EXAMPLES = {
 curl: `# Anonimización básica (free)
curl -X POST https://api.datacl.cl/v1/anonymize \\
 -H "Content-Type: application/json" \\
 -d '{"text": "Juan Pérez, RUT 12.345.678-K, cel +56 9 8765 4321"}'

# Con Amazon Bedrock (plan Pro)
curl -X POST https://api.datacl.cl/v1/anonymize \\
 -H "Content-Type: application/json" \\
 -H "X-Api-Key: anoncl_tu_api_key" \\
 -d '{"text": "...", "mode": "bedrock"}'`,

 python: `import requests

# Plan Free — regex
r = requests.post("https://api.datacl.cl/v1/anonymize", json={
 "text": "Juan Pérez, RUT 12.345.678-K, cel +56 9 8765 4321"
})
print(r.json()["text"])

# Plan Pro — Amazon Bedrock
r = requests.post("https://api.datacl.cl/v1/anonymize",
 headers={"X-Api-Key": "anoncl_tu_api_key"},
 json={"text": "...", "mode": "bedrock", "strict": True}
)
data = r.json()
print(data["text"]) # texto anonimizado
print(data["entities"]) # lista de entidades encontradas`,

 node: `// Plan Free
const res = await fetch("https://api.datacl.cl/v1/anonymize", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ text: "Juan Pérez RUT 12.345.678-K" })
});
const { text } = await res.json();

// Plan Pro — Amazon Bedrock
const res2 = await fetch("https://api.datacl.cl/v1/anonymize", {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 "X-Api-Key": "anoncl_tu_api_key"
 },
 body: JSON.stringify({ text: "...", mode: "bedrock" })
});
const { text, entities, summary } = await res2.json();`
};

function getCodeExample(lang) { return CODE_EXAMPLES[lang] || CODE_EXAMPLES.curl; }

function showCodeTab(lang) {
 document.getElementById('code-display').textContent = getCodeExample(lang);
 ['curl','python','node'].forEach(l => {
 const btn = document.getElementById('tab-'+l);
 if (btn) btn.style.borderColor = l===lang ? 'var(--red)' : '';
 });
}
