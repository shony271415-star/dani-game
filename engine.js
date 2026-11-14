/* מנוע התעלומות: יוצר זירת פשע, מציב חשודים, מנסח רמזים ומוודא שיש פתרון יחיד */
(function (root) {
  'use strict';

  const BLOCKING = { table: true, tv: true, plant: true };
  const SITTABLE = ['chair', 'bed', 'carpet'];

  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const ROOM_TYPES = [
    { name: 'סלון', inForm: 'בסלון', objs: [['tv', 1, 1], ['chair', 1, 2], ['carpet', 1, 2], ['plant', 0, 1]] },
    { name: 'מטבח', inForm: 'במטבח', objs: [['table', 1, 1], ['chair', 1, 2], ['plant', 0, 1]] },
    { name: 'חדר שינה', inForm: 'בחדר השינה', objs: [['bed', 1, 1], ['chair', 0, 1], ['carpet', 0, 1], ['plant', 0, 1]] },
    { name: 'אמבטיה', inForm: 'באמבטיה', objs: [['carpet', 1, 1], ['plant', 0, 1]] },
    { name: 'חדר עבודה', inForm: 'בחדר העבודה', objs: [['table', 1, 1], ['chair', 1, 1], ['tv', 0, 1], ['plant', 0, 1]] },
    { name: 'ספרייה', inForm: 'בספרייה', objs: [['chair', 1, 2], ['carpet', 0, 1], ['table', 0, 1], ['plant', 0, 1]] },
    { name: 'חדר אוכל', inForm: 'בחדר האוכל', objs: [['table', 1, 1], ['chair', 1, 2], ['plant', 0, 1]] },
    { name: 'חדר אורחים', inForm: 'בחדר האורחים', objs: [['bed', 1, 1], ['chair', 0, 1], ['tv', 0, 1]] },
    { name: 'חממה', inForm: 'בחממה', objs: [['plant', 1, 2], ['chair', 0, 1], ['carpet', 0, 1]] },
    { name: 'חדר משחקים', inForm: 'בחדר המשחקים', objs: [['tv', 1, 1], ['carpet', 1, 1], ['chair', 0, 1]] },
  ];

  const ROOM_COLORS = ['#f6d6cf', '#fbefc4', '#d7e9c9', '#cfe0f3', '#e6d5ef', '#f8dcb4', '#cdeae6'];

  const CHARACTERS = [
    { name: 'אלון', g: 'm', emoji: '🧔' }, { name: 'בני', g: 'm', emoji: '👨‍🦲' },
    { name: 'גיל', g: 'm', emoji: '👨‍🍳' }, { name: 'דורון', g: 'm', emoji: '👴' },
    { name: 'יוסי', g: 'm', emoji: '🤵' }, { name: 'משה', g: 'm', emoji: '👨‍🔧' },
    { name: 'צביקה', g: 'm', emoji: '👨‍🌾' }, { name: 'עומר', g: 'm', emoji: '👦' },
    { name: 'רון', g: 'm', emoji: '👨‍🎤' }, { name: 'איתן', g: 'm', emoji: '👨‍⚕️' },
    { name: 'אורית', g: 'f', emoji: '👩‍🦰' }, { name: 'בתיה', g: 'f', emoji: '👵' },
    { name: 'גלית', g: 'f', emoji: '👩‍🍳' }, { name: 'דנה', g: 'f', emoji: '👩‍💼' },
    { name: 'הילה', g: 'f', emoji: '👩‍🎨' }, { name: 'יעל', g: 'f', emoji: '👱‍♀️' },
    { name: 'מירב', g: 'f', emoji: '👩‍🔬' }, { name: 'נועה', g: 'f', emoji: '👧' },
    { name: 'שירה', g: 'f', emoji: '💃' }, { name: 'תמר', g: 'f', emoji: '👩‍🦱' },
  ];

  const STORIES = [
    ['ארוחת ערב שהשתבשה', 'המנה העיקרית הוגשה, אבל מישהו לא נשאר לקינוח.'],
    ['סוף שבוע בווילה', 'כולם באו לנוח. אחד מהם לא יחזור הביתה.'],
    ['מסיבת יום הולדת', 'העוגה עוד הייתה על השולחן כשנשמעה הצעקה.'],
    ['סערה בבקתה', 'החשמל נפל באמצע הלילה. כשחזר — היה מאוחר מדי.'],
    ['ירושה מסוכנת', 'הצוואה הוקראה בשמונה. בתשע כבר היה גוף.'],
    ['ערב משחקי קופסה', 'מישהו לקח את המשחק קצת יותר מדי ברצינות.'],
    ['ארבעה חלונות', 'למרות כל אור השמש, דברים אפלים קרו כאן.'],
    ['השכנים מלמעלה', 'הרעש פסק בבת אחת. השקט היה מחשיד.'],
    ['ליל הבדולח', 'אגרטל נשבר, ומיד אחריו — עוד משהו.'],
    ['חגיגת פרישה', 'נאומים, בלונים ונעלם אחד.'],
    ['קפה של הבוקר', 'הקפה התקרר. גם האורחת.'],
    ['שיפוץ שלא נגמר', 'הפועלים הלכו הביתה, החשודים נשארו.'],
  ];

  const OBJ_NAMES = { chair: 'כיסא', bed: 'מיטה', carpet: 'שטיח', table: 'שולחן', tv: 'טלוויזיה', plant: 'עציץ' };

  function makeHelpers(R) {
    return {
      ri: (n) => Math.floor(R() * n),
      pick: (arr) => arr[Math.floor(R() * arr.length)],
      shuffle: (arr) => {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
        return a;
      },
    };
  }

  function neighbors(N, i) {
    const r = Math.floor(i / N), c = i % N, out = [];
    if (r > 0) out.push(i - N);
    if (r < N - 1) out.push(i + N);
    if (c > 0) out.push(i - 1);
    if (c < N - 1) out.push(i + 1);
    return out;
  }

  function makeRooms(N, k, R, H) {
    for (let tries = 0; tries < 500; tries++) {
      const id = new Array(N * N).fill(-1);
      const seeds = H.shuffle([...Array(N * N).keys()]).slice(0, k);
      const size = new Array(k).fill(1);
      seeds.forEach((s, r) => { id[s] = r; });
      let left = N * N - k;
      let stuck = false;
      while (left > 0) {
        // החדר הקטן ביותר שיכול לגדול
        const order = H.shuffle([...Array(k).keys()]).sort((a, b) => size[a] - size[b]);
        let grown = false;
        for (const r of order) {
          const cand = [];
          for (let i = 0; i < N * N; i++) {
            if (id[i] !== -1) continue;
            const nb = neighbors(N, i);
            const same = nb.filter((j) => id[j] === r).length;
            if (same > 0) cand.push([i, same + R() * 1.5]);
          }
          if (cand.length) {
            cand.sort((a, b) => b[1] - a[1]);
            const chosen = cand[0][0];
            id[chosen] = r; size[r]++; left--; grown = true;
            break;
          }
        }
        if (!grown) { stuck = true; break; }
      }
      if (stuck) continue;
      if (Math.min(...size) < 3) continue;
      if (Math.max(...size) > Math.ceil((N * N) / k) + N) continue;
      return id;
    }
    return null;
  }

  function computeWalls(N, roomOf) {
    return roomOf.map((room, i) => {
      const r = Math.floor(i / N), c = i % N;
      return {
        n: r === 0 || roomOf[i - N] !== room,
        s: r === N - 1 || roomOf[i + N] !== room,
        w: c === 0 || roomOf[i - 1] !== room,
        e: c === N - 1 || roomOf[i + 1] !== room,
      };
    });
  }

  function placeObjects(N, roomOf, roomTypes, R, H) {
    const obj = new Array(N * N).fill(null);
    const bedPair = new Array(N * N).fill(null); // לציור מיטה כפולה
    roomTypes.forEach((type, room) => {
      const cells = H.shuffle(roomOf.map((x, i) => (x === room ? i : -1)).filter((i) => i >= 0));
      const sz = cells.length;
      let blocked = 0, used = 0;
      const maxBlocked = Math.max(1, Math.floor(sz * 0.34));
      const maxUsed = sz - 1;
      for (const [t, lo, hi] of type.objs) {
        const count = lo + H.ri(hi - lo + 1);
        for (let n = 0; n < count; n++) {
          if (used >= maxUsed) break;
          if (BLOCKING[t] && blocked >= maxBlocked) break;
          const free = cells.filter((i) => obj[i] === null);
          if (!free.length) break;
          if (t === 'bed') {
            // מיטה תופסת שתי משבצות כשאפשר
            let placed = false;
            for (const i of free) {
              const mates = neighbors(N, i).filter((j) => roomOf[j] === room && obj[j] === null);
              if (mates.length && used + 2 <= maxUsed) {
                const j = H.pick(mates);
                obj[i] = obj[j] = 'bed'; bedPair[i] = j; bedPair[j] = i; used += 2; placed = true;
                break;
              }
            }
            if (!placed) { obj[free[0]] = 'bed'; used++; }
          } else {
            obj[free[0]] = t; used++;
            if (BLOCKING[t]) blocked++;
          }
        }
      }
    });
    return { obj, bedPair };
  }

  /* ---------- רמזים ---------- */

  function cellFacts(P, i) {
    const { N, roomOf, obj, walls, windows } = P;
    const f = {};
    f.room = roomOf[i];
    f.obj = obj[i];
    const w = walls[i];
    f.corner = (w.n || w.s) && (w.e || w.w);
    f.center = !w.n && !w.s && !w.e && !w.w;
    f.window = ['n', 's', 'e', 'w'].some((side) => windows.has(i + side));
    f.beside = {};
    for (const j of neighbors(N, i)) {
      if (roomOf[j] !== roomOf[i]) continue;
      if (obj[j] && obj[j] !== obj[i]) f.beside[obj[j]] = true;
    }
    return f;
  }

  function evalUnary(P, clue, i) {
    const f = P.facts[i];
    switch (clue.t) {
      case 'room': return f.room === clue.a;
      case 'notRoom': return f.room !== clue.a;
      case 'on': return f.obj === clue.a;
      case 'floor': return f.obj === null;
      case 'beside': return !!f.beside[clue.a];
      case 'window': return f.window;
      case 'corner': return f.corner;
      case 'center': return f.center;
      default: return true; // רמזים יחסיים נבדקים בנפרד
    }
  }

  function trueClues(P, sol, person, victim) {
    const i = sol[person];
    const f = P.facts[i];
    const out = [];
    out.push({ t: 'room', a: f.room });
    if (f.obj && SITTABLE.includes(f.obj)) out.push({ t: 'on', a: f.obj });
    if (!f.obj) out.push({ t: 'floor' });
    for (const k of Object.keys(f.beside)) out.push({ t: 'beside', a: k });
    if (f.window) out.push({ t: 'window' });
    if (f.corner) out.push({ t: 'corner' });
    if (f.center) out.push({ t: 'center' });
    for (let r = 0; r < P.rooms.length; r++) if (r !== f.room) out.push({ t: 'notRoom', a: r });
    for (let q = 0; q < sol.length; q++) {
      if (q === person || q === victim) continue;
      if (P.roomOf[sol[q]] === f.room) out.push({ t: 'sameRoom', a: q });
    }
    return out;
  }

  function clueKey(c) { return c.t + ':' + (c.a === undefined ? '' : c.a); }

  // מונה פתרונות (עד limit). clues[p] = רשימת רמזים לחשוד p. הקורבן הוא האחרון.
  function solve(P, clues, limit) {
    const N = P.N, M = N; // M אנשים כולל הקורבן
    const victim = M - 1;
    const free = [];
    for (let i = 0; i < N * N; i++) if (!BLOCKING[P.obj[i]]) free.push(i);
    const cands = [];
    for (let p = 0; p < victim; p++) {
      cands[p] = free.filter((i) => clues[p].every((c) => evalUnary(P, c, i)));
    }
    const order = [...Array(victim).keys()].sort((a, b) => cands[a].length - cands[b].length);
    const pos = new Array(M).fill(-1);
    const rowUsed = new Array(N).fill(false), colUsed = new Array(N).fill(false);
    const sols = [];

    function relOk(p) {
      for (const c of clues[p]) {
        if (c.t === 'sameRoom' && pos[c.a] >= 0 && P.roomOf[pos[c.a]] !== P.roomOf[pos[p]]) return false;
      }
      for (let q = 0; q < victim; q++) {
        if (pos[q] < 0 || q === p) continue;
        for (const c of clues[q]) {
          if (c.t === 'sameRoom' && c.a === p && P.roomOf[pos[q]] !== P.roomOf[pos[p]]) return false;
        }
      }
      return true;
    }

    function rec(k) {
      if (sols.length >= limit) return;
      if (k === order.length) {
        const r = rowUsed.indexOf(false), c = colUsed.indexOf(false);
        const vi = r * N + c;
        if (BLOCKING[P.obj[vi]]) return;
        pos[victim] = vi;
        sols.push(pos.slice());
        pos[victim] = -1;
        return;
      }
      const p = order[k];
      for (const i of cands[p]) {
        const r = Math.floor(i / N), c = i % N;
        if (rowUsed[r] || colUsed[c]) continue;
        pos[p] = i; rowUsed[r] = colUsed[c] = true;
        if (relOk(p)) rec(k + 1);
        pos[p] = -1; rowUsed[r] = colUsed[c] = false;
        if (sols.length >= limit) return;
      }
    }
    rec(0);
    return sols;
  }

  function clueText(P, clue, person) {
    const m = person.g === 'm';
    const v = (mm, ff) => (m ? mm : ff);
    const was = v('היה', 'הייתה');
    switch (clue.t) {
      case 'room': return `${was} ${P.rooms[clue.a].inForm}.`;
      case 'notRoom': return `לא ${was} ${P.rooms[clue.a].inForm}.`;
      case 'on':
        if (clue.a === 'chair') return `${v('ישב', 'ישבה')} על **כיסא**.`;
        if (clue.a === 'bed') return `${v('שכב', 'שכבה')} על **מיטה**.`;
        return `${v('עמד', 'עמדה')} על **שטיח**.`;
      case 'floor': return `${v('עמד', 'עמדה')} על **רצפה ריקה**.`;
      case 'beside': return `${was} **ליד ${OBJ_NAMES[clue.a]}**.`;
      case 'window': return `${v('עמד', 'עמדה')} **מול חלון**.`;
      case 'corner': return `${was} **בפינה** של חדר.`;
      case 'center': return `**לא** ${was} **צמוד לקיר**.`;
      case 'sameRoom': return `${was} **באותו חדר** עם ${P.people[clue.a].name}.`;
      default: return '';
    }
  }

  const DIFFICULTY = {
    easy: { N: 4, rooms: [3, 4], windows: [3, 4], maxClues: 2, minimize: false },
    medium: { N: 5, rooms: [4, 4], windows: [3, 5], maxClues: 2, minimize: true },
    hard: { N: 6, rooms: [4, 5], windows: [4, 6], maxClues: 3, minimize: true },
  };

  function tryGenerate(R, H, diffKey) {
    const D = DIFFICULTY[diffKey];
    const N = D.N;
    const k = D.rooms[0] + H.ri(D.rooms[1] - D.rooms[0] + 1);
    const roomOf = makeRooms(N, k, R, H);
    if (!roomOf) return null;
    const types = H.shuffle(ROOM_TYPES).slice(0, k);
    const colors = H.shuffle(ROOM_COLORS);
    const rooms = types.map((t, r) => ({ name: t.name, inForm: t.inForm, color: colors[r] }));
    const { obj, bedPair } = placeObjects(N, roomOf, types, R, H);
    const walls = computeWalls(N, roomOf);

    const windows = new Set();
    const edges = [];
    for (let c = 0; c < N; c++) { edges.push(c + 'n'); edges.push((N - 1) * N + c + 's'); }
    for (let r = 0; r < N; r++) { edges.push(r * N + 'w'); edges.push(r * N + N - 1 + 'e'); }
    const nw = D.windows[0] + H.ri(D.windows[1] - D.windows[0] + 1);
    H.shuffle(edges).slice(0, nw).forEach((e) => windows.add(e));

    const P = { N, roomOf, rooms, obj, bedPair, walls, windows };
    P.facts = roomOf.map((_, i) => cellFacts(P, i));

    // פתרון: תמורה של עמודות על פני השורות, בלי חפצים חוסמים
    const victim = N - 1;
    let sol = null, murderer = -1;
    for (let t = 0; t < 300 && !sol; t++) {
      const perm = H.shuffle([...Array(N).keys()]);
      const cells = perm.map((c, r) => r * N + c);
      if (cells.some((i) => BLOCKING[obj[i]])) continue;
      const order = H.shuffle(cells); // מי עומד איפה
      const vRoom = roomOf[order[victim]];
      const withVictim = [];
      for (let p = 0; p < victim; p++) if (roomOf[order[p]] === vRoom) withVictim.push(p);
      if (withVictim.length !== 1) continue;
      sol = order; murderer = withVictim[0];
    }
    if (!sol) return null;

    const people = H.shuffle(CHARACTERS).slice(0, N).map((c) => ({ ...c }));
    P.people = people;

    // בחירת רמזים
    const all = [];
    for (let p = 0; p < victim; p++) all[p] = trueClues(P, sol, p, victim);
    const freeCount = obj.filter((o) => !BLOCKING[o]).length;
    const size = (c) => P.facts.filter((f, i) => !BLOCKING[obj[i]] && evalUnary(P, c, i)).length;

    const clues = [];
    for (let p = 0; p < victim; p++) {
      let pool = all[p].filter((c) => c.t !== 'notRoom' && c.t !== 'sameRoom');
      if (diffKey === 'easy') {
        pool.sort((a, b) => size(a) - size(b));
        pool = pool.slice(0, Math.max(1, Math.ceil(pool.length / 2)));
      } else if (diffKey === 'hard') {
        // ברמה קשה מעדיפים רמזים כלליים יותר
        const broad = pool.filter((c) => size(c) >= freeCount / 5);
        if (broad.length) pool = broad;
      }
      clues[p] = [H.pick(pool)];
    }

    for (let guard = 0; guard < 40; guard++) {
      const sols = solve(P, clues, 2);
      if (!sols.length) return null; // לא אמור לקרות
      if (sols.length === 1) break;
      const other = sols[0].every((x, i) => x === sol[i]) ? sols[1] : sols[0];
      const diff = H.shuffle([...Array(victim).keys()].filter((p) => other[p] !== sol[p]))
        .sort((a, b) => clues[a].length - clues[b].length);
      let added = false;
      for (const p of diff) {
        if (clues[p].length >= D.maxClues) continue;
        const have = new Set(clues[p].map(clueKey));
        const excl = all[p].filter((c) => {
          if (have.has(clueKey(c))) return false;
          if (c.t === 'sameRoom') return roomOf[other[c.a]] !== roomOf[other[p]];
          return !evalUnary(P, c, other[p]);
        });
        if (!excl.length) continue;
        // מעדיפים רמזים "טבעיים" על פני "לא בחדר"/"באותו חדר"
        const nice = excl.filter((c) => c.t !== 'notRoom' && c.t !== 'sameRoom');
        const pool = nice.length && R() < 0.75 ? nice : excl;
        clues[p].push(H.pick(pool));
        added = true;
        break;
      }
      if (!added) return null;
    }
    if (solve(P, clues, 2).length !== 1) return null;

    if (D.minimize) {
      for (let p = 0; p < victim; p++) {
        for (let j = clues[p].length - 1; j >= 0 && clues[p].length > 1; j--) {
          const removed = clues[p].splice(j, 1)[0];
          if (solve(P, clues, 2).length !== 1) clues[p].splice(j, 0, removed);
        }
      }
    }

    // אם אין אף רמז "באותו חדר" שמפנה לקורבן, הכול תקין. בונים את הפלט.
    people.forEach((person, p) => {
      person.isVictim = p === victim;
      person.clues = p === victim ? [] : clues[p].map((c) => clueText(P, c, person));
      person.rawClues = p === victim ? [] : clues[p];
    });

    const story = H.pick(STORIES);
    return {
      N, rooms, roomOf, obj, bedPair, walls,
      windows: [...windows],
      facts: P.facts,
      people,
      solution: sol,
      murderer,
      victim,
      title: story[0],
      intro: story[1],
    };
  }

  function generate(seed, diffKey) {
    const R = mulberry32(seed * 2654435761 + 12345);
    const H = makeHelpers(R);
    for (let attempt = 0; attempt < 400; attempt++) {
      const p = tryGenerate(R, H, diffKey);
      if (p) return p;
    }
    throw new Error('לא הצלחתי ליצור תעלומה');
  }

  const API = { generate, solve, evalUnary, BLOCKING, OBJ_NAMES, DIFFICULTY };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.MysteryEngine = API;
})(typeof window !== 'undefined' ? window : globalThis);
