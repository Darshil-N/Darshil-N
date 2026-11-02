// Builds the live-data SVGs (stats card, languages, contribution heatmap) from public GitHub data.
// No third-party widget services. Run: node scripts/stats.mjs   (GITHUB_TOKEN is optional, raises rate limits)
import { writeFileSync, mkdirSync } from 'node:fs';

const USER = process.env.GH_USER || 'Darshil-N';
const BG = '#0C0C0E', PANEL = '#111114', LIME = '#A3E635', FG = '#F8FAFC', MUTED = '#94A3B8';
const FONT = `Syne,'Arial Black',Impact,'Segoe UI',sans-serif`;
const MONO = `'JetBrains Mono',Consolas,'Courier New',monospace`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const headers = { 'User-Agent': 'profile-readme-stats', ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}) };
const get = async (url, json = true) => {
  const r = await fetch(url, { headers });
  if (!r.ok) throw new Error(`${url} -> ${r.status}`);
  return json ? r.json() : r.text();
};
const outDir = new URL('../assets/', import.meta.url);
mkdirSync(outDir, { recursive: true });
const out = (n, s) => writeFileSync(new URL(n, outDir), s);

/* ── data ── */
const [profile, repos, html] = await Promise.all([
  get(`https://api.github.com/users/${USER}`),
  get(`https://api.github.com/users/${USER}/repos?per_page=100&type=owner`),
  get(`https://github.com/users/${USER}/contributions`, false),
]);
const own = repos.filter((r) => !r.fork);
const stars = own.reduce((a, r) => a + r.stargazers_count, 0);
const langBytes = {};
await Promise.all(own.map(async (r) => {
  try { const l = await get(r.languages_url); for (const [k, v] of Object.entries(l)) langBytes[k] = (langBytes[k] || 0) + v; } catch { /* skip */ }
}));
const total = Number((html.match(/([\d,]+)\s*contributions\s*in the last year/s) || [])[1]?.replace(/,/g, '')) || 0;

/* calendar cells */
const tips = {};
for (const m of html.matchAll(/for="(contribution-day-component-\d+-\d+)"[^>]*>\s*(No|\d+) contributions? on/g)) tips[m[1]] = m[2] === 'No' ? 0 : Number(m[2]);
const cells = [];
for (const m of html.matchAll(/<td[^>]*data-date="([\d-]+)"[^>]*id="(contribution-day-component-(\d+)-(\d+))"[^>]*data-level="(\d)"/g))
  cells.push({ date: m[1], row: +m[3], col: +m[4], level: +m[5], n: tips[m[2]] ?? 0 });
const weeks = Math.max(...cells.map((c) => c.col)) + 1;

/* ── stats card ── */
{
  const items = [[total.toLocaleString('en-US'), 'CONTRIBUTIONS · LAST YEAR'], [String(profile.public_repos), 'PUBLIC REPOSITORIES'], [String(stars), 'STARS EARNED'], [String(profile.followers), 'FOLLOWERS']];
  let body = '';
  items.forEach(([v, l], i) => {
    const x = 36 + (i % 2) * 270, y = 98 + Math.floor(i / 2) * 82;
    body += `<g class="n" style="animation-delay:${0.2 + i * 0.15}s"><text x="${x}" y="${y}" font-size="46" font-weight="900" fill="${i === 0 ? LIME : FG}" textLength="${Math.max(v.length * 28, 40)}" lengthAdjust="spacingAndGlyphs">${esc(v)}</text>
<text x="${x + 1}" y="${y + 24}" font-size="10.5" font-weight="700" letter-spacing="2" fill="${MUTED}" font-family="${MONO}">${l}</text></g>`;
  });
  out('stats.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="580" height="230" viewBox="0 0 580 230">
<style>text{font-family:${FONT}}
.n{opacity:0;animation:n .8s cubic-bezier(.2,.8,.2,1) forwards}@keyframes n{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
.bar{transform-box:fill-box;transform-origin:top;animation:b 1s cubic-bezier(.6,0,.2,1) both}@keyframes b{from{transform:scaleY(0)}to{transform:scaleY(1)}}
.sw{animation:sw 6s cubic-bezier(.6,0,.3,1) infinite}@keyframes sw{from{transform:translateX(-120px)}to{transform:translateX(600px)}}</style>
<rect x=".5" y=".5" width="579" height="229" fill="${PANEL}" stroke="${FG}" stroke-opacity=".1"/>
<rect class="bar" width="4" height="230" fill="${LIME}"/>
<text x="36" y="34" font-size="11.5" font-weight="700" letter-spacing="3" fill="${MUTED}" font-family="${MONO}">GITHUB / ${esc(USER.toUpperCase())}</text>
${body}
<g class="sw"><polygon points="12,227 90,227 84,230 6,230" fill="${LIME}"/></g>
</svg>`);
}

/* ── languages ── */
{
  const sum = Object.values(langBytes).reduce((a, b) => a + b, 0) || 1;
  const top = Object.entries(langBytes).sort((a, b) => b[1] - a[1]).slice(0, 5);
  let body = '';
  top.forEach(([name, bytes], i) => {
    const pct = (bytes / sum) * 100, y = 78 + i * 28, w = Math.max(4, (pct / (top[0][1] / sum * 100)) * 250);
    body += `<g class="n" style="animation-delay:${0.15 + i * 0.12}s"><text x="36" y="${y + 4}" font-size="12.5" font-weight="700" letter-spacing="1" fill="${FG}" font-family="${MONO}">${esc(name.toUpperCase())}</text>
<rect x="180" y="${y - 8}" width="250" height="12" fill="${FG}" opacity=".07"/>
<rect class="f" style="animation-delay:${0.4 + i * 0.12}s" x="180" y="${y - 8}" width="${w.toFixed(1)}" height="12" fill="${LIME}" opacity="${(1 - i * 0.13).toFixed(2)}"/>
<text x="544" y="${y + 4}" text-anchor="end" font-size="12.5" font-weight="700" fill="${i === 0 ? LIME : MUTED}" font-family="${MONO}">${pct.toFixed(1)}%</text></g>`;
  });
  out('langs.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="580" height="230" viewBox="0 0 580 230">
<style>text{font-family:${FONT}}
.n{opacity:0;animation:n .8s cubic-bezier(.2,.8,.2,1) forwards}@keyframes n{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
.f{transform-box:fill-box;transform-origin:left;animation:f 1.2s cubic-bezier(.6,0,.2,1) both}@keyframes f{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.bar{transform-box:fill-box;transform-origin:top;animation:b 1s cubic-bezier(.6,0,.2,1) both}@keyframes b{from{transform:scaleY(0)}to{transform:scaleY(1)}}
.sw{animation:sw 6s cubic-bezier(.6,0,.3,1) 1.5s infinite}@keyframes sw{from{transform:translateX(-120px)}to{transform:translateX(600px)}}</style>
<rect x=".5" y=".5" width="579" height="229" fill="${PANEL}" stroke="${FG}" stroke-opacity=".1"/>
<rect class="bar" width="4" height="230" fill="${LIME}"/>
<text x="36" y="34" font-size="11.5" font-weight="700" letter-spacing="3" fill="${MUTED}" font-family="${MONO}">TOP LANGUAGES</text>
${body}
<g class="sw"><polygon points="12,227 90,227 84,230 6,230" fill="${LIME}"/></g>
</svg>`);
}

/* ── contribution heatmap ── */
{
  const CELL = 17, GAP = 5, STEP = CELL + GAP, X0 = 17, Y0 = 52;
  const colors = ['#1b1b20', '#3a5413', '#68991e', '#88c42b', LIME];
  let rects = '', months = '', lastMonth = '';
  cells.forEach((c) => {
    const x = X0 + c.col * STEP, y = Y0 + c.row * STEP;
    rects += `<rect class="c" style="animation-delay:${(c.col * 0.022).toFixed(2)}s" x="${x}" y="${y}" width="${CELL}" height="${CELL}" rx="2" fill="${colors[c.level]}"><title>${c.n} contributions on ${c.date}</title></rect>`;
    const mo = c.date.slice(0, 7);
    if (c.row === 0 && mo !== lastMonth) { lastMonth = mo; months += `<text x="${x}" y="${Y0 - 12}" font-size="11" font-weight="700" letter-spacing="2" fill="${MUTED}" font-family="${MONO}">${new Date(c.date + 'T00:00:00Z').toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }).toUpperCase()}</text>`; }
  });
  const W = X0 * 2 + weeks * STEP - GAP, H = Y0 + 7 * STEP + 40;
  const legend = colors.map((c, i) => `<rect x="${W - 17 - 58 - (5 - i) * 22}" y="${H - 28}" width="${CELL}" height="${CELL}" rx="2" fill="${c}"/>`).join('');
  out('graph.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<style>text{font-family:${FONT}}
.c{opacity:0;animation:c .5s ease-out forwards}@keyframes c{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.sw{animation:sw 7s linear 2s infinite}@keyframes sw{from{transform:translateX(-60px)}to{transform:translateX(${W + 60}px)}}</style>
<rect width="${W}" height="${H}" fill="${BG}"/>
<text x="17" y="26" font-size="13" font-weight="800" letter-spacing="3" fill="${FG}" font-family="${MONO}"><tspan fill="${LIME}">${total.toLocaleString('en-US')}</tspan> CONTRIBUTIONS IN THE LAST YEAR</text>
${months}${rects}
<text x="${W - 17 - 58 - 5 * 22 - 4}" y="${H - 15}" text-anchor="end" font-size="10.5" font-weight="700" letter-spacing="2" fill="${MUTED}" font-family="${MONO}">LESS</text>
${legend}
<text x="${W - 17}" y="${H - 15}" text-anchor="end" font-size="10.5" font-weight="700" letter-spacing="2" fill="${MUTED}" font-family="${MONO}">MORE</text>
<g class="sw" opacity=".07"><polygon points="20,${Y0} 44,${Y0} 24,${Y0 + 7 * STEP} 0,${Y0 + 7 * STEP}" fill="#fff"/></g>
</svg>`);
}
console.log(`stats built: ${total} contributions, ${own.length} repos, ${weeks} weeks`);
