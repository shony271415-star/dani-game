(function () {
  'use strict';
  const E = window.MysteryEngine;
  const $ = (id) => document.getElementById(id);
  const STORE_KEY = 'mystery-grid-v1';

  const DIFFS = [
    { key: 'easy', label: '🔎 Rookie', sub: '4×4 grid · 3 suspects', seed: 100000 },
    { key: 'medium', label: '🕵️ Detective', sub: '5×5 grid · 4 suspects', seed: 200000 },
    { key: 'hard', label: '🎩 Inspector', sub: '6×6 grid · 5 suspects', seed: 300000 },
    { key: 'expert', label: '🧠 Expert', sub: '8×8 grid · 7 suspects', seed: 400000 },
    { key: 'extreme', label: '💀 Extreme', sub: '10×10 grid · 9 suspects · bring coffee', seed: 500000 },
  ];
  const DIFF = Object.fromEntries(DIFFS.map((d) => [d.key, d]));
  const RANKS = [[0, 'Rookie'], [3, 'Junior Detective'], [10, 'Detective'], [25, 'Inspector'], [50, 'Chief Inspector'], [100, 'Legend of the Force']];

  let store = load();
  let S = null;
  let timer = null;

  function load() {
    let s;
    try { s = JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { s = {}; }
    if (s.engine !== E.VERSION) {
      // cases from the old version can't be resumed, but progress and profile are kept
      for (const d of DIFFS) if (s[d.key]) { s[d.key].cur = null; s[d.key].next = null; }
      s.engine = E.VERSION;
    }
    return s;
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (e) { /* storage full or private mode */ }
  }
  function prog(diff) {
    if (!store[diff]) store[diff] = { caseNum: 1, solved: 0, best: null, cur: null, next: null };
    return store[diff];
  }

  const fmtTime = (sec) => {
    const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    return (h ? h + ':' + String(m).padStart(2, '0') : String(m).padStart(2, '0')) + ':' + String(s).padStart(2, '0');
  };
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const rich = (t) => esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  const pr = (p, he, she) => (p.g === 'm' ? he : she);

  /* ---------- case building (in a worker when possible) ---------- */
  let worker = null, reqId = 0;
  const pending = {};
  try {
    if (/^https?:$/.test(location.protocol)) {
      worker = new Worker('worker.js');
      worker.onmessage = (e) => {
        const cb = pending[e.data.id];
        delete pending[e.data.id];
        if (cb) cb(e.data.error ? null : e.data.puzzle);
      };
      worker.onerror = () => { worker = null; };
    }
  } catch (e) { worker = null; }

  function buildCase(diff, caseNum, cb) {
    const seed = DIFF[diff].seed + caseNum;
    if (worker) {
      const id = ++reqId;
      pending[id] = (p) => (p ? cb(p) : cb(E.generate(seed, diff)));
      worker.postMessage({ id, seed, diff });
    } else {
      setTimeout(() => cb(E.generate(seed, diff)), 30);
    }
  }
  function prefetchNext(diff, caseNum) {
    const p = prog(diff);
    if (p.next && p.next.caseNum === caseNum + 1) return;
    buildCase(diff, caseNum + 1, (puzzle) => {
      prog(diff).next = { caseNum: caseNum + 1, puzzle };
      save();
    });
  }

  /* ---------- profile ---------- */
  function totalSolved() { return DIFFS.reduce((n, d) => n + prog(d.key).solved, 0); }
  function rankName() {
    const t = totalSolved();
    let r = RANKS[0][1];
    for (const [n, name] of RANKS) if (t >= n) r = name;
    return r;
  }
  function askProfile() {
    modal(`<div class="big">🕵️</div><h2>Who's on the case?</h2>
      <p>Your name and progress are saved on this device.</p>
      <input class="name-in" id="name-in" maxlength="18" placeholder="Your name" autocomplete="off">
      <div class="row"><button class="primary" data-act="ok">Let's go</button></div>`,
    { ok: saveProfile }, true);
    const cur = store.profile ? store.profile.name : '';
    $('name-in').value = cur || '';
    $('name-in').addEventListener('keydown', (e) => { if (e.key === 'Enter') saveProfile(); });
  }
  function saveProfile() {
    const name = $('name-in').value.trim();
    if (!name) { $('name-in').focus(); shake($('modal-body')); return; }
    store.profile = { name };
    save(); closeModal(); showHome();
  }
  function renderGreet() {
    const el = $('greet');
    if (!store.profile) { el.innerHTML = '<b>Tap here to sign in</b>'; return; }
    const t = totalSolved();
    el.innerHTML = `<b>Hello, ${esc(store.profile.name)}! 👋</b>
      <div>Rank: ${rankName()} · ${t === 1 ? '1 case solved' : t ? t + ' cases solved' : 'no cases solved yet'}</div>
      <small>Tap to change name</small>`;
  }

  /* ---------- home ---------- */
  function showHome() {
    stopTimer();
    $('home').classList.add('active');
    $('game').classList.remove('active');
    renderGreet();
    $('diffs').innerHTML = DIFFS.map((d) => {
      const p = prog(d.key);
      const badge = p.cur ? 'In progress' : p.solved ? `${p.solved} solved` : 'New!';
      return `<button class="diff-btn ${d.key === 'extreme' ? 'extreme' : ''}" data-diff="${d.key}">
        <span>${d.label}<small>${d.sub}</small></span><span class="badge">${badge}</span></button>`;
    }).join('');
    $('diffs').querySelectorAll('.diff-btn').forEach((b) => b.addEventListener('click', () => startGame(b.dataset.diff)));
  }

  /* ---------- game ---------- */
  function startGame(diff) {
    const p = prog(diff);
    const caseNum = p.caseNum;
    const go = (puzzle) => {
      $('loading').classList.remove('show');
      begin(diff, caseNum, puzzle);
    };
    if (p.cur && p.cur.caseNum === caseNum && p.cur.puzzle) return go(p.cur.puzzle);
    if (p.next && p.next.caseNum === caseNum && p.next.puzzle) { const pz = p.next.puzzle; p.next = null; return go(pz); }
    $('loading-text').textContent = diff === 'extreme' ? 'Building a really nasty crime scene…' : 'Building the crime scene…';
    $('loading').classList.add('show');
    buildCase(diff, caseNum, go);
  }

  function begin(diff, caseNum, puzzle) {
    const p = prog(diff);
    S = {
      diff, caseNum, P: puzzle,
      place: new Array(puzzle.N).fill(-1), xs: new Set(),
      sel: -1, mode: 'place', history: [],
      elapsed: 0, hints: 0, solvedGrid: false, wrongAccuse: [],
    };
    if (p.cur && p.cur.caseNum === caseNum) {
      S.place = p.cur.place || S.place; S.xs = new Set(p.cur.xs || []); S.elapsed = p.cur.elapsed || 0;
      S.hints = p.cur.hints || 0; S.wrongAccuse = p.cur.wrongAccuse || [];
    }
    persist();
    $('home').classList.remove('active');
    $('game').classList.add('active');
    $('case-title').textContent = `${puzzle.theme.icon} Case #${caseNum}: ${puzzle.title}`;
    $('intro').textContent = puzzle.intro;
    buildLegend();
    setMode('place');
    render();
    window.scrollTo(0, 0);
    requestAnimationFrame(() => { $('play-area').style.top = $('topbar').offsetHeight + 'px'; });
    startTimer();
    prefetchNext(diff, caseNum);
    if (!store.seenHowto) { store.seenHowto = true; save(); showHowto(); }
    checkDone(true);
  }

  function persist() {
    if (!S) return;
    prog(S.diff).cur = {
      caseNum: S.caseNum, puzzle: S.P, place: S.place, xs: [...S.xs], elapsed: S.elapsed,
      hints: S.hints, wrongAccuse: S.wrongAccuse,
    };
    save();
  }

  function startTimer() {
    stopTimer(); updateSub();
    timer = setInterval(() => {
      if (document.hidden || !S || S.solvedGrid) return;
      S.elapsed++; updateSub();
      if (S.elapsed % 10 === 0) persist();
    }, 1000);
  }
  function stopTimer() { if (timer) clearInterval(timer); timer = null; }
  function updateSub() {
    $('case-sub').textContent = `${S.P.theme.name} · ${DIFF[S.diff].label.replace(/^\S+\s/, '')} · ⏱ ${fmtTime(S.elapsed)}`;
  }

  function shake(el) { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }
  function setStatus(msg, bad) { $('status').textContent = msg; if (bad) shake($('status')); }

  function setMode(m) {
    S.mode = m;
    $('mode-place').classList.toggle('on', m === 'place');
    $('mode-x').classList.toggle('on', m === 'x');
    if (m === 'x') { S.sel = -1; setStatus('Mark mode: tap a square to cross it out ✕'); }
    else setStatus('Pick a suspect below, then tap a square.');
    render();
  }

  function snapshot() {
    S.history.push({ place: S.place.slice(), xs: [...S.xs] });
    if (S.history.length > 300) S.history.shift();
  }
  const whoAt = (cell) => S.place.indexOf(cell);

  function onCell(i) {
    if (S.solvedGrid) return;
    const P = S.P, occ = whoAt(i);
    if (S.mode === 'x') {
      if (occ >= 0) return;
      snapshot();
      if (S.xs.has(i)) S.xs.delete(i); else S.xs.add(i);
      render(); persist();
      return;
    }
    if (S.sel >= 0) {
      if (E.isBlocked(P.obj[i])) { setStatus(`Nobody can stand on ${E.OBJECTS[P.obj[i]].name === 'TV' ? 'the TV' : 'the ' + E.OBJECTS[P.obj[i]].name}!`, true); return; }
      snapshot();
      if (occ >= 0) S.place[occ] = -1;
      S.place[S.sel] = i; S.xs.delete(i); S.sel = -1;
      setStatus('Pick a suspect below, then tap a square.');
      render(); persist(); checkDone(false);
      return;
    }
    if (occ >= 0) {
      snapshot();
      S.place[occ] = -1; S.sel = occ;
      setStatus(`You picked up ${P.people[occ].name}. Tap a new square.`);
      render(); persist();
      return;
    }
    setStatus('First pick a suspect from the list below 👇', true);
  }

  function onSuspect(p) {
    if (S.solvedGrid) return;
    if (S.mode === 'x') setMode('place');
    S.sel = S.sel === p ? -1 : p;
    if (S.sel >= 0) setStatus(`Where was ${S.P.people[p].name}? Tap a square.`);
    render();
  }

  function conflicts() {
    const N = S.P.N, bad = new Set();
    for (let a = 0; a < N; a++) for (let b = a + 1; b < N; b++) {
      const x = S.place[a], y = S.place[b];
      if (x < 0 || y < 0) continue;
      if (Math.floor(x / N) === Math.floor(y / N) || x % N === y % N) { bad.add(a); bad.add(b); }
    }
    return bad;
  }

  function checkDone(silent) {
    const P = S.P;
    if (S.place.some((x) => x < 0)) return;
    if (conflicts().size) { if (!silent) setStatus('Two people share a row or column. That can\'t be right!', true); return; }
    if (!S.place.every((x, p) => x === P.solution[p])) {
      if (!silent) setStatus('🤔 Something doesn\'t add up… someone breaks one of their clues.', true);
      return;
    }
    S.solvedGrid = true;
    persist(); render();
    setStatus('✅ Everyone is in place! Now… who did it?');
    setTimeout(showAccuse, 450);
  }

  /* ---------- drawing ---------- */
  function zoneLabelCells(P) {
    // one label per area, on a square near its bottom, without two labels overlapping
    const N = P.N, cellPx = Math.min(window.innerWidth * 0.94, 470, window.innerHeight * 0.52) / N;
    const fontPx = Math.max(8, cellPx * 0.19);
    const span = (z) => (P.zones[z].name.length * fontPx * 0.58 + 10) / cellPx; // label width in squares
    const taken = []; // [row, from, to]
    const out = {};
    const zonesBySize = [...P.zones.keys()].sort((a, b) => P.zoneOf.filter((x) => x === a).length - P.zoneOf.filter((x) => x === b).length);
    for (const z of zonesBySize) {
      const w = span(z);
      const cells = [];
      P.zoneOf.forEach((zz, i) => {
        if (zz !== z) return;
        const r = Math.floor(i / N), c = i % N;
        let run = 0; for (let k = 0; k < N; k++) if (P.zoneOf[r * N + k] === z) run++;
        const score = r * 10 + Math.min(run, w) * 3 + (P.obj[i] ? -2 : 0) - Math.abs(c - (N - 1) / 2) * 0.2;
        cells.push([i, score]);
      });
      cells.sort((a, b) => b[1] - a[1]);
      let chosen = cells[0][0];
      for (const [i] of cells) {
        const r = Math.floor(i / N), c = i % N + 0.5;
        const from = Math.max(0, c - w / 2), to = Math.min(N, c + w / 2);
        if (!taken.some(([tr, tf, tt]) => tr === r && from < tt && to > tf)) { chosen = i; break; }
      }
      const r = Math.floor(chosen / N), c = chosen % N + 0.5;
      taken.push([r, c - w / 2, c + w / 2]);
      out[chosen] = z;
    }
    return out;
  }

  const isOuter = (N, i, s) => {
    const r = Math.floor(i / N), c = i % N;
    return (s === 'n' && r === 0) || (s === 's' && r === N - 1) || (s === 'w' && c === 0) || (s === 'e' && c === N - 1);
  };

  function render() {
    if (!S) return;
    const P = S.P, N = P.N, big = N > 6;
    const board = $('board');
    board.style.setProperty('--n', N);
    board.style.gridTemplateColumns = `repeat(${N}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${N}, 1fr)`;
    board.innerHTML = '';
    const labels = zoneLabelCells(P), bad = conflicts();
    const usedR = new Set(), usedC = new Set();
    if (S.sel >= 0) S.place.forEach((x, p) => { if (x >= 0 && p !== S.sel) { usedR.add(Math.floor(x / N)); usedC.add(x % N); } });
    const edges = new Set(P.edges);

    for (let i = 0; i < N * N; i++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.style.background = P.zones[P.zoneOf[i]].color;
      const w = P.walls[i];
      ['n', 's', 'e', 'w'].forEach((s) => { if (w[s] && !isOuter(N, i, s)) cell.classList.add('wall-' + s); });
      const o = P.obj[i], def = o && E.OBJECTS[o];
      if (def && def.css === 'rug') cell.classList.add('rug');
      const who = whoAt(i);
      if (who >= 0) cell.classList.add('has-token');
      if (S.sel >= 0 && (usedR.has(Math.floor(i / N)) || usedC.has(i % N) || E.isBlocked(o))) cell.classList.add('dim');
      if (def && def.css === 'table') { const t = document.createElement('div'); t.className = 'table-obj'; cell.appendChild(t); }
      else if (def && def.e) { const em = document.createElement('div'); em.className = 'obj'; em.textContent = def.e; cell.appendChild(em); }
      ['n', 's', 'e', 'w'].forEach((s) => {
        if (edges.has(i + s)) { const d = document.createElement('div'); d.className = 'edge ' + s; d.style.background = P.theme.edgeColor; cell.appendChild(d); }
      });
      if (i in labels) {
        const lb = document.createElement('div');
        lb.className = 'zone-label'; lb.textContent = P.zones[labels[i]].name;
        cell.appendChild(lb);
      }
      if (who >= 0) {
        const person = P.people[who];
        const t = document.createElement('div');
        t.className = 'token' + (big ? ' letter' : '') + (person.isVictim ? ' victim' : '') + (bad.has(who) ? ' conflict' : '') + (S.solvedGrid ? ' locked' : '');
        if (big) { t.textContent = person.letter; t.style.background = person.color; }
        else t.textContent = person.emoji;
        cell.appendChild(t);
      } else if (S.xs.has(i)) {
        const x = document.createElement('div'); x.className = 'xmark'; x.textContent = '✕'; cell.appendChild(x);
      }
      cell.addEventListener('click', () => onCell(i));
      board.appendChild(cell);
    }

    const list = $('suspects');
    list.innerHTML = '';
    P.people.forEach((person, p) => {
      const card = document.createElement('button');
      card.className = 'suspect' + (person.isVictim ? ' is-victim' : '') + (S.sel === p ? ' sel' : '') + (S.place[p] >= 0 ? ' placed' : '');
      const clues = person.isVictim
        ? '<div><b>The victim.</b> Found in the last remaining square.</div>'
        : person.clues.map((c) => `<div>${rich(c)}</div>`).join('');
      card.innerHTML = `<div class="face">${person.emoji}<span class="lt" style="background:${person.color}">${person.letter}</span></div>
        <div><div class="nm">${esc(person.name)}${person.isVictim ? ' ☠️' : ''}</div><div class="cl">${clues}</div></div>`;
      card.addEventListener('click', () => onSuspect(p));
      list.appendChild(card);
    });
  }

  function buildLegend() {
    const P = S.P, T = P.theme;
    const present = [...new Set(P.obj.filter(Boolean))];
    const show = (o) => (E.OBJECTS[o].e || (o === 'rug' ? '▨' : '▬')) + ' ' + E.OBJECTS[o].name;
    const can = present.filter((o) => !E.isBlocked(o)).map(show);
    const cant = present.filter((o) => E.isBlocked(o)).map(show);
    $('legend').innerHTML = `<summary>📖 Detective's dictionary</summary><ul>
      <li>Every person was in a <b>different row</b> and a <b>different column</b>.</li>
      <li>You <b>can</b> stand on: bare ${T.floor}${can.length ? ', ' + can.join(', ') : ''}.</li>
      ${cant.length ? `<li>You <b>can't</b> stand on: ${cant.join(', ')}.</li>` : ''}
      <li><b>Beside</b> something = in a square directly above, below, left or right of it, in the same ${T.area}.</li>
      <li><b>In a corner</b> = a square where two walls of the ${T.area} meet.</li>
      <li><b>${T.center[0].toUpperCase() + T.center.slice(1)}</b> = none of the square's 4 sides is a wall.</li>
      <li><b>By a ${T.edge}</b> = the colored bar on the outer wall is on that square's side.</li>
      <li><b>Higher row</b> = closer to the top. <b>To the left</b> = closer to the left side.</li>
      <li><b>Diagonally next to</b> = touching only by a corner.</li>
      <li>The victim was in the last free square. Whoever was <b>alone with them</b> in the same ${T.area} is the murderer.</li>
    </ul>`;
  }

  /* ---------- tools ---------- */
  $('mode-place').addEventListener('click', () => setMode('place'));
  $('mode-x').addEventListener('click', () => setMode('x'));
  $('undo').addEventListener('click', () => {
    if (S.solvedGrid || !S.history.length) return;
    const h = S.history.pop();
    S.place = h.place; S.xs = new Set(h.xs); S.sel = -1;
    render(); persist();
  });
  $('reset').addEventListener('click', () => {
    if (S.solvedGrid) return;
    modal(`<div class="big">🗑️</div><h2>Clear the board?</h2><p>All placements and marks will be erased.</p>
      <div class="row"><button class="primary" data-act="yes">Yes, clear</button><button class="secondary" data-act="close">Cancel</button></div>`, {
      yes: () => { snapshot(); S.place.fill(-1); S.xs.clear(); S.sel = -1; render(); persist(); closeModal(); },
    });
  });
  $('hint').addEventListener('click', () => {
    if (S.solvedGrid) return;
    const P = S.P;
    let p = S.place.findIndex((x, q) => x >= 0 && x !== P.solution[q]);
    const wasWrong = p >= 0;
    if (p < 0) p = S.place.findIndex((x, q) => x < 0 && !P.people[q].isVictim);
    if (p < 0) p = S.place.findIndex((x) => x < 0);
    if (p < 0) return;
    snapshot();
    const target = P.solution[p], occ = whoAt(target);
    if (occ >= 0) S.place[occ] = -1;
    S.place[p] = target; S.xs.delete(target); S.sel = -1; S.hints++;
    const person = P.people[p];
    setStatus(wasWrong ? `💡 ${person.name} was in the wrong place. Fixed it.` : `💡 Placed ${person.name} in the right spot.`);
    render(); persist(); checkDone(false);
  });
  $('back').addEventListener('click', () => { persist(); showHome(); });
  $('howto-home').addEventListener('click', showHowto);
  $('howto-game').addEventListener('click', showHowto);
  $('greet').addEventListener('click', askProfile);

  /* ---------- modals ---------- */
  let modalActions = {}, modalSticky = false;
  function modal(html, actions, sticky) {
    $('modal-body').innerHTML = html;
    modalActions = actions || {};
    modalSticky = !!sticky;
    $('modal').classList.add('show');
  }
  function closeModal() { $('modal').classList.remove('show'); }
  $('modal').addEventListener('click', (e) => {
    if (e.target === $('modal')) { if (!modalSticky) closeModal(); return; }
    const btn = e.target.closest('[data-act]');
    if (!btn) return;
    if (btn.dataset.act === 'close') closeModal();
    else if (modalActions[btn.dataset.act]) modalActions[btn.dataset.act](btn);
  });

  function showHowto() {
    modal(`<div class="big">👮</div><h2>Welcome, detective!</h2>
      <div class="howto">
      <p>There was (yep, you guessed it) a murder last night. The good news? We have a lineup of suspects and a clue about each of them.</p>
      <p><b>Your goal:</b> find the murderer: the one person who was <b>alone with the victim</b> in the same room.</p>
      <ul>
        <li>Every person was in a <b>different row</b> and a <b>different column</b>, like sudoku.</li>
        <li>Some objects can be stood on (chairs, beds, rugs…), others can't (tables, plants…). Check the dictionary under the suspects.</li>
        <li>The victim (<b>V</b>) is in the <b>last remaining square</b>.</li>
      </ul>
      <p><b>How to play:</b> tap a suspect card, then a square. Tap a placed suspect to pick them up again. Use <b>✕ Mark</b> to cross out squares you've ruled out.</p>
      <p>Each scene is different: a mansion, a ship, a forest, a space station and more.</p>
      </div>
      <div class="row"><button class="primary" data-act="close">Let's investigate!</button></div>`);
  }

  function showAccuse() {
    const P = S.P, v = P.people[P.victim];
    const zone = P.zones[P.zoneOf[P.solution[P.victim]]].name;
    const btns = P.people.map((person, p) => person.isVictim ? '' :
      `<button data-act="acc" data-p="${p}" class="${S.wrongAccuse.includes(p) ? 'nope' : ''}"><span>${person.emoji}</span>${esc(person.name)}</button>`).join('');
    modal(`<div class="big">🔪</div><h2>The murderer is…</h2>
      <p>${esc(v.name)} was found in the <b>${esc(zone)}</b>. Who was alone with ${pr(v, 'him', 'her')}?</p>
      <div class="accuse-grid">${btns}</div>
      <p id="acc-msg" style="min-height:24px;color:var(--accent);font-weight:700"></p>`, {
      acc: (btn) => {
        const p = +btn.dataset.p;
        if (p === P.murderer) return win();
        if (!S.wrongAccuse.includes(p)) S.wrongAccuse.push(p);
        persist();
        btn.classList.add('nope');
        $('acc-msg').textContent = `${P.people[p].name} wasn't even in the ${zone}! Try again.`;
        shake($('modal-body'));
      },
    });
  }

  function win() {
    const P = S.P, pg = prog(S.diff);
    const m = P.people[P.murderer], v = P.people[P.victim];
    const zone = P.zones[P.zoneOf[P.solution[P.victim]]].name;
    pg.solved++; pg.caseNum++; pg.cur = null;
    const isBest = !S.hints && (pg.best == null || S.elapsed < pg.best);
    if (isBest) pg.best = S.elapsed;
    save(); stopTimer();
    const stars = !S.hints && !S.wrongAccuse.length ? '⭐⭐⭐' : S.hints <= 1 ? '⭐⭐' : '⭐';
    modal(`<div class="big">${m.emoji}🚔</div><h2>Case closed!</h2>
      <p><b>${esc(m.name)}</b> was alone with ${esc(v.name)} in the ${esc(zone)}.<br>${pr(m, 'He', 'She')}'s on the way to jail. 🔒</p>
      <p style="font-size:28px;margin:6px 0">${stars}</p>
      <p>⏱ ${fmtTime(S.elapsed)}${S.hints ? ` · 💡 ${S.hints} hint${S.hints > 1 ? 's' : ''}` : ''}${isBest ? '<br>🏆 New personal best!' : ''}</p>
      <div class="row"><button class="primary" data-act="next">Next case →</button><button class="secondary" data-act="home">Menu</button></div>`, {
      next: () => { closeModal(); startGame(S.diff); },
      home: () => { closeModal(); showHome(); },
    });
  }

  /* ---------- install as an app ---------- */
  let installEvent = null;
  const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); installEvent = e; $('install-btn').hidden = false; });
  window.addEventListener('appinstalled', () => { $('install-btn').hidden = true; });
  if (!standalone && isIOS) $('install-btn').hidden = false;
  $('install-btn').addEventListener('click', () => {
    if (installEvent) { installEvent.prompt(); installEvent = null; return; }
    modal(`<div class="big">📲</div><h2>Install on iPhone</h2>
      <ol class="steps">
        <li>Open this page in <b>Safari</b>.</li>
        <li>Tap the <b>Share</b> button (square with an arrow).</li>
        <li>Choose <b>"Add to Home Screen"</b>.</li>
        <li>From now on, open the game from the icon.</li>
      </ol>
      <p><small>Install before you start playing: on iPhone the app keeps its progress separately from Safari.</small></p>
      <div class="row"><button class="primary" data-act="close">Got it</button></div>`);
  });

  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});

  document.addEventListener('visibilitychange', () => { if (document.hidden) persist(); });
  window.addEventListener('resize', () => { if (S) $('play-area').style.top = $('topbar').offsetHeight + 'px'; });
  showHome();
  if (!store.profile) askProfile();
})();
