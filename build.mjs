// Generates every animated SVG used by the profile README.
// Run: node build.mjs   (writes into ./assets)
import { writeFileSync, mkdirSync } from 'node:fs';

const BG = '#0C0C0E', PANEL = '#121216', LIME = '#A3E635', FG = '#F8FAFC', MUTED = '#94A3B8';
const FONT = `Syne,'Arial Black',Impact,'Segoe UI',sans-serif`;
const BODY = `'Segoe UI',Helvetica,Arial,sans-serif`;
const MONO = `'JetBrains Mono',Consolas,'Courier New',monospace`;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
mkdirSync(new URL('./assets/', import.meta.url), { recursive: true });
const out = (name, svg) => writeFileSync(new URL(`./assets/${name}`, import.meta.url), svg);

let laneId = 0;
/** Endless text lane. Returns { svg, css }. */
function lane({ text, y, size, charW, dir = -1, speed = 70, viewW = 1200, attrs }) {
  const id = laneId++;
  const period = text.length * charW;
  const copies = Math.ceil((viewW + period) / period) + 1;
  let t = '';
  for (let k = 0; k < copies; k++)
    t += `<text x="${k * period}" y="${y}" font-size="${size}" font-weight="900" textLength="${period}" lengthAdjust="spacingAndGlyphs" ${attrs}>${esc(text)}</text>`;
  const from = dir < 0 ? 0 : -period, to = dir < 0 ? -period : 0;
  return {
    svg: `<g class="m${id}">${t}</g>`,
    css: `.m${id}{animation:m${id} ${(period / speed).toFixed(1)}s linear infinite}@keyframes m${id}{from{transform:translateX(${from}px)}to{transform:translateX(${to}px)}}`,
  };
}
const grid = (id, s, c, o) => `<pattern id="${id}" width="${s}" height="${s}" patternUnits="userSpaceOnUse"><path d="M${s} 0H0V${s}" fill="none" stroke="${c}" stroke-opacity="${o}"/></pattern>`;

/* ═════════════════════════ HERO — lime poster ═════════════════════════ */
{
  const tick = lane({ text: 'IEEE PUBLISHED ✦ LIVE ON PLAY STORE ✦ AGENTIC AI ✦ TEXT-TO-SQL ✦ FULL STACK ✦ REACT NATIVE ✦ HACKATHON WINNER ✦ ', y: 530, size: 28, charW: 17, speed: 90, attrs: `fill="${LIME}"` });
  out('hero.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="580" viewBox="0 0 1200 580">
<defs>${grid('g', 40, BG, 0.07)}</defs>
<style>
text{font-family:${FONT}}
.up{opacity:0;animation:up 1s cubic-bezier(.2,.8,.2,1) forwards}@keyframes up{from{opacity:0;transform:translateY(70px)}to{opacity:1;transform:none}}
.d1{animation-delay:.2s}.d2{animation-delay:.45s}.d3{animation-delay:.8s}
.ring{transform-origin:1095px 262px;animation:rot 16s linear infinite}.ring2{transform-origin:1095px 262px;animation:rot 9s linear infinite reverse}
@keyframes rot{to{transform:rotate(360deg)}}
.scan{animation:scan 7s linear infinite}@keyframes scan{from{transform:translateX(-100px)}to{transform:translateX(1300px)}}
.bl{animation:bl 1.1s steps(2) infinite}@keyframes bl{50%{opacity:0}}
${tick.css}
</style>
<rect width="1200" height="580" fill="${LIME}"/><rect width="1200" height="580" fill="url(#g)"/>
<g class="scan"><rect width="3" height="580" fill="${BG}" opacity=".18"/></g>

<rect width="1200" height="46" fill="${BG}"/>
<circle class="bl" cx="30" cy="23" r="5" fill="${LIME}"/>
<text x="46" y="28" font-size="12" font-weight="700" letter-spacing="4" fill="${LIME}" font-family="${MONO}">AI &amp; FULL STACK DEVELOPER  ✦  BENGALURU, INDIA</text>
<text x="1170" y="28" text-anchor="end" font-size="12" font-weight="700" letter-spacing="3" fill="${FG}" font-family="${MONO}">DARSHILNATHWANI.NETLIFY.APP ↗</text>

<g class="up d1"><text x="46" y="246" font-size="196" font-weight="900" fill="${BG}" textLength="790" lengthAdjust="spacingAndGlyphs">DARSHIL</text></g>
<g class="up d2"><text x="46" y="422" font-size="196" font-weight="900" fill="none" stroke="${BG}" stroke-width="3.5" textLength="860" lengthAdjust="spacingAndGlyphs">NATHWANI</text></g>
<g class="up d3"><text x="52" y="458" font-size="14" font-weight="700" letter-spacing="2.5" fill="${BG}" font-family="${MONO}">IEEE TENCON 2026  ✦  1ST PLACE HACKATHON  ✦  LIVE ON PLAY STORE</text></g>

<polygon points="1010,46 1200,46 1200,478 950,478" fill="${BG}"/>
<g class="ring" fill="none" stroke="${LIME}"><circle cx="1095" cy="262" r="112" stroke-dasharray="3 11" stroke-opacity=".7"/><circle cx="1095" cy="228" r="7" fill="${LIME}" stroke="none"/></g>
<g class="ring2" fill="none" stroke="${LIME}"><circle cx="1095" cy="262" r="76" stroke-dasharray="14 8" stroke-opacity=".5"/><circle cx="1095" cy="186" r="5" fill="${FG}" stroke="none"/></g>
<text x="1095" y="285" text-anchor="middle" font-size="70" font-weight="900" fill="${LIME}" textLength="104" lengthAdjust="spacingAndGlyphs">DN</text>

<rect y="478" width="1200" height="102" fill="${BG}"/>
<polygon points="0,478 1200,478 1200,484 0,484" fill="${LIME}" opacity=".35"/>
${tick.svg}
</svg>`);
}

/* ═════════════════════════ Section header ═════════════════════════ */
const heads = [
  ['01', 'PROFILE', 'FILE 001'], ['02', 'ARSENAL', 'TOOLS OF THE TRADE'], ['03', 'PROOF', 'BY THE NUMBERS'], ['04', 'WORK', 'SELECTED PROJECTS'], ['05', 'CONTACT', "LET'S TALK"],
];
for (const [n, title, note] of heads) {
  const tw = title.length * 31;
  out(`h-${title.toLowerCase()}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="84" viewBox="0 0 1200 84">
<style>
text{font-family:${FONT}}
.t{opacity:0;animation:t .9s cubic-bezier(.2,.8,.2,1) forwards}@keyframes t{from{opacity:0;transform:translateX(-50px)}to{opacity:1;transform:none}}
.ln{transform-origin:left;animation:ln 1.4s cubic-bezier(.6,0,.2,1) .3s both}@keyframes ln{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.dot{animation:dot 4s cubic-bezier(.6,0,.3,1) infinite}@keyframes dot{from{transform:translateX(0)}to{transform:translateX(${1200 - 200 - tw - 90}px)}}
</style>
<rect width="1200" height="84" fill="${BG}"/>
<polygon points="14,14 88,14 74,70 0,70" fill="${LIME}"/>
<text x="44" y="53" text-anchor="middle" font-size="30" font-weight="900" fill="${BG}" textLength="44" lengthAdjust="spacingAndGlyphs">${n}</text>
<text class="t" x="112" y="58" font-size="44" font-weight="900" fill="${FG}" textLength="${tw}" lengthAdjust="spacingAndGlyphs">${title}</text>
<g transform="translate(${112 + tw + 24} 0)"><rect class="ln" x="0" y="41" width="${1200 - 112 - tw - 24 - 200}" height="2" fill="${FG}" opacity=".18"/>
<g class="dot"><rect x="0" y="39" width="46" height="6" fill="${LIME}"/></g></g>
<text x="1186" y="47" text-anchor="end" font-size="12" font-weight="700" letter-spacing="3" fill="${LIME}" font-family="${MONO}">/ ${esc(note)}</text>
</svg>`);
}

/* ═════════════════════════ Manifesto — kinetic rows ═════════════════════════ */
{
  const rows = [
    ['PUBLISHED AT IEEE ✦ ', 50, -1, 60, `fill="none" stroke="${LIME}" stroke-width="2.5"`],
    ['LIVE ON PLAY STORE ✦ ', 50, 1, 80, `fill="${FG}"`],
    ['1ST PLACE WINNER ✦ ', 50, -1, 100, `fill="${LIME}"`],
  ];
  let css = '', svg = '';
  rows.forEach(([text, charW, dir, speed, attrs], i) => {
    const l = lane({ text, y: 92 + i * 116, size: 96, charW, dir, speed, attrs });
    css += l.css; svg += l.svg;
    if (i) svg += `<rect y="${i * 116 - 6}" width="1200" height="1" fill="${FG}" opacity=".1"/>`;
  });
  out('manifesto.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="352" viewBox="0 0 1200 352">
<defs>
<linearGradient id="l" x1="0" x2="1"><stop offset="0" stop-color="${BG}"/><stop offset="1" stop-color="${BG}" stop-opacity="0"/></linearGradient>
<linearGradient id="r" x1="1" x2="0"><stop offset="0" stop-color="${BG}"/><stop offset="1" stop-color="${BG}" stop-opacity="0"/></linearGradient>
</defs>
<style>text{font-family:${FONT}}${css}</style>
<rect width="1200" height="352" fill="${BG}"/>
${svg}
<rect width="160" height="352" fill="url(#l)"/><rect x="1040" width="160" height="352" fill="url(#r)"/>
</svg>`);
}

/* ═════════════════════════ Dossier ═════════════════════════ */
{
  const rows = [
    ['ROLE', 'AI & Full Stack Developer'],
    ['NOW', 'Part-Time Software Developer @ Vina EduTech · Jul 2026 – Present'],
    ['BEFORE', 'Full Stack Intern @ Indian Chess Academy · Jan – Jun 2026'],
    ['RESEARCH', 'AI Research Intern @ Grep Digital · IEEE TENCON 2026 paper'],
    ['FREELANCE', 'Production client sites, incl. Velvet Academy · 2025 – Present'],
    ['EDUCATION', 'B.E. Information Science & Engineering @ DSCE, Bengaluru · 2024 – Present'],
    ['FOCUS', 'Agentic AI · RAG · Text-to-SQL · Web & Mobile Apps'],
  ];
  let body = '', css = '';
  rows.forEach(([k, v], i) => {
    const y = 122 + i * 44;
    body += `<text x="72" y="${y}" font-size="11.5" font-weight="800" letter-spacing="3" fill="${LIME}" font-family="${MONO}">${k}</text>
<text x="226" y="${y}" font-size="14" font-weight="600" fill="${FG}" font-family="${BODY}">${esc(v)}</text>
<rect class="cv cv${i}" x="62" y="${y - 20}" width="740" height="30" fill="${PANEL}"/>
<rect x="62" y="${y + 12}" width="740" height="1" fill="${FG}" opacity=".08"/>`;
    css += `.cv${i}{animation-delay:${0.5 + i * 0.35}s}`;
  });
  let bars = '';
  const hs = [40, 64, 28, 70, 52, 36, 66, 30, 58, 72, 44, 34, 62, 48, 70, 26, 56, 40, 68, 32, 60, 46];
  hs.forEach((h, i) => { bars += `<rect class="bar" style="animation-delay:${(i % 7) * 0.18}s" x="${906 + i * 12}" y="${430 - h}" width="6" height="${h}" fill="${BG}"/>`; });
  out('dossier.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="470" viewBox="0 0 1200 470">
<defs>${grid('g', 40, FG, 0.04)}</defs>
<style>
text{font-family:${FONT}}
.cv{transform-box:fill-box;transform-origin:right center;animation:cv .6s cubic-bezier(.7,0,.3,1) forwards}@keyframes cv{to{transform:scaleX(0)}}
${css}
.bar{transform-box:fill-box;transform-origin:bottom;animation:bar 1.6s ease-in-out infinite}@keyframes bar{50%{transform:scaleY(.45)}}
.bl{animation:bl 1.1s steps(2) infinite}@keyframes bl{50%{opacity:0}}
.sw{animation:sw 6s linear infinite}@keyframes sw{from{transform:translateY(0)}to{transform:translateY(420px)}}
</style>
<rect width="1200" height="470" fill="${BG}"/><rect width="1200" height="470" fill="url(#g)"/>
<rect x="40" y="30" width="780" height="410" fill="${PANEL}" stroke="${FG}" stroke-opacity=".14"/>
<rect x="40" y="30" width="780" height="44" fill="${BG}" stroke="${FG}" stroke-opacity=".14"/>
<circle cx="64" cy="52" r="5" fill="${LIME}"/><circle cx="82" cy="52" r="5" fill="${FG}" opacity=".3"/><circle cx="100" cy="52" r="5" fill="${FG}" opacity=".3"/>
<text x="124" y="57" font-size="12" font-weight="700" letter-spacing="3" fill="${MUTED}" font-family="${MONO}">FILE_001 // DARSHIL_NATHWANI</text>
${body}
<rect class="bl" x="72" y="418" width="10" height="16" fill="${LIME}"/>
<g class="sw" opacity=".3"><rect x="40" y="76" width="780" height="2" fill="${LIME}"/></g>

<polygon points="880,0 1200,0 1200,470 840,470" fill="${LIME}"/>
<text x="905" y="104" font-size="12" font-weight="800" letter-spacing="4" fill="${BG}" font-family="${MONO}">INDEX / 001</text>
<text x="898" y="272" font-size="190" font-weight="900" fill="${BG}" textLength="262" lengthAdjust="spacingAndGlyphs">DN</text>
<circle class="bl" cx="912" cy="318" r="5" fill="${BG}"/>
<text x="928" y="323" font-size="12" font-weight="800" letter-spacing="4" fill="${BG}" font-family="${MONO}">STATUS: BUILDING</text>
${bars}
</svg>`);
}

/* ═════════════════════════ Arsenal — scrolling lanes ═════════════════════════ */
{
  const cats = [
    ['LANGUAGES', 'PYTHON ✦ TYPESCRIPT ✦ JAVASCRIPT ✦ KOTLIN ✦ C++ ✦ C ✦ SOLIDITY ✦ '],
    ['AI & ML', 'TENSORFLOW ✦ OPENCV ✦ YOLO ✦ LANGCHAIN ✦ LANGGRAPH ✦ HUGGING FACE ✦ XGBOOST ✦ GEMINI API ✦ OLLAMA ✦ '],
    ['WEB', 'REACT ✦ NEXT.JS ✦ NODE.JS ✦ FASTAPI ✦ FLASK ✦ TAILWIND ✦ '],
    ['MOBILE & APPS', 'KOTLIN ✦ ANDROID SDK ✦ REACT NATIVE ✦ FIREBASE ✦ OFFLINE-FIRST ✦ GOOGLE PLAY ✦ APP STORE ✦ '],
    ['DATA & INFRA', 'SUPABASE ✦ POSTGRESQL ✦ MONGODB ✦ SQLITE ✦ REDIS ✦ CHROMADB ✦ DOCKER ✦ GITHUB ✦ VERCEL ✦ '],
  ];
  const LH = 100, H = cats.length * LH;
  const styles = [`fill="${FG}"`, `fill="none" stroke="${LIME}" stroke-width="1.8"`, `fill="${LIME}"`, `fill="none" stroke="${FG}" stroke-opacity=".55" stroke-width="1.5"`];
  let css = '', body = '';
  cats.forEach(([label, text], i) => {
    const l = lane({ text, y: i * LH + 66, size: 46, charW: 27, dir: i % 2 ? 1 : -1, speed: 60 + (i % 3) * 14, attrs: styles[i % styles.length] });
    css += l.css; body += l.svg;
    body += `<rect y="${(i + 1) * LH - 1}" width="1200" height="1" fill="${FG}" opacity=".08"/>`;
  });
  let labels = '';
  cats.forEach(([label], i) => {
    const y = i * LH, solid = i % 2 === 0;
    labels += `<g class="lb" style="animation-delay:${i * 0.12}s"><polygon points="0,${y} 252,${y} 228,${y + LH} 0,${y + LH}" fill="${solid ? LIME : PANEL}" ${solid ? '' : `stroke="${FG}" stroke-opacity=".15"`}/>
<text x="26" y="${y + 58}" font-size="20" font-weight="900" letter-spacing="3" fill="${solid ? BG : FG}">${esc(label)}</text></g>`;
  });
  out('arsenal.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${H}" viewBox="0 0 1200 ${H}">
<defs><linearGradient id="r" x1="1" x2="0"><stop offset="0" stop-color="${BG}"/><stop offset="1" stop-color="${BG}" stop-opacity="0"/></linearGradient></defs>
<style>
text{font-family:${FONT}}
${css}
.lb{opacity:0;animation:lb .7s cubic-bezier(.2,.8,.2,1) forwards}@keyframes lb{from{opacity:0;transform:translateX(-80px)}to{opacity:1;transform:none}}
</style>
<rect width="1200" height="${H}" fill="${BG}"/>
${body}
<rect x="1060" width="140" height="${H}" fill="url(#r)"/>
${labels}
</svg>`);
}

/* ═════════════════════════ Proof — lime dial + stats ═════════════════════════ */
{
  const C = (2 * Math.PI * 118).toFixed(1), off = (C * 0.07).toFixed(1);
  const stats = [
    ['1ST', 'ICA HACKATHON WINNER', 'VINA EDUTECH · 2026'],
    ['1.8M+', 'FINANCIAL RECORDS', 'SIDDHI AI · XGBOOST + SHAP'],
    ['6 LIVE', 'PRODUCTION PLATFORMS', 'WEB + PLAY STORE APPS'],
  ];
  let body = '';
  stats.forEach(([big, l1, l2], i) => {
    const x = 430 + i * 250;
    body += `<g class="st" style="animation-delay:${0.4 + i * 0.25}s">
<text x="${x}" y="186" font-size="70" font-weight="900" fill="${BG}" textLength="${big.length * 37}" lengthAdjust="spacingAndGlyphs">${big}</text>
<rect class="ul" style="animation-delay:${0.8 + i * 0.25}s" x="${x}" y="206" width="56" height="5" fill="${BG}"/>
<text x="${x}" y="244" font-size="11.5" font-weight="800" letter-spacing="1.5" fill="${BG}" font-family="${MONO}">${l1}</text>
<text x="${x}" y="264" font-size="11.5" font-weight="700" letter-spacing="1.5" fill="${BG}" opacity=".65" font-family="${MONO}">${l2}</text></g>`;
    if (i) body += `<polygon points="${x - 22},70 ${x - 18},70 ${x - 38},290 ${x - 42},290" fill="${BG}" opacity=".35"/>`;
  });
  out('proof.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="360" viewBox="0 0 1200 360">
<defs>${grid('g', 40, BG, 0.07)}</defs>
<style>
text{font-family:${FONT}}
.pr{stroke-dasharray:${C};stroke-dashoffset:${C};transform:rotate(-90deg);transform-origin:200px 180px;animation:pr 2.2s cubic-bezier(.3,.7,.2,1) .3s forwards}@keyframes pr{to{stroke-dashoffset:${off}}}
.st{opacity:0;animation:st .8s cubic-bezier(.2,.8,.2,1) forwards}@keyframes st{from{opacity:0;transform:translateY(34px)}to{opacity:1;transform:none}}
.ul{transform-box:fill-box;transform-origin:left;animation:ul 1s cubic-bezier(.6,0,.2,1) both}@keyframes ul{from{transform:scaleX(0)}to{transform:scaleX(2.6)}}
.sp{transform-origin:200px 180px;animation:sp 12s linear infinite}@keyframes sp{to{transform:rotate(360deg)}}
</style>
<rect width="1200" height="360" fill="${LIME}"/><rect width="1200" height="360" fill="url(#g)"/>
<circle cx="200" cy="180" r="118" fill="none" stroke="${BG}" stroke-opacity=".16" stroke-width="22"/>
<circle class="pr" cx="200" cy="180" r="118" fill="none" stroke="${BG}" stroke-width="22" stroke-linecap="butt"/>
<g class="sp"><circle cx="200" cy="36" r="5" fill="${BG}"/><circle cx="200" cy="180" r="145" fill="none" stroke="${BG}" stroke-opacity=".4" stroke-dasharray="2 9"/></g>
<text x="200" y="198" text-anchor="middle" font-size="62" font-weight="900" fill="${BG}" textLength="150" lengthAdjust="spacingAndGlyphs">93%</text>
<text x="200" y="226" text-anchor="middle" font-size="11.5" font-weight="800" letter-spacing="2" fill="${BG}" font-family="${MONO}">NL-TO-SQL ACCURACY</text>
<text x="200" y="246" text-anchor="middle" font-size="10.5" font-weight="700" letter-spacing="1.5" fill="${BG}" opacity=".65" font-family="${MONO}">DRISHTI-AI</text>
${body}
</svg>`);
}

/* ═════════════════════════ Work — full-width slabs ═════════════════════════ */
{
  const projects = [
    ['drishti', '01', 'DRISHTI-AI', 'Campus Surveillance Intelligence', 'IEEE TENCON 2026',
      ['Natural-language campus surveillance: fine-tuned DeepSeek 6.7B', 'Text-to-SQL plus real-time YOLOv8 anomaly detection. 93% query', 'accuracy, 73% cache hit rate, privacy-first local inference.'],
      ['DeepSeek', 'YOLOv8', 'Flask', 'PostgreSQL'], false],
    ['crickraft', '02', 'CRICKRAFT', 'Academy Management System', 'LIVE · WEB + PLAY STORE',
      ['Batch scheduling, attendance, fees and player telemetry for', 'cricket academies. React/TypeScript dashboard plus an offline-first', 'Kotlin Android app, synced in real time.'],
      ['React', 'TypeScript', 'Kotlin', 'Firebase'], true],
    ['strengthkraft', '03', 'STRENGTHKRAFT', 'Athletic Training Platform', 'LIVE · WEB + PLAY STORE',
      ['Enterprise web suite and React Native app for strength programs:', 'workout logging, athlete progress dashboards and low-latency', 'video workouts with offline caching.'],
      ['React Native', 'React', 'Node.js', 'Firebase'], false],
    ['ica', '04', 'ICA', 'Indian Chess Academy', '1ST PLACE HACKATHON',
      ['Official platform for Indian Chess Academy, grown from the', 'winning hackathon prototype: course discovery, enrolments and', 'tournament operations on indianchessacad.com.'],
      ['React', 'TypeScript', 'Firebase', 'Node.js'], true],
  ];
  for (const [id, n, name, sub, tag, desc, tags, lime] of projects) {
    const bg = lime ? LIME : BG, fg = lime ? BG : FG, ac = lime ? BG : LIME, mu = lime ? '#25330a' : MUTED;
    const tagW = Math.round(tag.length * 10.6 + 64);
    out(`w-${id}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="230" viewBox="0 0 1200 230">
<defs>${grid('g', 40, fg, lime ? 0.07 : 0.045)}</defs>
<style>
text{font-family:${FONT}}
.in{opacity:0;animation:in .9s cubic-bezier(.2,.8,.2,1) forwards}@keyframes in{from{opacity:0;transform:translateX(-60px)}to{opacity:1;transform:none}}
.tg{animation:tg 1.1s cubic-bezier(.2,.8,.2,1) both}@keyframes tg{from{transform:translateX(${tagW}px)}to{transform:none}}
.ar{animation:ar 1.5s ease-in-out infinite}@keyframes ar{50%{transform:translateX(9px)}}
.sw{animation:sw 4.5s cubic-bezier(.6,0,.3,1) infinite}@keyframes sw{from{transform:translateX(-300px)}to{transform:translateX(1300px)}}
</style>
<rect width="1200" height="230" fill="${bg}"/><rect width="1200" height="230" fill="url(#g)"/>
<text class="in" x="26" y="188" font-size="190" font-weight="900" fill="none" stroke="${ac}" stroke-opacity="${lime ? 0.5 : 0.55}" stroke-width="2" textLength="196" lengthAdjust="spacingAndGlyphs">${n}</text>
<g class="in" style="animation-delay:.2s">
<text x="252" y="104" font-size="60" font-weight="900" fill="${fg}" textLength="${Math.min(name.length * 40, 420)}" lengthAdjust="spacingAndGlyphs">${esc(name)}</text>
<text x="254" y="136" font-size="13" font-weight="800" letter-spacing="3" fill="${ac}" font-family="${MONO}">${esc(sub.toUpperCase())}</text>
<text x="254" y="186" font-size="13" font-weight="700" letter-spacing="2" fill="${fg}" font-family="${MONO}">${esc(tags.join('  /  ').toUpperCase())}</text></g>
${desc.map((l, i) => `<text class="in" style="animation-delay:${0.4 + i * 0.12}s" x="690" y="${88 + i * 25}" font-size="13.5" font-weight="600" fill="${lime ? '#1d2a06' : MUTED}" font-family="${BODY}">${esc(l)}</text>`).join('')}
<g class="in" style="animation-delay:.8s"><text x="692" y="186" font-size="13" font-weight="800" letter-spacing="4" fill="${fg}" font-family="${MONO}">OPEN REPO</text>
<g class="ar"><text x="812" y="187" font-size="17" font-weight="900" fill="${ac}" font-family="${MONO}">→</text></g></g>
<g class="tg"><polygon points="${1200 - tagW + 22},0 1200,0 1200,34 ${1200 - tagW},34" fill="${ac}"/>
<text x="${1200 - tagW + 36}" y="22" font-size="12" font-weight="800" letter-spacing="2" fill="${bg}" font-family="${MONO}">${esc(tag)}</text></g>
<g class="sw"><polygon points="22,224 300,224 288,230 10,230" fill="${ac}"/></g>
</svg>`);
  }
}

/* ═════════════════════════ Honors board ═════════════════════════ */
{
  const items = [
    ['PUBLISHED', 'IEEE TENCON 2026', 'IEEE REGION 10 FLAGSHIP CONFERENCE', true],
    ['1ST PLACE', 'INDIAN CHESS ACADEMY HACKATHON', 'VINA EDUTECH', false],
    ['TOP 10', 'NASIKO × DEVAARAMBH BUILDATHON', 'MICROSOFT REACTOR', false],
    ['TOP 10', 'ATHERMEX HACKATHON', 'BMSCE × DSCE', false],
    ['TOP 20', 'CICADA HACKATHON', '150+ TEAMS · ATRIA UNIVERSITY', false],
    ['TOP 25', 'GOOGLE DEEPMIND HACKATHON', 'GOOGLE DEEPMIND BANGALORE', false],
  ];
  let body = '';
  items.forEach(([rank, title, org, hot], i) => {
    const x = (i % 3) * 400, y = Math.floor(i / 3) * 170 + 10;
    const bg = hot ? LIME : PANEL, fg = hot ? BG : FG, ac = hot ? BG : LIME;
    body += `<g class="cd" style="animation-delay:${i * 0.12}s">
<polygon points="${x + 14},${y} ${x + 390},${y} ${x + 376},${y + 156} ${x},${y + 156}" fill="${bg}" ${hot ? '' : `stroke="${FG}" stroke-opacity=".15"`}/>
<text x="${x + 32}" y="${y + 70}" font-size="44" font-weight="900" fill="${ac}" textLength="${rank.length * 26}" lengthAdjust="spacingAndGlyphs">${rank}</text>
<text x="${x + 32}" y="${y + 106}" font-size="15" font-weight="800" fill="${fg}">${esc(title)}</text>
<text x="${x + 32}" y="${y + 130}" font-size="11" font-weight="700" letter-spacing="2" fill="${fg}" opacity=".6" font-family="${MONO}">${esc(org)}</text>
<text x="${x + 346}" y="${y + 32}" text-anchor="end" font-size="11" font-weight="800" letter-spacing="2" fill="${ac}" font-family="${MONO}">2026</text></g>`;
  });
  out('honors.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="350" viewBox="0 0 1200 350">
<style>
text{font-family:${FONT}}
.cd{opacity:0;animation:cd .7s cubic-bezier(.2,.8,.2,1) forwards}@keyframes cd{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:none}}
.sh{animation:sh 6s ease-in-out infinite}@keyframes sh{0%{transform:translateX(-300px)}60%,100%{transform:translateX(1500px)}}
</style>
<rect width="1200" height="350" fill="${BG}"/>
${body}
<g class="sh" opacity=".07"><polygon points="60,0 100,0 60,350 20,350" fill="#fff"/></g>
</svg>`);

  const more = lane({ text: 'RAAHI ✦ SIDDHI AI ✦ SANJEEVANI ✦ KARA-AI ✦ DISHA AI ✦ SAARTHI ✦ PRAVAAH AI ✦ NETRA ✦ KRITI SMARTHIRE ✦ VELVET ACADEMY ✦ ', y: 50, size: 30, charW: 22, speed: 80, attrs: `fill="${BG}"` });
  out('more.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="72" viewBox="0 0 1200 72">
<style>text{font-family:${FONT}}${more.css}</style>
<rect width="1200" height="72" fill="${LIME}"/>
${more.svg}
<polygon points="0,0 250,0 226,72 0,72" fill="${BG}"/>
<text x="24" y="44" font-size="15" font-weight="900" letter-spacing="3" fill="${LIME}">ALSO SHIPPED</text>
</svg>`);
}

/* ═════════════════════════ Contact ═════════════════════════ */
{
  out('contact.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="340" viewBox="0 0 1200 340">
<defs>${grid('g', 40, FG, 0.045)}</defs>
<style>
text{font-family:${FONT}}
.in{opacity:0;animation:in 1s cubic-bezier(.2,.8,.2,1) forwards}@keyframes in{from{opacity:0;transform:translateY(60px)}to{opacity:1;transform:none}}
.sl{animation:sl 5s cubic-bezier(.6,0,.3,1) infinite}@keyframes sl{from{transform:translateX(-400px)}to{transform:translateX(1500px)}}
.pu{transform-box:fill-box;transform-origin:center;animation:pu 2.2s ease-in-out infinite}@keyframes pu{50%{transform:scale(1.5);opacity:.4}}
.sp{transform-origin:1090px 170px;animation:sp 14s linear infinite}@keyframes sp{to{transform:rotate(360deg)}}
</style>
<rect width="1200" height="340" fill="${BG}"/><rect width="1200" height="340" fill="url(#g)"/>
<polygon points="0,0 1200,0 1200,10 0,10" fill="${LIME}"/>
<text x="50" y="62" font-size="12" font-weight="800" letter-spacing="5" fill="${LIME}" font-family="${MONO}">✦ END OF FILE  /  NEXT STEP</text>
<g class="in"><text x="46" y="236" font-size="190" font-weight="900" fill="${LIME}" textLength="1010" lengthAdjust="spacingAndGlyphs">SAY HELLO.</text></g>
<g class="in" style="animation-delay:.5s"><text x="52" y="298" font-size="16" font-weight="700" letter-spacing="3" fill="${FG}" font-family="${MONO}">DARSHILNATHWANI@GMAIL.COM</text></g>
<g class="sl" opacity=".16"><polygon points="60,10 130,10 70,340 0,340" fill="${FG}"/></g>
<g class="sp" fill="none" stroke="${LIME}" stroke-opacity=".7"><circle cx="1090" cy="170" r="70" stroke-dasharray="3 10"/></g>
<circle class="pu" cx="1090" cy="170" r="9" fill="${LIME}"/>
</svg>`);

  const btns = [
    ['email', 'EMAIL', true], ['linkedin', 'LINKEDIN', false], ['github', 'GITHUB', false], ['portfolio', 'PORTFOLIO', false],
  ];
  for (const [id, label, lime] of btns) {
    const bg = lime ? LIME : PANEL, fg = lime ? BG : FG, ac = lime ? BG : LIME;
    out(`b-${id}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="290" height="78" viewBox="0 0 290 78">
<style>
text{font-family:${FONT}}
.ar{animation:ar 1.4s ease-in-out infinite}@keyframes ar{50%{transform:translateX(8px)}}
.sw{animation:sw 3.6s cubic-bezier(.6,0,.3,1) infinite}@keyframes sw{from{transform:translateX(-120px)}to{transform:translateX(360px)}}
.bd{stroke-dasharray:90 640;animation:bd 4s linear infinite}@keyframes bd{from{stroke-dashoffset:0}to{stroke-dashoffset:-730}}
</style>
<polygon points="14,2 288,2 276,76 2,76" fill="${bg}" ${lime ? '' : `stroke="${FG}" stroke-opacity=".18"`}/>
<g class="sw" opacity="${lime ? 0.22 : 0.1}"><polygon points="20,2 52,2 40,76 8,76" fill="${lime ? BG : LIME}"/></g>
<polygon class="bd" points="14,2 288,2 276,76 2,76" fill="none" stroke="${ac}" stroke-width="2.5"/>
<text x="36" y="48" font-size="20" font-weight="900" letter-spacing="4" fill="${fg}">${label}</text>
<g class="ar"><text x="236" y="49" font-size="22" font-weight="900" fill="${ac}" font-family="${MONO}">→</text></g>
</svg>`);
  }
}
console.log('built');
