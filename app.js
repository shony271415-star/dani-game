(function () {
  'use strict';
  const E = window.MysteryEngine;
  const $ = (id) => document.getElementById(id);
  const STORE_KEY = 'mystery-grid-v1';

  const DIFFS = [
    { key: 'easy', name: 'Rookie', emoji: '🔎', art: 'logo', sub: '4×4 grid · 3 suspects', seed: 100000 },
    { key: 'medium', name: 'Detective', emoji: '🕵️', art: 'eye', sub: '5×5 grid · 4 suspects', seed: 200000 },
    { key: 'hard', name: 'Inspector', emoji: '🎩', art: 'cap', sub: '6×6 grid · 5 suspects', seed: 300000 },
    { key: 'expert', name: 'Expert', emoji: '🧠', art: 'bulb', sub: '8×8 grid · 7 suspects', seed: 400000 },
    { key: 'extreme', name: 'Extreme', emoji: '💀', art: 'knife', sub: '10×10 grid · 9 suspects · bring coffee', seed: 500000 },
  ];
  DIFFS.forEach((d) => { d.label = d.emoji + ' ' + d.name; });
  const DIFF = Object.fromEntries(DIFFS.map((d) => [d.key, d]));
  const RANKS = [[0, 'Rookie'], [3, 'Junior Detective'], [10, 'Detective'], [25, 'Inspector'], [50, 'Chief Inspector'], [100, 'Legend of the Force']];

  /* ---------- look: emoji edition, or the illustrated edition when art.js is loaded ---------- */
  const ART = window.MysteryArt || null;
  const ic = (name, emoji) => (ART ? `<span class="ic">${ART.ui(name)}</span>` : emoji);
  /* ---------- skin packs sold in the coin shop ---------- */
  const PACKS = [
    { id: 'classic', name: 'Classic Detectives', price: 0, rarity: 'Basic', desc: 'The original cast.', emoji: null },
    { id: 'pets', name: 'Pet Detectives', price: 300, rarity: 'Common', desc: 'Cats, dogs, foxes, owls and more. Paws off the evidence!', emoji: ['🐱', '🐶', '🦊', '🐰', '🐻', '🐼', '🦉', '🐸', '🐯', '🐨'] },
    { id: 'gangsters', name: 'Noir Gangsters', price: 600, rarity: 'Rare', desc: 'Fedoras, trench coats and very dark sunglasses.', emoji: ['🕴️', '🤵', '🤵‍♀️', '🧔‍♂️', '👩‍🦰', '🧑‍💼', '👨‍💼', '👩‍💼'] },
    { id: 'monsters', name: 'Monster Mash', price: 1000, rarity: 'Rare', desc: 'Vampires, mummies, ghosts and one very polite werewolf.', emoji: ['🧛', '🧟', '👻', '🧙', '🧌', '🐺', '🎃', '💀', '🧞'] },
    { id: 'royals', name: 'Royal Court', price: 1600, rarity: 'Epic', desc: 'Crowns, jewels and ermine, in a shimmering gold frame.', emoji: ['🤴', '👸', '🫅', '👑', '🦄', '💎'] },
    { id: 'space', name: 'Space Crew', price: 2500, rarity: 'Epic', desc: 'Astronauts and aliens, framed by the stars.', emoji: ['👩‍🚀', '🧑‍🚀', '👨‍🚀', '👽', '🤖', '👾', '🛸'] },
    { id: 'neon', name: 'Neon Legends', price: 4000, rarity: 'Legendary', desc: 'Glowing neon characters in a pulsing frame.', emoji: ['🌟', '💫', '⚡', '🔮', '🌈', '🪩', '✨'] },
    { id: 'masquerade', name: 'Masquerade Ball', iap: 'skin_masquerade', usd: '$1.99', rarity: 'Premium', desc: 'Venetian masks, feathers and velvet. Comes with a gilded frame.', emoji: ['🎭', '🦚', '🪶', '💃', '🕺', '🎩'] },
    { id: 'cyber', name: 'Cyber Agents', iap: 'skin_cyber', usd: '$2.99', rarity: 'Premium', desc: 'Glowing visors and live scan lines. The flashiest look in the game.', emoji: ['🦾', '🤖', '🕶️', '👾', '💿', '🛰️'] },
  ];
  /* ---------- real-money products, sold through Google Play Billing ---------- */
  const COIN_PACKS = [
    { iap: 'coins_500', coins: 500, usd: '$0.99' },
    { iap: 'coins_1200', coins: 1200, usd: '$1.99', tag: 'Popular' },
    { iap: 'coins_3000', coins: 3000, usd: '$3.99', tag: 'Best value' },
    { iap: 'coins_7500', coins: 7500, usd: '$7.99' },
  ];
  const IAP = {
    service: null, prices: {},
    ids: () => [...COIN_PACKS.map((c) => c.iap), ...PACKS.filter((x) => x.iap).map((x) => x.iap)],
    price(id, fallback) { return this.prices[id] || fallback; },
    async init() {
      // only exists when the game runs as the Google Play app (Trusted Web Activity with Play Billing on)
      if (!('getDigitalGoodsService' in window)) return;
      try {
        this.service = await window.getDigitalGoodsService('https://play.google.com/billing');
        const details = await this.service.getDetails(this.ids());
        for (const d of details) this.prices[d.itemId] = new Intl.NumberFormat(undefined, { style: 'currency', currency: d.price.currency }).format(d.price.value);
        // give back anything bought before (new phone, reinstall) or not finished last time
        for (const pur of await this.service.listPurchases()) await this.grant(pur.itemId, pur.purchaseToken, true);
      } catch (e) { this.service = null; }
    },
    async grant(id, token, restoring) {
      const coinPack = COIN_PACKS.find((c) => c.iap === id), skin = PACKS.find((x) => x.iap === id);
      store.owned = store.owned || ['classic'];
      if (coinPack) {
        store.coins = coins() + coinPack.coins;
        try { await this.service.consume(token); } catch (e) { /* will be retried by listPurchases next launch */ }
      }
      if (skin && !store.owned.includes(skin.id)) { store.owned.push(skin.id); if (!restoring) store.skin = skin.id; }
      store.paid = true;
      save(); renderCoins(); applySkin();
      return coinPack ? `+${coinPack.coins} coins` : skin ? `${skin.name} unlocked` : '';
    },
    async buy(id) {
      if (!this.service) {
        modal(`<div class="big">${ic('phone', '📲')}</div><h2>Available in the app</h2>
          <p>Purchases with real money work in the Google Play version of Mystery Grid.</p>
          <div class="row"><button class="primary" data-act="close">OK</button></div>`);
        return;
      }
      try {
        const req = new PaymentRequest([{ supportedMethods: 'https://play.google.com/billing', data: { sku: id } }],
          { total: { label: 'Total', amount: { currency: 'USD', value: '0' } } });
        const res = await req.show();
        const msg = await this.grant(id, res.details.purchaseToken, false);
        await res.complete('success');
        sfx('unlock'); confetti();
        toast(`<span class="ti">${ic('gift', '🎁')}</span><span><b>Thank you!</b><small>${msg}</small></span>`);
        showShop();
      } catch (e) { /* cancelled or failed: nothing was charged */ }
    },
  };
  const PACK = Object.fromEntries(PACKS.map((x) => [x.id, x]));
  const skinId = () => (store && PACK[store.skin] ? store.skin : 'classic');
  const nameHash = (s) => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };
  function skinEmoji(person, id) {
    const pack = PACK[id || skinId()];
    if (!pack || !pack.emoji) return person.emoji;
    return person.isVictim ? '💀' : pack.emoji[nameHash(person.name + person.letter) % pack.emoji.length];
  }
  const face = (person, id) => (ART ? ART.skinAvatar(person, id || skinId()) : skinEmoji(person, id));
  function applySkin() {
    PACKS.forEach((x) => document.body.classList.toggle('skin-' + x.id, x.id === skinId()));
  }
  const plain = (t) => (ART ? t.replace(/(?:[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B50}\u{2705}]\uFE0F?)\s?/gu, '') : t);
  const stars = (n) => (ART ? [1, 2, 3].map((k) => `<span class="ic star">${ART.ui(k <= n ? 'star' : 'starOff')}</span>`).join('') : '⭐'.repeat(n));

  /* ---------- daily case: same case for everyone on the same day ---------- */
  const DAILY_DIFF = ['hard', 'medium', 'hard', 'hard', 'expert', 'expert', 'extreme']; // Sunday → Saturday
  const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  function today() {
    const d = new Date();
    return { num: Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000), weekday: d.getDay() };
  }
  const dailyLog = () => (store.dailyLog = store.dailyLog || {});
  function dailyStreak() {
    const log = dailyLog(), t = today().num;
    let day = log[t] ? t : t - 1, n = 0;
    while (log[day]) { n++; day--; }
    return n;
  }

  /* ---------- tutorial: a hand-made first case ---------- */
  function tutorialPuzzle() {
    const P = {
      N: 4, tutorial: true,
      theme: { id: 'mansion', name: 'The Mansion', icon: '🏚️', area: 'room', edge: 'window', edgeColor: '#7fc4f0', floor: 'floor', wall: 'beside a wall', center: 'not beside a wall' },
      zones: [{ name: 'Living Room', color: '#cfe0f3' }, { name: 'Kitchen', color: '#fbefc4' }, { name: 'Bedroom', color: '#e6d5ef' }],
      zoneOf: [0, 0, 1, 1, 0, 0, 1, 1, 2, 2, 2, 1, 2, 2, 2, 1],
      obj: ['tv', null, 'table', null, 'plant', 'chair', null, null, null, 'rug', null, null, 'bed', 'bed', null, 'plant'],
      edges: ['3n', '8w'],
      people: [
        { letter: 'A', name: 'Ava', g: 'f', emoji: '👩', color: '#e74c3c', clues: ['She was **sitting on a chair**.'], rawClues: [{ t: 'on', a: 'chair' }] },
        { letter: 'B', name: 'Ben', g: 'm', emoji: '👨', color: '#2980b9', clues: ['He was **lying on a bed**.'], rawClues: [{ t: 'on', a: 'bed' }] },
        { letter: 'C', name: 'Chloe', g: 'f', emoji: '👱‍♀️', color: '#27ae60', clues: ['She was in the **Kitchen**.', 'She was **by a window**.'], rawClues: [{ t: 'zone', a: 1 }, { t: 'edge' }] },
        { letter: 'V', name: 'Victor', g: 'm', emoji: '🧔', color: '#7f1d1d', isVictim: true, clues: [], rawClues: [] },
      ],
      solution: [5, 12, 3, 10], murderer: 1, victim: 3,
      title: 'Your First Case', intro: 'A quiet evening, a loud scream. Let\'s learn the ropes together.',
    };
    return E.finishCustom(P);
  }
  const TUTORIAL = [
    { text: '👋 Welcome, detective! I\'ll walk you through your very first case. Tap <b>Next</b>.', next: true },
    { text: 'This is the <b>crime scene</b>. Thick lines are walls: they split the house into rooms. You <b>can</b> stand on chairs, beds and rugs, but <b>not</b> on tables, plants or TVs.', next: true },
    { text: 'The golden rule: every person was in a <b>different row</b> and a <b>different column</b>, just like sudoku.', next: true },
    { text: '<b>Ava</b> was sitting on a chair. There is only <b>one chair</b> in the house! Tap Ava\'s card below, then tap the chair.', expect: { p: 0, cell: 5 }, card: 0, cells: [5] },
    { text: 'Nice! Ava now owns her row and her column, so nobody else can use them. When you pick another suspect, those squares turn gray.', next: true },
    { text: '<b>Ben</b> was lying on a bed. The bed covers two squares, but one of them is in Ava\'s column. So there is only one choice left. Place Ben!', expect: { p: 1, cell: 12 }, card: 1, cells: [12, 13] },
    { text: '<b>Chloe</b> was in the Kitchen, <b>by a window</b> (the little bar on the outer wall). Only one Kitchen square touches a window. Place Chloe!', expect: { p: 2, cell: 3 }, card: 2, cells: [3] },
    { text: 'The victim is always in the <b>last free square</b>: only one row and one column are left. Place <b>Victor</b> there.', expect: { p: 3, cell: 10 }, card: 3, cells: [10] },
    { text: 'Everyone is in place! Victor was found in the <b>Bedroom</b>. Who else was in the Bedroom? That person is the murderer!' },
  ];

  /* ---------- journey: one endless path of levels that slowly gets harder ---------- */
  const JOURNEY_SEED = 2000000;
  function journeyDiff(n) {
    if (n <= 3) return 'easy';
    if (n <= 10) return 'medium';
    if (n <= 25) return n % 5 === 0 ? 'expert' : 'hard';
    if (n > 50 && n % 5 === 0) return 'extreme';
    return n % 4 === 0 ? 'hard' : 'expert';
  }
  const isBoss = (n) => n > 10 && n % 5 === 0;
  const TIERS = [[4, 'Detective'], [11, 'Inspector'], [26, 'Expert'], [51, 'Extreme bosses']];

  /* ---------- friends & challenges travel as short codes inside links ---------- */
  const b64e = (o) => btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(o)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const b64d = (s) => { try { s = s.replace(/-/g, '+').replace(/_/g, '/'); return JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(s), (c) => c.charCodeAt(0)))); } catch (e) { return null; } };
  const linkFor = (key, payload) => `${location.origin}${location.pathname}#${key}=${b64e(payload)}`;
  function myId() { if (!store.pid) { store.pid = Math.random().toString(36).slice(2, 10); save(); } return store.pid; }
  function myCard() {
    return { i: myId(), n: (store.profile && store.profile.name) || 'Detective', l: prog('journey').caseNum, s: skinId(), d: dailyStreak(), t: totalSolved() };
  }
  async function share(text, url) {
    try { if (navigator.share) { await navigator.share({ title: 'Mystery Grid', text, url }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
    try { await navigator.clipboard.writeText(`${text} ${url}`); toast(`<span class="ti">${ic('check', '✓')}</span><span><b>Link copied!</b><small>Paste it to your friend in any chat.</small></span>`); return; } catch (e) { /* fall through */ }
    modal(`<h2>Send this to a friend</h2><textarea class="name-in share-box" readonly>${esc(text + ' ' + url)}</textarea>
      <div class="row"><button class="primary" data-act="close">Done</button></div>`);
  }
  function seedOf(slot, diff, caseNum) {
    if (slot === 'journey') return JOURNEY_SEED + caseNum;
    if (slot === 'daily') return 1000000 + caseNum;
    if (slot === 'challenge') return caseNum;
    return DIFF[diff].seed + caseNum;
  }

  /* ---------- coins ---------- */
  const COIN_BASE = { easy: 10, medium: 15, hard: 20, expert: 30, extreme: 50 };
  const COST = { clue: 20, check: 10, reveal: 50 };
  const BONUS = [10, 15, 20, 25, 30, 40, 60];
  const coinIc = () => ic('coin', '🪙');

  /* ---------- achievements ---------- */
  const ACH = [
    { id: 'first', name: 'First Case', desc: 'Solve your first case', test: () => totalSolved() >= 1 },
    { id: 'ten', name: 'Seasoned Sleuth', desc: 'Solve 10 cases', test: () => totalSolved() >= 10 },
    { id: 'fifty', name: 'Case Cracker', desc: 'Solve 50 cases', test: () => totalSolved() >= 50 },
    { id: 'week', name: 'Week of Crime', desc: 'Keep a 7-day daily streak', test: () => dailyStreak() >= 7 },
    { id: 'month', name: 'Monthly Mastermind', desc: 'Keep a 30-day daily streak', test: () => dailyStreak() >= 30 },
    { id: 'clean', name: 'No Peeking', desc: 'Solve an Inspector case or harder without any help', test: (c) => c && c.clean && ['hard', 'expert', 'extreme'].includes(c.diff) },
    { id: 'expert', name: 'Expert Witness', desc: 'Solve an Expert case', test: (c) => c && c.diff === 'expert' },
    { id: 'extreme', name: 'Extreme Measures', desc: 'Solve an Extreme case', test: (c) => c && c.diff === 'extreme' },
    { id: 'speedy', name: 'Speed Sleuth', desc: 'Solve a Rookie case in under a minute', test: (c) => c && c.diff === 'easy' && c.time < 60 },
    { id: 'globe', name: 'Globetrotter', desc: 'Solve a case in all 9 scenes', test: () => (store.themesSolved || []).length >= 9 },
    { id: 'level25', name: 'Halfway Hero', desc: 'Reach level 25 on the journey', test: () => prog('journey').caseNum > 25 },
    { id: 'rich', name: 'Treasure Hunter', desc: 'Hold 500 coins at once', test: () => (store.coins || 0) >= 500 },
  ];

  /* ---------- sound, vibration, confetti ---------- */
  let audio = null;
  const getAudio = () => (audio = audio || new (window.AudioContext || window.webkitAudioContext)());
  // iPhone/iPad: Safari only allows sound after a touch, and can suspend it in the background.
  // The first touch anywhere wakes the audio up by playing a tiny silent sound.
  function unlockAudio() {
    try {
      const ac = getAudio();
      if (ac.state !== 'running') ac.resume();
      const src = ac.createBufferSource();
      src.buffer = ac.createBuffer(1, 1, 22050);
      src.connect(ac.destination); src.start(0);
    } catch (e) { /* no audio available */ }
  }
  ['touchend', 'pointerdown', 'keydown'].forEach((ev) => document.addEventListener(ev, unlockAudio, { once: true, capture: true }));
  document.addEventListener('visibilitychange', () => { if (!document.hidden && audio && audio.state !== 'running') audio.resume().catch(() => {}); });

  // Vibration: Android supports navigator.vibrate. iPhone doesn't, but since iOS 18 toggling a
  // switch-style checkbox plays the system's light haptic tap, so a hidden one is used there.
  let hapticSwitch = null;
  function iosHaptic() {
    if (!hapticSwitch) {
      hapticSwitch = document.createElement('label');
      hapticSwitch.setAttribute('aria-hidden', 'true');
      hapticSwitch.style.cssText = 'position:fixed;left:-200px;top:0;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none';
      const input = document.createElement('input');
      input.type = 'checkbox'; input.setAttribute('switch', ''); input.tabIndex = -1;
      hapticSwitch.appendChild(input);
      document.body.appendChild(hapticSwitch);
    }
    hapticSwitch.click();
  }
  function haptic(kind) {
    if (kind === 'tick') return;
    if (navigator.vibrate) { navigator.vibrate(kind === 'wrong' ? 40 : kind === 'win' ? [30, 50, 30] : 12); return; }
    if (/iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
      iosHaptic();
      if (kind === 'win' || kind === 'wrong') setTimeout(iosHaptic, 120);
    }
  }

  function sfx(kind) {
    if (store.sound === false) return;
    try {
      getAudio();
      if (audio.state !== 'running') audio.resume().catch(() => {});
      const notes = {
        place: [[660, 0, 0.07], [990, 0.05, 0.08]], tick: [[1400, 0, 0.03]], wrong: [[190, 0, 0.16]],
        coin: [[1320, 0, 0.07], [1760, 0.07, 0.12]], win: [[523, 0, 0.12], [659, 0.1, 0.12], [784, 0.2, 0.12], [1047, 0.3, 0.3]],
        unlock: [[784, 0, 0.1], [1047, 0.1, 0.1], [1319, 0.2, 0.22]],
      }[kind] || [];
      const t0 = audio.currentTime;
      for (const [f, at, dur] of notes) {
        const o = audio.createOscillator(), g = audio.createGain();
        o.type = kind === 'wrong' ? 'square' : 'sine';
        o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t0 + at);
        g.gain.exponentialRampToValueAtTime(kind === 'tick' ? 0.04 : 0.13, t0 + at + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + at + dur);
        o.connect(g).connect(audio.destination);
        o.start(t0 + at); o.stop(t0 + at + dur + 0.02);
      }
    } catch (e) { /* no audio available */ }
    haptic(kind);
  }
  function confetti() {
    const cv = document.createElement('canvas');
    cv.className = 'confetti';
    cv.width = innerWidth * devicePixelRatio; cv.height = innerHeight * devicePixelRatio;
    document.body.appendChild(cv);
    const ctx = cv.getContext('2d'), cols = ['#f6c85f', '#f4a3b5', '#8fd3f4', '#9ee6c9', '#a88be0', '#e8615a'];
    const parts = Array.from({ length: 140 }, () => ({
      x: cv.width / 2 + (Math.random() - 0.5) * cv.width * 0.3, y: cv.height * 0.35,
      vx: (Math.random() - 0.5) * 22 * devicePixelRatio, vy: (-Math.random() * 20 - 6) * devicePixelRatio,
      s: (5 + Math.random() * 7) * devicePixelRatio, r: Math.random() * 6, c: cols[Math.floor(Math.random() * cols.length)],
    }));
    let f = 0;
    (function step() {
      ctx.clearRect(0, 0, cv.width, cv.height);
      for (const p of parts) {
        p.vy += 0.55 * devicePixelRatio; p.x += p.vx; p.y += p.vy; p.vx *= 0.99; p.r += 0.15;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); ctx.restore();
      }
      if (++f < 110) requestAnimationFrame(step); else cv.remove();
    })();
  }
  let toastQ = [], toastOn = false;
  function toast(html) {
    toastQ.push(html);
    if (toastOn) return;
    const next = () => {
      const h = toastQ.shift();
      if (!h) { toastOn = false; return; }
      toastOn = true;
      const el = document.createElement('div');
      el.className = 'toast'; el.innerHTML = h;
      document.body.appendChild(el);
      sfx('unlock');
      setTimeout(() => el.classList.add('out'), 2600);
      setTimeout(() => { el.remove(); next(); }, 3000);
    };
    next();
  }

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
  let storageOk = true;
  function save() {
    store.rev = Date.now();
    try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); storageOk = true; } catch (e) { storageOk = false; }
  }
  // Another window (or the installed app) may have saved newer progress: adopt it before the player does anything,
  // so an old window left open in the background can never overwrite it.
  function refreshFromDisk() {
    let disk = null;
    try { disk = JSON.parse(localStorage.getItem(STORE_KEY)); } catch (e) { return false; }
    if (!disk || !(disk.rev > (store.rev || 0))) return false;
    Object.keys(store).forEach((k) => delete store[k]);
    Object.assign(store, disk);
    return true;
  }
  function onStoreChanged() {
    if (!refreshFromDisk()) return;
    applySkin(); renderCoins();
    if ($('home').classList.contains('active')) showHome();
    else if ($('map').classList.contains('active')) showMap();
  }
  window.addEventListener('storage', (e) => { if (e.key === STORE_KEY) onStoreChanged(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) onStoreChanged(); });
  window.addEventListener('focus', onStoreChanged);
  window.addEventListener('pageshow', onStoreChanged);
  function prog(slot) {
    const diff = slot;
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

  function buildCase(diff, caseNum, cb, seedOverride) {
    const seed = seedOverride || DIFF[diff].seed + caseNum;
    if (worker) {
      const id = ++reqId;
      pending[id] = (p) => (p ? cb(p) : cb(E.generate(seed, diff)));
      worker.postMessage({ id, seed, diff });
    } else {
      setTimeout(() => cb(E.generate(seed, diff)), 30);
    }
  }
  function prefetchNext(slot, caseNum) {
    const p = prog(slot), n = caseNum + 1;
    if (p.next && p.next.caseNum === n) return;
    const journey = slot === 'journey';
    buildCase(journey ? journeyDiff(n) : slot, n, (puzzle) => {
      prog(slot).next = { caseNum: n, puzzle };
      save();
    }, journey ? JOURNEY_SEED + n : undefined);
  }

  /* ---------- profile ---------- */
  function totalSolved() { return DIFFS.reduce((n, d) => n + prog(d.key).solved, 0) + prog('journey').solved + Object.keys(store.dailyLog || {}).length; }
  function coins() { if (typeof store.coins !== 'number') store.coins = 100; return store.coins; }
  function addCoins(n) { coins(); store.coins += n; save(); renderCoins(); }
  function renderCoins() { const el = $('coins-pill'); if (el) el.innerHTML = `${coinIc()} <b>${coins()}</b><span class="cp-shop">SHOP</span>`; }
  function checkAchievements(ctx) {
    store.ach = store.ach || {};
    for (const x of ACH) {
      if (store.ach[x.id] || !x.test(ctx)) continue;
      store.ach[x.id] = today().num;
      store.coins = coins() + 50;
      toast(`<span class="ti">${ic('medal', '🏅')}</span><span><b>${x.name}</b><small>${x.desc} · +50 ${ART ? 'coins' : '🪙'}</small></span>`);
    }
    save(); renderCoins();
  }
  function rankName() {
    const t = totalSolved();
    let r = RANKS[0][1];
    for (const [n, name] of RANKS) if (t >= n) r = name;
    return r;
  }
  function askProfile() {
    modal(`<div class="big">${ic('logo', '🕵️')}</div><h2>Who's on the case?</h2>
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
    const firstTime = !store.profile;
    store.profile = { name };
    save(); closeModal(); showHome();
    if (pendingLink) return handleLink();
    if (firstTime && !store.tutorialDone && !totalSolved()) offerTutorial();
  }
  function renderGreet() {
    const el = $('greet');
    if (!store.profile) { el.innerHTML = '<b>Tap here to sign in</b>'; return; }
    const t = totalSolved();
    el.innerHTML = `<b>Hello, ${esc(store.profile.name)}! ${ic('wave', '👋')}</b>
      <div>Rank: ${rankName()} · ${t === 1 ? '1 case solved' : t ? t + ' cases solved' : 'no cases solved yet'}</div>
      <small>Tap to change name</small>`;
  }

  /* ---------- home ---------- */
  function showHome() {
    stopTimer();
    $('map').classList.remove('active');
    $('home').classList.add('active');
    $('game').classList.remove('active');
    renderGreet();
    renderCoins();
    renderJourney();
    renderDaily();
    renderShopCard();
    $('sound-btn').innerHTML = `${ic(store.sound === false ? 'mute' : 'sound', store.sound === false ? '🔇' : '🔊')} Sound`;
    const got = Object.keys(store.ach || {}).length;
    $('ach-btn').innerHTML = `${ic('trophy', '🏆')} Trophies ${got}/${ACH.length}`;
    $('shop-btn').innerHTML = `${ic('coin', '🛍️')} Shop`;
    $('backup-btn').innerHTML = `${ic('lock', '💾')} Save progress`;
    renderStorageNote();
    setTimeout(maybeDailyBonus, 350);
    $('diffs').innerHTML = DIFFS.map((d) => {
      const p = prog(d.key);
      const badge = p.cur ? 'In progress' : p.solved ? `${p.solved} solved` : 'New!';
      return `<button class="diff-btn ${d.key === 'extreme' ? 'extreme' : ''}" data-diff="${d.key}">
        <span>${ART ? `<span class="ic dic">${ART.ui(d.art)}</span>${d.name}` : d.label}<small>${d.sub}</small></span><span class="badge">${badge}</span></button>`;
    }).join('');
    $('diffs').querySelectorAll('.diff-btn').forEach((b) => b.addEventListener('click', () => startGame(b.dataset.diff)));
  }

  function renderJourney() {
    const p = prog('journey'), n = p.caseNum, diff = journeyDiff(n), d = DIFF[diff];
    const tier = TIERS.find(([lv]) => lv > n);
    const prev = [...TIERS].reverse().find(([lv]) => lv <= n);
    const from = prev ? prev[0] : 1, pct = tier ? Math.round(((n - from) / (tier[0] - from)) * 100) : 100;
    const going = p.cur && p.cur.caseNum === n;
    $('journey').innerHTML = `<button class="play-card${isBoss(n) ? ' boss' : ''}" id="play-btn">
        <span class="pc-ic">${ic('play', '▶️')}</span>
        <span class="pc-tx"><b>${going ? 'Continue' : 'Play'}</b><small>Level ${n} · ${d.name}${isBoss(n) ? ' · BOSS' : ''}</small></span>
        <span class="lvl-badge">${n}</span>
      </button>
      <div class="journey-bar"><div style="width:${pct}%"></div></div>
      <div class="streak">${tier ? `${tier[0] - n} level${tier[0] - n === 1 ? '' : 's'} to ${tier[1]}` : 'Boss levels every 5 · how far can you go?'} · <button class="mini-link" id="map-btn">Map${(store.friends || []).length ? ` & ${(store.friends || []).length} friend${(store.friends || []).length > 1 ? 's' : ''}` : ''}</button></div>`;
    $('play-btn').addEventListener('click', startJourney);
    $('map-btn').addEventListener('click', showMap);
  }

  function renderStorageNote() {
    let el = $('storage-note');
    if (!el) { el = document.createElement('div'); el.id = 'storage-note'; $('greet').insertAdjacentElement('afterend', el); }
    const installed = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    let msg = '';
    if (!storageOk) msg = `<b>This browser is not saving your progress</b> (private mode or storage blocked). Open the game in your normal browser, or use <button class="mini-link" data-note="backup">Save progress</button>.`;
    else if (!installed && totalSolved() >= 2) msg = ios
      ? `Playing in Safari? iPhone can erase a website's saved progress after a week away. <button class="mini-link" data-note="install">Add to Home Screen</button> to keep it safe, or <button class="mini-link" data-note="backup">save a backup code</button>.`
      : `Your progress is saved in this browser only. <button class="mini-link" data-note="backup">Save a backup code</button> to keep it safe.`;
    el.className = msg ? 'storage-note' : '';
    el.innerHTML = msg;
    el.querySelectorAll('[data-note]').forEach((b) => b.addEventListener('click', () => (b.dataset.note === 'backup' ? showBackup() : $('install-btn').click())));
  }

  function renderShopCard() {
    let el = $('shop-card');
    if (!el) {
      el = document.createElement('div');
      el.id = 'shop-card';
      $('daily').insertAdjacentElement('afterend', el);
    }
    const have = store.owned || ['classic'], owned = have.length;
    const next = PACKS.find((x) => !x.iap && !have.includes(x.id)) || PACKS.find((x) => !have.includes(x.id));
    el.innerHTML = `<button class="shop-card" id="shop-card-btn">
        <span class="sc-faces">${SHOP_PEOPLE.slice(0, 3).map((p) => `<span class="pf skin-${next ? next.id : skinId()}">${face(p, next ? next.id : skinId())}</span>`).join('')}</span>
        <span class="sc-tx"><b>Detective Shop</b><small>${next ? `New look: ${next.name} · ${next.iap ? IAP.price(next.iap, next.usd) : next.price.toLocaleString('en') + ' coins'}` : 'You own every pack!'} · ${owned}/${PACKS.length} owned</small></span>
        <span class="badge">Open</span>
      </button>`;
    $('shop-card-btn').addEventListener('click', showShop);
  }

  /* ---------- backup code: move progress to another phone or browser ---------- */
  const BACKUP_KEYS = ['profile', 'coins', 'owned', 'skin', 'journey', 'jStars', 'easy', 'medium', 'hard', 'expert', 'extreme', 'daily', 'dailyLog', 'ach', 'trophies',
    'themesSolved', 'friends', 'bonusDay', 'bonusStreak', 'pid', 'sound', 'seenHowto', 'tutorialDone', 'paid', 'engine'];
  function backupCode() {
    const o = {};
    BACKUP_KEYS.forEach((k) => { if (store[k] !== undefined) o[k] = store[k]; });
    // in-progress boards are not worth carrying over
    ['journey', 'easy', 'medium', 'hard', 'expert', 'extreme', 'daily'].forEach((k) => { if (o[k]) o[k] = { ...o[k], cur: null, next: null }; });
    return 'MG1.' + b64e(o);
  }
  function restoreCode(code) {
    const m = String(code).trim().match(/MG1\.([A-Za-z0-9_-]+)/), o = m && b64d(m[1]);
    if (!o || typeof o !== 'object' || !o.profile) return false;
    // never lose progress: keep whichever side is further along
    const mine = prog('journey').caseNum, theirs = (o.journey && o.journey.caseNum) || 1;
    if (theirs < mine && !confirm(`This backup is on level ${theirs}, but you are on level ${mine}. Replace your progress anyway?`)) return null;
    Object.keys(store).forEach((k) => delete store[k]);
    Object.assign(store, o, { engine: E.VERSION });
    save(); applySkin();
    return true;
  }
  function showBackup() {
    const code = backupCode();
    modal(`<div class="big">${ic('lock', '💾')}</div><h2>Save your progress</h2>
      <p><small>Your progress lives on this phone. If you switch phones, reinstall, or open the game in a different browser, use this code to bring it back.</small></p>
      <textarea class="name-in share-box" id="backup-box" readonly>${code}</textarea>
      <div class="row"><button class="primary" data-act="copy">Copy code</button><button class="secondary" data-act="send">Send to myself</button></div>
      <p class="restore-h"><b>Restore from a code</b></p>
      <textarea class="name-in share-box" id="restore-box" placeholder="Paste a code that starts with MG1."></textarea>
      <div class="row"><button class="secondary" data-act="restore">Restore</button><button class="secondary" data-act="close">Close</button></div>
      <p id="bk-msg" class="acc-msg"></p>`, {
      copy: async (b) => { try { await navigator.clipboard.writeText(code); b.textContent = 'Copied ✓'; } catch (e) { $('backup-box').select(); b.textContent = 'Select & copy ↑'; } },
      send: () => share('My Mystery Grid progress backup (paste it in Settings → Save progress → Restore):', code),
      restore: () => {
        const r = restoreCode($('restore-box').value);
        if (r === true) { closeModal(); showHome(); toast(`<span class="ti">${ic('check', '✓')}</span><span><b>Progress restored!</b><small>Level ${prog('journey').caseNum}, ${coins()} coins.</small></span>`); }
        else if (r === false) { $('bk-msg').textContent = 'That code does not look right. Copy the whole thing, starting with MG1.'; shake($('modal-body')); }
      },
    });
  }

  /* ---------- the journey map ---------- */
  function showMap() {
    stopTimer();
    $('home').classList.remove('active'); $('game').classList.remove('active'); $('map').classList.add('active');
    const cur = prog('journey').caseNum, stars = store.jStars || {};
    const lo = Math.max(1, cur - 30), hi = cur + 30, GAP = 96;
    const W = Math.min(window.innerWidth, 480), H = (hi - lo + 1) * GAP + 180;
    const X = (n) => W / 2 + Math.sin(n * 0.9) * W * 0.27, Y = (n) => H - 110 - (n - lo) * GAP;
    const pathFor = (from, to) => {
      let d = `M${X(from)} ${Y(from)}`;
      for (let n = from + 1; n <= to; n++) d += ` Q${X(n - 1)} ${(Y(n - 1) + Y(n)) / 2} ${X(n)} ${Y(n)}`;
      return d;
    };
    let html = `<svg class="map-path" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
      <path d="${pathFor(lo, hi)}" class="mp-todo"/>${cur > lo ? `<path d="${pathFor(lo, Math.min(cur, hi))}" class="mp-done"/>` : ''}</svg>`;
    const me = { name: (store.profile && store.profile.name) || 'You', g: 'f', letter: 'Me', color: '#d9a441', emoji: '🕵️' };
    const friendsAt = {};
    (store.friends || []).forEach((f) => { (friendsAt[Math.min(Math.max(f.l, lo), hi)] = friendsAt[Math.min(Math.max(f.l, lo), hi)] || []).push(f); });
    for (let n = lo; n <= hi; n++) {
      const x = X(n), y = Y(n), boss = isBoss(n), done = n < cur, now = n === cur;
      const th = E.themeFor(JOURNEY_SEED + n);
      const cls = `node${done ? ' done' : now ? ' cur' : ' locked'}${boss ? ' boss' : ''}`;
      const st = done ? `<span class="nstars">${[1, 2, 3].map((k) => `<i class="${k <= (stars[n] || 1) ? 'on' : ''}">★</i>`).join('')}</span>` : '';
      html += `<button class="${cls}" data-n="${n}" style="left:${x}px;top:${y}px">${boss && !done ? `<span class="nb">BOSS</span>` : ''}<b>${n}</b>${st}</button>`;
      const side = Math.sin(n * 0.9) > 0 ? -1 : 1;
      html += `<span class="theme-dec" style="left:${x + side * 62}px;top:${y}px" title="${th.name}">${ART ? ART.theme(th.id) : th.icon}</span>`;
      const tier = TIERS.find(([lv]) => lv === n);
      if (tier) html += `<div class="tier-banner" style="top:${y + GAP / 2 + 6}px">${DIFF[journeyDiff(n)].name} zone</div>`;
      if (now) html += `<span class="me-pin" style="left:${x}px;top:${y - 58}px"><span class="pin-face">${face(me)}</span><small>You</small></span>`;
      (friendsAt[n] || []).forEach((f, k) => {
        const fp = { name: f.n, g: 'f', letter: f.n[0], color: '#7aa7ff', emoji: '🙂' };
        html += `<span class="friend-pin" style="left:${x + side * -1 * (52 + k * 30)}px;top:${y - 6}px"><span class="pin-face">${face(fp, PACK[f.s] ? f.s : 'classic')}</span><small>${esc(f.n)}${f.l > hi ? ' ↑' + f.l : f.l < lo ? ' ↓' + f.l : ''}</small></span>`;
      });
    }
    $('map-canvas').style.width = W + 'px'; $('map-canvas').style.height = H + 'px';
    $('map-canvas').innerHTML = html;
    $('map-friends').textContent = `Friends (${(store.friends || []).length})`;
    $('map-canvas').querySelectorAll('.node').forEach((b) => b.addEventListener('click', () => {
      const n = +b.dataset.n;
      if (n === cur) return startJourney();
      if (n < cur) toast(`<span class="ti">${ic('star', '⭐')}</span><span><b>Level ${n}</b><small>Solved with ${stars[n] || 1} star${(stars[n] || 1) > 1 ? 's' : ''}.</small></span>`);
      else toast(`<span class="ti">${ic('lock', '🔒')}</span><span><b>Level ${n}</b><small>Solve level ${cur} first.</small></span>`);
    }));
    requestAnimationFrame(() => window.scrollTo(0, Math.max(0, Y(cur) - window.innerHeight * 0.55 + $('map-canvas').offsetTop)));
  }

  /* ---------- friends ---------- */
  function addFriend(card, quiet) {
    if (!card || !card.i || !card.n || card.i === myId()) return false;
    store.friends = store.friends || [];
    const f = { i: String(card.i).slice(0, 12), n: String(card.n).slice(0, 18), l: Math.max(1, Math.min(1e7, +card.l || 1)), s: PACK[card.s] ? card.s : 'classic', d: +card.d || 0, t: +card.t || 0, at: today().num };
    const k = store.friends.findIndex((x) => x.i === f.i);
    if (k >= 0) store.friends[k] = f; else store.friends.push(f);
    save();
    if (!quiet) toast(`<span class="ti">${ic('hand', '🤝')}</span><span><b>${esc(f.n)} ${k >= 0 ? 'updated' : 'added'}!</b><small>Level ${f.l} on the journey map.</small></span>`);
    return true;
  }
  function showFriends() {
    const list = (store.friends || []).sort((x, y) => y.l - x.l).map((f) => {
      const fp = { name: f.n, g: 'f', letter: f.n[0], color: '#7aa7ff', emoji: '🙂' };
      const age = today().num - (f.at || today().num);
      return `<div class="friend-row"><span class="pf skin-${f.s}">${face(fp, f.s)}</span><div><b>${esc(f.n)}</b><small>Level ${f.l} · ${f.t} cases · ${f.d}-day streak · updated ${age ? age + 'd ago' : 'today'}</small></div>
        <button class="mini-x" data-act="rm" data-id="${f.i}" aria-label="Remove">✕</button></div>`;
    }).join('') || '<p><small>No friends yet. Send your link to a friend, and ask for theirs!</small></p>';
    modal(`<div class="big">${ic('hand', '🤝')}</div><h2>Friends</h2>
      <p><small>You're on level <b>${prog('journey').caseNum}</b>. Send your link so friends see you on their map. Send it again whenever you want them to see your new progress.</small></p>
      <div class="friend-list">${list}</div>
      <div class="row"><button class="primary" data-act="mine">Send my link</button><button class="secondary" data-act="add">Add a friend</button></div>
      <div class="row"><button class="secondary" data-act="close">Close</button></div>`, {
      mine: () => share(`Join me on Mystery Grid! I'm on level ${prog('journey').caseNum}. Open this link to add me as a friend (on iPhone with the app installed: copy it and paste it in Map → Friends → Add a friend):`, linkFor('friend', myCard())),
      add: () => {
        modal(`<h2>Add a friend</h2><p><small>Paste the link (or code) your friend sent you.</small></p>
          <textarea class="name-in share-box" id="friend-in" placeholder="https://…#friend=…"></textarea>
          <div class="row"><button class="primary" data-act="ok">Add</button><button class="secondary" data-act="back">Back</button></div>`, {
          ok: () => {
            const raw = $('friend-in').value.trim(), m = raw.match(/friend=([A-Za-z0-9_-]+)/), card = b64d(m ? m[1] : raw);
            if (!addFriend(card, true)) { shake($('modal-body')); return; }
            if ($('map').classList.contains('active')) showMap();
            offerShareBack(card.n, '');
          },
          back: showFriends,
        });
      },
      rm: (b) => { store.friends = (store.friends || []).filter((x) => x.i !== b.dataset.id); save(); showFriends(); if ($('map').classList.contains('active')) showMap(); },
    });
  }

  // friendship goes one way (no server), so right after adding someone, offer to send our link back
  function offerShareBack(name, code) {
    const inApp = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    const iosBrowser = /iphone|ipad|ipod/i.test(navigator.userAgent) && !inApp;
    modal(`<div class="big">${ic('hand', '🤝')}</div><h2>${esc(name)} is your friend!</h2>
      <p>${esc(name)} is now on your map. To show up on <b>${esc(name)}'s</b> map too, send your link back.</p>
      ${iosBrowser ? `<div class="ios-note"><b>Using the installed app on iPhone?</b> This link opened in Safari, which keeps its own copy of the game. Open the app, go to <b>Map → Friends → Add a friend</b> and paste the same link there.
        <button class="secondary" data-act="copy">Copy this friend's link</button></div>` : ''}
      <div class="row"><button class="primary" data-act="back">Send my link to ${esc(name)}</button><button class="secondary" data-act="close">Later</button></div>`, {
      back: () => { closeModal(); share(`Hey ${name}, add me back on Mystery Grid! I'm on level ${prog('journey').caseNum}:`, linkFor('friend', myCard())); },
      copy: async (b) => {
        try { await navigator.clipboard.writeText(`${location.origin}${location.pathname}#friend=${code}`); b.textContent = 'Copied! Now paste it in the app'; } catch (e) { b.textContent = 'Copy failed: long-press the link in WhatsApp and copy it'; }
      },
    });
  }

  /* ---------- challenges: same case, who is faster? ---------- */
  let pendingChallenge = null;
  function startChallenge(c) {
    if (!c || !DIFF[c.diff] || !c.seed) return;
    addFriend({ i: c.i, n: c.n, l: c.l, s: c.s, d: c.d, t: c.tt }, true);
    pendingChallenge = c;
    const p = prog('challenge');
    const go = (puzzle) => { $('loading').classList.remove('show'); begin(c.diff, c.seed, puzzle, 'challenge'); };
    if (p.cur && p.cur.caseNum === c.seed && p.cur.puzzle) return go(p.cur.puzzle);
    $('loading-text').textContent = `Opening ${c.n}'s challenge…`;
    $('loading').classList.add('show');
    buildCase(c.diff, c.seed, go, c.seed);
  }
  function challengeLink() {
    const card = myCard();
    return linkFor('challenge', { i: card.i, n: card.n, l: card.l, s: card.s, d: card.d, tt: card.t, diff: S.diff, seed: seedOf(S.slot === 'challenge' ? 'challenge' : S.slot, S.diff, S.caseNum), time: S.elapsed, title: S.P.title });
  }

  function maybeDailyBonus() {
    if (!store.profile || $('modal').classList.contains('show') || !$('home').classList.contains('active')) return;
    const t = today().num;
    if (store.bonusDay === t) return;
    const streak = store.bonusDay === t - 1 ? (store.bonusStreak || 0) + 1 : 1;
    const idx = (streak - 1) % 7, reward = BONUS[idx];
    const days = BONUS.map((c, k) => `<div class="bday${k < idx ? ' got' : ''}${k === idx ? ' now' : ''}"><small>Day ${k + 1}</small>${k < idx ? ic('check', '✓') : coinIc()}<b>${c}</b></div>`).join('');
    modal(`<div class="big">${ic('gift', '🎁')}</div><h2>Daily gift!</h2>
      <p>Come back every day for a bigger gift.</p><div class="bonus-row">${days}</div>
      <div class="row"><button class="primary" data-act="take">Collect +${reward} ${ART ? 'coins' : '🪙'}</button></div>`, {
      take: () => {
        store.bonusDay = t; store.bonusStreak = streak;
        addCoins(reward); sfx('coin'); closeModal();
        checkAchievements();
      },
    }, true);
  }

  function showCalendar() {
    const now = new Date(), y = now.getFullYear(), m = now.getMonth(), t = today().num, log = dailyLog();
    const first = new Date(y, m, 1).getDay(), days = new Date(y, m + 1, 0).getDate();
    const dn = (d) => Math.floor(Date.UTC(y, m, d) / 86400000);
    let cellsHtml = ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((x) => `<div class="cal-h">${x}</div>`).join('') + '<div></div>'.repeat(first);
    let solved = 0;
    for (let d = 1; d <= days; d++) {
      const k = dn(d), done = !!log[k];
      if (done) solved++;
      cellsHtml += `<div class="cal-d${done ? ' done' : ''}${k === t ? ' today' : ''}${k > t ? ' future' : ''}">${done ? ic('star', '⭐') : ''}<span>${d}</span></div>`;
    }
    const monthName = now.toLocaleString('en', { month: 'long' });
    const won = (store.trophies || {})[`${y}-${m + 1}`];
    modal(`<h2>${monthName} cases</h2><div class="cal">${cellsHtml}</div>
      <p><b>${solved}</b> of ${days} days solved.</p>
      <p class="cal-tro">${ic(won ? 'trophy' : 'trophyOff', '🏆')} ${won ? `You won the ${monthName} trophy!` : `Solve every daily case this month to win the ${monthName} trophy.`}</p>
      <div class="row"><button class="primary" data-act="close">Close</button></div>`);
  }

  const SHOP_PEOPLE = [
    { name: 'Ava', g: 'f', letter: 'A', color: '#e74c3c', emoji: '👩' }, { name: 'Ben', g: 'm', letter: 'B', color: '#2980b9', emoji: '👨' },
    { name: 'Chloe', g: 'f', letter: 'C', color: '#27ae60', emoji: '👱‍♀️' }, { name: 'Victor', g: 'm', letter: 'V', color: '#7f1d1d', emoji: '🧔', isVictim: true },
  ];
  function showShop() {
    store.owned = store.owned || ['classic'];
    const coinCards = COIN_PACKS.map((c) => `<button class="coin-pack" data-act="iap" data-id="${c.iap}">
        ${c.tag ? `<span class="cp-tag">${c.tag}</span>` : ''}<span class="cp-ic">${coinIc()}</span><b>${c.coins.toLocaleString('en')}</b><span class="cp-price">${IAP.price(c.iap, c.usd)}</span></button>`).join('');
    const cards = PACKS.map((x) => {
      const owned = store.owned.includes(x.id), on = skinId() === x.id, short = (x.price || 0) - coins();
      const btn = on ? '<button class="secondary" disabled>Equipped ✓</button>'
        : owned ? `<button class="primary" data-act="equip" data-id="${x.id}">Equip</button>`
        : x.iap ? `<button class="primary premium-btn" data-act="iap" data-id="${x.iap}">Buy for ${IAP.price(x.iap, x.usd)}</button>`
        : short > 0 ? `<button class="secondary" disabled>${coinIc()} ${x.price.toLocaleString('en')} · need ${short.toLocaleString('en')} more</button>`
        : `<button class="primary" data-act="buy" data-id="${x.id}">Buy for ${coinIc()} ${x.price.toLocaleString('en')}</button>`;
      return `<div class="pack rar-${x.rarity.toLowerCase()}${on ? ' on' : ''}">
        <div class="pk-top"><b>${x.name}</b><span class="rar">${x.rarity}</span></div>
        <div class="pk-faces">${SHOP_PEOPLE.map((p) => `<span class="pf skin-${x.id}">${face(p, x.id)}</span>`).join('')}</div>
        <small>${x.desc}</small>${btn}</div>`;
    }).join('');
    modal(`<h2>${ic('coin', '🪙')} Detective Shop</h2><p>You have ${coinIc()} <b>${coins()}</b> coins. New looks for every suspect and victim.</p>
      <div class="shop-list"><div class="shop-h">Get coins</div><div class="coin-packs">${coinCards}</div><div class="shop-h">Skin packs</div>${cards}</div>
      <div class="row"><button class="secondary" data-act="close">Close</button></div>`, {
      buy: (b) => {
        const x = PACK[b.dataset.id];
        if (!x || coins() < x.price) return;
        store.coins -= x.price; store.owned.push(x.id); store.skin = x.id; save();
        applySkin(); renderCoins(); sfx('unlock'); confetti();
        showShop();
        toast(`<span class="ti">${ic('gift', '🎁')}</span><span><b>${x.name} unlocked!</b><small>Equipped on every suspect.</small></span>`);
      },
      equip: (b) => { store.skin = b.dataset.id; save(); applySkin(); sfx('coin'); showShop(); },
      iap: (b) => IAP.buy(b.dataset.id),
    });
  }

  function showTrophies() {
    store.ach = store.ach || {};
    const list = ACH.map((x) => `<div class="ach${store.ach[x.id] ? ' got' : ''}">${ic(store.ach[x.id] ? 'medal' : 'trophyOff', store.ach[x.id] ? '🏅' : '🔒')}<div><b>${x.name}</b><small>${x.desc}</small></div></div>`).join('');
    const months = Object.keys(store.trophies || {});
    modal(`<div class="big">${ic('trophy', '🏆')}</div><h2>Trophy room</h2>
      <div class="ach-list">${list}</div>
      ${months.length ? `<p><b>Monthly trophies:</b> ${months.map((k) => new Date(k.split('-')[0], k.split('-')[1] - 1, 1).toLocaleString('en', { month: 'short', year: 'numeric' })).join(', ')}</p>` : ''}
      <p><small>Each trophy is worth 50 coins.</small></p>
      <div class="row"><button class="primary" data-act="close">Close</button></div>`);
  }

  function renderDaily() {
    const t = today(), diff = DAILY_DIFF[t.weekday], d = DIFF[diff];
    const done = dailyLog()[t.num], p = prog('daily'), streak = dailyStreak();
    const status = done ? `<span class="dc-done">✓ ${fmtTime(done.t)}</span>` : p.cur && p.cur.caseNum === t.num ? 'Continue' : 'Play';
    $('daily').innerHTML = `<button class="daily-card" id="daily-btn">
        <span class="dc-ic">${ic('calendar', '📅')}</span>
        <span class="dc-tx"><b>Daily Case</b><small>${WEEKDAYS[t.weekday]} · ${d.name} · ${d.sub.split(' · ')[0]}</small></span>
        <span class="badge">${status}</span>
      </button>
      <div class="streak">${streak ? `${ic('flame', '🔥')} ${streak}-day streak${done ? '' : ', solve today to keep it!'}` : 'A new case every day. Same one for everyone!'} · <button class="mini-link" id="cal-btn">Calendar</button></div>`;
    $('daily-btn').addEventListener('click', startDaily);
    $('cal-btn').addEventListener('click', showCalendar);
  }

  let pendingLink = null;
  function handleLink() {
    const h = pendingLink || location.hash;
    if (!h || h.length < 2) return;
    if (!store.profile) { pendingLink = h; return; }   // ask for a name first, then come back here
    pendingLink = null;
    history.replaceState(null, '', location.pathname);
    if (h === '#daily') return startDaily();
    const m = h.match(/^#(friend|challenge)=([A-Za-z0-9_-]+)/);
    if (!m) return;
    const data = b64d(m[2]);
    if (m[1] === 'friend') {
      if (!addFriend(data, true)) return;
      showMap();
      offerShareBack(data.n, m[2]);
    } else startChallenge(data);
  }

  function offerTutorial() {
    modal(`<div class="big">${ic('cap', '🎓')}</div><h2>New here?</h2><p>Take the 2-minute tutorial: we'll solve a tiny case together, step by step.</p>
      <div class="row"><button class="primary" data-act="go">Start tutorial</button><button class="secondary" data-act="close">I know how to play</button></div>`, {
      go: () => { closeModal(); startTutorial(); },
    });
  }

  /* ---------- game ---------- */
  function startDaily() {
    const t = today(), diff = DAILY_DIFF[t.weekday], p = prog('daily');
    const go = (puzzle) => { $('loading').classList.remove('show'); begin(diff, t.num, puzzle, 'daily'); };
    if (p.cur && p.cur.caseNum === t.num && p.cur.puzzle) return go(p.cur.puzzle);
    $('loading-text').textContent = 'Opening today\'s case file…';
    $('loading').classList.add('show');
    buildCase(diff, t.num, go, 1000000 + t.num);
  }

  function startJourney() {
    const p = prog('journey'), n = p.caseNum, diff = journeyDiff(n);
    const go = (puzzle) => { $('loading').classList.remove('show'); begin(diff, n, puzzle, 'journey'); };
    if (p.cur && p.cur.caseNum === n && p.cur.puzzle) return go(p.cur.puzzle);
    if (p.next && p.next.caseNum === n && p.next.puzzle) { const pz = p.next.puzzle; p.next = null; return go(pz); }
    $('loading-text').textContent = isBoss(n) ? 'Building a boss level…' : 'Building the crime scene…';
    $('loading').classList.add('show');
    buildCase(diff, n, go, JOURNEY_SEED + n);
  }

  function startTutorial() {
    begin('easy', 0, tutorialPuzzle(), 'tutorial');
  }

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

  function begin(diff, caseNum, puzzle, slot) {
    slot = slot || diff;
    const p = prog(slot);
    S = {
      diff, slot, caseNum, P: puzzle, tut: slot === 'tutorial' ? 0 : -1,
      place: new Array(puzzle.N).fill(-1), xs: new Set(), draft: {},
      sel: -1, mode: 'place', history: [],
      elapsed: 0, hints: 0, helps: 0, extra: [], solvedGrid: false, won: false, wrongAccuse: [],
    };
    if (slot !== 'tutorial' && p.cur && p.cur.caseNum === caseNum) {
      S.place = p.cur.place || S.place; S.xs = new Set(p.cur.xs || []); S.elapsed = p.cur.elapsed || 0;
      S.hints = p.cur.hints || 0; S.wrongAccuse = p.cur.wrongAccuse || [];
      S.draft = p.cur.draft || {}; S.helps = p.cur.helps || 0; S.extra = p.cur.extra || [];
    }
    persist();
    $('home').classList.remove('active');
    $('map').classList.remove('active');
    $('game').classList.add('active');
    if (slot === 'challenge') S.challenge = pendingChallenge || (p.cur && p.cur.challenge) || null;
    const label = slot === 'challenge' && S.challenge ? `${S.challenge.n}'s challenge: ${puzzle.title}` : slot === 'daily' ? `Daily Case: ${puzzle.title}` : slot === 'tutorial' ? puzzle.title : slot === 'journey' ? `Level ${caseNum}: ${puzzle.title}` : `Case #${caseNum}: ${puzzle.title}`;
    $('case-title').innerHTML = (ART ? `<span class="tic">${ART.theme(puzzle.theme.id)}</span>` : puzzle.theme.icon + ' ') + esc(label);
    $('intro').textContent = slot === 'challenge' && S.challenge ? `⚔ ${S.challenge.n} solved this in ${fmtTime(S.challenge.time)}. Can you beat that?` : puzzle.intro;
    $('game').classList.toggle('tut', slot === 'tutorial');
    buildLegend();
    setMode('place');
    render();
    window.scrollTo(0, 0);
    requestAnimationFrame(() => { $('play-area').style.top = $('topbar').offsetHeight + 'px'; });
    startTimer();
    if (slot === 'journey' || DIFF[slot]) prefetchNext(slot, caseNum);
    if (slot === 'tutorial') renderCoach();
    else if (!store.seenHowto && !store.tutorialDone) { store.seenHowto = true; save(); showHowto(); }
    checkDone(true);
  }

  function renderCoach() {
    const el = $('coach');
    if (!S || S.tut < 0) { el.hidden = true; return; }
    const step = TUTORIAL[S.tut];
    el.hidden = false;
    el.innerHTML = `<div class="coach-face">${ART ? ART.ui('logo') : '🕵️'}</div><div class="coach-tx">${plain(step.text)}</div>
      ${step.next ? '<button class="primary coach-next" id="coach-next">Next</button>' : ''}`;
    if (step.next) $('coach-next').addEventListener('click', () => { S.tut++; renderCoach(); render(); });
  }

  function persist() {
    if (!S || S.slot === 'tutorial') return;
    prog(S.slot).cur = {
      caseNum: S.caseNum, puzzle: S.P, place: S.place, xs: [...S.xs], elapsed: S.elapsed,
      challenge: S.challenge || null, hints: S.hints, wrongAccuse: S.wrongAccuse, draft: S.draft, helps: S.helps, extra: S.extra,
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
    const kind = S.slot === 'challenge' ? `Challenge · ${DIFF[S.diff].name}` : S.slot === 'daily' ? `Daily · ${DIFF[S.diff].name}` : S.slot === 'tutorial' ? 'Tutorial' : S.slot === 'journey' ? `Level ${S.caseNum} · ${DIFF[S.diff].name}${isBoss(S.caseNum) ? ' · Boss' : ''}` : DIFF[S.diff].name;
    $('case-sub').textContent = `${S.P.theme.name} · ${kind} · ${ART ? '' : '⏱ '}${fmtTime(S.elapsed)}`;
  }

  function shake(el) { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }
  function setStatus(msg, bad) { $('status').textContent = plain(msg); if (bad) { shake($('status')); sfx('wrong'); } }

  function setMode(m) {
    S.mode = m;
    $('mode-place').classList.toggle('on', m === 'place');
    $('mode-x').classList.toggle('on', m === 'x');
    $('mode-draft').classList.toggle('on', m === 'draft');
    if (m === 'x') { S.sel = -1; setStatus('Mark mode: tap a square to cross it out ✕'); }
    else if (m === 'draft') setStatus(S.sel >= 0 ? `Draft: tap every square where ${S.P.people[S.sel].name} might be.` : 'Draft mode: pick a suspect, then tap all the squares where they might be.');
    else setStatus('Pick a suspect below, then tap a square.');
    render();
  }

  function snapshot() {
    S.history.push({ place: S.place.slice(), xs: [...S.xs], draft: JSON.parse(JSON.stringify(S.draft)) });
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
    if (S.mode === 'draft') {
      if (S.sel < 0) { setStatus('Pick a suspect first, then tap the squares where they might be 👇', true); return; }
      if (E.isBlocked(P.obj[i])) { setStatus('Nobody can stand there!', true); return; }
      if (occ >= 0) return;
      snapshot();
      const list = S.draft[i] || [];
      const k = list.indexOf(S.sel);
      if (k >= 0) list.splice(k, 1); else { list.push(S.sel); list.sort((x, y) => x - y); }
      if (list.length) S.draft[i] = list; else delete S.draft[i];
      sfx('tick');
      render(); persist();
      return;
    }
    if (S.tut >= 0) {
      const step = TUTORIAL[S.tut];
      if (!step.expect) { setStatus(step.next ? 'Tap Next in the box above first.' : 'Pick a suspect card below.', true); return; }
      if (S.sel < 0) { setStatus(`First tap ${P.people[step.expect.p].name}'s card below 👇`, true); return; }
      if (S.sel !== step.expect.p) { setStatus(`Let's place ${P.people[step.expect.p].name} first.`, true); S.sel = -1; render(); return; }
      if (i !== step.expect.cell) { setStatus('Not quite. Read the clue again 🙂', true); return; }
      S.place[S.sel] = i; S.sel = -1; S.tut++; sfx('place');
      setStatus('');
      renderCoach(); render(); checkDone(false);
      return;
    }
    if (S.sel >= 0) {
      if (E.isBlocked(P.obj[i])) { setStatus(`Nobody can stand on ${E.OBJECTS[P.obj[i]].name === 'TV' ? 'the TV' : 'the ' + E.OBJECTS[P.obj[i]].name}!`, true); return; }
      snapshot();
      if (occ >= 0) S.place[occ] = -1;
      S.place[S.sel] = i; S.xs.delete(i); sfx('place');
      clearDrafts(S.sel);
      S.sel = -1;
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

  function clearDrafts(p) {
    for (const c of Object.keys(S.draft)) {
      S.draft[c] = S.draft[c].filter((q) => q !== p);
      if (!S.draft[c].length) delete S.draft[c];
    }
  }

  function onSuspect(p) {
    if (S.solvedGrid) return;
    if (S.mode === 'x') setMode('place');
    S.sel = S.sel === p ? -1 : p;
    if (S.sel >= 0) setStatus(S.mode === 'draft' ? `Draft: tap every square where ${S.P.people[p].name} might be. Tap again to erase.` : `Where was ${S.P.people[p].name}? Tap a square.`);
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
      cell.style.backgroundColor = P.zones[P.zoneOf[i]].color;
      if (ART) cell.classList.add('fl-' + ART.floor(P.theme.id, P.zoneOf[i]));
      const step = S.tut >= 0 ? TUTORIAL[S.tut] : null;
      if (step && step.cells && step.cells.includes(i)) cell.classList.add('coach-hl');
      const w = P.walls[i];
      ['n', 's', 'e', 'w'].forEach((s) => { if (w[s] && !isOuter(N, i, s)) cell.classList.add('wall-' + s); });
      const o = P.obj[i], def = o && E.OBJECTS[o];
      if (def && def.css === 'rug') cell.classList.add('rug');
      const who = whoAt(i);
      if (who >= 0) cell.classList.add('has-token');
      if (S.solvedGrid && P.zoneOf[i] === P.zoneOf[P.solution[P.victim]]) cell.classList.add('vzone');
      if (S.sel >= 0 && (usedR.has(Math.floor(i / N)) || usedC.has(i % N) || E.isBlocked(o))) cell.classList.add('dim');
      const drafts = who < 0 ? S.draft[i] || [] : [];
      if (drafts.length) cell.classList.add('has-draft');
      if (S.mode === 'draft' && S.sel >= 0 && drafts.includes(S.sel)) cell.classList.add('draft-sel');
      if (ART && o && ART.has(o)) { const em = document.createElement('div'); em.className = 'obj art'; em.innerHTML = ART.icon(o); cell.appendChild(em); }
      else if (def && def.css === 'table') { const t = document.createElement('div'); t.className = 'table-obj'; cell.appendChild(t); }
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
        else if (ART) { t.innerHTML = face(person); t.classList.add('art'); t.style.borderColor = person.isVictim ? '' : person.color; }
        else t.textContent = skinEmoji(person);
        cell.appendChild(t);
      } else {
        if (S.xs.has(i)) { const x = document.createElement('div'); x.className = 'xmark'; x.textContent = '✕'; cell.appendChild(x); }
        if (drafts.length) {
          const d = document.createElement('div');
          d.className = 'drafts';
          const per = Math.max(2, Math.ceil(Math.sqrt(drafts.length))); // always small, so drafts never look like placements
          d.style.gridTemplateColumns = `repeat(${per}, 1fr)`;
          d.style.setProperty('--per', per);
          for (const q of drafts) {
            const sp = document.createElement('span');
            sp.textContent = P.people[q].letter; sp.style.color = P.people[q].color;
            d.appendChild(sp);
          }
          cell.appendChild(d);
        }
      }
      cell.addEventListener('click', () => onCell(i));
      board.appendChild(cell);
    }

    const notes = $('extra');
    notes.hidden = !S.extra.length;
    notes.innerHTML = `<b>${ART ? '' : '🧾 '}Extra clues from headquarters</b>` + S.extra.map((x) => `<div>• ${rich(x.text)}</div>`).join('');

    const list = $('suspects');
    list.innerHTML = '';
    P.people.forEach((person, p) => {
      const card = document.createElement('button');
      card.className = 'suspect' + (person.isVictim ? ' is-victim' : '') + (S.sel === p ? ' sel' : '') + (S.place[p] >= 0 ? ' placed' : '')
        + (S.tut >= 0 && TUTORIAL[S.tut].card === p && S.place[p] < 0 ? ' coach-hl' : '');
      const clues = person.isVictim
        ? '<div><b>The victim.</b> Found in the last remaining square.</div>'
        : person.clues.map((c) => `<div>${rich(c)}</div>`).join('');
      card.innerHTML = `<div class="face">${face(person)}<span class="lt" style="background:${person.color}">${person.letter}</span></div>
        <div><div class="nm">${esc(person.name)}${person.isVictim ? (ART ? ' <span class="rip">rip</span>' : ' ☠️') : ''}</div><div class="cl">${clues}</div></div>`;
      card.addEventListener('click', () => onSuspect(p));
      list.appendChild(card);
    });
    renderAccuse();
  }

  function buildLegend() {
    const P = S.P, T = P.theme;
    const present = [...new Set(P.obj.filter(Boolean))];
    const show = (o) => (ART && ART.has(o) ? `<span class="ic lg">${ART.icon(o)}</span>` : E.OBJECTS[o].e || (o === 'rug' ? '▨' : '▬')) + ' ' + E.OBJECTS[o].name;
    const can = present.filter((o) => !E.isBlocked(o)).map(show);
    const cant = present.filter((o) => E.isBlocked(o)).map(show);
    $('legend').innerHTML = `<summary>${ART ? '' : '📖 '}Detective's dictionary</summary><ul>
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
  $('mode-draft').addEventListener('click', () => setMode('draft'));
  $('undo').addEventListener('click', () => {
    if (S.solvedGrid || !S.history.length) return;
    const h = S.history.pop();
    S.place = h.place; S.xs = new Set(h.xs); S.draft = h.draft || {};
    render(); persist();
  });
  $('reset').addEventListener('click', () => {
    if (S.solvedGrid) return;
    modal(`<div class="big">${ic('trash', '🗑️')}</div><h2>Clear the board?</h2><p>All placements, drafts and ✕ marks will be erased. Extra clues stay.</p>
      <div class="row"><button class="primary" data-act="yes">Yes, clear</button><button class="secondary" data-act="close">Cancel</button></div>`, {
      yes: () => { snapshot(); S.place.fill(-1); S.xs.clear(); S.draft = {}; S.sel = -1; render(); persist(); closeModal(); },
    });
  });
  $('hint').addEventListener('click', () => {
    if (S.solvedGrid) return;
    if (S.tut >= 0) { setStatus('Follow the hints in the box above 🙂'); return; }
    const price = (k) => `<span class="price">${coinIc()} ${COST[k]}</span>`;
    modal(`<div class="big">${ic('bulb', '💡')}</div><h2>Need a hand, detective?</h2>
      <p>You have ${coinIc()} <b>${coins()}</b> coins.</p>
      <div class="help-list">
        <button class="primary" data-act="clue">${ic('note', '🧾')} Give me an extra clue ${price('clue')}<small>A fact about the whole scene. Nobody's spot is revealed.</small></button>
        <button class="secondary" data-act="check">${ic('check', '✔️')} Check my placements ${price('check')}<small>Tells you if someone on the board is in the wrong spot.</small></button>
        <button class="secondary" data-act="reveal">${ic('eye', '👁️')} Reveal one suspect ${price('reveal')}<small>The last resort.</small></button>
      </div>
      <div class="row"><button class="secondary" data-act="close">Never mind</button></div>`, {
      clue: () => { closeModal(); if (pay('clue')) giveExtraClue(); },
      check: () => { closeModal(); if (pay('check')) checkPlacements(); },
      reveal: () => { closeModal(); if (pay('reveal')) revealOne(); },
    });
  });

  function pay(kind) {
    if (coins() < COST[kind]) { setStatus(`Not enough coins (${COST[kind]} needed). Solve cases and collect your daily gift to earn more!`, true); return false; }
    store.coins -= COST[kind]; save(); sfx('coin');
    return true;
  }

  function knownForHints() {
    // what the player already got right is taken into account, so the clue helps from where they are
    const P = S.P, fixed = {};
    S.place.forEach((x, p) => { if (x >= 0 && x === P.solution[p] && !P.people[p].isVictim) fixed[p] = x; });
    const crossed = [...S.xs].filter((c) => !P.solution.includes(c));
    return { fixed, crossed };
  }

  function giveExtraClue() {
    const P = S.P;
    const have = new Set(S.extra.map((x) => x.id));
    const facts = E.sceneFacts(P, knownForHints())
      .filter((f) => !have.has(f.id) && !(f.dup && have.has(f.dup)))
      .sort((x, y) => y.score - x.score);
    if (!facts.length) { setStatus('Headquarters has no more extra clues for this case. Try another kind of help.', true); return; }
    const top = facts[0].score;
    const pool = facts.filter((f) => f.score >= top * 0.8);
    const f = pool[Math.floor(Math.random() * pool.length)];
    S.extra.push({ id: f.id, text: f.text });
    S.helps++;
    setStatus('🧾 New clue added above the suspects.');
    render(); persist();
    const el = $('extra');
    el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function checkPlacements() {
    const P = S.P;
    const placed = S.place.map((x, p) => [x, p]).filter(([x]) => x >= 0);
    if (!placed.length) { setStatus('Place somebody on the board first, then I can check.', true); return; }
    S.helps++;
    const wrong = placed.filter(([x, p]) => x !== P.solution[p]);
    if (!wrong.length) setStatus(`✅ So far so good: all ${placed.length} placed ${placed.length === 1 ? 'person is' : 'people are'} in the right spot.`);
    else setStatus(`🔴 ${wrong.length === 1 ? P.people[wrong[0][1]].name + ' is' : wrong.length + ' people are'} in the wrong spot.`, true);
    persist();
  }

  function revealOne() {
    const P = S.P;
    let p = S.place.findIndex((x, q) => x >= 0 && x !== P.solution[q]);
    const wasWrong = p >= 0;
    if (p < 0) p = S.place.findIndex((x, q) => x < 0 && !P.people[q].isVictim);
    if (p < 0) p = S.place.findIndex((x) => x < 0);
    if (p < 0) return;
    snapshot();
    const target = P.solution[p], occ = whoAt(target);
    if (occ >= 0) S.place[occ] = -1;
    S.place[p] = target; S.xs.delete(target); clearDrafts(p); S.sel = -1; S.hints++;
    const person = P.people[p];
    setStatus(wasWrong ? `👁️ ${person.name} was in the wrong place. Fixed it.` : `👁️ Placed ${person.name} in the right spot.`);
    render(); persist(); checkDone(false);
  }
  $('back').addEventListener('click', () => { persist(); showHome(); });
  $('howto-home').addEventListener('click', showHowto);
  $('howto-game').addEventListener('click', showHowto);
  $('greet').addEventListener('click', askProfile);
  $('tut-btn').addEventListener('click', startTutorial);
  $('ach-btn').addEventListener('click', showTrophies);
  $('shop-btn').addEventListener('click', showShop);
  $('backup-btn').addEventListener('click', showBackup);
  $('map-back').addEventListener('click', () => { $('map').classList.remove('active'); showHome(); });
  $('map-friends').addEventListener('click', showFriends);
  window.addEventListener('hashchange', handleLink);
  $('coins-pill').addEventListener('click', showShop);
  $('sound-btn').addEventListener('click', () => { store.sound = store.sound === false; save(); showHome(); if (store.sound) sfx('coin'); });

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
    modal(`<div class="big">${ic('logo', '👮')}</div><h2>Welcome, detective!</h2>
      <div class="howto">
      <p>There was (yep, you guessed it) a murder last night. The good news? We have a lineup of suspects and a clue about each of them.</p>
      <p><b>Your goal:</b> find the murderer: the one person who was <b>alone with the victim</b> in the same room.</p>
      <ul>
        <li>Every person was in a <b>different row</b> and a <b>different column</b>, like sudoku.</li>
        <li>Some objects can be stood on (chairs, beds, rugs…), others can't (tables, plants…). Check the dictionary under the suspects.</li>
        <li>The victim (<b>V</b>) is in the <b>last remaining square</b>.</li>
      </ul>
      <p><b>How to play:</b> tap a suspect card, then a square. Tap a placed suspect to pick them up again. Use <b>✏️ Draft</b> to pencil in every square where a suspect <i>might</i> be, and <b>✕ Mark</b> to cross out squares nobody can use.</p>
      <p><b>Stuck?</b> 💡 gives you an extra clue about the whole scene, checks your board, or (last resort) reveals a suspect.</p>
      <p>Each scene is different: a mansion, a ship, a forest, a space station and more.</p>
      </div>
      <div class="row"><button class="primary" data-act="close">Let's investigate!</button><button class="secondary" data-act="tut">Guided tutorial</button></div>`, {
      tut: () => { closeModal(); startTutorial(); },
    });
  }

  /* the accusation lives in a panel under the board, so the board stays visible and it can't be lost */
  function showAccuse() { renderAccuse(); }

  function nextCase() {
    closeModal();
    if (S.slot === 'journey' || S.slot === 'tutorial') startJourney();
    else if (S.slot === 'daily' || S.slot === 'challenge') showHome();
    else startGame(S.diff);
  }

  function renderAccuse() {
    let el = $('accuse');
    if (!el) {
      el = document.createElement('div');
      el.id = 'accuse'; el.className = 'accuse';
      $('status').insertAdjacentElement('afterend', el);
      el.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn || !S) return;
        if (btn.dataset.next) return nextCase();
        if (btn.dataset.home) { closeModal(); return showHome(); }
        const p = +btn.dataset.p;
        if (Number.isNaN(p) || S.won) return;
        const P = S.P, zone = P.zones[P.zoneOf[P.solution[P.victim]]].name;
        if (p === P.murderer) return win();
        if (!S.wrongAccuse.includes(p)) S.wrongAccuse.push(p);
        persist(); renderAccuse();
        $('acc-msg').textContent = `${P.people[p].name} wasn't alone with ${P.people[P.victim].name} in the ${zone}! Look again.`;
        shake(el); sfx('wrong');
      });
    }
    const on = !!(S && S.solvedGrid);
    el.hidden = !on;
    $('game').classList.toggle('accusing', on);
    if (!on) return;
    const P = S.P, v = P.people[P.victim], zone = P.zones[P.zoneOf[P.solution[P.victim]]].name;
    if (S.won) {
      const m = P.people[P.murderer];
      const nextLabel = S.slot === 'journey' ? `Level ${S.caseNum + 1} →` : S.slot === 'tutorial' ? 'Play level 1 →' : S.slot === 'daily' || S.slot === 'challenge' ? '' : 'Next case →';
      el.innerHTML = `<div class="acc-t">Case closed: <b>${esc(m.name)}</b> did it.</div>
        <div class="acc-btns">${nextLabel ? `<button class="primary" data-next="1">${nextLabel}</button>` : ''}<button class="secondary" data-home="1">Menu</button></div>`;
      return;
    }
    const btns = P.people.map((person, p) => person.isVictim ? '' :
      `<button data-p="${p}" class="${S.wrongAccuse.includes(p) ? 'nope' : ''}"><span class="af">${face(person)}</span>${esc(person.name)}</button>`).join('');
    el.innerHTML = `<div class="acc-t">${ic('knife', '🔪')} <b>Who did it?</b> ${esc(v.name)} was found in the <b>${esc(zone)}</b> (highlighted). Who was alone with ${pr(v, 'him', 'her')}?</div>
      <div class="acc-row">${btns}</div><div class="acc-msg" id="acc-msg"></div>`;
  }

  function win() {
    const P = S.P, pg = prog(S.slot);
    const m = P.people[P.murderer], v = P.people[P.victim];
    const zone = P.zones[P.zoneOf[P.solution[P.victim]]].name;
    stopTimer();
    S.won = true; renderAccuse();
    if (S.slot === 'tutorial') {
      store.tutorialDone = true; store.seenHowto = true; save();
      S.tut = -1; renderCoach();
      modal(`<div class="big">${ic('cap', '🎓')}</div><h2>You did it, detective!</h2>
        <p><b>Ben</b> was alone with Victor in the Bedroom. Case closed!</p>
        <div class="howto"><p>Real cases have more suspects and trickier clues. Your tools:</p><ul>
          <li><b>Draft</b>: pencil in every square where a suspect <i>might</i> be.</li>
          <li><b>Mark</b>: cross out squares nobody can use.</li>
          <li><b>Help</b>: an extra clue when you're stuck.</li></ul></div>
        <div class="row"><button class="primary" data-act="first">Play level 1</button><button class="secondary" data-act="home">Menu</button></div>`, {
        first: () => { closeModal(); startJourney(); },
        home: () => { closeModal(); showHome(); },
      });
      return;
    }
    const nStars = !S.hints && !S.helps && !S.wrongAccuse.length ? 3 : !S.hints ? 2 : 1;
    const earned = (COIN_BASE[S.diff] + (nStars === 3 ? 10 : nStars === 2 ? 5 : 0)) * (S.slot === 'daily' ? 2 : 1);
    store.coins = coins() + earned;
    store.themesSolved = [...new Set([...(store.themesSolved || []), P.theme.id])];
    let isBest = false, dailyTxt = '';
    if (S.slot === 'daily') {
      dailyLog()[S.caseNum] = { t: S.elapsed, stars: nStars };
      pg.cur = null;
      // a full month of daily cases wins that month's trophy
      const d = new Date(), y = d.getFullYear(), mo = d.getMonth(), last = new Date(y, mo + 1, 0).getDate();
      let all = true;
      for (let k = 1; k <= last; k++) if (!dailyLog()[Math.floor(Date.UTC(y, mo, k) / 86400000)]) { all = false; break; }
      if (all) { store.trophies = store.trophies || {}; store.trophies[`${y}-${mo + 1}`] = true; }
      const n = dailyStreak();
      dailyTxt = `<br>${ic('flame', '🔥')} ${n}-day streak! Come back tomorrow for a new case.`;
    } else if (S.slot === 'challenge') {
      pg.cur = null;
      const c = S.challenge, diff = c ? S.elapsed - c.time : 0;
      if (c && diff < 0) store.coins += 30;
      dailyTxt = c ? `<div class="duel ${diff < 0 ? 'won' : 'lost'}">${diff < 0 ? `You beat ${esc(c.n)} by ${fmtTime(-diff)}! +30 coins` : diff === 0 ? `A perfect tie with ${esc(c.n)}!` : `${esc(c.n)} was faster by ${fmtTime(diff)}.`}<br><small>You ${fmtTime(S.elapsed)} · ${esc(c.n)} ${fmtTime(c.time)}</small></div>` : '';
    } else {
      if (S.slot === 'journey') { store.jStars = store.jStars || {}; store.jStars[S.caseNum] = Math.max(store.jStars[S.caseNum] || 0, nStars); }
      pg.solved++; pg.caseNum++; pg.cur = null;
      isBest = !S.hints && !S.helps && (pg.best == null || S.elapsed < pg.best);
      if (isBest) pg.best = S.elapsed;
    }
    save();
    sfx('win'); confetti();
    const levelTxt = S.slot === 'journey' ? `<div class="lvl-done">Level ${S.caseNum} complete!</div>` : '';
    const helpTxt = [S.helps ? `🧾 ${S.helps} clue${S.helps > 1 ? 's' : ''}/check${S.helps > 1 ? 's' : ''}` : '', S.hints ? `👁️ ${S.hints} reveal${S.hints > 1 ? 's' : ''}` : ''].filter(Boolean).join(' · ');
    modal(`<div class="big">${ART ? `<span class="ic win-face">${face(m)}</span><span class="ic">${ART.ui('siren')}</span>` : m.emoji + '🚔'}</div><h2>Case closed!</h2>
      <p><b>${esc(m.name)}</b> was alone with ${esc(v.name)} in the ${esc(zone)}.<br>${pr(m, 'He', 'She')}'s on the way to jail. ${ic('lock', '🔒')}</p>
      ${levelTxt}<p class="stars-row" style="font-size:28px;margin:6px 0">${stars(nStars)}</p>
      <p class="earned">${coinIc()} +<b id="earned">0</b> coins</p>
      <p>${ART ? '' : '⏱ '}${fmtTime(S.elapsed)}${helpTxt ? ' · ' + plain(helpTxt) : ''}${isBest ? '<br>New personal best!' : ''}${dailyTxt}</p>
      <div class="row">${S.slot === 'daily' || S.slot === 'challenge' ? '' : `<button class="primary" data-act="next">${S.slot === 'journey' ? `Level ${S.caseNum + 1} →` : 'Next case →'}</button>`}<button class="${S.slot === 'daily' || S.slot === 'challenge' ? 'primary' : 'secondary'}" data-act="home">Menu</button></div>
      <div class="row"><button class="secondary duel-btn" data-act="duel">${ic('knife', '⚔️')} ${S.slot === 'challenge' ? 'Challenge back' : 'Challenge a friend'}</button></div>`, {
      next: nextCase,
      duel: () => share(`I solved "${S.P.title}" in ${fmtTime(S.elapsed)} on Mystery Grid. Can you beat my time?`, challengeLink()),
      home: () => { closeModal(); showHome(); },
    });
    // count the coins up, then hand out any new trophies
    let shown = 0;
    const tick = setInterval(() => {
      shown = Math.min(earned, shown + Math.ceil(earned / 18));
      const el = $('earned'); if (el) el.textContent = shown;
      if (shown >= earned) { clearInterval(tick); sfx('coin'); }
    }, 45);
    checkAchievements({ diff: S.diff, clean: !S.hints && !S.helps, time: S.elapsed });
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
    modal(`<div class="big">${ic('phone', '📲')}</div><h2>Install on iPhone</h2>
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
    const hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then((reg) => {
      reg.update().catch(() => {});
      document.addEventListener('visibilitychange', () => { if (!document.hidden) reg.update().catch(() => {}); });
    }).catch(() => {});
    // a new version took over: reload once, but only on the home screen so no game is interrupted
    let reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController || reloaded) return;
      const go = () => { if (!reloaded && $('home').classList.contains('active') && !$('modal').classList.contains('show')) { reloaded = true; location.reload(); } };
      go();
      if (!reloaded) document.addEventListener('click', () => setTimeout(go, 50), { once: true });
    });
  }
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});

  document.addEventListener('visibilitychange', () => { if (document.hidden) persist(); });
  window.addEventListener('resize', () => { if (S) $('play-area').style.top = $('topbar').offsetHeight + 'px'; });
  applySkin();
  IAP.init().then(() => { if ($('home').classList.contains('active')) renderShopCard(); });
  showHome();
  if (!store.profile) askProfile();
  handleLink();
})();
