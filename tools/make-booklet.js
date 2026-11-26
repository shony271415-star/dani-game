/* Builds a printable, ink-light black & white casebook from the Crime Grid engine.
   Output:
     casebook-print.pdf    single-sided A4 landscape; fold each sheet in half (print outside), stack, staple on the fold
     casebook-read.pdf     single-sided A4 landscape, one whole case per sheet (for a screen or loose sheets)
     casebook-booklet.pdf  double-sided A4 landscape, imposed to fold and staple into an A5 booklet
   Usage: node tools/make-booklet.js [out-dir] [owner name]
   Cases come from seeds 9,000,000+, a range the app never uses, so nothing in the
   booklet can be a case the player already met on their phone. */
'use strict';
const fs = require('fs');
const path = require('path');
const E = require('../engine.js');

const OUT = path.resolve(process.argv[2] || path.join(__dirname, '..'));
const OWNER = process.argv[3] || 'Crime Grid';
const PLAN = [
  { diff: 'hard', label: 'Inspector', count: 6, seed: 9000000, accept: (g) => g.level === 2 && g.trials >= 2 },
  { diff: 'expert', label: 'Expert', count: 12, seed: 9100000, accept: (g) => g.level === 2 && g.trials >= 6 },
  { diff: 'extreme', label: 'Extreme', count: 6, seed: 9200000, accept: (g) => g.level === 2 && g.trials >= 12 },
];

const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const rich = (t) => esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');

/* ---------- pick the cases ---------- */
function pickCases() {
  const cases = [];
  for (const level of PLAN) {
    const themeUse = {};
    const picked = [];
    for (let s = level.seed; picked.length < level.count && s < level.seed + 5000; s++) {
      const P = E.generate(s, level.diff);
      if (!level.accept(P.grade)) continue;
      // keep the scenes varied within a level
      if ((themeUse[P.theme.id] || 0) >= Math.ceil(level.count / 9) + (picked.length >= 9 ? 1 : 0)) continue;
      // double-check: exactly one solution
      const Pv = { ...P, edges: new Set(P.edges) };
      const sols = E.solve(Pv, P.people.slice(0, -1).map((p) => p.rawClues), 2);
      if (sols.length !== 1) continue;
      themeUse[P.theme.id] = (themeUse[P.theme.id] || 0) + 1;
      picked.push({ ...P, levelLabel: level.label, diff: level.diff, seed: s });
    }
    cases.push(...picked);
  }
  cases.forEach((c, k) => { c.no = k + 1; });
  // every case in the book gets its own title
  const used = new Set();
  for (const c of cases) {
    const stories = E.THEMES.find((t) => t.id === c.theme.id).stories;
    let k = Math.max(0, stories.findIndex((st) => st[0] === c.title));
    for (let tries = 0; used.has(stories[k][0]) && tries < stories.length; tries++) k = (k + 1) % stories.length;
    [c.title, c.intro] = stories[k];
    used.add(c.title);
  }
  return cases;
}

/* ---------- drawing (black & white, light on ink) ---------- */
function labelCells(P, sizeMm) {
  const N = P.N, cell = sizeMm / N, font = Math.max(1.8, Math.min(2.6, cell * 0.2));
  const span = (z) => (P.zones[z].name.length * font * 0.56 + 2) / cell;
  const order = [...P.zones.keys()].sort((a, b) => P.zoneOf.filter((x) => x === a).length - P.zoneOf.filter((x) => x === b).length);
  const taken = [], out = {};
  for (const z of order) {
    const w = span(z), cells = [];
    P.zoneOf.forEach((zz, i) => {
      if (zz !== z) return;
      const r = Math.floor(i / N), c = i % N;
      let run = 0; for (let k = 0; k < N; k++) if (P.zoneOf[r * N + k] === z) run++;
      cells.push([i, r * 10 + Math.min(run, w) * 3 + (P.obj[i] ? -2 : 0) - Math.abs(c - (N - 1) / 2) * 0.2]);
    });
    cells.sort((a, b) => b[1] - a[1]);
    let chosen = cells[0][0];
    for (const [i] of cells) {
      const r = Math.floor(i / N), c = i % N + 0.5;
      if (!taken.some(([tr, f, t]) => tr === r && c - w / 2 < t && c + w / 2 > f)) { chosen = i; break; }
    }
    taken.push([Math.floor(chosen / N), chosen % N + 0.5 - w / 2, chosen % N + 0.5 + w / 2]);
    out[chosen] = z;
  }
  return { out, font };
}

function board(P, sizeMm, mode) {
  // mode: 'scene' (the crime scene), 'draft' (walls only, to pencil in), 'answer' (solution letters)
  const N = P.N, cell = sizeMm / N;
  const edges = new Set(P.edges);
  const { out: labels, font } = mode === 'scene' ? labelCells(P, sizeMm) : { out: {}, font: 0 };
  const thick = mode === 'scene' ? 0.7 : 0.5, thin = 0.12;
  let html = `<div class="board ${mode}" style="width:${sizeMm}mm;height:${sizeMm}mm;grid-template-columns:repeat(${N},1fr);grid-template-rows:repeat(${N},1fr)">`;
  for (let i = 0; i < N * N; i++) {
    const r = Math.floor(i / N), c = i % N, w = P.walls[i];
    const side = (s, outer) => `${outer ? 0 : w[s] ? thick : thin}mm solid ${w[s] ? '#000' : '#9a9a9a'}`;
    const style = `border-top:${side('n', r === 0)};border-bottom:${side('s', r === N - 1)};border-left:${side('w', c === 0)};border-right:${side('e', c === N - 1)}`;
    const o = P.obj[i], def = o && E.OBJECTS[o];
    let cls = 'cell', inner = '';
    if (mode === 'scene') {
      if (def && def.css === 'rug') cls += ' rug';
      if (def && def.css === 'table') inner += '<div class="table"></div>';
      else if (def && def.e) inner += `<span class="obj" style="font-size:${cell * 0.55}mm">${def.e}</span>`;
      if (i in labels) inner += `<span class="zl" style="font-size:${font}mm">${esc(P.zones[labels[i]].name)}</span>`;
    } else if (E.isBlocked(o)) cls += ' blocked';
    if (mode === 'answer') {
      const p = P.solution.indexOf(i);
      if (p >= 0) {
        const person = P.people[p];
        inner += `<span class="ans${person.isVictim ? ' v' : ''}${p === P.murderer ? ' m' : ''}" style="font-size:${cell * 0.6}mm">${person.letter}</span>`;
      }
    } else {
      for (const s of ['n', 's', 'e', 'w']) if (edges.has(i + s)) inner += `<span class="edge ${s}"></span>`;
    }
    html += `<div class="${cls}" style="${style}">${inner}</div>`;
  }
  return html + '</div>';
}

/* ---------- cute bits (line art only, easy on ink) ---------- */
const HEART = 'M16 28.5C9 23.5 2.2 18 2.2 10.6 2.2 6 5.7 2.6 10 2.6c2.6 0 4.7 1.3 6 3.4 1.3-2.1 3.4-3.4 6-3.4 4.3 0 7.8 3.4 7.8 8 0 7.4-6.8 12.9-13.8 17.9Z';
const heart = (sizeMm, opts = {}) => `<svg class="hrt" width="${sizeMm}mm" height="${sizeMm * 0.94}mm" viewBox="0 0 32 30">
  <path d="${HEART}" fill="none" stroke="#000" stroke-width="${opts.w || 1.4}" ${opts.dash ? 'stroke-dasharray="2.2 1.6"' : ''}/>
  ${opts.broken ? '<path d="M16 6 L13.4 11.5 L17.6 15 L14 20.5 L16 28" fill="none" stroke="#000" stroke-width="1.1"/>' : ''}</svg>`;
const letterHeart = (person, size) => `<div class="lh" style="width:${size}mm;height:${size * 0.94}mm">${heart(size, { dash: person.isVictim, broken: person.isVictim })}<span>${person.letter}</span></div>`;
const sparkle = (sizeMm) => `<svg class="spk" width="${sizeMm}mm" height="${sizeMm}mm" viewBox="0 0 20 20"><path d="M10 1 C11 7 13 9 19 10 C13 11 11 13 10 19 C9 13 7 11 1 10 C7 9 9 7 10 1Z" fill="none" stroke="#000" stroke-width="1.1"/></svg>`;
const flourish = `<div class="flourish"><span class="ln"></span>${heart(3.2, { w: 1.8 })}<span class="ln"></span></div>`;
const pageNo = (n) => (n === '' ? '' : `<div class="pn">${heart(5.2, { w: 1.2 })}<span>${n}</span></div>`);

function stands(P) {
  const present = [...new Set(P.obj.filter(Boolean))];
  const show = (o) => `${E.OBJECTS[o].e ? `<span class="mini">${E.OBJECTS[o].e}</span>` : o === 'rug' ? '▨' : '▭'}&nbsp;${esc(E.OBJECTS[o].name)}`;
  return {
    can: present.filter((o) => !E.isBlocked(o)).map(show),
    cant: present.filter((o) => E.isBlocked(o)).map(show),
  };
}

function cluePage(P, n) {
  const T = P.theme, { can, cant } = stands(P);
  const cards = P.people.map((person) => {
    const clues = person.isVictim
      ? '<div><b>The victim.</b> Found in the last remaining square.</div>'
      : person.clues.map((c) => `<div>${rich(c)}</div>`).join('');
    return `<div class="card${person.isVictim ? ' victim' : ''}">
      ${letterHeart(person, P.N >= 10 ? 8 : 8.8)}
      <div class="txt"><div class="nm">${esc(person.name)}${person.isVictim ? ' <span class="rip">rip</span>' : ''}</div><div class="cl">${clues}</div></div></div>`;
  }).join('');
  return `<div class="pg case-l">
    <header>
      <div class="ribbon">Case ${P.no}</div>
      <div class="ttl"><b>${esc(P.title)}</b><span>${esc(T.name)} <i>·</i> ${P.levelLabel} <i>·</i> ${P.N}×${P.N}</span></div>
    </header>
    <p class="intro">“${esc(P.intro)}”</p>
    <div class="cards n${P.N}">${cards}</div>
    <div class="key">
      <div><b>can</b> stand on: bare ${esc(T.floor)}${can.length ? ', ' + can.join(', ') : ''}</div>
      ${cant.length ? `<div><b>can't</b> stand on: ${cant.join(', ')}</div>` : ''}
      <div><span class="winkey"></span> on the outer wall = ${esc(T.edge)}</div>
    </div>
    ${pageNo(n)}</div>`;
}

function boardPage(P, n) {
  return `<div class="pg case-r">
    <div class="rhead">${sparkle(3)}<span class="lvl">${P.levelLabel}</span><span class="cn">case ${P.no}</span></div>
    <div class="scene-wrap">${board(P, 118, 'scene')}</div>
    <div class="bottom">
      <div class="draftbox"><div class="dt">draft ✎</div>${board(P, 56, 'draft')}</div>
      <div class="side">
        <div class="verdict"><div class="vt">The murderer is…</div><div class="line"></div>${heart(3.4, { w: 1.6 })}</div>
        <div class="timer"><span>started</span><i></i><span>solved</span><i></i></div>
        <div class="check"><span class="box"></span> solved without peeking</div>
      </div>
    </div>
    ${pageNo(n)}</div>`;
}

function magnifier() {
  // a magnifying glass with a heart in the lens, drawn with lines only
  return `<svg class="mag" viewBox="0 0 120 120" width="44mm" height="44mm">
    <circle cx="50" cy="50" r="34" fill="none" stroke="#000" stroke-width="3.2"/>
    <circle cx="50" cy="50" r="28" fill="none" stroke="#000" stroke-width="1" stroke-dasharray="3 3"/>
    <path d="M75 75 L104 104" stroke="#000" stroke-width="9" stroke-linecap="round" fill="none"/>
    <path d="M75 75 L104 104" stroke="#fff" stroke-width="4.5" stroke-linecap="round" fill="none"/>
    <g transform="translate(34 35) scale(1)"><path d="${HEART}" fill="none" stroke="#000" stroke-width="2"/></g>
    <path d="M30 34 Q34 24 44 22" fill="none" stroke="#000" stroke-width="1.6" stroke-linecap="round"/>
  </svg>`;
}

function coverPage() {
  const total = PLAN.reduce((s, l) => s + l.count, 0);
  return `<div class="pg cover">
    <div class="frame"></div><div class="frame2"></div>
    <div class="corner tl">✿</div><div class="corner tr">✿</div><div class="corner bl">✿</div><div class="corner br">✿</div>
    <div class="secret">top secret ♡</div>
    <div class="owner">${esc(OWNER)}'s</div>
    <h1>Crime Grid</h1>
    <div class="book">~ casebook ~</div>
    <div class="art">${sparkle(6)}${magnifier()}${sparkle(4.5)}</div>
    <p class="tag">sudoku meets murder mystery</p>
    ${flourish}
    <p class="count">${total} unsolved cases<br><span>inspector · expert · extreme</span></p>
    <div class="belongs">this casebook belongs to<div class="line"></div></div>
  </div>`;
}

function rulesPages() {
  const p1 = `<div class="pg rules">
    <h2>Welcome, detective!</h2>
    <p class="lead">There was (yep, you guessed it) a murder. The good news? We have a lineup of suspects and clues about each of them. Let me show you the ropes.</p>
    <h3>your goal</h3>
    <p>Place every person on the crime scene, then name the murderer: the one suspect who was <b>alone with the victim</b> in the same room or area.</p>
    <h3>the rules</h3>
    <ul>
      <li>Every person was in a <b>different row</b> and a <b>different column</b>, like sudoku.</li>
      <li>Some objects can be stood on (chairs, beds, rugs, logs, crates…), others can't (tables, plants, statues, barrels…). Every case lists them.</li>
      <li>Suspects are named in order: <b>A</b>, <b>B</b>, <b>C</b>… The victim's name always starts with <b>V</b>.</li>
      <li>The victim is in the <b>last remaining square</b>.</li>
      <li>Every case has <b>exactly one</b> solution, reachable by logic alone.</li>
    </ul>
    <h3>solving on paper</h3>
    <ul>
      <li>Pencil small letters in the <b>draft</b> grid where each suspect <i>might</i> be. Striped squares can't be stood on.</li>
      <li>Cross out squares (✕) as you rule them out.</li>
      <li>When you're sure, write the letter on the big board.</li>
      <li>Use a pencil. You'll want the eraser. ♡</li>
    </ul>
    ${pageNo(2)}</div>`;
  const p2 = `<div class="pg rules">
    <h2>Detective's dictionary</h2>
    <ul class="dict">
      <li><b>Beside</b> something: in a square directly above, below, left or right of it, in the same room.</li>
      <li><b>In a corner</b>: a square where two walls of a room meet.</li>
      <li><b>Not beside a wall</b>: none of the square's four sides is a wall. Outdoors this reads <b>not at the edge of any area</b>.</li>
      <li><b>Beside a wall</b> / <b>at the edge of an area</b>: at least one side is a wall.</li>
      <li><b>By a window</b> (or porthole, viewport, trail, entrance): the little frame on the outer wall touches that square.</li>
      <li><b>Higher row</b>: closer to the top. <b>To the left</b>: closer to the left edge.</li>
      <li><b>Diagonally next to</b>: touching only by a corner.</li>
      <li><b>Same room / area</b>: inside the same walls.</li>
      <li><b>Standing on the bare floor</b>: an empty square, no object.</li>
    </ul>
    <h3>in this casebook</h3>
    <div class="toc">
      ${PLAN.map((l, k) => {
        const first = PLAN.slice(0, k).reduce((s, x) => s + x.count, 0) + 1;
        return `<div class="row"><b>${l.label}</b><span class="dots"></span><span>cases ${first}–${first + l.count - 1}</span><small>${l.diff === 'hard' ? '6×6 · 5 suspects' : l.diff === 'expert' ? '8×8 · 7 suspects' : '10×10 · 9 suspects'}</small></div>`;
      }).join('')}
    </div>
    <p class="small">Inspector cases warm you up. Expert cases need "what if…?" thinking. Extreme cases take a while, so grab a cozy blanket and some tea.<br>Solutions are at the back. No peeking! ♡</p>
    ${pageNo(3)}</div>`;
  return [p1, p2];
}

function solutionPages(cases, startNo) {
  const per = 4, pages = [];
  for (let k = 0; k < cases.length; k += per) {
    let html = `<div class="pg sols"><h2>${k ? 'Solutions, cont.' : 'Solutions'}</h2><p class="hint">murderer circled · victim underlined</p><div class="solgrid">`;
    for (const P of cases.slice(k, k + per)) {
      const m = P.people[P.murderer];
      html += `<div class="sol"><div class="st"><b>case ${P.no}</b> · ${esc(P.title)}</div>${board(P, 56, 'answer')}
        <div class="sm">${heart(2.6, { w: 1.8 })} ${m.letter} · ${esc(m.name)} did it</div></div>`;
    }
    pages.push(html + `</div>${pageNo(startNo + pages.length)}</div>`);
  }
  return pages;
}

function notesPage(n) {
  return `<div class="pg notes"><h2>Detective's notes</h2>${'<div class="rule"></div>'.repeat(24)}${pageNo(n)}</div>`;
}
function backCover() {
  return `<div class="pg back"><div class="frame"></div>${magnifier()}<p class="cc">case closed</p><p class="xo">xoxo ♡</p><p class="small">every case has exactly one solution</p></div>`;
}

const FONT_DIR = path.join(__dirname, 'fonts');
const font = (family, file, weight) => `@font-face { font-family: "${family}"; font-weight: ${weight}; src: url(data:font/woff2;base64,${fs.readFileSync(path.join(FONT_DIR, file)).toString('base64')}) format("woff2"); }`;
const FONTS = [
  font('Quicksand', 'quicksand-latin-500-normal.woff2', 500),
  font('Quicksand', 'quicksand-latin-600-normal.woff2', 600),
  font('Quicksand', 'quicksand-latin-700-normal.woff2', 700),
  font('Pacifico', 'pacifico-latin-400-normal.woff2', 400),
  font('Fredoka', 'fredoka-latin-500-normal.woff2', 500),
  font('Fredoka', 'fredoka-latin-600-normal.woff2', 600),
  font('Dancing Script', 'dancing-script-latin-700-normal.woff2', 700),
].join('\n');

const CSS = `
* { box-sizing: border-box; }
html, body { margin: 0; }
body { font-family: "Quicksand", "DejaVu Sans", sans-serif; font-weight: 500; color: #000; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
b { font-weight: 700; }
.pg { width: 148.5mm; height: 210mm; padding: 9mm 10mm 12mm; position: relative; overflow: hidden; background: #fff; }
.sheet { width: 297mm; height: 210mm; display: flex; page-break-after: always; }
.sheet:last-child { page-break-after: auto; }
.sheet.fold { position: relative; }
.sheet.fold::after { content: ""; position: absolute; top: 0; bottom: 0; left: 50%; border-left: .2mm dashed #cfcfcf; }
.reader .pg { page-break-after: always; }
.reader .pg:last-child { page-break-after: auto; }
.script { font-family: "Pacifico", cursive; font-weight: 400; }
.pn { position: absolute; bottom: 4.2mm; left: 50%; transform: translateX(-50%); width: 5.2mm; height: 4.9mm; }
.pn .hrt { position: absolute; inset: 0; }
.pn span { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: "Fredoka"; font-weight: 600; font-size: 2mm; padding-bottom: .5mm; }
.flourish { display: flex; align-items: center; justify-content: center; gap: 2mm; margin: 3mm auto; width: 60%; }
.flourish .ln { flex: 1; border-top: .25mm dotted #000; }

/* cover */
.cover { text-align: center; padding-top: 30mm; }
.cover .frame { position: absolute; inset: 7mm; border: .5mm solid #000; border-radius: 9mm; }
.cover .frame2, .back .frame { position: absolute; inset: 9.5mm; border: .3mm dashed #000; border-radius: 7mm; }
.cover .corner { position: absolute; font-size: 6mm; line-height: 1; background: #fff; padding: 0 1mm; font-family: "DejaVu Sans"; }
.cover .tl { top: 5mm; left: 13mm; } .cover .tr { top: 5mm; right: 13mm; } .cover .bl { bottom: 4.5mm; left: 13mm; } .cover .br { bottom: 4.5mm; right: 13mm; }
.cover .secret { position: absolute; top: 15mm; right: 14mm; transform: rotate(10deg); border: .4mm solid #000; border-radius: 4mm; font-family: "Fredoka"; font-weight: 600; font-size: 3.2mm; padding: .6mm 3mm; letter-spacing: .4mm; }
.cover .owner { font-family: "Pacifico"; font-size: 12mm; line-height: 1.2; }
.cover h1 { font-family: "Fredoka"; font-weight: 600; font-size: 15.5mm; margin: 0; letter-spacing: .4mm; line-height: 1; }
.cover .book { font-family: "Dancing Script"; font-weight: 700; font-size: 8mm; margin-top: 1mm; }
.cover .art { display: flex; align-items: flex-start; justify-content: center; gap: 1mm; margin: 8mm 0 4mm; }
.cover .art .spk:first-child { margin-top: 2mm; } .cover .art .spk:last-child { margin-top: 30mm; }
.cover .tag { font-family: "Dancing Script"; font-weight: 700; font-size: 6mm; margin: 0; }
.cover .count { font-family: "Fredoka"; font-weight: 500; font-size: 4mm; line-height: 1.5; margin: 0; }
.cover .count span { font-family: "Quicksand"; font-size: 3.2mm; letter-spacing: .3mm; }
.cover .belongs { position: absolute; left: 24mm; right: 24mm; bottom: 22mm; font-family: "Dancing Script"; font-weight: 700; font-size: 5mm; text-align: center; }
.cover .belongs .line { border-bottom: .3mm solid #000; height: 9mm; }

/* rules */
.rules h2 { font-family: "Pacifico"; font-weight: 400; font-size: 8mm; margin: 0 0 2mm; text-align: center; }
.rules h3 { font-family: "Fredoka"; font-weight: 600; font-size: 4.4mm; margin: 3.5mm 0 1.2mm; display: flex; align-items: center; gap: 2mm; }
.rules h3::before { content: "✿"; font-family: "DejaVu Sans"; font-size: 3.6mm; }
.rules h3::after { content: ""; flex: 1; border-top: .25mm dotted #000; }
.rules p, .rules li { font-size: 3.3mm; line-height: 1.5; }
.rules p { margin: 0; }
.rules .lead { font-family: "Dancing Script"; font-weight: 700; font-size: 4.6mm; line-height: 1.3; text-align: center; margin-bottom: 1mm; }
.rules ul { margin: 0; padding: 0; list-style: none; }
.rules li { margin-bottom: 1.1mm; padding-left: 5mm; position: relative; }
.rules li::before { content: "♡"; position: absolute; left: 0; top: 0; font-family: "DejaVu Sans"; font-size: 3mm; }
.rules .dict li { margin-bottom: 1.9mm; }
.rules .small { font-size: 3.1mm; margin-top: 3mm; text-align: center; }
.toc .row { display: flex; align-items: baseline; gap: 2mm; font-size: 3.4mm; margin: 1.6mm 0; }
.toc .row b { font-family: "Fredoka"; font-weight: 600; }
.toc .dots { flex: 1; border-bottom: .3mm dotted #000; }
.toc small { font-size: 2.8mm; width: 30mm; text-align: right; }

/* left page */
.case-l header { display: flex; align-items: center; gap: 3mm; }
.ribbon { font-family: "Pacifico"; font-size: 5mm; line-height: 1; padding: 1.8mm 4.5mm 2.4mm; border: .4mm solid #000; border-radius: 6mm; white-space: nowrap; position: relative; }
.ribbon::after { content: ""; position: absolute; inset: .9mm; border: .2mm dashed #000; border-radius: 5mm; }
.case-l .ttl { display: flex; flex-direction: column; }
.case-l .ttl b { font-family: "Fredoka"; font-weight: 600; font-size: 5mm; line-height: 1.15; }
.case-l .ttl span { font-size: 2.9mm; letter-spacing: .15mm; }
.case-l .ttl i { font-style: normal; margin: 0 .6mm; }
.case-l .intro { font-family: "Dancing Script"; font-weight: 700; font-size: 4.2mm; margin: 2.4mm 0 3mm; text-align: center; line-height: 1.2; }
.cards { display: grid; gap: 2mm; }
.cards.n6 { grid-template-columns: 1fr; gap: 2.6mm; }
.cards.n8, .cards.n10 { grid-template-columns: 1fr 1fr; }
.card { display: flex; gap: 2mm; align-items: flex-start; border: .3mm solid #000; border-radius: 3.2mm; padding: 1.7mm 2.2mm 1.9mm; break-inside: avoid; position: relative; }
.card.victim { border-style: dashed; }
.lh { position: relative; flex: 0 0 auto; }
.lh .hrt { position: absolute; inset: 0; width: 100%; height: 100%; }
.lh span { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: "Fredoka"; font-weight: 600; font-size: 2.9mm; padding-bottom: 1.3mm; }
.card.victim .lh span { opacity: 0; }
.card .nm { font-family: "Fredoka"; font-weight: 600; font-size: 3.5mm; line-height: 1.2; }
.card .rip { font-family: "Dancing Script"; font-weight: 700; font-size: 3.4mm; }
.card .cl { font-size: 2.95mm; line-height: 1.36; }
.cards.n6 .card .cl { font-size: 3.2mm; }
.cards.n6 .card .nm { font-size: 3.8mm; }
.cards.n10 .card .cl { font-size: 2.75mm; }
.cards.n10 .card { padding: 1.3mm 1.9mm 1.5mm; }
.key { position: absolute; left: 10mm; right: 10mm; bottom: 11.5mm; font-size: 2.75mm; line-height: 1.45; border-top: .25mm dotted #000; padding-top: 1.3mm; }
.key b { font-family: "Fredoka"; font-weight: 600; }
.key .mini { filter: grayscale(1); }
.winkey { display: inline-block; width: 6mm; height: 1.6mm; border: .25mm solid #000; border-radius: .8mm; background: #fff; vertical-align: middle; }

/* right page */
.case-r .rhead { display: flex; align-items: center; justify-content: flex-end; gap: 1.6mm; margin-bottom: 2mm; }
.case-r .rhead .lvl { font-family: "Fredoka"; font-weight: 500; font-size: 3mm; letter-spacing: .5mm; text-transform: lowercase; }
.case-r .rhead .cn { font-family: "Pacifico"; font-size: 4.2mm; line-height: 1; }
.scene-wrap { display: flex; justify-content: center; }
.case-r .bottom { display: flex; gap: 4mm; margin-top: 3mm; align-items: flex-start; }
.draftbox .dt { font-family: "Pacifico"; font-size: 3.6mm; line-height: 1.3; margin-bottom: .6mm; }
.case-r .side { flex: 1; display: flex; flex-direction: column; gap: 3mm; padding-top: 5.6mm; }
.verdict { border: .4mm dashed #000; border-radius: 4mm; padding: 2mm 3mm 2.6mm; position: relative; }
.verdict .vt { font-family: "Pacifico"; font-size: 4mm; line-height: 1.2; }
.verdict .line { border-bottom: .3mm solid #000; height: 8mm; margin-right: 4mm; }
.verdict .hrt { position: absolute; right: 2.4mm; bottom: 1.7mm; }
.timer { display: grid; grid-template-columns: auto 1fr; gap: 1.5mm 2mm; align-items: end; font-family: "Dancing Script"; font-weight: 700; font-size: 4mm; }
.timer i { border-bottom: .25mm dotted #000; height: 4mm; }
.check { font-size: 2.9mm; display: flex; align-items: center; gap: 1.5mm; }
.check .box { width: 3mm; height: 3mm; border: .3mm solid #000; border-radius: .9mm; }

/* boards */
.board { display: grid; border: .8mm solid #000; border-radius: 2.4mm; position: relative; flex: 0 0 auto; background: #fff; }
.board .cell { position: relative; display: flex; align-items: center; justify-content: center; }
.board .cell:first-child { border-top-left-radius: 1.6mm; }
.board .blocked { background-image: repeating-linear-gradient(45deg, #b5b5b5 0 .18mm, transparent .18mm 1.3mm); }
.board .rug { background-image: repeating-linear-gradient(-45deg, #c4c4c4 0 .15mm, transparent .15mm 1.2mm); }
.board .rug::before { content: ""; position: absolute; inset: 13%; border: .2mm dashed #777; border-radius: 1.2mm; }
.board .obj { line-height: 1; filter: grayscale(1); opacity: .72; }
.board .table { width: 72%; height: 54%; border: .35mm solid #000; border-radius: 1.6mm; background-image: repeating-linear-gradient(0deg, #c4c4c4 0 .15mm, transparent .15mm 1.1mm); }
.board .zl { position: absolute; bottom: .3mm; left: 50%; transform: translateX(-50%); background: #fff; border: .2mm solid #000; border-radius: 2mm; padding: 0 1.2mm; white-space: nowrap; font-family: "Fredoka"; font-weight: 500; z-index: 3; line-height: 1.4; }
.board .edge { position: absolute; z-index: 2; background: #fff; border: .25mm solid #000; border-radius: .7mm; }
.board .edge.n { top: -.95mm; left: 20%; right: 20%; height: 1.3mm; }
.board .edge.s { bottom: -.95mm; left: 20%; right: 20%; height: 1.3mm; }
.board .edge.w { left: -.95mm; top: 20%; bottom: 20%; width: 1.3mm; }
.board .edge.e { right: -.95mm; top: 20%; bottom: 20%; width: 1.3mm; }
.board .ans { font-family: "Fredoka"; font-weight: 600; }
.board .ans.v { text-decoration: underline; }
.board .ans.m { border: .35mm solid #000; border-radius: 50%; width: 82%; height: 82%; display: flex; align-items: center; justify-content: center; }

/* back pages */
.sols h2, .notes h2 { font-family: "Pacifico"; font-weight: 400; font-size: 7mm; margin: 0; text-align: center; }
.sols .hint { text-align: center; font-family: "Dancing Script"; font-weight: 700; font-size: 4mm; margin: 0 0 4mm; }
.solgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; justify-items: center; }
.sol { display: flex; flex-direction: column; align-items: center; gap: 1.2mm; }
.sol .st, .sol .sm { font-size: 2.9mm; text-align: center; }
.sol .st b { font-family: "Fredoka"; font-weight: 600; }
.sol .sm { display: flex; align-items: center; gap: 1mm; }
.notes h2 { margin-bottom: 4mm; }
.notes .rule { border-bottom: .25mm dotted #888; height: 6.6mm; }
.back { text-align: center; padding-top: 58mm; }
.back .mag { width: 34mm; height: 34mm; }
.back .cc { font-family: "Pacifico"; font-size: 9mm; margin: 4mm 0 0; }
.back .xo { font-family: "Dancing Script"; font-weight: 700; font-size: 7mm; margin: 0; }
.back .small { font-size: 2.9mm; margin-top: 6mm; }
`;

function impose(pages) {
  // saddle stitch: n is a multiple of 4; sheet k front = [n-2k, 2k+1], back = [2k+2, n-2k-1] (1-based)
  const n = pages.length, sides = [];
  for (let k = 0; k < n / 4; k++) {
    sides.push([n - 2 * k, 2 * k + 1]);
    sides.push([2 * k + 2, n - 2 * k - 1]);
  }
  return sides;
}

async function main() {
  const t0 = Date.now();
  const cases = pickCases();
  console.log(`picked ${cases.length} cases in ${Date.now() - t0} ms`);

  const pages = [coverPage(), ...rulesPages()];
  for (const P of cases) {
    pages.push(cluePage(P, pages.length + 1)); // even page: left side of the spread
    pages.push(boardPage(P, pages.length + 1)); // odd page: right side
  }
  pages.push(...solutionPages(cases, pages.length + 1));
  while ((pages.length + 1) % 4 !== 0) pages.push(notesPage(pages.length + 1));
  pages.push(backCover());
  console.log(`${pages.length} booklet pages → ${pages.length / 4} sheets of A4`);

  const head = (size) => `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${esc(OWNER)}'s Crime Grid Casebook</title>
    <style>${FONTS}
@page { size: ${size}; margin: 0; }${CSS}</style></head>`;
  // simple copy: single-sided A4 landscape, no folding. Every case fills exactly one sheet
  // (clues left, board right), so it prints in one go and also reads well on a screen.
  const nCase = cases.length, solStart = 3 + nCase * 2;
  const flat = [[pages[0], pages[1]], [pages[2], notesPage('')]];
  for (let k = 3; k < solStart; k += 2) flat.push([pages[k], pages[k + 1]]);
  const sols = pages.slice(solStart, solStart + Math.ceil(nCase / 4));
  for (let k = 0; k < sols.length; k += 2) flat.push([sols[k], sols[k + 1] || notesPage('')]);
  const flatHtml = `${head('297mm 210mm')}<body>${flat.map(([l, r]) => `<div class="sheet">${l}${r}</div>`).join('')}</body></html>`;
  console.log(`single-sided version: ${flat.length} sheets`);
  // single-sided folded booklet: every sheet is printed on one side, folded in half with the print
  // outside, and the folded sheets are stacked and stapled along the fold. Sheet k carries
  // [page 2k | page 2k-1]: page 2k-1 becomes the front of the folded leaf, page 2k its back.
  const fold = pages.slice(0, solStart + sols.length);
  if (fold.length % 2) fold.push(backCover());
  const foldSheets = [];
  for (let k = 0; k < fold.length; k += 2) foldSheets.push([fold[k + 1], fold[k]]);
  const foldHtml = `${head('297mm 210mm')}<body>${foldSheets.map(([l, r]) => `<div class="sheet fold">${l}${r}</div>`).join('')}</body></html>`;
  console.log(`single-sided folded booklet: ${fold.length} pages on ${foldSheets.length} sheets`);
  const printHtml = `${head('297mm 210mm')}<body>${impose(pages).map(([l, r]) => `<div class="sheet">${pages[l - 1]}${pages[r - 1]}</div>`).join('')}</body></html>`;

  fs.mkdirSync(OUT, { recursive: true });
  const { chromium } = require('playwright');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const [name, html] of [['casebook-print', foldHtml], ['casebook-read', flatHtml], ['casebook-booklet', printHtml]]) {
    const file = path.join(OUT, name + '.html');
    fs.writeFileSync(file, html);
    await page.goto('file://' + file);
    await page.pdf({ path: path.join(OUT, name + '.pdf'), preferCSSPageSize: true, printBackground: true });
    const overflow = await page.evaluate(() => [...document.querySelectorAll('.pg')].map((p) => {
      let worst = 0;
      for (const el of p.querySelectorAll('.cards, .bottom, .solgrid, ul, table')) {
        worst = Math.max(worst, el.getBoundingClientRect().bottom - p.getBoundingClientRect().bottom + 12 * 3.78);
      }
      const key = p.querySelector('.key'), cards = p.querySelector('.cards');
      if (key && cards) worst = Math.max(worst, cards.getBoundingClientRect().bottom - key.getBoundingClientRect().top + 2);
      return Math.round(worst);
    }));
    const bad = overflow.map((v, i) => [i + 1, v]).filter(([, v]) => v > 0);
    console.log(`${name}.pdf written; pages with content too low: ${JSON.stringify(bad)}`);
    fs.unlinkSync(file);
  }
  await browser.close();
}
main().catch((e) => { console.error(e); process.exit(1); });
