/* ═══════════════════════════════════════════════
   DATACHILE — Main Stylesheet
   ═══════════════════════════════════════════════ */

@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,400;0,500;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');

/* ── TOKENS ─────────────────────────────────── */
:root {
  --red:      #E63329;
  --red-dark: #B5251C;
  --red-glow: rgba(230,51,41,0.15);
  --blue:     #003F8A;
  --white:    #F2EFE8;
  --dark:     #0A0A0A;
  --mid:      #141414;
  --surface:  #111111;
  --surface2: #1A1A1A;
  --surface3: #222222;
  --border:   rgba(255,255,255,0.06);
  --border2:  rgba(255,255,255,0.10);
  --muted:    #666666;
  --muted2:   #888888;
  --gold:     #D4A843;

  --font-display: 'Syne', sans-serif;
  --font-body:    'DM Sans', sans-serif;
  --font-mono:    'DM Mono', monospace;

  --radius-sm: 6px;
  --radius:    10px;
  --radius-lg: 16px;
  --radius-xl: 24px;

  --nav-h: 60px;
  --transition: 0.2s cubic-bezier(0.4,0,0.2,1);
}

/* ── RESET ──────────────────────────────────── */
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
html { scroll-behavior:smooth; }
body {
  font-family: var(--font-body);
  background: var(--dark);
  color: var(--white);
  min-height: 100vh;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}
a { color: inherit; text-decoration: none; }
button { cursor: pointer; font-family: var(--font-body); }
input, select { font-family: var(--font-body); }

/* ── SCROLLBAR ──────────────────────────────── */
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: var(--dark); }
::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: #3a3a3a; }

/* ── TYPOGRAPHY ─────────────────────────────── */
.t-display { font-family: var(--font-display); font-weight: 800; letter-spacing: -2px; line-height: 0.93; }
.t-heading { font-family: var(--font-display); font-weight: 700; letter-spacing: -0.5px; }
.t-mono    { font-family: var(--font-mono); }
.t-label   { font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; }
.t-muted   { color: var(--muted2); }

/* ── LAYOUT ─────────────────────────────────── */
.container { max-width: 1260px; margin: 0 auto; padding: 0 28px; }
.page-wrap { padding-top: var(--nav-h); }

/* ── NAVIGATION ─────────────────────────────── */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  height: var(--nav-h);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 28px;
  background: rgba(10,10,10,0.92);
  backdrop-filter: blur(24px) saturate(160%);
  border-bottom: 1px solid var(--border);
}
.nav-logo {
  font-family: var(--font-display);
  font-size: 20px; font-weight: 800;
  letter-spacing: -0.5px;
  display: flex; align-items: center; gap: 1px;
}
.nav-logo .accent { color: var(--red); }
.nav-logo .tag {
  font-family: var(--font-mono);
  font-size: 9px;
  padding: 2px 6px;
  background: rgba(230,51,41,0.15);
  border: 1px solid rgba(230,51,41,0.25);
  border-radius: 4px;
  color: var(--red);
  margin-left: 8px;
  letter-spacing: 0.5px;
}
.nav-links { display: flex; gap: 2px; }
.nav-link {
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 13px; font-weight: 500;
  border: none; background: transparent;
  color: var(--muted2);
  transition: all var(--transition);
}
.nav-link:hover { color: var(--white); background: var(--surface2); }
.nav-link.active { color: var(--white); background: var(--surface2); }
.nav-actions { display: flex; gap: 10px; align-items: center; }

/* Maker credit in nav */
.nav-maker-credit {
  display: flex; align-items: center; gap: 4px;
  padding: 5px 12px;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 20px;
  font-family: var(--font-mono);
  font-size: 10px; color: var(--muted2);
  letter-spacing: 0.3px;
  text-decoration: none;
  transition: all var(--transition);
  white-space: nowrap;
}
.nav-maker-credit:hover { border-color: rgba(230,51,41,0.4); color: var(--white); }

/* ── BUTTONS ────────────────────────────────── */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  border: none; border-radius: var(--radius);
  font-family: var(--font-body); font-weight: 600;
  cursor: pointer; transition: all var(--transition);
  white-space: nowrap;
}
.btn-sm  { padding: 7px 16px; font-size: 12px; }
.btn-md  { padding: 10px 20px; font-size: 14px; }
.btn-lg  { padding: 14px 28px; font-size: 15px; }
.btn-xl  { padding: 16px 36px; font-size: 16px; font-family: var(--font-display); font-weight: 700; letter-spacing: -0.3px; }

.btn-primary { background: var(--red); color: white; }
.btn-primary:hover { background: var(--red-dark); transform: translateY(-1px); box-shadow: 0 8px 24px rgba(230,51,41,0.3); }

.btn-ghost { background: transparent; color: var(--white); border: 1px solid var(--border2); }
.btn-ghost:hover { border-color: rgba(255,255,255,0.25); background: var(--surface2); }

.btn-surface { background: var(--surface2); color: var(--white); border: 1px solid var(--border); }
.btn-surface:hover { background: var(--surface3); border-color: var(--border2); }

.btn-outline-red { background: transparent; color: var(--red); border: 1px solid rgba(230,51,41,0.35); }
.btn-outline-red:hover { background: var(--red-glow); }

/* ── HERO ───────────────────────────────────── */
.hero {
  min-height: 92vh;
  display: flex; align-items: center;
  position: relative;
  overflow: hidden;
  padding: 80px 0 60px;
}
.hero-content { position: relative; z-index: 2; }
.hero-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 14px;
  background: rgba(230,51,41,0.1);
  border: 1px solid rgba(230,51,41,0.2);
  border-radius: 20px;
  font-family: var(--font-mono);
  font-size: 11px; color: var(--red);
  letter-spacing: 0.5px; text-transform: uppercase;
  margin-bottom: 32px;
}
.hero-eyebrow::before { content: '◉'; font-size: 7px; animation: blink 2s infinite; }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }

.hero-built-by {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 14px;
  background: var(--surface2);
  border: 1px solid var(--border2);
  border-radius: 20px;
  font-family: var(--font-mono);
  font-size: 10px; color: var(--muted2);
  letter-spacing: 0.3px;
}
.hero-built-link {
  color: var(--white);
  font-weight: 500;
  text-decoration: none;
  transition: color var(--transition);
}
.hero-built-link:hover { color: var(--red); }

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(56px, 7.5vw, 112px);
  font-weight: 800;
  line-height: 0.91;
  letter-spacing: -4px;
  margin-bottom: 32px;
}
.hero-title em { color: var(--red); font-style: normal; }
.hero-title .line2 { padding-left: clamp(20px, 4vw, 80px); }

.hero-sub {
  font-size: clamp(16px, 2vw, 19px);
  font-weight: 300; color: #999;
  max-width: 580px; line-height: 1.65;
  margin-bottom: 44px;
}
.hero-cta { display: flex; gap: 14px; flex-wrap: wrap; }

.hero-stats {
  display: flex; gap: 0;
  margin-top: 72px;
  padding-top: 40px;
  border-top: 1px solid var(--border);
}
.hero-stat {
  flex: 1;
  padding: 0 28px;
  border-right: 1px solid var(--border);
}
.hero-stat:first-child { padding-left: 0; }
.hero-stat:last-child  { border-right: none; }
.stat-n {
  font-family: var(--font-display);
  font-size: 38px; font-weight: 800;
  letter-spacing: -1.5px;
  color: var(--white);
  line-height: 1;
}
.stat-n span { color: var(--red); }
.stat-l { font-family: var(--font-mono); font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-top: 6px; }

/* Hero background */
.hero-bg-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
}
.hero-glow {
  position: absolute;
  width: 700px; height: 700px;
  border-radius: 50%;
  pointer-events: none;
}
.hero-glow-1 { top: -200px; right: -200px; background: radial-gradient(circle, rgba(230,51,41,0.06) 0%, transparent 65%); }
.hero-glow-2 { bottom: -300px; left: -100px; background: radial-gradient(circle, rgba(0,63,138,0.08) 0%, transparent 65%); }

/* ── SEARCH BAR ─────────────────────────────── */
.searchbar {
  position: sticky; top: var(--nav-h); z-index: 900;
  background: rgba(10,10,10,0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  padding: 16px 0;
}
.searchbar-inner { display: flex; flex-direction: column; gap: 12px; }
.search-row { display: flex; gap: 12px; align-items: center; }
.search-field {
  flex: 1; position: relative;
}
.search-icon-el {
  position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
  color: var(--muted); font-size: 17px; pointer-events: none;
}
.search-input {
  width: 100%;
  padding: 12px 16px 12px 44px;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--white); font-size: 14px;
  outline: none; transition: border-color var(--transition);
}
.search-input::placeholder { color: var(--muted); }
.search-input:focus { border-color: rgba(230,51,41,0.5); }

.chip-row { display: flex; gap: 6px; flex-wrap: wrap; }
.chip {
  padding: 6px 14px;
  border-radius: 20px;
  font-family: var(--font-mono);
  font-size: 11px; font-weight: 500;
  border: 1px solid var(--border);
  background: transparent; color: var(--muted2);
  cursor: pointer; transition: all var(--transition);
  white-space: nowrap;
}
.chip:hover { border-color: rgba(255,255,255,0.2); color: var(--white); }
.chip.active { background: rgba(230,51,41,0.12); border-color: rgba(230,51,41,0.4); color: var(--red); }

/* ── CATALOG LAYOUT ─────────────────────────── */
.catalog-layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 40px;
  padding: 40px 0 80px;
  align-items: start;
}
.sidebar { position: sticky; top: calc(var(--nav-h) + 115px); }
.sidebar-section { margin-bottom: 30px; }
.sidebar-label {
  font-family: var(--font-mono);
  font-size: 9px; text-transform: uppercase;
  letter-spacing: 2px; color: var(--muted);
  margin-bottom: 10px; padding: 0 4px;
}
.sidebar-item {
  display: flex; justify-content: space-between; align-items: center;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  font-size: 13px; color: #AAA;
  cursor: pointer; transition: all var(--transition);
  margin-bottom: 1px;
}
.sidebar-item:hover { background: var(--surface2); color: var(--white); }
.sidebar-item.active { background: rgba(230,51,41,0.1); color: var(--red); }
.sidebar-badge {
  font-family: var(--font-mono); font-size: 10px;
  padding: 2px 7px; background: var(--surface2);
  border-radius: 10px; color: var(--muted);
}
.sidebar-item.active .sidebar-badge { background: rgba(230,51,41,0.15); color: var(--red); }
.sidebar-divider { height: 1px; background: var(--border); margin: 20px 0; }

/* ── CATALOG HEADER ─────────────────────────── */
.catalog-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 20px;
}
.catalog-title-row h2 { font-family: var(--font-display); font-size: 18px; font-weight: 700; }
.catalog-count { font-family: var(--font-mono); font-size: 11px; color: var(--muted); margin-top: 4px; }
.sort-wrap select {
  padding: 8px 14px;
  background: var(--surface2); border: 1px solid var(--border);
  border-radius: var(--radius-sm); color: var(--white);
  font-family: var(--font-mono); font-size: 11px;
  outline: none; cursor: pointer;
}

/* ── FEATURED BANNER ────────────────────────── */
.featured-wrap { margin-bottom: 20px; }
.featured-card {
  background: linear-gradient(135deg, rgba(230,51,41,0.08) 0%, rgba(0,63,138,0.1) 100%);
  border: 1px solid rgba(230,51,41,0.18);
  border-radius: var(--radius-lg);
  padding: 28px 32px;
  display: flex; gap: 24px; align-items: center; justify-content: space-between;
  position: relative; overflow: hidden;
}
.featured-card::before {
  content: '★ DESTACADO';
  position: absolute; top: 0; left: 0;
  padding: 5px 14px;
  background: var(--red);
  font-family: var(--font-mono);
  font-size: 9px; letter-spacing: 1.5px;
  border-bottom-right-radius: var(--radius-sm);
}
.featured-info { flex: 1; padding-top: 16px; }
.featured-title { font-family: var(--font-display); font-size: 22px; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 8px; }
.featured-desc { font-size: 13px; color: #999; line-height: 1.6; max-width: 460px; }
.featured-actions { display: flex; gap: 10px; flex-shrink: 0; flex-wrap: wrap; align-items: center; }

/* ── DATASET GRID ───────────────────────────── */
.dataset-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

/* ── DATASET CARD ───────────────────────────── */
.dataset-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 22px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
  position: relative;
  overflow: hidden;
}
.dataset-card::after {
  content: '';
  position: absolute; top: 0; left: 0; right: 0;
  height: 2px;
  background: transparent;
  transition: background 0.25s;
}
.dataset-card:hover {
  border-color: rgba(230,51,41,0.25);
  transform: translateY(-3px);
  box-shadow: 0 16px 48px rgba(0,0,0,0.5);
}
.dataset-card:hover::after { background: var(--red); }

.card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; gap: 8px; }
.sector-tag {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 10px; border-radius: var(--radius-sm);
  font-family: var(--font-mono); font-size: 10px;
  letter-spacing: 0.3px; text-transform: uppercase; font-weight: 500;
}
.license-tag {
  font-family: var(--font-mono); font-size: 9px;
  padding: 4px 9px; border-radius: var(--radius-sm);
  border: 1px solid;
  white-space: nowrap;
}
.license-comercial { border-color: rgba(52,211,153,0.35); color: #34D399; background: rgba(52,211,153,0.06); }
.license-dual      { border-color: rgba(212,168,67,0.35); color: var(--gold); background: rgba(212,168,67,0.06); }
.license-personal  { border-color: rgba(251,146,60,0.35); color: #FB923C; background: rgba(251,146,60,0.06); }

.card-title { font-family: var(--font-display); font-size: 15px; font-weight: 700; line-height: 1.25; margin-bottom: 8px; letter-spacing: -0.2px; }
.card-desc { font-size: 12px; color: var(--muted2); line-height: 1.55; margin-bottom: 16px; }

.card-meta { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 16px; }
.meta-pill { display: flex; align-items: center; gap: 5px; font-family: var(--font-mono); font-size: 10px; color: #666; }
.meta-pip { width: 3px; height: 3px; border-radius: 50%; background: currentColor; flex-shrink: 0; }

.card-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 14px; border-top: 1px solid var(--border); }
.card-price { font-family: var(--font-display); font-size: 17px; font-weight: 800; letter-spacing: -0.5px; }
.card-price.free { color: #34D399; }
.card-price sup { font-size: 10px; font-weight: 400; color: var(--muted); font-family: var(--font-mono); }

/* ── STARS ──────────────────────────────────── */
.stars { display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--gold); }
.stars span { color: var(--muted2); font-family: var(--font-mono); font-size: 10px; }

/* ── MODAL ──────────────────────────────────── */
.modal-backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.75);
  backdrop-filter: blur(10px);
  z-index: 2000;
  display: none; align-items: center; justify-content: center;
  padding: 20px;
}
.modal-backdrop.open { display: flex; }
.modal {
  background: var(--surface);
  border: 1px solid var(--border2);
  border-radius: var(--radius-xl);
  width: 100%; max-width: 780px;
  max-height: 88vh;
  overflow-y: auto;
  padding: 0;
  position: relative;
  animation: modalSlide 0.3s cubic-bezier(0.34,1.56,0.64,1);
}
@keyframes modalSlide { from { opacity:0; transform:scale(0.93) translateY(20px); } to { opacity:1; transform:none; } }

.modal-header {
  padding: 32px 36px 24px;
  border-bottom: 1px solid var(--border);
  position: relative;
}
.modal-close {
  position: absolute; top: 24px; right: 24px;
  width: 34px; height: 34px; border-radius: 50%;
  background: var(--surface2); border: 1px solid var(--border);
  color: var(--white); font-size: 17px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all var(--transition);
}
.modal-close:hover { background: var(--red); border-color: var(--red); }

.modal-body { padding: 28px 36px 36px; }
.modal-title { font-family: var(--font-display); font-size: 26px; font-weight: 800; letter-spacing: -0.8px; line-height: 1.1; margin: 12px 0 10px; }
.modal-desc { font-size: 14px; color: #AAA; line-height: 1.7; }

.modal-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 24px 0; }
.modal-stat-box { background: var(--surface2); border-radius: var(--radius); padding: 14px 16px; }
.modal-stat-label { font-family: var(--font-mono); font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--muted); margin-bottom: 6px; }
.modal-stat-val { font-family: var(--font-display); font-size: 16px; font-weight: 700; }

.modal-section { margin-top: 26px; }
.modal-section-title { font-family: var(--font-mono); font-size: 9px; text-transform: uppercase; letter-spacing: 2px; color: var(--muted); margin-bottom: 12px; border-bottom: 1px solid var(--border); padding-bottom: 8px; }

/* Fields table */
.fields-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.fields-table th { font-family: var(--font-mono); font-size: 9px; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); padding: 6px 10px; text-align: left; border-bottom: 1px solid var(--border); }
.fields-table td { padding: 8px 10px; border-bottom: 1px solid rgba(255,255,255,0.03); vertical-align: top; }
.fields-table tr:hover td { background: var(--surface2); }
.field-name { font-family: var(--font-mono); font-size: 11px; color: #7DD3FC; }
.field-type { font-family: var(--font-mono); font-size: 10px; color: var(--gold); }
.field-desc { color: var(--muted2); line-height: 1.4; }

/* Sample data */
.sample-wrap { background: var(--surface2); border-radius: var(--radius); padding: 14px 16px; overflow-x: auto; }
.sample-wrap pre { font-family: var(--font-mono); font-size: 11px; color: #A8D5A2; white-space: pre-wrap; word-break: break-all; line-height: 1.6; }

/* Use cases */
.use-cases { list-style: none; }
.use-cases li { padding: 7px 0; font-size: 13px; color: #AAA; display: flex; gap: 10px; align-items: flex-start; border-bottom: 1px solid rgba(255,255,255,0.03); }
.use-cases li::before { content: '→'; color: var(--red); flex-shrink: 0; font-family: var(--font-mono); font-size: 12px; margin-top: 1px; }

/* Pricing cards */
.pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 12px; }
.pricing-card {
  background: var(--surface2); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 18px;
  cursor: pointer; transition: all var(--transition);
  position: relative;
}
.pricing-card:hover { border-color: var(--border2); }
.pricing-card.selected { border-color: var(--red); background: rgba(230,51,41,0.06); }
.pricing-badge { display: inline-block; padding: 2px 8px; background: var(--red); border-radius: 4px; font-family: var(--font-mono); font-size: 9px; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px; }
.pricing-label { font-family: var(--font-mono); font-size: 9px; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); margin-bottom: 8px; }
.pricing-price { font-family: var(--font-display); font-size: 22px; font-weight: 800; margin-bottom: 4px; }
.pricing-price.free { color: #34D399; }
.pricing-price sub { font-size: 12px; font-weight: 400; color: var(--muted); font-family: var(--font-mono); }
.pricing-desc { font-size: 11px; color: var(--muted2); line-height: 1.5; margin-top: 6px; }

.buy-btn-wrap { margin-top: 20px; }
.btn-buy {
  width: 100%; padding: 16px;
  background: var(--red); border: none; border-radius: var(--radius);
  color: white; font-family: var(--font-display);
  font-size: 16px; font-weight: 700; letter-spacing: -0.3px;
  cursor: pointer; transition: all var(--transition);
}
.btn-buy:hover { background: var(--red-dark); box-shadow: 0 8px 30px rgba(230,51,41,0.4); }
.btn-buy-note { text-align: center; font-family: var(--font-mono); font-size: 10px; color: var(--muted); margin-top: 10px; }

/* ── EMPTY STATE ────────────────────────────── */
.empty-state { text-align: center; padding: 80px 20px; grid-column: 1 / -1; }
.empty-icon { font-size: 48px; margin-bottom: 16px; opacity: 0.5; }
.empty-title { font-family: var(--font-display); font-size: 20px; font-weight: 700; margin-bottom: 8px; }
.empty-desc { font-size: 14px; color: var(--muted2); }

/* ── TOAST ──────────────────────────────────── */
.toast {
  position: fixed; bottom: 24px; right: 24px; z-index: 9999;
  background: var(--surface2); border: 1px solid var(--border2);
  border-radius: var(--radius); padding: 14px 20px;
  font-size: 13px; max-width: 320px;
  display: flex; align-items: center; gap: 10px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  animation: toastIn 0.3s ease, toastOut 0.3s ease 2.7s forwards;
}
@keyframes toastIn  { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
@keyframes toastOut { from { opacity:1; } to { opacity:0; } }
.toast-icon { font-size: 18px; }

/* ── API PAGE ───────────────────────────────── */
.api-page { padding: 60px 0 100px; }
.api-grid { display: grid; grid-template-columns: 280px 1fr; gap: 48px; }
.api-nav-sticky { position: sticky; top: calc(var(--nav-h) + 24px); }
.api-sidebar-item { padding: 8px 12px; border-radius: var(--radius-sm); font-size: 13px; color: #AAA; cursor: pointer; transition: all var(--transition); margin-bottom: 2px; display: block; }
.api-sidebar-item:hover { background: var(--surface2); color: var(--white); }
.api-sidebar-item.active { background: rgba(230,51,41,0.1); color: var(--red); }
.api-section { margin-bottom: 56px; }
.api-section-title { font-family: var(--font-display); font-size: 22px; font-weight: 700; margin-bottom: 6px; }
.api-section-desc { font-size: 14px; color: #999; line-height: 1.65; margin-bottom: 24px; }
.code-block { background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; overflow-x: auto; margin-bottom: 16px; position: relative; }
.code-block pre { font-family: var(--font-mono); font-size: 12px; line-height: 1.7; color: #A8D5A2; }
.code-block .comment { color: #555; }
.code-block .key { color: #7DD3FC; }
.code-block .string { color: #86EFAC; }
.code-block .num { color: #F9A8D4; }
.code-lang { position: absolute; top: 10px; right: 12px; font-family: var(--font-mono); font-size: 9px; text-transform: uppercase; color: var(--muted); letter-spacing: 1px; }
.endpoint-row { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.method-badge { font-family: var(--font-mono); font-size: 11px; font-weight: 500; padding: 4px 10px; border-radius: var(--radius-sm); }
.method-get  { background: rgba(52,211,153,0.15); color: #34D399; border: 1px solid rgba(52,211,153,0.3); }
.method-post { background: rgba(251,146,60,0.15); color: #FB923C; border: 1px solid rgba(251,146,60,0.3); }
.endpoint-url { font-family: var(--font-mono); font-size: 13px; color: #7DD3FC; }
.param-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.param-table th { font-family: var(--font-mono); font-size: 9px; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); padding: 8px 10px; text-align: left; border-bottom: 1px solid var(--border); }
.param-table td { padding: 9px 10px; border-bottom: 1px solid rgba(255,255,255,0.03); color: #CCC; }
.param-name { font-family: var(--font-mono); color: #7DD3FC; }
.param-req { font-family: var(--font-mono); font-size: 10px; color: var(--red); }
.param-opt { font-family: var(--font-mono); font-size: 10px; color: var(--muted); }

/* ── PRICING PAGE ───────────────────────────── */
.pricing-page { padding: 60px 0 100px; }
.pricing-hero { text-align: center; padding: 40px 0 60px; }
.pricing-hero h1 { font-family: var(--font-display); font-size: clamp(40px,5vw,64px); font-weight: 800; letter-spacing: -2px; margin-bottom: 16px; }
.pricing-hero p { font-size: 16px; color: #999; max-width: 480px; margin: 0 auto; }
.plans-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; max-width: 960px; margin: 0 auto 60px; }
.plan-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-xl); padding: 32px; position: relative; }
.plan-card.featured-plan { border-color: var(--red); background: rgba(230,51,41,0.04); }
.plan-badge { display: inline-block; padding: 4px 12px; background: var(--red); border-radius: 20px; font-family: var(--font-mono); font-size: 10px; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 16px; }
.plan-name { font-family: var(--font-display); font-size: 22px; font-weight: 800; margin-bottom: 6px; }
.plan-desc { font-size: 13px; color: #888; margin-bottom: 24px; line-height: 1.5; }
.plan-price { font-family: var(--font-display); font-size: 44px; font-weight: 800; letter-spacing: -2px; margin-bottom: 4px; }
.plan-price sub { font-size: 14px; font-weight: 400; color: var(--muted); font-family: var(--font-mono); }
.plan-period { font-family: var(--font-mono); font-size: 11px; color: var(--muted); margin-bottom: 28px; }
.plan-features { list-style: none; }
.plan-features li { padding: 8px 0; font-size: 13px; color: #CCC; display: flex; gap: 10px; border-bottom: 1px solid rgba(255,255,255,0.04); }
.plan-features li .check { color: #34D399; flex-shrink: 0; }
.plan-features li .cross { color: var(--muted); flex-shrink: 0; }

/* ── FOOTER ─────────────────────────────────── */
footer {
  border-top: 1px solid var(--border);
  padding: 48px 0 32px;
}
.footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; margin-bottom: 40px; }
.footer-brand p { font-size: 13px; color: var(--muted2); line-height: 1.6; margin-top: 12px; max-width: 280px; }
.footer-col h4 { font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--muted); margin-bottom: 14px; }
.footer-col a { display: block; font-size: 13px; color: #888; margin-bottom: 8px; transition: color var(--transition); }
.footer-col a:hover { color: var(--white); }
.footer-bottom { display: flex; justify-content: space-between; align-items: center; padding-top: 24px; border-top: 1px solid var(--border); font-family: var(--font-mono); font-size: 11px; color: var(--muted); }
.footer-bottom .legal { display: flex; gap: 20px; }

/* ── MAKER STRIP ─────────────────────────────── */
.maker-strip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 36px 0 32px;
  margin-bottom: 0;
  position: relative;
}
.maker-strip::before {
  content: '';
  position: absolute; top: 0; left: 50%; transform: translateX(-50%);
  width: 80px; height: 1px;
  background: linear-gradient(90deg, transparent, var(--red), transparent);
}
.maker-label {
  font-family: var(--font-mono);
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  color: var(--muted);
}
.maker-brands {
  display: flex;
  align-items: center;
  gap: 20px;
}
.maker-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: var(--surface2);
  border: 1px solid var(--border2);
  border-radius: var(--radius);
  text-decoration: none;
  transition: all 0.25s;
  position: relative;
  overflow: hidden;
}
.maker-brand::before {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(230,51,41,0.06) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.25s;
}
.maker-brand:hover {
  border-color: rgba(230,51,41,0.4);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
}
.maker-brand:hover::before { opacity: 1; }
.maker-brand-icon { font-size: 16px; }
.maker-brand-name {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.3px;
  color: var(--white);
}
.maker-brand-accent { color: var(--red); }
.maker-divider {
  font-family: var(--font-mono);
  font-size: 18px;
  color: var(--muted);
  font-style: italic;
}
.maker-sub {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--muted);
  letter-spacing: 0.5px;
}

/* ── RESPONSIVE ─────────────────────────────── */
@media (max-width: 1024px) {
  .catalog-layout { grid-template-columns: 1fr; }
  .sidebar { display: none; }
  .api-grid { grid-template-columns: 1fr; }
  .api-nav-sticky { display: none; }
  .plans-grid { grid-template-columns: 1fr; max-width: 440px; }
  .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
}
@media (max-width: 768px) {
  .dataset-grid { grid-template-columns: 1fr; }
  .hero-stats { flex-direction: column; gap: 20px; }
  .hero-stat { border-right: none; border-bottom: 1px solid var(--border); padding: 0 0 20px; }
  .hero-stat:last-child { border-bottom: none; }
  .modal-stats-grid { grid-template-columns: 1fr 1fr; }
  .pricing-grid { grid-template-columns: 1fr; }
  .footer-grid { grid-template-columns: 1fr; }
  .footer-bottom { flex-direction: column; gap: 12px; text-align: center; }
  .featured-card { flex-direction: column; }
  .nav-links { display: none; }
}
@media (max-width: 480px) {
  .container { padding: 0 16px; }
  .hero-title { letter-spacing: -2px; }
  .modal { border-radius: var(--radius-lg); }
  .modal-header, .modal-body { padding: 20px; }
  .modal-stats-grid { grid-template-columns: 1fr; }
}

/* ── UTILITIES ──────────────────────────────── */
.hidden { display: none !important; }
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.mt-1 { margin-top: 4px; }
.mt-2 { margin-top: 8px; }
.mt-3 { margin-top: 16px; }
