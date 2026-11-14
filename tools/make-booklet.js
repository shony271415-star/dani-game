/* Builds a printable, ink-light black & white casebook from the Mystery Grid engine.
   Output:
     casebook-print.pdf  A4 landscape sheets, pages imposed for a folded, stapled A5 booklet
     casebook-read.pdf   the same A5 pages in reading order (for a screen)
   Usage: node tools/make-booklet.js [out-dir] [owner name]
   Cases come from seeds 9,000,000+, a range the app never uses, so nothing in the
   booklet can be a case the player already met on their phone. */
'use strict';
const fs = require('fs');
const path = require('path');
const E = require('../engine.js');

const OUT = path.resolve(process.argv[2] || path.join(__dirname, '..'));
const OWNER = process.argv[3] || 'Dani';
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

const pageNo = (n) => `<div class="pn">${n}</div>`;

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
      <div class="lt">${person.letter}</div>
      <div><div class="nm">${esc(person.name)}${person.isVictim ? ' ✝' : ''}</div><div class="cl">${clues}</div></div></div>`;
  }).join('');
  return `<div class="pg case-l">
    <header><div class="no">CASE ${P.no}</div><div class="ttl"><b>${esc(P.title)}</b><span>${esc(T.name)} · ${P.levelLabel} · ${P.N}×${P.N}</span></div></header>
    <p class="intro">${esc(P.intro)}</p>
    <div class="cards n${P.N}">${cards}</div>
    <div class="key">
      <div><b>Can</b> stand on: bare ${esc(T.floor)}${can.length ? ', ' + can.join(', ') : ''}.</div>
      ${cant.length ? `<div><b>Can't</b> stand on: ${cant.join(', ')}.</div>` : ''}
      <div><span class="winkey"></span> on the outer wall = ${esc(T.edge)}.</div>
    </div>
    ${pageNo(n)}</div>`;
}

function boardPage(P, n) {
  const big = 118;
  return `<div class="pg case-r">
    <div class="rhead"><span class="lvl">${P.levelLabel.toUpperCase()}</span> CASE ${P.no}</div>
    <div class="scene-wrap">${board(P, big, 'scene')}</div>
    <div class="bottom">
      <div class="draftbox"><div class="dt">✏️ Draft</div>${board(P, 56, 'draft')}</div>
      <div class="side">
        <div class="verdict">The murderer is…<div class="line"></div></div>
        <div class="timer">Started ______<br>Solved ______</div>
        <div class="check">☐ Solved without peeking</div>
      </div>
    </div>
    ${pageNo(n)}</div>`;
}

function coverPage() {
  const total = PLAN.reduce((s, l) => s + l.count, 0);
  return `<div class="pg cover">
    <div class="stamp">TOP SECRET</div>
    <div class="owner">${esc(OWNER)}'s</div>
    <h1>MYSTERY<br>GRID</h1>
    <div class="book">— CASEBOOK —</div>
    <div class="glass">🔍</div>
    <p class="tag">Sudoku meets murder mystery</p>
    <p class="count">${total} unsolved cases<br>Inspector · Expert · Extreme</p>
    <div class="belongs">Lead detective:<div class="line"></div></div>
  </div>`;
}

function rulesPages() {
  const p1 = `<div class="pg rules">
    <h2>Welcome, detective!</h2>
    <p class="lead">There was (yep, you guessed it) a murder. The good news? We have a lineup of suspects and clues about each of them. Let me show you the ropes.</p>
    <h3>Your goal</h3>
    <p>Place every person on the crime scene, then name the murderer: the one suspect who was <b>alone with the victim</b> in the same room or area.</p>
    <h3>The rules</h3>
    <ul>
      <li>Every person was in a <b>different row</b> and a <b>different column</b>, like sudoku.</li>
      <li>Some objects can be stood on (chairs, beds, rugs, logs, crates…), others can't (tables, plants, statues, barrels…). Every case lists them.</li>
      <li>Suspects are named in order: <b>A</b>, <b>B</b>, <b>C</b>… The victim's name always starts with <b>V</b>.</li>
      <li>The victim is in the <b>last remaining square</b>.</li>
      <li>Every case has <b>exactly one</b> solution, reachable by logic alone.</li>
    </ul>
    <h3>Solving on paper</h3>
    <ul>
      <li>Pencil small letters in the <b>Draft</b> grid where each suspect <i>might</i> be. Shaded squares can't be stood on.</li>
      <li>Cross out squares (✕) as you rule them out.</li>
      <li>When you're sure, write the letter on the big board.</li>
      <li>Use a pencil. You'll want the eraser.</li>
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
    <h3>In this casebook</h3>
    <table class="toc">
      ${PLAN.map((l, k) => {
        const first = PLAN.slice(0, k).reduce((s, x) => s + x.count, 0) + 1;
        return `<tr><td><b>${l.label}</b></td><td>Cases ${first}–${first + l.count - 1}</td><td>${l.diff === 'hard' ? '6×6 · 5 suspects' : l.diff === 'expert' ? '8×8 · 7 suspects' : '10×10 · 9 suspects'}</td></tr>`;
      }).join('')}
    </table>
    <p class="small">Inspector cases warm you up. Expert cases need "what if…?" thinking. Extreme cases take a while: get comfortable.<br>Solutions are at the back. No peeking!</p>
    ${pageNo(3)}</div>`;
  return [p1, p2];
}

function solutionPages(cases, startNo) {
  const per = 4, pages = [];
  for (let k = 0; k < cases.length; k += per) {
    let html = `<div class="pg sols"><h2>Solutions${k ? ' (cont.)' : ''}</h2><div class="solgrid">`;
    for (const P of cases.slice(k, k + per)) {
      const m = P.people[P.murderer];
      html += `<div class="sol"><div class="st"><b>Case ${P.no}</b> · ${esc(P.title)}</div>${board(P, 56, 'answer')}
        <div class="sm">Murderer: <b>${m.letter} · ${esc(m.name)}</b></div></div>`;
    }
    pages.push(html + `</div>${pageNo(startNo + pages.length)}</div>`);
  }
  return pages;
}

function notesPage(n) {
  return `<div class="pg notes"><h2>Detective's notes</h2>${'<div class="rule"></div>'.repeat(26)}${pageNo(n)}</div>`;
}
function backCover() {
  return `<div class="pg back"><div class="end">🔒</div><p><b>Case closed.</b></p><p class="small">Made with Mystery Grid.<br>Every case has exactly one solution.</p></div>`;
}

const CSS = `
* { box-sizing: border-box; }
html, body { margin: 0; }
body { font-family: "Helvetica Neue", Arial, sans-serif; color: #000; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.pg { width: 148.5mm; height: 210mm; padding: 9mm 10mm 11mm; position: relative; overflow: hidden; background: #fff; }
.pn { position: absolute; bottom: 5mm; left: 0; right: 0; text-align: center; font-size: 2.8mm; color: #555; }
.sheet { width: 297mm; height: 210mm; display: flex; page-break-after: always; }
.sheet:last-child { page-break-after: auto; }
.reader .pg { page-break-after: always; }
.reader .pg:last-child { page-break-after: auto; }

/* cover: outline only, no fills */
.cover { text-align: center; padding-top: 34mm; border: 0; }
.cover::before { content: ""; position: absolute; inset: 7mm; border: 0.6mm solid #000; }
.cover::after { content: ""; position: absolute; inset: 9mm; border: 0.2mm solid #000; }
.cover .owner { font-size: 9mm; font-style: italic; font-family: Georgia, serif; }
.cover h1 { font-size: 21mm; line-height: .95; margin: 3mm 0 2mm; letter-spacing: 1.5mm; font-weight: 900; }
.cover .book { font-size: 5mm; letter-spacing: 2mm; }
.cover .glass { font-size: 26mm; margin: 9mm 0 4mm; filter: grayscale(1); opacity: .8; }
.cover .tag { font-size: 4mm; font-style: italic; margin: 0; }
.cover .count { font-size: 3.6mm; margin-top: 5mm; line-height: 1.5; }
.cover .stamp { position: absolute; top: 15mm; right: 13mm; transform: rotate(12deg); border: 0.6mm solid #000; font-weight: 900; font-size: 3.6mm; padding: .8mm 2.5mm; letter-spacing: .8mm; }
.cover .belongs { position: absolute; left: 22mm; right: 22mm; bottom: 22mm; font-size: 3.6mm; text-align: left; }
.cover .belongs .line { border-bottom: 0.3mm solid #000; height: 8mm; }

.rules h2 { font-size: 7mm; margin: 1mm 0 2mm; }
.rules h3 { font-size: 4.3mm; margin: 4mm 0 1.2mm; border-bottom: .3mm solid #000; padding-bottom: .6mm; }
.rules p, .rules li { font-size: 3.35mm; line-height: 1.45; }
.rules p { margin: 0; }
.rules .lead { font-style: italic; }
.rules ul { margin: 0; padding-left: 4.5mm; }
.rules li { margin-bottom: 1.1mm; }
.rules .dict li { margin-bottom: 2mm; }
.rules .small { font-size: 3.1mm; margin-top: 3mm; }
.toc { border-collapse: collapse; font-size: 3.35mm; width: 100%; }
.toc td { padding: 1mm 2mm 1mm 0; border-bottom: .15mm solid #aaa; }

/* left page: suspects and clues */
.case-l header { display: flex; align-items: center; gap: 3mm; border-bottom: .5mm solid #000; padding-bottom: 1.6mm; }
.case-l .no { border: .5mm solid #000; font-weight: 900; padding: 1mm 2.2mm; font-size: 3.6mm; letter-spacing: .3mm; white-space: nowrap; }
.case-l .ttl { display: flex; flex-direction: column; }
.case-l .ttl b { font-size: 4.8mm; }
.case-l .ttl span { font-size: 2.9mm; color: #444; }
.case-l .intro { font-style: italic; font-size: 3.2mm; margin: 1.8mm 0 2.5mm; color: #333; }
.cards { display: grid; gap: 1.8mm; }
.cards.n6 { grid-template-columns: 1fr; gap: 2.4mm; }
.cards.n8 { grid-template-columns: 1fr 1fr; }
.cards.n10 { grid-template-columns: 1fr 1fr; }
.card { display: flex; gap: 2mm; border: .3mm solid #000; border-radius: 1.6mm; padding: 1.5mm 2mm; break-inside: avoid; }
.card.victim { border-style: dashed; }
.card .lt { flex: 0 0 auto; width: 6.4mm; height: 6.4mm; border-radius: 50%; border: .45mm solid #000; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 3.6mm; }
.card.victim .lt { border-style: dashed; }
.card .nm { font-weight: 800; font-size: 3.3mm; }
.card .cl { font-size: 2.95mm; line-height: 1.33; }
.cards.n6 .card .cl { font-size: 3.2mm; }
.cards.n6 .card .nm { font-size: 3.6mm; }
.cards.n10 .card .cl { font-size: 2.75mm; }
.cards.n10 .card { padding: 1.2mm 1.8mm; }
.key { position: absolute; left: 10mm; right: 10mm; bottom: 11mm; font-size: 2.75mm; line-height: 1.45; border-top: .2mm solid #000; padding-top: 1.2mm; }
.key .mini { filter: grayscale(1); }
.winkey { display: inline-block; width: 6mm; height: 1.6mm; border: .25mm solid #000; background: #fff; vertical-align: middle; }

/* right page: board, draft grid, verdict */
.case-r .rhead { text-align: right; font-weight: 900; font-size: 3.3mm; letter-spacing: .3mm; margin-bottom: 2mm; }
.case-r .rhead .lvl { font-weight: 400; letter-spacing: .5mm; margin-right: 1.5mm; }
.scene-wrap { display: flex; justify-content: center; }
.case-r .bottom { display: flex; gap: 4mm; margin-top: 3mm; align-items: flex-start; }
.draftbox .dt { font-weight: 800; font-size: 3.2mm; margin-bottom: 1mm; }
.case-r .side { flex: 1; display: flex; flex-direction: column; gap: 3mm; padding-top: 4.5mm; }
.verdict { border: .5mm solid #000; border-radius: 1.6mm; padding: 1.6mm 2.4mm 2.2mm; font-weight: 800; font-size: 3.4mm; }
.verdict .line { border-bottom: .3mm solid #000; height: 9mm; }
.timer, .check { font-size: 3mm; line-height: 2; }

.board { display: grid; border: .9mm solid #000; position: relative; flex: 0 0 auto; background: #fff; }
.board .cell { position: relative; display: flex; align-items: center; justify-content: center; }
.board .blocked { background-image: repeating-linear-gradient(45deg, #b5b5b5 0 .18mm, transparent .18mm 1.3mm); }
.board .rug { background-image: repeating-linear-gradient(45deg, #c8c8c8 0 .15mm, transparent .15mm 1.1mm); }
.board .rug::before { content: ""; position: absolute; inset: 13%; border: .2mm dashed #777; }
.board .obj { line-height: 1; filter: grayscale(1); opacity: .75; }
.board .table { width: 72%; height: 54%; border: .35mm solid #000; border-radius: 1mm; background-image: repeating-linear-gradient(0deg, #bbb 0 .15mm, transparent .15mm 1mm); }
.board .zl { position: absolute; bottom: .3mm; left: 50%; transform: translateX(-50%); background: #fff; border: .2mm solid #000; border-radius: 2mm; padding: 0 1.1mm; white-space: nowrap; font-weight: 700; z-index: 3; line-height: 1.35; }
.board .edge { position: absolute; z-index: 2; background: #fff; border: .25mm solid #000; }
.board .edge.n { top: -.9mm; left: 20%; right: 20%; height: 1.2mm; }
.board .edge.s { bottom: -.9mm; left: 20%; right: 20%; height: 1.2mm; }
.board .edge.w { left: -.9mm; top: 20%; bottom: 20%; width: 1.2mm; }
.board .edge.e { right: -.9mm; top: 20%; bottom: 20%; width: 1.2mm; }
.board .ans { font-weight: 900; }
.board .ans.v { text-decoration: underline; }
.board .ans.m { border: .35mm solid #000; border-radius: 50%; width: 82%; height: 82%; display: flex; align-items: center; justify-content: center; }

.sols h2, .notes h2 { font-size: 6mm; margin: 0 0 4mm; }
.solgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 6mm 6mm; justify-items: center; }
.sol { display: flex; flex-direction: column; align-items: center; gap: 1.2mm; }
.sol .st, .sol .sm { font-size: 2.9mm; text-align: center; }
.sols .legend { font-size: 2.8mm; margin-top: 4mm; }
.notes .rule { border-bottom: .2mm solid #999; height: 6.6mm; }
.back { text-align: center; padding-top: 80mm; }
.back .end { font-size: 18mm; filter: grayscale(1); opacity: .7; }
.back p { font-size: 4mm; }
.back .small { font-size: 3mm; color: #555; }
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

  const head = (size) => `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${esc(OWNER)}'s Mystery Grid Casebook</title>
    <style>@page { size: ${size}; margin: 0; }${CSS}</style></head>`;
  const readerHtml = `${head('148.5mm 210mm')}<body class="reader">${pages.join('')}</body></html>`;
  const printHtml = `${head('297mm 210mm')}<body>${impose(pages).map(([l, r]) => `<div class="sheet">${pages[l - 1]}${pages[r - 1]}</div>`).join('')}</body></html>`;

  fs.mkdirSync(OUT, { recursive: true });
  const { chromium } = require('playwright');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const [name, html] of [['casebook-read', readerHtml], ['casebook-print', printHtml]]) {
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
