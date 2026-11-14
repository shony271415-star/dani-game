(function () {
  'use strict';
  const E = window.MysteryEngine;
  const $ = (id) => document.getElementById(id);
  const STORE_KEY = 'mystery-grid-v1';
  const DIFF_LABEL = { easy: 'בלש מתחיל', medium: 'בלש ותיק', hard: 'מפקח ראשי' };
  const DIFF_SEED = { easy: 100000, medium: 200000, hard: 300000 };

  let store = load();
  let S = null; // מצב המשחק הנוכחי
  let timer = null;

  function load() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { return {}; }
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (e) { /* מצב פרטי */ }
  }
  function prog(diff) {
    if (!store[diff]) store[diff] = { caseNum: 1, solved: 0, best: null, cur: null };
    return store[diff];
  }

  function fmtTime(sec) {
    const m = Math.floor(sec / 60), s = sec % 60;
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }
  function rich(text) {
    const esc = text.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
    return esc.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  }
  const g = (p, m, f) => (p.g === 'm' ? m : f);

  /* ---------- מסך פתיחה ---------- */
  function showHome() {
    stopTimer();
    $('home').classList.add('active');
    $('game').classList.remove('active');
    for (const d of ['easy', 'medium', 'hard']) {
      const p = prog(d);
      $('badge-' + d).textContent = p.solved ? `${p.solved} פוענחו` : 'חדש!';
    }
  }

  document.querySelectorAll('.diff-btn').forEach((b) => {
    b.addEventListener('click', () => startGame(b.dataset.diff));
  });

  /* ---------- משחק ---------- */
  function startGame(diff) {
    const p = prog(diff);
    const caseNum = p.caseNum;
    const puzzle = E.generate(DIFF_SEED[diff] + caseNum, diff);
    S = {
      diff, caseNum, P: puzzle,
      place: new Array(puzzle.N).fill(-1),
      xs: new Set(),
      sel: -1, mode: 'place', history: [],
      elapsed: 0, hints: 0, solvedGrid: false, wrongAccuse: [],
    };
    if (p.cur && p.cur.caseNum === caseNum) {
      S.place = p.cur.place; S.xs = new Set(p.cur.xs); S.elapsed = p.cur.elapsed;
      S.hints = p.cur.hints || 0; S.wrongAccuse = p.cur.wrongAccuse || [];
    }
    $('home').classList.remove('active');
    $('game').classList.add('active');
    $('case-title').textContent = `תיק #${caseNum}: ${puzzle.title}`;
    $('intro').textContent = puzzle.intro;
    setMode('place');
    setStatus('בחרו חשוד מהרשימה ואז משבצת בלוח.');
    render();
    window.scrollTo(0, 0);
    startTimer();
    if (!store.seenHowto) { store.seenHowto = true; save(); showHowto(); }
    checkDone(true);
  }

  function persist() {
    if (!S) return;
    prog(S.diff).cur = {
      caseNum: S.caseNum, place: S.place, xs: [...S.xs], elapsed: S.elapsed,
      hints: S.hints, wrongAccuse: S.wrongAccuse,
    };
    save();
  }

  function startTimer() {
    stopTimer();
    updateSub();
    timer = setInterval(() => {
      if (document.hidden || S.solvedGrid) return;
      S.elapsed++;
      updateSub();
      if (S.elapsed % 5 === 0) persist();
    }, 1000);
  }
  function stopTimer() { if (timer) clearInterval(timer); timer = null; }
  function updateSub() {
    $('case-sub').textContent = `${DIFF_LABEL[S.diff]} · ⏱ ${fmtTime(S.elapsed)}`;
  }

  function setStatus(msg, shake) {
    const el = $('status');
    el.textContent = msg;
    if (shake) { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }
  }

  function setMode(m) {
    S.mode = m;
    $('mode-place').classList.toggle('on', m === 'place');
    $('mode-x').classList.toggle('on', m === 'x');
    if (m === 'x') { S.sel = -1; setStatus('מצב סימון: הקישו על משבצת כדי לסמן ✕ (מקום שאף אחד לא יכול להיות בו).'); }
    else setStatus('בחרו חשוד מהרשימה ואז משבצת בלוח.');
    if (S.P) render();
  }

  function snapshot() {
    S.history.push({ place: S.place.slice(), xs: [...S.xs] });
    if (S.history.length > 200) S.history.shift();
  }

  function whoAt(cell) { return S.place.indexOf(cell); }

  function onCell(i) {
    if (S.solvedGrid) return;
    const P = S.P;
    const occupant = whoAt(i);
    if (S.mode === 'x') {
      if (occupant >= 0) return;
      snapshot();
      if (S.xs.has(i)) S.xs.delete(i); else S.xs.add(i);
      render(); persist();
      return;
    }
    if (S.sel >= 0) {
      if (E.BLOCKING[P.obj[i]]) {
        setStatus(`אי אפשר לעמוד על ${E.OBJ_NAMES[P.obj[i]]}!`, true);
        return;
      }
      snapshot();
      if (occupant >= 0) S.place[occupant] = -1;
      S.place[S.sel] = i;
      S.xs.delete(i);
      S.sel = -1;
      render(); persist();
      checkDone(false);
      return;
    }
    if (occupant >= 0) {
      snapshot();
      S.place[occupant] = -1;
      S.sel = occupant;
      setStatus(`הרמתם את ${P.people[occupant].name}. בחרו משבצת חדשה.`);
      render(); persist();
      return;
    }
    setStatus('קודם בחרו חשוד מהרשימה למטה 👇', true);
  }

  function onSuspect(p) {
    if (S.solvedGrid) return;
    if (S.mode === 'x') setMode('place');
    S.sel = S.sel === p ? -1 : p;
    if (S.sel >= 0) {
      const person = S.P.people[p];
      setStatus(`איפה ${g(person, 'היה', 'הייתה')} ${person.name}? הקישו על משבצת.`);
    }
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
    const bad = conflicts();
    if (bad.size) {
      if (!silent) setStatus('שני אנשים באותה שורה או עמודה — זה לא יכול להיות!', true);
      return;
    }
    const correct = S.place.every((x, p) => x === P.solution[p]);
    if (!correct) {
      if (!silent) setStatus('🤔 משהו לא מסתדר... יש מישהו שלא עומד בכל הרמזים שלו.', true);
      return;
    }
    S.solvedGrid = true;
    persist();
    render();
    setStatus('✅ כל החשודים במקום! עכשיו — מי הרוצח?');
    setTimeout(showAccuse, 450);
  }

  /* ---------- ציור ---------- */
  function roomLabelCells(P) {
    const N = P.N, best = {};
    P.roomOf.forEach((room, i) => {
      const r = Math.floor(i / N), c = i % N;
      const score = r * 10 - Math.abs(c - (N - 1) / 2) + (P.obj[i] ? -0.5 : 0);
      if (!(room in best) || score > best[room].score) best[room] = { i, score };
    });
    const out = {};
    Object.keys(best).forEach((room) => { out[best[room].i] = +room; });
    return out;
  }

  function render() {
    const P = S.P, N = P.N;
    const board = $('board');
    board.style.setProperty('--n', N);
    board.style.gridTemplateColumns = `repeat(${N}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${N}, 1fr)`;
    board.innerHTML = '';
    const labels = roomLabelCells(P);
    const bad = conflicts();
    const usedRows = new Set(), usedCols = new Set();
    if (S.sel >= 0) S.place.forEach((x, p) => { if (x >= 0 && p !== S.sel) { usedRows.add(Math.floor(x / N)); usedCols.add(x % N); } });
    const winSet = new Set(P.windows);

    for (let i = 0; i < N * N; i++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      const w = P.walls[i];
      cell.style.background = P.rooms[P.roomOf[i]].color;
      ['n', 's', 'e', 'w'].forEach((s) => { if (w[s] && !isOuter(N, i, s)) cell.classList.add('wall-' + s); });
      const o = P.obj[i];
      if (o === 'carpet') cell.classList.add('carpet');
      const who = whoAt(i);
      if (who >= 0) cell.classList.add('has-token');
      if (S.sel >= 0 && (usedRows.has(Math.floor(i / N)) || usedCols.has(i % N) || E.BLOCKING[o])) cell.classList.add('dim');

      if (o === 'table') { const t = document.createElement('div'); t.className = 'table-obj'; cell.appendChild(t); }
      else if (o && o !== 'carpet') {
        const em = document.createElement('div');
        em.className = 'obj';
        em.textContent = { chair: '🪑', bed: '🛏️', tv: '📺', plant: '🪴' }[o];
        cell.appendChild(em);
      }
      ['n', 's', 'e', 'w'].forEach((s) => {
        if (winSet.has(i + s)) { const wi = document.createElement('div'); wi.className = 'win ' + s; cell.appendChild(wi); }
      });
      if (i in labels) {
        const lb = document.createElement('div');
        lb.className = 'room-label';
        lb.textContent = P.rooms[labels[i]].name;
        cell.appendChild(lb);
      }
      if (who >= 0) {
        const person = P.people[who];
        const t = document.createElement('div');
        t.className = 'token' + (person.isVictim ? ' victim' : '') + (bad.has(who) ? ' conflict' : '') + (S.solvedGrid ? ' locked' : '');
        t.textContent = person.emoji;
        cell.appendChild(t);
      } else if (S.xs.has(i)) {
        const x = document.createElement('div');
        x.className = 'xmark'; x.textContent = '✕';
        cell.appendChild(x);
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
        ? `<b>${g(person, 'הקורבן', 'הקורבן')}.</b> ${g(person, 'נמצא', 'נמצאה')} במשבצת האחרונה שנותרה.`
        : person.clues.map(rich).join('<br>');
      card.innerHTML = `<div class="face">${person.emoji}</div><div><div class="nm">${person.name}${person.isVictim ? ' ☠️' : ''}</div><div class="cl">${clues}</div></div>`;
      card.addEventListener('click', () => onSuspect(p));
      list.appendChild(card);
    });
  }

  function isOuter(N, i, s) {
    const r = Math.floor(i / N), c = i % N;
    return (s === 'n' && r === 0) || (s === 's' && r === N - 1) || (s === 'w' && c === 0) || (s === 'e' && c === N - 1);
  }

  /* ---------- כלים ---------- */
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
    modal(`<div class="big">🗑️</div><h2>לנקות את הלוח?</h2><p>כל ההצבות והסימונים יימחקו.</p>
      <div class="row"><button class="primary" data-act="yes">כן, נקו</button><button class="secondary" data-act="close">ביטול</button></div>`, {
      yes: () => { snapshot(); S.place.fill(-1); S.xs.clear(); S.sel = -1; render(); persist(); closeModal(); },
    });
  });
  $('hint').addEventListener('click', () => {
    if (S.solvedGrid) return;
    const P = S.P;
    // קודם מתקנים טעות, אחר כך מציבים מישהו חדש (לא את הקורבן)
    let p = S.place.findIndex((x, q) => x >= 0 && x !== P.solution[q]);
    let wasWrong = p >= 0;
    if (p < 0) p = S.place.findIndex((x, q) => x < 0 && !P.people[q].isVictim);
    if (p < 0) p = S.place.findIndex((x) => x < 0);
    if (p < 0) return;
    snapshot();
    const target = P.solution[p];
    const occ = whoAt(target);
    if (occ >= 0) S.place[occ] = -1;
    S.place[p] = target;
    S.xs.delete(target);
    S.sel = -1;
    S.hints++;
    const person = P.people[p];
    setStatus(wasWrong ? `💡 ${person.name} לא ${g(person, 'היה', 'הייתה')} במקום הנכון — תיקנתי.` : `💡 הצבתי את ${person.name} במקום הנכון.`);
    render(); persist();
    checkDone(false);
  });
  $('back').addEventListener('click', () => { persist(); showHome(); });
  $('howto-home').addEventListener('click', showHowto);
  $('howto-game').addEventListener('click', showHowto);

  /* ---------- חלונות ---------- */
  let modalActions = {};
  function modal(html, actions) {
    $('modal-body').innerHTML = html;
    modalActions = actions || {};
    $('modal').classList.add('show');
  }
  function closeModal() { $('modal').classList.remove('show'); }
  $('modal').addEventListener('click', (e) => {
    if (e.target === $('modal')) { closeModal(); return; }
    const btn = e.target.closest('[data-act]');
    if (!btn) return;
    const act = btn.dataset.act;
    if (act === 'close') closeModal();
    else if (modalActions[act]) modalActions[act](btn);
  });

  function showHowto() {
    modal(`<div class="big">👮</div><h2>ברוכים הבאים, בלשים!</h2>
      <div class="howto">
      <p>אתמול בלילה היה — כן, ניחשתם — רצח. החדשות הטובות? יש לנו רשימת חשודים ומידע על כל אחד מהם.</p>
      <p><b>המטרה:</b> לגלות מי הרוצח — מי ${'היה'} לבד בחדר עם הקורבן.</p>
      <ul>
        <li>כל אדם היה ב<b>שורה אחרת</b> וב<b>עמודה אחרת</b> (כמו בסודוקו).</li>
        <li>אפשר לעמוד על רצפה ריקה, כיסא, מיטה או שטיח. <b>אי אפשר</b> לעמוד על שולחן, טלוויזיה או עציץ.</li>
        <li>הקורבן נמצא ב<b>משבצת האחרונה שנותרה</b>.</li>
        <li>מי שהיה <b>לבד</b> עם הקורבן באותו חדר — הוא הרוצח!</li>
      </ul>
      <p><b>איך משחקים:</b> הקישו על כרטיס של חשוד ואז על משבצת בלוח. הקשה על חשוד שכבר בלוח מרימה אותו. במצב <b>✕ סימון</b> אפשר לסמן משבצות שנפסלו.</p>
      </div>
      <div class="row"><button class="primary" data-act="close">יאללה, לחקור!</button></div>`);
  }

  function showAccuse() {
    const P = S.P;
    const btns = P.people.map((person, p) => person.isVictim ? '' :
      `<button data-act="acc" data-p="${p}" class="${S.wrongAccuse.includes(p) ? 'nope' : ''}"><span>${person.emoji}</span>${person.name}</button>`).join('');
    const v = P.people[P.victim];
    modal(`<div class="big">🔪</div><h2>הרוצח הוא...</h2>
      <p>${v.name} ${g(v, 'נמצא', 'נמצאה')} ${P.rooms[P.roomOf[P.solution[P.victim]]].inForm}. מי ${g(v, 'היה איתו', 'היה איתה')} לבד?</p>
      <div class="accuse-grid">${btns}</div>
      <p id="acc-msg" style="min-height:24px;color:var(--accent);font-weight:700"></p>`, {
      acc: (btn) => {
        const p = +btn.dataset.p;
        if (p === P.murderer) win();
        else {
          if (!S.wrongAccuse.includes(p)) S.wrongAccuse.push(p);
          persist();
          btn.classList.add('nope');
          const person = P.people[p];
          $('acc-msg').textContent = `${person.name} בכלל לא ${g(person, 'היה', 'הייתה')} באותו חדר! נסו שוב.`;
          $('modal-body').classList.remove('shake'); void $('modal-body').offsetWidth; $('modal-body').classList.add('shake');
        }
      },
    });
  }

  function win() {
    const P = S.P, pr = prog(S.diff);
    const m = P.people[P.murderer], v = P.people[P.victim];
    pr.solved++;
    pr.caseNum++;
    pr.cur = null;
    const isBest = !S.hints && (pr.best === null || S.elapsed < pr.best);
    if (isBest) pr.best = S.elapsed;
    save();
    stopTimer();
    const stars = S.hints === 0 && S.wrongAccuse.length === 0 ? '⭐⭐⭐' : S.hints <= 1 ? '⭐⭐' : '⭐';
    modal(`<div class="big">${m.emoji}🚔</div><h2>התיק פוענח!</h2>
      <p><b>${m.name}</b> ${g(m, 'היה', 'הייתה')} לבד עם ${v.name} ${P.rooms[P.roomOf[P.solution[P.victim]]].inForm}.<br>${g(m, 'הוא', 'היא')} בדרך לכלא. 🔒</p>
      <p style="font-size:28px;margin:6px 0">${stars}</p>
      <p>⏱ ${fmtTime(S.elapsed)}${S.hints ? ` · 💡 ${S.hints} רמזים` : ''}${isBest ? '<br>🏆 שיא חדש!' : ''}</p>
      <div class="row"><button class="primary" data-act="next">לתיק הבא ←</button><button class="secondary" data-act="home">לתפריט</button></div>`, {
      next: () => { closeModal(); startGame(S.diff); },
      home: () => { closeModal(); showHome(); },
    });
  }

  document.addEventListener('visibilitychange', () => { if (document.hidden) persist(); });
  showHome();
})();
