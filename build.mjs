// Generates the animated SVGs for the GitHub profile README.
// Run: node build.mjs   (writes into ./assets)
import { writeFileSync, mkdirSync } from 'node:fs';

const BG = '#0C0C0E', PANEL = '#111114', LIME = '#A3E635', FG = '#F8FAFC', MUTED = '#94A3B8';
const FONT = `Syne,'Arial Black',Impact,'Segoe UI',sans-serif`;
const BODY = `'Segoe UI',Helvetica,Arial,sans-serif`;
const MONO = `'JetBrains Mono',Consolas,'Courier New',monospace`;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
mkdirSync(new URL('./assets/', import.meta.url), { recursive: true });
const out = (name, svg) => writeFileSync(new URL(`./assets/${name}`, import.meta.url), svg);

/* ───────────── Hero ───────────── */
out('hero.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="440" viewBox="0 0 1200 440">
<defs><pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="${FG}" stroke-opacity=".035"/></pattern></defs>
<style>
text{font-family:${FONT}}
.up{opacity:0;animation:up 1.1s cubic-bezier(.2,.8,.2,1) forwards}@keyframes up{from{opacity:0;transform:translateY(50px)}to{opacity:1;transform:none}}
.d1{animation-delay:.15s}.d2{animation-delay:.4s}.d3{animation-delay:.8s}
.ring{transform-origin:1050px 215px;animation:rot 24s linear infinite}@keyframes rot{to{transform:rotate(360deg)}}
.bl{animation:bl 1.2s steps(2) infinite}@keyframes bl{50%{opacity:0}}
.scan{animation:scan 9s linear infinite}@keyframes scan{from{transform:translateX(-60px)}to{transform:translateX(1260px)}}
</style>
<rect width="1200" height="440" fill="${BG}"/><rect width="1200" height="440" fill="url(#g)"/>
<g class="scan"><rect width="2" height="440" fill="${LIME}" opacity=".18"/></g>

<circle class="bl" cx="66" cy="62" r="5" fill="${LIME}"/>
<text x="84" y="67" font-size="13" font-weight="700" letter-spacing="5" fill="${MUTED}" font-family="${MONO}">GITHUB.COM/DARSHIL-N</text>

<g class="up d1"><text x="60" y="226" font-size="150" font-weight="900" fill="${FG}" textLength="640" lengthAdjust="spacingAndGlyphs">DARSHIL</text></g>
<g class="up d2"><text x="60" y="368" font-size="150" font-weight="900" fill="none" stroke="${LIME}" stroke-width="2.5" textLength="740" lengthAdjust="spacingAndGlyphs">NATHWANI</text></g>
<g class="up d3"><text x="64" y="410" font-size="14" font-weight="700" letter-spacing="5" fill="${MUTED}" font-family="${MONO}">AI &amp; FULL STACK DEVELOPER  ·  BENGALURU</text></g>

<polygon points="960,0 1200,0 1200,440 900,440" fill="${LIME}"/>
<g class="ring" fill="none" stroke="${BG}" stroke-opacity=".55"><circle cx="1050" cy="215" r="92" stroke-dasharray="3 10"/><circle cx="1050" cy="123" r="6" fill="${BG}" stroke="none"/></g>
<text x="1050" y="246" text-anchor="middle" font-size="84" font-weight="900" fill="${BG}" textLength="124" lengthAdjust="spacingAndGlyphs">DN</text>
</svg>`);

/* ───────────── Section label ───────────── */
for (const [id, label, note] of [['pinned', 'PINNED WORK', 'REPOSITORIES'], ['activity', 'ACTIVITY', 'LIVE FROM GITHUB']]) {
  const w = label.length * 13 + 52;
  out(`l-${id}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="52" viewBox="0 0 1200 52">
<style>
.st{animation:st 5s cubic-bezier(.6,0,.3,1) infinite}@keyframes st{from{transform:translateX(0)}to{transform:translateX(${1200 - w - 280}px)}}
.ln{transform-origin:left;animation:ln 1.4s cubic-bezier(.6,0,.2,1) .2s both}@keyframes ln{from{transform:scaleX(0)}to{transform:scaleX(1)}}
</style>
<polygon points="12,6 ${w},6 ${w - 12},46 0,46" fill="${LIME}"/>
<text x="24" y="32" font-size="14" font-weight="800" letter-spacing="5" fill="${BG}" font-family="${MONO}">${label}</text>
<g transform="translate(${w + 24} 0)"><rect class="ln" y="25" width="${1200 - w - 24 - 190}" height="2" fill="${FG}" opacity=".14"/>
<g class="st"><rect y="23" width="44" height="6" fill="${LIME}"/></g></g>
<text x="1200" y="31" text-anchor="end" font-size="12" font-weight="700" letter-spacing="3" fill="${MUTED}" font-family="${MONO}">${note}</text>
</svg>`);
}

/* ───────────── Repo cards ───────────── */
const repos = [
  ['raahi', 'Raahi', ['Smart tourist safety for Northeast India.', 'Blockchain ID, NFC wristbands, SMS fallback.'], ['Kotlin', 'Polygon', 'Firebase']],
  ['siddhi', 'Siddhi-Ai', ['Credit-risk AI over 1.8M+ financial records.', 'XGBoost with SHAP explainability.'], ['XGBoost', 'FastAPI', 'React']],
  ['sanjeevani', 'Sanjeevani', ['Multi-agent ICU decision support: guideline', 'retrieval and risk reports with safety guards.'], ['FastAPI', 'Ollama', 'ChromaDB']],
  ['kara', 'Kara-Ai', ['Multimodal interview coach reading speech,', 'facial expression and body language.'], ['YOLOv8', 'Gemini', 'FastAPI']],
  ['saarthi', 'Saarthi', ['Standardizes public-sector material master data:', 'OCR, deduplication and code generation.'], ['FastAPI', 'Supabase', 'pgvector']],
  ['pravaah', 'Pravaah-AI-', ['Multi-agent fairness and bias auditing for ML', 'datasets and deployed models.'], ['LangGraph', 'FastAPI', 'Gemini']],
];
repos.forEach(([id, name, desc, tags], i) => {
  let chips = '', x = 36;
  for (const t of tags) { chips += `<text x="${x}" y="156" font-size="11.5" font-weight="700" letter-spacing="2" fill="${LIME}" font-family="${MONO}">${esc(t.toUpperCase())}</text>`; x += t.length * 9.2 + 26; }
  out(`r-${id}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="580" height="190" viewBox="0 0 580 190">
<style>
text{font-family:${FONT}}
.in{opacity:0;animation:in .9s cubic-bezier(.2,.8,.2,1) ${i * 0.1}s forwards}@keyframes in{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
.bar{transform-box:fill-box;transform-origin:top;animation:bar 1s cubic-bezier(.6,0,.2,1) ${0.2 + i * 0.1}s both}@keyframes bar{from{transform:scaleY(0)}to{transform:scaleY(1)}}
.ar{animation:ar 2.2s ease-in-out infinite}@keyframes ar{50%{transform:translate(4px,-4px)}}
.sw{animation:sw 6s cubic-bezier(.6,0,.3,1) infinite}@keyframes sw{from{transform:translateX(-120px)}to{transform:translateX(600px)}}
</style>
<g class="in">
<rect x=".5" y=".5" width="579" height="189" fill="${PANEL}" stroke="${FG}" stroke-opacity=".1"/>
<rect class="bar" x="0" y="0" width="4" height="190" fill="${LIME}"/>
<text x="36" y="42" font-size="11.5" font-weight="700" letter-spacing="3" fill="${MUTED}" font-family="${MONO}">DARSHIL-N /</text>
<text x="36" y="84" font-size="32" font-weight="900" fill="${FG}" textLength="${Math.min(name.length * 21, 380)}" lengthAdjust="spacingAndGlyphs">${esc(name.toUpperCase())}</text>
<text x="36" y="112" font-size="13.5" font-weight="600" fill="${MUTED}" font-family="${BODY}">${esc(desc[0])}</text>
<text x="36" y="132" font-size="13.5" font-weight="600" fill="${MUTED}" font-family="${BODY}">${esc(desc[1])}</text>
${chips}
<g class="ar"><text x="530" y="46" font-size="22" font-weight="900" fill="${LIME}" font-family="${MONO}">↗</text></g>
<g class="sw"><polygon points="12,187 90,187 84,190 6,190" fill="${LIME}"/></g>
</g>
</svg>`);
});

/* ───────────── Closing ───────────── */
out('closing.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="220" viewBox="0 0 1200 220">
<style>
text{font-family:${FONT}}
.in{opacity:0;animation:in 1s cubic-bezier(.2,.8,.2,1) forwards}@keyframes in{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:none}}
.sl{animation:sl 7s cubic-bezier(.6,0,.3,1) infinite}@keyframes sl{from{transform:translateX(-300px)}to{transform:translateX(1500px)}}
.pu{transform-box:fill-box;transform-origin:center;animation:pu 2.4s ease-in-out infinite}@keyframes pu{50%{transform:scale(1.6);opacity:.35}}
</style>
<rect width="1200" height="220" fill="${BG}"/>
<polygon points="0,0 1200,0 1200,8 0,8" fill="${LIME}"/>
<g class="in"><text x="56" y="146" font-size="104" font-weight="900" fill="${LIME}" textLength="640" lengthAdjust="spacingAndGlyphs">SAY HELLO.</text></g>
<g class="in" style="animation-delay:.4s"><text x="60" y="190" font-size="14" font-weight="700" letter-spacing="5" fill="${MUTED}" font-family="${MONO}">DARSHILNATHWANI@GMAIL.COM</text></g>
<circle class="pu" cx="1140" cy="110" r="8" fill="${LIME}"/>
<g class="sl" opacity=".05"><polygon points="60,8 120,8 60,220 0,220" fill="#fff"/></g>
</svg>`);
console.log('built');
