(function () {
  'use strict';
  const E = window.MysteryEngine;
  const I = window.I18N;
  const tr = I.t, TR = I.T, trp = I.tp;       // translate: tr('English text {0}', arg), TR`English text ${arg}`
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
  const dname = (key) => tr(DIFF[key].name);
  const DIFF = Object.fromEntries(DIFFS.map((d) => [d.key, d]));
  const RANKS = [[0, 'Rookie'], [3, 'Junior Detective'], [10, 'Detective'], [25, 'Inspector'], [50, 'Chief Inspector'], [100, 'Legend of the Force']];

  /* ---------- look: emoji edition, or the illustrated edition when art.js is loaded ---------- */
  const ART = window.MysteryArt || null;
  const ic = (name, emoji) => (ART ? `<span class="ic">${ART.ui(name)}</span>` : emoji);
  /* ---------- skin packs sold in the coin shop ---------- */
  const PACKS = [
    { id: 'classic', name: 'Classic Detectives', price: 0, rarity: 'Basic', desc: 'The original cast.', emoji: null },
    { id: 'chefs', name: 'Kitchen Crew', price: 360, rarity: 'Common', desc: 'Chef hats, curly mustaches and a pinch of suspicion.', emoji: ['👨‍🍳', '👩‍🍳', '🧑‍🍳'] },
    { id: 'clowns', name: 'Circus Clowns', price: 400, rarity: 'Common', desc: 'Red noses, wild hair. Nobody trusts a clown.', emoji: ['🤡', '🎪', '🎈', '🤹'] },
    { id: 'cowboys', name: 'Wild West', price: 440, rarity: 'Common', desc: 'Cowboy hats, bandanas and a shiny sheriff star.', emoji: ['🤠', '🐴', '🌵', '⭐'] },
    { id: 'pets', name: 'Pet Detectives', price: 480, rarity: 'Common', desc: 'Cats, dogs, foxes, owls and more. Paws off the evidence!', emoji: ['🐱', '🐶', '🦊', '🐰', '🐻', '🐼', '🦉', '🐸', '🐯', '🐨'] },
    { id: 'robots', name: 'Robo Squad', price: 480, rarity: 'Common', desc: 'Beep boop. Box heads with glowing LED eyes.', emoji: ['🤖', '🦾', '🔋', '⚙️'] },
    { id: 'pirates', name: 'Pirate Crew', price: 600, rarity: 'Rare', desc: 'Eye patches, tricorns and gold earrings. Arr!', emoji: ['🏴‍☠️', '🦜', '⚓', '🗺️', '💰'] },
    { id: 'ninjas', name: 'Shadow Ninjas', price: 720, rarity: 'Rare', desc: 'Silent hoods, colourful headbands, one throwing star.', emoji: ['🥷', '🗡️', '🌙', '🎋'] },
    { id: 'dinos', name: 'Dino Hoodies', price: 840, rarity: 'Rare', desc: 'Everyone in a dinosaur onesie. Rawr.', emoji: ['🦖', '🦕', '🐊', '🐉'] },
    { id: 'wizards', name: 'Wizard Academy', price: 1000, rarity: 'Rare', desc: 'Starry hats, long beards and glowing wands.', emoji: ['🧙', '🧙‍♀️', '🧙‍♂️', '🪄', '🔮'] },
    { id: 'gangsters', name: 'Noir Gangsters', price: 1120, rarity: 'Rare', desc: 'Fedoras, trench coats and very dark sunglasses.', emoji: ['🕴️', '🤵', '🤵‍♀️', '🧔‍♂️', '👩‍🦰', '🧑‍💼', '👨‍💼', '👩‍💼'] },
    { id: 'heroes', name: 'Super Squad', price: 1600, rarity: 'Epic', desc: 'Masks, capes and big shiny emblems.', emoji: ['🦸', '🦸‍♀️', '🦸‍♂️', '⚡', '🛡️'] },
    { id: 'sea', name: 'Deep Sea Gang', price: 1920, rarity: 'Epic', desc: 'Ten sea creatures: octopus, shark, turtle, crab, seahorse, jellyfish, pufferfish, starfish, whale and swordfish.', emoji: ['🐙', '🦈', '🐡', '🦀', '🪼', '🐳'] },
    { id: 'monsters', name: 'Monster Mash', price: 2240, rarity: 'Epic', desc: 'Vampires, mummies, ghosts, a cyclops and one very polite werewolf.', emoji: ['🧛', '🧟', '👻', '🧙', '🧌', '🐺', '🎃', '💀', '🧞'] },
    { id: 'royals', name: 'Royal Court', price: 2600, rarity: 'Epic', desc: 'Crowns, jewels and ermine, in a shimmering gold frame.', emoji: ['🤴', '👸', '🫅', '👑', '🦄', '💎'] },
    { id: 'space', name: 'Space Crew', price: 3200, rarity: 'Epic', desc: 'Astronauts and aliens, framed by the stars.', emoji: ['👩‍🚀', '🧑‍🚀', '👨‍🚀', '👽', '🤖', '👾', '🛸'] },
    { id: 'neon', name: 'Neon Legends', price: 6000, rarity: 'Legendary', desc: 'Glowing neon characters in a pulsing frame.', emoji: ['🌟', '💫', '⚡', '🔮', '🌈', '🪩', '✨'] },
    { id: 'deco', name: 'Jazz Age', iap: 'skin_deco', usd: '$2.99', rarity: 'Premium', desc: 'Art deco gold, bow ties, pearls and a sunburst frame.', emoji: ['🎷', '🎩', '🥂', '💎'] },
    { id: 'steam', name: 'Steampunk Guild', iap: 'skin_steam', usd: '$2.99', rarity: 'Premium', desc: 'Brass goggles, gears and top hats in a riveted frame.', emoji: ['⚙️', '🎩', '🔧', '🕰️'] },
    { id: 'gothic', name: 'Haunted Gala', iap: 'skin_gothic', usd: '$1.99', rarity: 'Premium', desc: 'Powdered wigs, lace collars and candlelight. Ghosts welcome.', emoji: ['👻', '🕯️', '🎭', '🦇'] },
    { id: 'partners', name: 'Partners in Crime', ref: true, rarity: 'Exclusive', desc: 'Only for detectives who duel a new friend.', emoji: ['🤝', '🕵️', '🔎', '🕵️‍♀️'] },
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
  /* ---------- ads: none yet. When ads are added, show them only if adsAllowed(); players can pay once to remove them ---------- */
  const ADS_ON = false;   // flip to true in the release that contains real ads (window.CG_ADS_ON is only for tests)
  const REMOVE_ADS = { iap: 'remove_ads', usd: '$3.99' };
  /* rewarded video: the native wrapper (version 2) sets window.CGAdBridge = { isReady(): boolean, showRewarded(cb: (rewarded: boolean) => void) }.
     Without it nothing below is shown. Watching is always the player's own choice, and a few per day at most. */
  const AD_HINTS_PER_DAY = 3;
  const adBridgeReady = () => !!(window.CGAdBridge && typeof window.CGAdBridge.showRewarded === 'function' && (!window.CGAdBridge.isReady || window.CGAdBridge.isReady()));
  function adHintsLeft() { const d = today().num; if (!store.adHints || store.adHints.day !== d) store.adHints = { day: d, n: 0 }; return AD_HINTS_PER_DAY - store.adHints.n; }
  function watchAd(then) {
    try { window.CGAdBridge.showRewarded((ok) => { if (ok) then(); else toast(`<span class="ti">${ic('lock', '🔒')}</span><span><b>${tr('No video available right now. Try again later.')}</b></span>`); }); }
    catch (e) { toast(`<span class="ti">${ic('lock', '🔒')}</span><span><b>${tr('No video available right now. Try again later.')}</b></span>`); }
  }
  const adsAllowed = () => !!(ADS_ON || window.CG_ADS_ON) && !store.noAds;
  window.CGAds = { allowed: () => adsAllowed() };
  const IAP = {
    service: null, prices: {},
    ids: () => [REMOVE_ADS.iap, ...COIN_PACKS.map((c) => c.iap), ...PACKS.filter((x) => x.iap).map((x) => x.iap)],
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
      if (id === REMOVE_ADS.iap) {
        store.noAds = true; store.paid = true; save(); renderNoAds();
        try { if (this.service && this.service.acknowledge) await this.service.acknowledge(token, 'onetime'); } catch (e) { /* retried next launch via listPurchases */ }
        return tr('Ads removed. Thank you!');
      }
      store.paidTokens = store.paidTokens || [];
      if (coinPack) {
        // a token is paid out once, even if the store call below fails and the purchase shows up again next launch
        if (!store.paidTokens.includes(token)) { store.paidTokens.push(token); store.paidTokens = store.paidTokens.slice(-50); store.coins = coins() + coinPack.coins; save(); }
        try { await this.service.consume(token); } catch (e) { /* will be retried by listPurchases next launch */ }
      }
      if (skin) {
        if (!store.owned.includes(skin.id)) { store.owned.push(skin.id); if (!restoring) store.skin = skin.id; }
        save();
        // Google Play refunds purchases that are not acknowledged within 3 days
        try { if (this.service.acknowledge) await this.service.acknowledge(token, 'onetime'); } catch (e) { /* retried next launch via listPurchases */ }
      }
      store.paid = true;
      save(); renderCoins(); applySkin();
      return coinPack ? TR`+${I.num(coinPack.coins)} coins` : skin ? TR`${tr(skin.name)} unlocked` : '';
    },
    async buy(id) {
      if (!this.service) {
        modal(`<div class="big">${ic('phone', '📲')}</div><h2>${tr('Available in the app')}</h2>
          <p>${tr('Purchases with real money work in the Google Play version of Crime Grid.')}</p>
          <div class="row"><button class="primary" data-act="close">${tr('OK')}</button></div>`);
        return;
      }
      try {
        const req = new PaymentRequest([{ supportedMethods: 'https://play.google.com/billing', data: { sku: id } }],
          { total: { label: 'Total', amount: { currency: 'USD', value: '0' } } });
        const res = await req.show();
        const msg = await this.grant(id, res.details.purchaseToken, false);
        await res.complete('success');
        sfx('unlock'); confetti();
        toast(`<span class="ti">${ic('gift', '🎁')}</span><span><b>${tr('Thank you!')}</b><small>${msg}</small></span>`);
        if (id === REMOVE_ADS.iap) { closeModal(); renderNoAds(); } else showShop();
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
  function today() {
    const d = new Date();
    return { num: Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000), weekday: d.getDay() };
  }
  const dailyLog = () => (store.dailyLog = store.dailyLog || {});
  function dailyStreak() {
    const log = dailyLog(), fr = store.frozen || {}, t = today().num;
    let day = (log[t] || fr[t]) ? t : t - 1, n = 0;
    while (log[day] || fr[day]) { if (log[day]) n++; day--; }   // a frozen day keeps the streak alive without adding to it
    return n;
  }
  // earned by finishing every 7th day of a streak: saves the streak if exactly one day was missed
  function applyStreakFreeze() {
    const log = dailyLog(), t = today().num, y = t - 1;
    store.frozen = store.frozen || {};
    if (log[t] || log[y] || store.frozen[y] || (store.freezes || 0) < 1) return;
    if (!(log[y - 1] || store.frozen[y - 1])) return;
    store.frozen[y] = true; store.freezes -= 1; save();
    setTimeout(() => toast(`<span class="ti">${ic('flame', '🔥')}</span><span><b>${tr('Streak freeze used!')}</b><small>${tr('Your {0}-day streak is safe. Solve today to keep it going.', dailyStreak())}</small></span>`), 600);
  }
  // a repeating calendar reminder (works on any phone, no server needed)
  function remindDaily() {
    const times = [[8, 0], [13, 0], [20, 0]];
    modal(`<div class="big">${ic('flame', '🔥')}</div><h2>${tr('Daily reminder')}</h2>
      <p>${tr('Pick a time. Your calendar will remind you every day to solve the Daily Case.')}</p>
      <div class="stake-row">${times.map(([h], i) => `<button class="${h === 20 ? 'primary' : 'secondary'}" data-act="t${i}">${String(h).padStart(2, '0')}:00</button>`).join('')}</div>
      <div class="row"><button class="secondary" data-act="close">${tr('Not now')}</button></div>`,
      Object.fromEntries(times.map(([h, m], i) => ['t' + i, () => { closeModal(); downloadReminder(h, m); }])));
  }
  function downloadReminder(h, m) {
    const d = new Date(), p2 = (n) => String(n).padStart(2, '0');
    const stamp = `${d.getFullYear()}${p2(d.getMonth() + 1)}${p2(d.getDate())}T${p2(h)}${p2(m)}00`;
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Crime Grid//Daily//EN', 'BEGIN:VEVENT', 'UID:crimegrid-daily-reminder@crimegrid', `DTSTAMP:${stamp}`, `DTSTART:${stamp}`, 'DURATION:PT10M', 'RRULE:FREQ=DAILY',
      `SUMMARY:${tr("Crime Grid: today's case is waiting")}`, `DESCRIPTION:${tr('Solve the Daily Case and keep your streak!')} ${GAME_URL}`, 'BEGIN:VALARM', 'TRIGGER:PT0M', 'ACTION:DISPLAY', 'DESCRIPTION:Crime Grid', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    const a = document.createElement('a');
    a.href = url; a.download = 'crime-grid-daily.ics';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    toast(`<span class="ti">${ic('check', '✓')}</span><span><b>${tr('Reminder file ready')}</b><small>${tr('Open it to add the daily reminder to your calendar.')}</small></span>`);
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
  const TUTORIAL_OLD = [
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

  // v2 tutorial: 8 small units shown as 6 steps (steps 1-3 teach the rules with a picture, 4-5 place the suspects, 6 accuses)
  const TUT2 = [
    { n: 1, ill: 'rows', next: true, text: () => tr('Rule 1: every suspect has a row and a column all to themselves.') },
    { n: 2, ill: 'objs', next: true, text: () => tr('Rule 2: you can stand on chairs, beds and rugs, but not on tables, plants or TVs.') },
    { n: 3, ill: 'room', next: true, text: () => tr('Rule 3: the victim is in the last free square, and whoever is alone with them in that room did it.') },
    { n: 4, expect: { p: 0, cell: 5 }, card: 0, cells: [5], text: (P) => tr('{0} sat on a chair: tap her card, then the glowing chair.', P.people[0].name) },
    { n: 5, expect: { p: 1, cell: 12 }, card: 1, cells: [12, 13], text: (P) => tr('{0} lay on a bed. Only one bed square is left, so place him there.', P.people[1].name) },
    { n: 5, expect: { p: 2, cell: 3 }, card: 2, cells: [3], text: (P) => tr('{0} was in the Kitchen, by a window: only one square fits.', P.people[2].name) },
    { n: 5, expect: { p: 3, cell: 10 }, card: 3, cells: [10], text: (P) => tr('{0}, the victim, goes in the last free square.', P.people[3].name) },
    { n: 6, accuse: true, text: (P, zone) => tr('{0} was found {1}. Who was alone with him? Tap the killer!', P.people[3].name, zone.in) },
  ];
  const TUTORIAL = ART ? TUT2 : TUTORIAL_OLD;
  const TUT_STEPS = 6;
  const PRAISE = () => [tr('Nice!'), tr('Great!'), tr('Exactly right!'), tr('Sharp eye, detective!')];

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
    return { i: myId(), n: safeName(store.profile && store.profile.name, 'Detective'), l: prog('journey').caseNum, s: skinId(), d: dailyStreak(), t: totalSolved(), u: (window.CGNet && window.CGNet.uid()) || undefined };
  }
  async function share(text, url) {
    try { if (navigator.share) { await navigator.share({ title: 'Crime Grid', text, url }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
    try { await navigator.clipboard.writeText(`${text} ${url}`); toast(`<span class="ti">${ic('check', '✓')}</span><span><b>${tr('Link copied!')}</b><small>${tr('Paste it to your friend in any chat.')}</small></span>`); return; } catch (e) { /* fall through */ }
    modal(`<h2>${tr('Send this to a friend')}</h2><textarea class="name-in share-box" readonly>${esc(text + ' ' + url)}</textarea>
      <div class="row"><button class="primary" data-act="close">${tr('Done')}</button></div>`);
  }
  function seedOf(slot, diff, caseNum) {
    if (slot === 'journey') return JOURNEY_SEED + caseNum;
    if (slot === 'daily') return 1000000 + caseNum;
    if (slot === 'challenge') return caseNum;
    return DIFF[diff].seed + caseNum;
  }

  /* ---------- coins ---------- */
  const COIN_BASE = { easy: 5, medium: 8, hard: 10, expert: 15, extreme: 25 };
  const COST = { clue: 20, check: 10, reveal: 50 };
  const BONUS = [10, 15, 20, 25, 30, 40, 60];

  /* ---------- retention: daily missions, win streak, star chest ---------- */
    const MISSIONS = [
    { id: 'solve3', n: 3, reward: 25, text: ['Solve {0} cases', 3], hit: () => 1 },
    { id: 'hard', n: 1, reward: 25, text: ['Solve a Hard or harder case'], hit: (c) => (['hard', 'expert', 'extreme'].includes(c.diff) ? 1 : 0) },
    { id: 'clean', n: 1, reward: 20, text: ['Solve a case without any help'], hit: (c) => (c.clean ? 1 : 0) },
    { id: 'solve2', n: 2, reward: 15, text: ['Solve {0} cases', 2], hit: () => 1 },
    { id: 'stars', n: 5, reward: 20, text: ['Earn {0} stars', 5], hit: (c) => c.stars },
    { id: 'daily', n: 1, reward: 20, text: ['Solve the Daily Case'], hit: (c) => (c.slot === 'daily' ? 1 : 0) },
  ];
  function missions() {
    const d = today().num;
    if (!store.missions || store.missions.day !== d) {
      store.missions = { day: d, list: [0].map((k) => ({ id: MISSIONS[(d + k) % MISSIONS.length].id, p: 0, done: false })), all: false };
      save();
    }
    return store.missions;
  }
  const missionDef = (id) => MISSIONS.find((m) => m.id === id);
  const missionText = (m) => tr(m.text[0], m.text[1]);
  // called once per solved case; returns extra coins and a few message lines
  function retentionOnWin(c) {
    const lines = [], out = { coins: 0, lines };
    // daily missions
    const ms = missions();
    ms.list.forEach((it) => {
      if (it.done) return;
      const def = missionDef(it.id);
      it.p = Math.min(def.n, it.p + def.hit(c));
      if (it.p >= def.n) {
        it.done = true; out.coins += def.reward;
        lines.push(`${ic('check', '✔️')} ${tr('Mission complete: {0} · +{1} coins', missionText(def), def.reward)}`);
      }
    });
    return out;
  }
  function renderRetention() {
    let el = $('retention');
    if (!el) { el = document.createElement('div'); el.id = 'retention'; $('rewards-body').appendChild(el); }
    const ms = missions(), got = ms.list.filter((it) => it.done).length;
    const rows = ms.list.map((it) => {
      const def = missionDef(it.id);
      return `<div class="mi${it.done ? ' done' : ''}"><span class="mi-ck">${it.done ? '✓' : ''}</span><span class="mi-tx">${esc(missionText(def))}</span><span class="mi-pr">${it.done ? '' : def.n > 1 ? `${it.p}/${def.n}` : ''}</span><span class="mi-rw">${coinIc()} ${def.reward}</span></div>`;
    }).join('');
    const n = ms.list.length;
    $('rewards-sum').innerHTML = `${ic('gift', '🎁')} ${tr(n > 1 ? 'Daily Missions' : 'Daily Mission')} ${got}/${n}`;
    el.innerHTML = `<div class="missions"><div class="mi-h"><b>${tr(n > 1 ? 'Daily Missions' : 'Daily Mission')}</b><span>${got}/${n}</span></div>${rows}</div>`;
  }
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
    if (navigator.vibrate && (!navigator.userActivation || navigator.userActivation.hasBeenActive)) { navigator.vibrate(kind === 'wrong' ? 40 : kind === 'win' ? [30, 50, 30] : 12); return; }
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
      el.className = 'toast' + ($('modal').classList.contains('show') ? ' low' : ''); el.innerHTML = h; // low = bottom, so it never covers a dialog heading
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
  function coins() { if (typeof store.coins !== 'number') store.coins = 30; return store.coins; }
  function addCoins(n) { coins(); store.coins += n; save(); renderCoins(); }
  function renderNoAds() {
    const el = $('noads-pill');
    if (!el) return;
    el.hidden = !adsAllowed();
    if (el.hidden) return;
    el.innerHTML = `<span class="ic">${ART ? ART.ui('lock') : '🚫'}</span> ${tr('No ads')}`;
    el.onclick = () => modal(`<div class="big">${ic('lock', '🚫')}</div><h2>${tr('Remove ads')}</h2>
      <p>${tr('Enjoy Crime Grid without ads. One payment, no subscription. It comes back if you reinstall the game.')}</p>
      <div class="row"><button class="primary premium-btn" data-act="buy">${tr('Buy for {0}', IAP.price(REMOVE_ADS.iap, REMOVE_ADS.usd))}</button><button class="secondary" data-act="close">${tr('Not now')}</button></div>`, {
      buy: () => IAP.buy(REMOVE_ADS.iap),
    });
  }
  function renderCoins() { const el = $('coins-pill'); if (el) el.innerHTML = `${coinIc()} <b>${I.num(coins())}</b><span class="cp-shop">${tr('SHOP')}</span>`; }
  function checkAchievements(ctx) {
    store.ach = store.ach || {};
    for (const x of ACH) {
      if (store.ach[x.id] || !x.test(ctx)) continue;
      store.ach[x.id] = today().num;
      store.coins = coins() + 50;
      toast(`<span class="ti">${ic('medal', '🏅')}</span><span><b>${tr(x.name)}</b><small>${tr(x.desc)} · ${TR`+50 coins`}</small></span>`);
    }
    save(); renderCoins();
  }
  function rankName() {
    const t = totalSolved();
    let r = RANKS[0][1];
    for (const [n, name] of RANKS) if (t >= n) r = name;
    return tr(r);
  }
  function askProfile() {
    modal(`<div class="big">${ic('logo', '🕵️')}</div><h2>${tr("Who's on the case?")}</h2>
      <p>${tr('Your name and progress are saved on this device.')}</p>
      <input class="name-in" id="name-in" maxlength="18" placeholder="${esc(tr('Your name'))}" autocomplete="off">
      <div class="lang-row">${langButtons()}</div>
      <div class="row"><button class="primary" data-act="ok">${tr("Let's go")}</button></div>`,
    { ok: saveProfile, lang: (b) => { chooseLang(b.dataset.lang); const v = $('name-in').value; askProfile(); $('name-in').value = v; } }, true);
    const cur = store.profile ? store.profile.name : '';
    $('name-in').value = cur || '';
    $('name-in').addEventListener('keydown', (e) => { if (e.key === 'Enter') saveProfile(); });
  }
  // nicknames are shown to other players, so keep them clean: no links, emails, phone numbers or common slurs
  const BAD_SHORT = ['dick', 'cock', 'sex', 'porn', 'anal', 'cum', 'tit', 'tits', 'kkk', 'isis', 'rape'];
  const BAD_LONG = ['fuck', 'shit', 'bitch', 'cunt', 'nigg', 'fagg', 'whore', 'slut', 'pussy', 'nazi', 'hitler', 'blowjob', 'nigga', 'retard', 'pizd', 'blyat', 'blyad', 'huy', 'ebat', 'suka', 'mudak', 'pidor', 'pidar', 'puta', 'mierda', 'cabron', 'pendej', 'maricon', 'verga', 'coño', 'joder', 'זונה', 'שרמוט', 'כוסית', 'כוס', 'זין', 'חרא', 'מניאק', 'בןזונה', 'הומו', 'סרטן', 'хуй', 'хуе', 'пизд', 'ебан', 'ебат', 'блят', 'блядь', 'сука', 'мудак', 'пидор', 'гандон', 'шлюх', 'залуп'];
  function safeName(n, fallback) {
    let t = String(n == null ? '' : n).replace(/\s+/g, ' ').trim().slice(0, 18);
    const low = t.toLowerCase();
    const flat = low.replace(/[^a-z0-9\u0590-\u05ff\u0400-\u04ff\u00f1]/g, '').replace(/0/g, 'o').replace(/1/g, 'i').replace(/3/g, 'e').replace(/4/g, 'a').replace(/5/g, 's').replace(/\$/g, 's').replace(/@/g, 'a');
    const words = low.split(/[^a-z\u0590-\u05ff\u0400-\u04ff]+/).filter(Boolean);
    const bad = /https?:|www\.|\.com|\.net|@[a-z]|\d{6,}/i.test(low) || BAD_LONG.some((w) => flat.includes(w)) || BAD_SHORT.some((w) => words.includes(w));
    return bad || !t ? (fallback || tr('Detective')) : t;
  }
  function saveProfile() {
    const name = safeName($('name-in').value, '');
    if (!name) { $('name-in').focus(); shake($('modal-body')); return; }
    const firstTime = !store.profile;
    store.profile = { name };
    save(); closeModal(); showHome();
    if (pendingLink) return handleLink();
    if (firstTime && !store.tutorialDone && !totalSolved()) offerTutorial();
  }
  function renderGreet() {
    const el = $('greet');
    if (!store.profile) { el.innerHTML = `<b>${tr('Tap here to set your name')}</b>`; return; }
    const t = totalSolved();
    el.innerHTML = `<b>${tr('Hello, {0}!', esc(store.profile.name))} ${ic('wave', '👋')}</b>
      <div>${tr('Rank: {0}', rankName())} · ${t ? trp(t, '1 case solved', '{0} cases solved') : tr('no cases solved yet')}</div>
      <small>${tr('Tap to change name')}</small>`;
  }

  /* ---------- home ---------- */
  function showHome() {
    stopTimer();
    if (R && R.phase === 'play' && S && S.slot === 'race' && !S.won) raceLeave();
    const wasHome = $('home').classList.contains('active');
    $('map').classList.remove('active');
    $('home').classList.add('active');
    $('game').classList.remove('active');
    if (!wasHome && window.__resetHomeNav) window.__resetHomeNav();
    if (!wasHome) window.scrollTo(0, 0);
    applyStreakFreeze();
    renderGreet();
    renderCoins();
    renderNoAds();
    renderJourney();
    renderDaily();
    renderRetention();
    renderShopCard();
    const got = Object.keys(store.ach || {}).length;
    $('ach-btn').innerHTML = `${ic('trophy', '🏆')} ${tr('Trophies')} ${got}/${ACH.length}`;
    $('shop-btn').innerHTML = `${ic('coin', '🛍️')} ${tr('Shop')}`;
    $('settings-btn').innerHTML = `${ic('gear', '⚙️')} ${tr('Settings')}`;
    renderStorageNote();
    setTimeout(maybeDailyBonus, 350);
    $('diffs').innerHTML = DIFFS.map((d) => {
      const p = prog(d.key);
      const badge = (p.cur ? '▶ ' : '') + tr('Level {0}', p.caseNum);
      return `<button class="diff-btn ${d.key === 'extreme' ? 'extreme' : ''}" data-diff="${d.key}">
        <span>${ART ? `<span class="ic dic">${ART.ui(d.art)}</span>${tr(d.name)}` : d.emoji + ' ' + tr(d.name)}<small>${tr(d.sub)}</small></span><span class="badge">${badge}</span></button>`;
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
        <span class="pc-ic">${document.body.classList.contains('noir') ? '<svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true"><path d="M8 3.5l15 9.5-15 9.5z" fill="#fff" stroke="#1a1a2e" stroke-width="2" stroke-linejoin="round"/></svg>' : ic('play', '▶️')}</span>
        <span class="pc-tx"><b>${going ? tr('Continue') : tr('Play')}</b><small>${tr('Level {0}', n)} · ${tr(d.name)}${isBoss(n) ? ' · ' + tr('BOSS') : ''}</small></span>
        <span class="lvl-badge">${n}</span>
      </button>
      <div class="journey-bar"><div style="width:${pct}%"></div></div>
      <div class="streak">${tier ? trp(tier[0] - n, '1 level to {1}', '{0} levels to {1}', tr(tier[1])) : tr('Boss levels every 5 · how far can you go?')} <span class="nb">· <button class="mini-link" id="map-btn">${(store.friends || []).length ? trp((store.friends || []).length, 'Map & 1 friend', 'Map & {0} friends') : tr('Map')}</button></span></div>`;
    $('play-btn').addEventListener('click', startJourney);
    $('map-btn').addEventListener('click', showMap);
  }

  function renderStorageNote() {
    let el = $('storage-note');
    if (!el) { el = document.createElement('div'); el.id = 'storage-note'; $('daily').insertAdjacentElement('afterend', el); }
    const installed = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    let msg = '';
    const lnk = (k, label) => `<button class="mini-link" data-note="${k}">${label}</button>`;
    if (!storageOk) msg = tr('<b>This browser is not saving your progress</b> (private mode or storage blocked). Open the game in your normal browser, or use {0}.', lnk('backup', tr('Save progress')));
    else if (!installed && totalSolved() >= 2) msg = ios
      ? tr("Playing in Safari? iPhone can erase a website's saved progress after a week away. {0} to keep it safe, or {1}.", lnk('install', tr('Add to Home Screen')), lnk('backup', tr('save a backup code')))
      : tr('Your progress is saved in this browser only. {0} to keep it safe.', lnk('backup', tr('Save a backup code')));
    el.className = msg ? 'storage-note' : '';
    el.innerHTML = msg;
    el.querySelectorAll('[data-note]').forEach((b) => b.addEventListener('click', () => (b.dataset.note === 'backup' ? showBackup() : $('install-btn').click())));
  }

  function renderShopCard() {
    let el = $('shop-card');
    if (!el) {
      el = document.createElement('div');
      el.id = 'shop-card';
      $('rewards-body').appendChild(el);
    }
    const have = store.owned || ['classic'], owned = have.length;
    const next = PACKS.find((x) => !x.iap && !x.ref && !have.includes(x.id)) || PACKS.find((x) => !x.ref && !have.includes(x.id));
    el.innerHTML = `<button class="shop-card" id="shop-card-btn">
        <span class="sc-faces">${SHOP_PEOPLE.slice(0, 3).map((p) => `<span class="pf skin-${next ? next.id : skinId()}">${face(p, next ? next.id : skinId())}</span>`).join('')}</span>
        <span class="sc-tx"><b>${tr('Detective Shop')}</b><small>${next ? tr('New look: {0} · {1}', tr(next.name), next.iap ? IAP.price(next.iap, next.usd) : tr('{0} coins', I.num(next.price))) : tr('You own every pack!')} · ${tr('{0}/{1} owned', owned, PACKS.length)}</small></span>
        <span class="badge">${tr('Open')}</span>
      </button>`;
    $('shop-card-btn').addEventListener('click', showShop);
  }

  /* ---------- language & settings ---------- */
  const langButtons = () => I.langs.map((l) => `<button class="lang-btn${I.lang === l.code ? ' on' : ''}" data-act="lang" data-lang="${l.code}" lang="${l.code}">${l.label}</button>`).join('');
  function chooseLang(code) { store.lang = code; save(); I.setLang(code); }
  // repaint whatever is on screen in the new language
  function relocalize() {
    renderCoins();
    if ($('home').classList.contains('active')) showHome();
    else if ($('map').classList.contains('active')) showMap();
    else if (S) { paintCaseHeader(); buildLegend(); renderCoach(); setMode(S.mode); }
  }
  function showSettings() {
    modal(`<div class="big">${ic('gear', '⚙️')}</div><h2>${tr('Settings')}</h2>
      <div class="set-h">${tr('Language')}</div><div class="lang-row">${langButtons()}</div>
      <div class="set-h">${tr('Sound & vibration')}</div>
      <div class="row"><button class="secondary" data-act="sound">${ic(store.sound === false ? 'mute' : 'sound', store.sound === false ? '🔇' : '🔊')} ${store.sound === false ? tr('Off') : tr('On')}</button></div>
      <div class="set-h">${tr('Your progress')}</div>
      <div class="row"><button class="secondary" data-act="backup">${ic('lock', '💾')} ${tr('Save progress')}</button><button class="secondary" data-act="name">${tr('Change name')}</button></div>
      <div class="row"><button class="secondary" data-act="tut">${ic('cap', '🎓')} ${tr('Tutorial')}</button><button class="secondary" data-act="how">${tr('How to play')}</button></div>
      <div class="row"><button class="primary" data-act="close">${tr('Close')}</button></div>`, {
      lang: (b) => { chooseLang(b.dataset.lang); relocalize(); showSettings(); },
      sound: () => { store.sound = store.sound === false; save(); if (store.sound !== false) sfx('coin'); showSettings(); if ($('home').classList.contains('active')) showHome(); },
      backup: showBackup,
      name: () => { closeModal(); askProfile(); },
      tut: () => { closeModal(); startTutorial(); },
      how: showHowto,
    });
  }

  /* ---------- backup code: move progress to another phone or browser ---------- */
  const BACKUP_KEYS = ['noAds', 'lang', 'profile', 'coins', 'missions', 'freezes', 'frozen', 'seenWhatIf', 'owned', 'skin', 'journey', 'jStars', 'easy', 'medium', 'hard', 'expert', 'extreme', 'daily', 'dailyLog', 'ach', 'trophies',
    'themesSolved', 'friends', 'bonusDay', 'bonusStreak', 'pid', 'sound', 'seenHowto', 'tutorialDone', 'paid', 'engine'];
  function backupCode() {
    const o = {};
    BACKUP_KEYS.forEach((k) => { if (store[k] !== undefined) o[k] = store[k]; });
    // in-progress boards are not worth carrying over
    ['journey', 'easy', 'medium', 'hard', 'expert', 'extreme', 'daily'].forEach((k) => { if (o[k]) o[k] = { ...o[k], cur: null, next: null }; });
    return 'MG1.' + b64e(o);
  }
  function parseBackup(code) {
    const m = String(code).trim().match(/MG1\.([A-Za-z0-9_-]+)/), o = m && b64d(m[1]);
    return o && typeof o === 'object' && o.profile ? o : null;
  }
  function applyBackup(o) {
    Object.keys(store).forEach((k) => delete store[k]);
    Object.assign(store, o, { engine: E.VERSION });
    save(); applySkin(); I.setLang(store.lang || I.detect()); renderGreet();
    closeModal(); showHome();
    toast(`<span class="ti">${ic('check', '✓')}</span><span><b>${tr('Progress restored!')}</b><small>${tr('Level {0}, {1} coins.', prog('journey').caseNum, coins())}</small></span>`);
  }
  // never lose progress by accident: a backup that is behind the current game needs a clear yes (styled dialog, not the browser's)
  function restoreCode(code) {
    const o = parseBackup(code);
    if (!o) return false;
    const mine = prog('journey').caseNum, theirs = (o.journey && o.journey.caseNum) || 1;
    if (theirs >= mine) { applyBackup(o); return true; }
    modal(`<div class="big">${ic('lock', '💾')}</div><h2>${tr('Replace your progress?')}</h2>
      <p>${tr('This backup is on level {0}, but you are on level {1}. Replace your progress anyway?', theirs, mine)}</p>
      <div class="row"><button class="secondary" data-act="keep">${tr('Keep my progress')}</button><button class="primary" data-act="replace">${tr('Replace')}</button></div>`, {
      keep: () => { closeModal(); showBackup(); },
      replace: () => applyBackup(o),
    }, true);
    return null;
  }
  function showBackup() {
    const code = backupCode();
    modal(`<div class="big">${ic('lock', '💾')}</div><h2>${tr('Save your progress')}</h2>
      <p><small>${tr('Your progress lives on this phone. If you switch phones, reinstall, or open the game in a different browser, use this code to bring it back.')}</small></p>
      <textarea class="name-in share-box code-box" id="backup-box" readonly>${code}</textarea>
      <div class="row"><button class="primary" data-act="copy">${tr('Copy code')}</button><button class="secondary" data-act="send">${tr('Send to myself')}</button></div>
      <p class="restore-h"><b>${tr('Restore from a code')}</b></p>
      <textarea class="name-in share-box code-box" id="restore-box" placeholder="${esc(tr('Paste a code that starts with MG1.'))}"></textarea>
      <div class="row"><button class="secondary" data-act="restore">${tr('Restore')}</button><button class="secondary" data-act="close">${tr('Close')}</button></div>
      <p id="bk-msg" class="acc-msg"></p>`, {
      copy: async (b) => { try { await navigator.clipboard.writeText(code); b.textContent = tr('Copied ✓'); } catch (e) { $('backup-box').select(); b.textContent = tr('Select & copy ↑'); } },
      send: () => share(tr('My Crime Grid progress backup (paste it in Settings → Save progress → Restore):'), code),
      restore: () => {
        if (restoreCode($('restore-box').value) === false) { $('bk-msg').textContent = tr('That code does not look right. Copy the whole thing, starting with MG1.'); shake($('modal-body')); }
      },
    });
  }

  /* ---------- the journey map ---------- */
  function showMap() {
    stopTimer();
    $('home').classList.remove('active'); $('game').classList.remove('active'); $('map').classList.add('active');
    const cur = prog('journey').caseNum, stars = store.jStars || {};
    const lo = Math.max(1, cur - 200), hi = cur + 300, GAP = 96;   // the journey never ends; the map shows a long stretch of it
    const W = Math.min(window.innerWidth, 480), H = (hi - lo + 1) * GAP + 180;
    const X = (n) => W / 2 + Math.sin(n * 0.9) * W * 0.27, Y = (n) => H - 110 - (n - lo) * GAP;
    const pathFor = (from, to) => {
      let d = `M${X(from)} ${Y(from)}`;
      for (let n = from + 1; n <= to; n++) d += ` Q${X(n - 1)} ${(Y(n - 1) + Y(n)) / 2} ${X(n)} ${Y(n)}`;
      return d;
    };
    let html = `<svg class="map-path" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
      <path d="${pathFor(lo, hi)}" class="mp-todo"/>${cur > lo ? `<path d="${pathFor(lo, Math.min(cur, hi))}" class="mp-done"/>` : ''}</svg>`;
    const me = { name: (store.profile && store.profile.name) || tr('You'), g: 'f', letter: 'Me', color: '#d9a441', emoji: '🕵️' };
    const friendsAt = {};
    (store.friends || []).forEach((f) => { (friendsAt[Math.min(Math.max(f.l, lo), hi)] = friendsAt[Math.min(Math.max(f.l, lo), hi)] || []).push(f); });
    for (let n = lo; n <= hi; n++) {
      const x = X(n), y = Y(n), boss = isBoss(n), done = n < cur, now = n === cur;
      const th = E.themeFor(JOURNEY_SEED + n);
      const cls = `node${done ? ' done' : now ? ' cur' : ' locked'}${boss ? ' boss' : ''}`;
      const st = done ? `<span class="nstars">${[1, 2, 3].map((k) => `<i class="${k <= (stars[n] || 1) ? 'on' : ''}">★</i>`).join('')}</span>` : '';
      html += `<button class="${cls}" data-n="${n}" style="left:${x}px;top:${y}px">${boss && !done ? `<span class="nb">${tr('BOSS')}</span>` : ''}<b>${n}</b>${st}</button>`;
      const side = Math.sin(n * 0.9) > 0 ? -1 : 1;
      html += `<span class="theme-dec" style="left:${x + side * 62}px;top:${y}px" title="${esc(I.themeName(th.name))}">${ART ? ART.theme(th.id) : th.icon}</span>`;
      const tier = TIERS.find(([lv]) => lv === n);
      if (tier) html += `<div class="tier-banner" style="top:${y + GAP / 2 + 6}px">${tr('{0} zone', dname(journeyDiff(n)))}</div>`;
      if (now) html += `<span class="me-pin" style="left:${x}px;top:${y - 58}px"><span class="pin-face">${face(me)}</span><small>${tr('You')}</small></span>`;
      (friendsAt[n] || []).forEach((f, k) => {
        const fp = { name: f.n, g: 'f', letter: f.n[0], color: '#7aa7ff', emoji: '🙂' };
        html += `<span class="friend-pin" style="left:${x + side * -1 * (52 + k * 30)}px;top:${y - 6}px"><span class="pin-face">${face(fp, PACK[f.s] ? f.s : 'classic')}</span><small>${esc(f.n)}${f.l > hi ? ' ↑' + f.l : f.l < lo ? ' ↓' + f.l : ''}</small></span>`;
      });
    }
    $('map-canvas').style.width = W + 'px'; $('map-canvas').style.height = H + 'px';
    $('map-canvas').innerHTML = html;
    $('map-friends').textContent = tr('Share ({0})', (store.friends || []).length);
    $('map-canvas').querySelectorAll('.node').forEach((b) => b.addEventListener('click', () => {
      const n = +b.dataset.n;
      if (n === cur) return startJourney();
      if (n < cur) toast(`<span class="ti">${ic('star', '⭐')}</span><span><b>${tr('Level {0}', n)}</b><small>${trp(stars[n] || 1, 'Solved with 1 star.', 'Solved with {0} stars.')}</small></span>`);
      else toast(`<span class="ti">${ic('lock', '🔒')}</span><span><b>${tr('Level {0}', n)}</b><small>${tr('Solve level {0} first.', cur)}</small></span>`);
    }));
    requestAnimationFrame(() => window.scrollTo(0, Math.max(0, Y(cur) - window.innerHeight * 0.55 + $('map-canvas').offsetTop)));
  }

  /* ---------- friends ---------- */
  function addFriend(card, quiet) {
    if (!card || !card.i || !card.n || card.i === myId()) return false;
    if (card.u && NET && card.u === NET.uid()) return false;
    store.friends = store.friends || [];
    const k = store.friends.findIndex((x) => x.i === String(card.i).slice(0, 12) || (card.u && x.u === card.u));
    const old = k >= 0 ? store.friends[k] : {};
    const f = { i: String(card.i).slice(0, 12), n: safeName(card.n, 'Detective'), l: Math.max(1, Math.min(1e7, +card.l || old.l || 1)), s: PACK[card.s] ? card.s : old.s || 'classic', d: +card.d || old.d || 0, t: +card.t || old.t || 0, at: today().num };
    const u = card.u || old.u;
    if (u) f.u = String(u).slice(0, 40);
    if (card.tag || old.tag) f.tag = String(card.tag || old.tag).slice(0, 6);
    if (k >= 0) store.friends[k] = f; else store.friends.push(f);
    save();
    if (!quiet) toast(`<span class="ti">${ic('hand', '🤝')}</span><span><b>${k >= 0 ? tr('{0} updated!', esc(f.n)) : tr('{0} added!', esc(f.n))}</b><small>${tr('Level {0} on the journey map.', f.l)}</small></span>`);
    return true;
  }
  function friendRow(f, online) {
    const fp = { name: f.n, g: 'f', letter: f.n[0], color: '#7aa7ff', emoji: '🙂' };
    const age = today().num - (f.at || today().num);
    const canRace = !!NET;
    return `<div class="friend-row"><span class="pf skin-${f.s}">${face(fp, f.s)}</span><div><b>${esc(f.n)}${online ? ` <span class="on-dot" title="${esc(tr('Online now'))}"></span>` : ''}</b><small>${tr('Level {0} · {1} cases · {2}-day streak · updated {3}', f.l, f.t, f.d, age ? tr('{0}d ago', age) : tr('today'))}</small></div>
      ${canRace ? `<button class="mini-race" data-act="racef" data-id="${f.i}" aria-label="${esc(tr('Duel {0}', f.n))}">${ic('knife', '⚔️')}<span>${tr('Duel')}</span></button>` : ''}
      ${NET && f.u ? `<button class="mini-x" data-act="more" data-id="${f.i}" aria-label="${esc(tr('Report or block'))}">⋯</button>` : ''}
      <button class="mini-x" data-act="rm" data-id="${f.i}" aria-label="${esc(tr('Remove'))}">✕</button></div>`;
  }
  function friendListHtml(online) {
    return (store.friends || []).sort((x, y) => y.l - x.l).map((f) => friendRow(f, online && online[f.u])).join('')
      || `<p><small>${NET ? tr('No friends yet. Tell a friend your detective ID, or add theirs.') : tr('No friends yet. Send your link to a friend, and ask for theirs!')}</small></p>`;
  }
  function blockUid(u) {
    store.blocked = [...new Set([...(store.blocked || []), String(u)])].slice(-200);
    store.friends = (store.friends || []).filter((x) => x.u !== u);
    save();
  }
  // Play's user-generated-content rules: players can report and block others from inside the game
  function reportBlock(f) {
    modal(`<div class="big">${ic('lock', '🛡️')}</div><h2>${esc(f.n)}</h2>
      <p><small>${tr('Report this player, or block them so they can never invite you again.')}</small></p>
      <div class="help-list">
        ${['Offensive name', 'Cheating', 'Harassment', 'Something else'].map((r, i) => `<button class="secondary" data-act="rep" data-r="${i}">${tr('Report: {0}', tr(r))}</button>`).join('')}
        <button class="primary" data-act="blk">${tr('Block {0}', esc(f.n))}</button>
      </div>
      <div class="row"><button class="secondary" data-act="back">${tr('Back')}</button></div>`, {
      rep: async (b) => {
        const why = ['Offensive name', 'Cheating', 'Harassment', 'Something else'][+b.dataset.r] || 'Something else';
        try {
          await NET.signIn();
          const id = Array.from(crypto.getRandomValues(new Uint8Array(9)), (x) => 'abcdefghijklmnopqrstuvwxyz0123456789'[x % 36]).join('');
          await NET.put('reports/' + id, { from: NET.uid(), about: String(f.u).slice(0, 40), n: String(f.n).slice(0, 18), why, at: NET.TS });
          closeModal(); toast(`<span class="ti">${ic('check', '✓')}</span><span><b>${tr('Report sent. Thank you!')}</b></span>`);
        } catch (e) { raceFail(e); }
      },
      blk: () => { blockUid(f.u); toast(`<span class="ti">${ic('check', '✓')}</span><span><b>${tr('Blocked. {0} can no longer invite you.', esc(f.n))}</b></span>`); showFriends(); },
      back: showFriends,
    });
  }
  function showFriends() {
    const ids = NET && store.netOff ? `<div class="my-id"><button class="primary" data-act="getid">${tr('Get a detective ID')}</button></div><p class="id-msg"><small>${tr('Friends you add here can invite you to duels right inside the game.')}</small></p>`
      : NET ? `<div class="my-id"><small>${tr('Your detective ID')}</small><b class="id-code" id="my-id" dir="ltr">${esc(store.netTag || '······')}</b><button class="secondary" data-act="copyid">${tr('Copy')}</button></div>
      <div class="add-id"><input class="name-in" id="id-in" maxlength="12" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="${esc(tr("Friend's ID"))}" dir="ltr"><button class="primary" data-act="addid">${tr('Add')}</button></div>
      <p class="id-msg" id="id-msg"><small>${tr('Friends you add here can invite you to duels right inside the game.')}</small></p>` : '';
    modal(`<div class="big">${ic('hand', '🤝')}</div><h2>${tr('Friends')}</h2>
      ${ids}
      <div class="friend-list" id="friend-list">${friendListHtml()}</div>
      ${NET ? `<div class="race-cta"><button class="primary" data-act="race">${ic('knife', '⚔️')} ${tr('Live duel with a friend')}</button><small>${tr('New detective? You both get {0} coins and the exclusive Partners in Crime pack.', REF_COINS)}</small></div>` : ''}
      <details class="other-ways"${NET ? '' : ' open'}><summary>${tr('Other ways to add friends')}</summary>
        <p><small>${tr("You're on level <b>{0}</b>. Send your link so friends see you on their map. Send it again whenever you want them to see your new progress.", prog('journey').caseNum)}</small></p>
        <div class="row"><button class="secondary" data-act="mine">${tr('Send my link')}</button><button class="secondary" data-act="add">${tr('Add a friend')}</button></div></details>
      ${NET && store.netTag ? `<p class="forget"><button class="linkish" data-act="forget">${tr('Delete my online ID')}</button>${(store.blocked || []).length ? ` · <button class="linkish" data-act="unblock">${tr('Unblock all ({0})', store.blocked.length)}</button>` : ''}</p>` : ''}
      <div class="row"><button class="secondary" data-act="close">${tr('Close')}</button></div>`, {
      race: () => raceMenu(),
      more: (b) => { const f = (store.friends || []).find((x) => x.i === b.dataset.id); if (f) reportBlock(f); },
      unblock: () => { store.blocked = []; save(); showFriends(); },
      racef: (b) => {
        const f = (store.friends || []).find((x) => x.i === b.dataset.id);
        if (!f) return;
        if (f.u) return raceMenu(f);
        modal(`<div class="big">${ic('knife', '⚔️')}</div><p>${tr('To invite {0} inside the game, add them once with their detective ID (Friends screen).', esc(f.n))}</p>
          <div class="row"><button class="primary" data-act="back">${tr('OK')}</button></div>`, { back: showFriends });
      },
      copyid: async (b) => { if (!store.netTag) return; try { await navigator.clipboard.writeText(store.netTag); b.textContent = tr('Copied!'); } catch (e) { b.textContent = store.netTag; } },
      addid: () => addById($('id-in').value),
      getid: () => { store.netOff = false; save(); showFriends(); },
      forget: forgetOnline,
      mine: () => share(tr("Join me on Crime Grid! I'm on level {0}. Open this link to add me as a friend (on iPhone with the app installed: copy it and paste it in Map → Share → Add a friend):", prog('journey').caseNum), linkFor('friend', myCard())),
      add: () => {
        modal(`<h2>${tr('Add a friend')}</h2><p><small>${tr('Paste the link (or code) your friend sent you.')}</small></p>
          <textarea class="name-in share-box code-box" id="friend-in" placeholder="https://…#friend=…"></textarea>
          <div class="row"><button class="primary" data-act="ok">${tr('Add')}</button><button class="secondary" data-act="back">${tr('Back')}</button></div>`, {
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
    if (NET && !store.netOff) {
      const idIn = $('id-in');
      idIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') addById(idIn.value); });
      ensureTag().then((tag) => { const el = $('my-id'); if (el) el.textContent = tag; refreshFriends(); })
        .catch(() => { const el = $('id-msg'); if (el) el.innerHTML = `<small>${navigator.onLine === false ? tr('Live duels need an internet connection.') : tr('Could not reach the duel server. Try again in a moment.')}</small>`; });
    }
  }
  // friendship goes one way (no server), so right after adding someone, offer to send our link back
  function offerShareBack(name, code) {
    const inApp = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    const iosBrowser = /iphone|ipad|ipod/i.test(navigator.userAgent) && !inApp;
    modal(`<div class="big">${ic('hand', '🤝')}</div><h2>${tr('{0} is your friend!', esc(name))}</h2>
      <p>${tr("{0} is now on your map. To show up on <b>{0}'s</b> map too, send your link back.", esc(name))}</p>
      ${iosBrowser ? `<div class="ios-note">${tr('<b>Using the installed app on iPhone?</b> This link opened in Safari, which keeps its own copy of the game. Open the app, go to <b>Map → Share → Add a friend</b> and paste the same link there.')}
        <button class="secondary" data-act="copy">${tr("Copy this friend's link")}</button></div>` : ''}
      <div class="row"><button class="primary" data-act="back">${tr('Send my link to {0}', esc(name))}</button><button class="secondary" data-act="close">${tr('Later')}</button></div>`, {
      back: () => { closeModal(); share(tr("Hey {0}, add me back on Crime Grid! I'm on level {1}:", name, prog('journey').caseNum), linkFor('friend', myCard())); },
      copy: async (b) => {
        try { await navigator.clipboard.writeText(`${location.origin}${location.pathname}#friend=${code}`); b.textContent = tr('Copied! Now paste it in the app'); } catch (e) { b.textContent = tr('Copy failed: long-press the link in WhatsApp and copy it'); }
      },
    });
  }

  /* ---------- challenges: same case, who is faster? ---------- */
  let pendingChallenge = null;
  function startChallenge(c) {
    if (!c || !DIFF[c.diff] || !c.seed) return;
    addFriend({ i: c.i, n: c.n, l: c.l, s: c.s, d: c.d, t: c.tt, u: c.u }, true);
    pendingChallenge = c;
    const p = prog('challenge');
    const go = (puzzle) => { $('loading').classList.remove('show'); begin(c.diff, c.seed, puzzle, 'challenge'); };
    if (p.cur && p.cur.caseNum === c.seed && p.cur.puzzle) return go(p.cur.puzzle);
    $('loading-text').textContent = tr("Opening {0}'s challenge…", c.n);
    $('loading').classList.add('show');
    buildCase(c.diff, c.seed, go, c.seed);
  }
  function challengeLink() {
    const card = myCard();
    return linkFor('challenge', { u: card.u, i: card.i, n: card.n, l: card.l, s: card.s, d: card.d, tt: card.t, diff: S.diff, seed: seedOf(S.slot === 'challenge' ? 'challenge' : S.slot, S.diff, S.caseNum), time: S.elapsed, title: S.P.title });
  }

  function maybeDailyBonus() {
    if (!store.profile || $('modal').classList.contains('show') || !$('home').classList.contains('active')) return;
    const t = today().num;
    if (store.bonusDay === t) return;
    const streak = store.bonusDay === t - 1 ? (store.bonusStreak || 0) + 1 : 1;
    const idx = (streak - 1) % 7, reward = BONUS[idx];
    const days = BONUS.map((c, k) => `<div class="bday${k < idx ? ' got' : ''}${k === idx ? ' now' : ''}"><small>${tr('Day {0}', k + 1)}</small>${k < idx ? ic('check', '✓') : coinIc()}<b>${c}</b></div>`).join('');
    modal(`<div class="big">${ic('gift', '🎁')}</div><h2>${tr('Daily gift!')}</h2>
      <p>${tr('Come back every day for a bigger gift.')}</p><div class="bonus-row">${days}</div>
      <div class="row"><button class="primary" data-act="take">${tr('Collect +{0} coins', reward)}</button></div>`, {
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
    let cellsHtml = [0, 1, 2, 3, 4, 5, 6].map((x) => `<div class="cal-h">${I.weekdayNarrow(x)}</div>`).join('') + '<div></div>'.repeat(first);
    let solved = 0;
    for (let d = 1; d <= days; d++) {
      const k = dn(d), done = !!log[k];
      if (done) solved++;
      cellsHtml += `<div class="cal-d${done ? ' done' : ''}${k === t ? ' today' : ''}${k > t ? ' future' : ''}">${done ? ic('star', '⭐') : ''}<span>${d}</span></div>`;
    }
    const monthName = I.month(now);
    const won = (store.trophies || {})[`${y}-${m + 1}`];
    modal(`<h2>${tr('{0} cases', monthName)}</h2><div class="cal">${cellsHtml}</div>
      <p>${tr('<b>{0}</b> of {1} days solved.', solved, days)}</p>
      <p class="cal-tro">${ic(won ? 'trophy' : 'trophyOff', '🏆')} ${won ? tr('You won the {0} trophy!', monthName) : tr('Solve every daily case this month to win the {0} trophy.', monthName)}</p>
      <div class="row"><button class="primary" data-act="close">${tr('Close')}</button></div>`);
  }

  const SHOP_PEOPLE = [
    { name: 'Ava', g: 'f', letter: 'A', color: '#e74c3c', emoji: '👩' }, { name: 'Ben', g: 'm', letter: 'B', color: '#2980b9', emoji: '👨' },
    { name: 'Chloe', g: 'f', letter: 'C', color: '#27ae60', emoji: '👱‍♀️' }, { name: 'Victor', g: 'm', letter: 'V', color: '#7f1d1d', emoji: '🧔', isVictim: true },
  ];
  function showShop() {
    store.owned = store.owned || ['classic'];
    const coinCards = COIN_PACKS.map((c) => `<button class="coin-pack" data-act="iap" data-id="${c.iap}">
        ${c.tag ? `<span class="cp-tag">${tr(c.tag)}</span>` : ''}<span class="cp-ic">${coinIc()}</span><b>${I.num(c.coins)}</b><span class="cp-price">${IAP.price(c.iap, c.usd)}</span></button>`).join('');
    const cards = PACKS.map((x) => {
      const owned = store.owned.includes(x.id), on = skinId() === x.id, short = (x.price || 0) - coins();
      const btn = on ? `<button class="secondary" disabled>${tr('Equipped ✓')}</button>`
        : owned ? `<button class="primary" data-act="equip" data-id="${x.id}">${tr('Equip')}</button>`
        : x.ref ? `<button class="secondary" ${NET ? 'data-act="race"' : 'disabled'}>${ic('knife', '⚔️')} ${tr('Duel a new friend to unlock')}</button>`
        : x.iap ? `<button class="primary premium-btn" data-act="iap" data-id="${x.iap}">${tr('Buy for {0}', IAP.price(x.iap, x.usd))}</button>`
        : short > 0 ? `<button class="secondary" disabled>${coinIc()} ${I.num(x.price)} · ${tr('need {0} more', I.num(short))}</button>`
        : `<button class="primary" data-act="buy" data-id="${x.id}">${tr('Buy for {0}', coinIc() + ' ' + I.num(x.price))}</button>`;
      return `<div class="pack rar-${x.rarity.toLowerCase()}${on ? ' on' : ''}">
        <div class="pk-top"><b>${tr(x.name)}</b><span class="rar">${tr(x.rarity)}</span></div>
        <div class="pk-faces">${SHOP_PEOPLE.map((p) => `<span class="pf skin-${x.id}">${face(p, x.id)}</span>`).join('')}</div>
        <small>${tr(x.desc)}</small>${btn}</div>`;
    }).join('');
    modal(`<h2>${ic('coin', '🪙')} ${tr('Detective Shop')}</h2><p>${tr('You have {0} <b>{1}</b> coins. New looks for every suspect and victim.', coinIc(), I.num(coins()))}</p>
      <div class="shop-list"><div class="shop-h">${tr('Get coins')}</div><div class="coin-packs">${coinCards}</div><div class="shop-h">${tr('Skin packs')}</div>${cards}</div>
      <div class="row"><button class="secondary" data-act="close">${tr('Close')}</button></div>`, {
      buy: (b) => {
        const x = PACK[b.dataset.id];
        if (!x || x.ref || x.iap || !Number.isFinite(x.price) || x.price < 0 || coins() < x.price || (store.owned || []).includes(x.id)) return;
        store.coins -= x.price; store.owned.push(x.id); store.skin = x.id; save();
        applySkin(); renderCoins(); sfx('unlock'); confetti();
        showShop();
        toast(`<span class="ti">${ic('gift', '🎁')}</span><span><b>${tr('{0} unlocked!', tr(x.name))}</b><small>${tr('Equipped on every suspect.')}</small></span>`);
      },
      equip: (b) => { store.skin = b.dataset.id; save(); applySkin(); sfx('coin'); showShop(); },
      iap: (b) => IAP.buy(b.dataset.id),
      race: () => raceMenu(),
    });
  }

  function showTrophies() {
    store.ach = store.ach || {};
    const list = ACH.map((x) => `<div class="ach${store.ach[x.id] ? ' got' : ''}">${ic(store.ach[x.id] ? 'medal' : 'trophyOff', store.ach[x.id] ? '🏅' : '🔒')}<div><b>${tr(x.name)}</b><small>${tr(x.desc)}</small></div></div>`).join('');
    const months = Object.keys(store.trophies || {});
    modal(`<div class="big">${ic('trophy', '🏆')}</div><h2>${tr('Trophy room')}</h2>
      <div class="ach-list">${list}</div>
      ${months.length ? `<p><b>${tr('Monthly trophies:')}</b> ${months.map((k) => I.monthYear(new Date(k.split('-')[0], k.split('-')[1] - 1, 1))).join(', ')}</p>` : ''}
      <p><small>${tr('Each trophy is worth 50 coins.')}</small></p>
      <div class="row"><button class="primary" data-act="close">${tr('Close')}</button></div>`);
  }

  function renderDaily() {
    const t = today(), diff = DAILY_DIFF[t.weekday], d = DIFF[diff];
    const done = dailyLog()[t.num], p = prog('daily'), streak = dailyStreak();
    const noir = document.body.classList.contains('noir');
    const status = noir ? (done ? tr('SOLVED') : tr('OPEN'))
      : done ? `<span class="dc-done">✓ ${fmtTime(done.t)}</span>` : p.cur && p.cur.caseNum === t.num ? tr('Continue') : tr('Play');
    const parts = [I.weekday(t.weekday), tr(d.name), tr(d.sub).split(' · ')[0]];
    if (noir && done) parts.push(`✓ ${fmtTime(done.t)}`);
    const info = parts.map((x, i) => `<span style="white-space:nowrap">${x}${i < parts.length - 1 ? ' ·' : ''}</span>`).join(' ');
    $('daily').innerHTML = `<button class="daily-card" id="daily-btn" data-tab="${esc(tr('CASE FILE'))}">
        ${noir ? '<span class="clip" aria-hidden="true"></span>' : ''}
        <span class="dc-ic">${ic('calendar', '📅')}</span>
        <span class="dc-tx"><b>${tr('Daily Case')}</b><small>${info}</small></span>
        <span class="badge${noir && done ? ' solved' : ''}">${status}</span>
      </button>
      <div class="streak">${streak ? `${ic('flame', '🔥')} ${done ? tr('{0}-day streak', streak) : tr('{0}-day streak, solve today to keep it!', streak)}` : tr('A new case every day. Same one for everyone!')} ${(store.freezes || 0) > 0 ? ` <span class="nb">· ${tr('Freeze')} ×${store.freezes}</span>` : ''} <span class="nb">· <button class="mini-link" id="cal-btn">${tr('Calendar')}</button> · <button class="mini-link" id="remind-btn">${tr('Remind me')}</button></span></div>`;
    $('daily-btn').addEventListener('click', startDaily);
    $('cal-btn').addEventListener('click', showCalendar);
    $('remind-btn').addEventListener('click', remindDaily);
  }

  // Daily tab: a small menu (today's case, streak, calendar) instead of jumping straight into the level
  function showDailyMenu() {
    const t = today(), diff = DAILY_DIFF[t.weekday], d = DIFF[diff];
    const done = dailyLog()[t.num], p = prog('daily'), streak = dailyStreak();
    const resume = !done && p.cur && p.cur.caseNum === t.num;
    const info = [I.weekday(t.weekday), tr(d.name), tr(d.sub).split(' · ')[0]].join(' · ');
    const streakLine = streak ? `${ic('flame', '🔥')} ${done ? tr('{0}-day streak', streak) : tr('{0}-day streak, solve today to keep it!', streak)}` : tr('A new case every day. Same one for everyone!');
    modal(`<div class="big">${ic('calendar', '📅')}</div><h2>${tr('Daily Case')}</h2>
      <p>${esc(info)}</p>
      <p>${done ? `<b>${tr('SOLVED')}</b> ✓ ${fmtTime(done.t)}` : ''}</p>
      <p>${streakLine}</p>
      <div class="row">${done ? '' : `<button class="primary" data-act="play">${resume ? tr('Continue') : tr('Play')}</button>`}
      <button class="secondary" data-act="cal">${tr('Calendar')}</button>
      <button class="secondary" data-act="close">${tr('Close')}</button></div>`, {
      play: () => { closeModal(); startDaily(); },
      cal: () => { closeModal(); showCalendar(); },
    });
  }

  let pendingLink = null;
  /* ---------- live race: two detectives, the same case, at the same moment (Firebase, see net.js) ---------- */
  const NET = window.CGNet && window.CGNet.enabled ? window.CGNet : null;
  const RACE_DIFFS = ['easy', 'medium', 'hard', 'expert'], REF_COINS = 500, REF_MAX = 5, RACE_WIN = 40;
  let R = null;   // { code, role, room, foe, puzzle, phase: lobby|count|play|done, stop }
  const raceUrl = (code) => `${location.origin}${location.pathname}#race=${code}`;
  const otherRole = () => (R.role === 'host' ? 'guest' : 'host');
  const isNewbie = () => !store.refBy && totalSolved() <= 3;
  function raceCode() {
    const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', r = crypto.getRandomValues(new Uint8Array(6));
    return Array.from(r, (b) => A[b % A.length]).join('');
  }
  function raceCard(nb) {
    const c = myCard();
    return { uid: NET.uid(), n: String(c.n).slice(0, 18), i: c.i, s: c.s, l: c.l, t: c.t, nb: !!nb };
  }
  function raceWait(text) { $('loading-text').textContent = text; $('loading').classList.add('show'); }
  function raceFail(e, msg) {
    $('loading').classList.remove('show');
    if (R && R.stop) R.stop();
    R = null;
    modal(`<div class="big">${ic('knife', '⚔️')}</div><h2>${tr('Live duel')}</h2><p>${msg || (navigator.onLine === false ? tr('Live duels need an internet connection.') : tr('Could not reach the duel server. Try again in a moment.'))}</p>
      <div class="row"><button class="primary" data-act="close">${tr('OK')}</button></div>`);
  }
  const STAKES = [0, 25, 50, 100, 250, 500];
  let raceStake = 0;
  function raceMenu(friend) {
    if (!NET) return;
    if (raceStake > coins()) raceStake = 0;
    modal(`<div class="big">${ic('knife', '⚔️')}</div><h2>${friend ? tr('Duel {0}', esc(friend.n)) : tr('Live duel')}</h2>
      <p>${friend ? tr('Pick a level. {0} gets the invite inside the game.', esc(friend.n)) : tr('Same case, same moment. Whoever solves it first wins.')}</p>
      <div class="stake-h">${coinIc()} ${tr('Stake per player')}</div>
      <div class="stake-row">${STAKES.map((v) => `<button class="${v === raceStake ? 'primary' : 'secondary'}" data-act="stake" data-v="${v}"${v > coins() ? ' disabled' : ''}>${v ? I.num(v) : tr('Free')}</button>`).join('')}</div>
      ${raceStake ? `<p class="stake-note"><small>${tr('The winner takes {0} coins. Leaving early loses your stake.', I.num(raceStake * 2))}</small></p>` : ''}
      <div class="race-diffs">${RACE_DIFFS.map((d) => `<button class="secondary" data-act="go" data-d="${d}">${esc(dname(d))}</button>`).join('')}</div>
      <p><small>${tr('New detective? You both get {0} coins and the exclusive Partners in Crime pack.', REF_COINS)}</small></p>
      <div class="row"><button class="secondary" data-act="code">${tr('I have a code')}</button><button class="secondary" data-act="close">${tr('Close')}</button></div>`, {
      go: (b) => createRace(b.dataset.d, friend),
      stake: (b) => { raceStake = +b.dataset.v || 0; raceMenu(friend); },
      code: () => {
        modal(`<h2>${tr('Join a duel')}</h2><p><small>${tr('Type the 6-letter code your friend sent you.')}</small></p>
          <input class="name-in race-code-in" id="race-in" maxlength="40" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="ABC123">
          <div class="row"><button class="primary" data-act="ok">${tr('Join')}</button><button class="secondary" data-act="back">${tr('Back')}</button></div>`, {
          ok: () => {
            const raw = $('race-in').value, m = raw.match(/race=([A-Za-z0-9]+)/), code = (m ? m[1] : raw).toUpperCase().replace(/[^A-Z0-9]/g, '');
            if (code.length !== 6) { shake($('modal-body')); return; }
            joinRace(code);
          },
          back: () => raceMenu(friend),
        });
        setTimeout(() => $('race-in') && $('race-in').focus(), 50);
      },
    });
  }
  function cleanupRaces() {   // rooms older than a day are removed by whoever opens the next race
    const old = Date.now() - 86400000 - 3600000;
    NET.query('races', `&orderBy=%22created%22&endAt=${old}&limitToFirst=20`)
      .then((rooms) => Object.keys(rooms || {}).forEach((k) => NET.del('races/' + k).catch(() => {})))
      .catch(() => {});
  }
  async function createRace(diff, invitee) {
    if (!NET || !DIFF[diff]) return;
    closeModal();
    raceWait(tr('Opening a duel room…'));
    try {
      await NET.signIn();
      cleanupRaces();
      const code = raceCode(), seed = 3000000 + Math.floor(Math.random() * 9e8), stake = Math.min(raceStake, Math.floor(coins()));
      await NET.put('races/' + code, { v: 1, seed, diff, stake, created: NET.TS, host: raceCard(false) });
      enterRace(code, 'host');
      if (invitee && invitee.u) {
        await ensureTag();
        const c = myCard();
        R.invitee = invitee;
        try { await NET.put(`inbox/${invitee.u}/${code}`, { t: 'race', from: NET.uid(), n: String(c.n).slice(0, 18), s: c.s, i: c.i, l: c.l, code, diff, stake, at: NET.TS }); }
        catch (e) { R.noInbox = true; const el0 = $('race-lobby'); if (el0) el0.innerHTML = lobbyHtml(); return; }   // friend has no online profile yet
        const mine = R;
        setTimeout(() => { if (R === mine && R.phase === 'lobby' && !R.foe) { R.slow = true; const el = $('race-lobby'); if (el) el.innerHTML = lobbyHtml(); } }, 60000);
        const el = $('race-lobby'); if (el) el.innerHTML = lobbyHtml();
      }
    } catch (e) { raceFail(e); }
  }
  async function joinRace(code, ackStake) {
    code = String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    if (!NET) return raceFail(null, tr('Live duels are not available in this version yet.'));
    closeModal();
    raceWait(tr('Joining the duel…'));
    try {
      await NET.signIn();
      const room = await NET.get('races/' + code);
      if (!room || !room.host) return raceFail(null, tr('This duel has ended, or the code is wrong.'));
      const me = NET.uid();
      if (room.host.uid === me) return enterRace(code, 'host');
      if ((store.blocked || []).includes(room.host.uid)) return raceFail(null, tr('You blocked this player.'));
      if (room.guest && room.guest.uid !== me) return raceFail(null, tr('This duel already has two detectives.'));
      if (room.go && !(room.guest && room.guest.uid === me)) return raceFail(null, tr('This duel has already started.'));
      const stake = Math.max(0, Math.min(500, Math.floor(+room.stake || 0)));
      if (stake > 0 && !(room.guest && room.guest.uid === me)) {
        if (coins() < stake) return raceFail(null, tr('You need {0} coins to join this duel.', I.num(stake)));
        if (ackStake !== stake) {   // never take coins without a clear yes
          $('loading').classList.remove('show');
          const ok = await new Promise((resolve) => modal(`<div class="big">${ic('knife', '⚔️')}</div><h2>${tr('Live duel')}</h2>
            <p>${tr('{0} challenges you for {1} coins each. The winner takes {2}. Join?', esc(room.host.n), I.num(stake), I.num(stake * 2))}</p>
            <div class="row"><button class="primary" data-act="yes">${tr('Join')}</button><button class="secondary" data-act="no">${tr('Not now')}</button></div>`,
            { yes: () => { closeModal(); resolve(true); }, no: () => { closeModal(); resolve(false); } }, true));
          if (!ok) return;
          raceWait(tr('Joining the duel…'));
        }
      }
      if (!room.guest) {
        try { await NET.put(`races/${code}/guest`, raceCard(isNewbie())); }
        catch (e) {   // lost a race with another guest?
          const g = await NET.get(`races/${code}/guest`).catch(() => null);
          if (g && g.uid !== me) return raceFail(null, tr('This duel already has two detectives.'));
          throw e;
        }
      }
      enterRace(code, 'guest');
    } catch (e) { raceFail(e); }
  }
  function enterRace(code, role) {
    if (R && R.stop) R.stop();
    R = { code, role, room: null, foe: null, puzzle: null, phase: 'lobby', lastP: -1 };
    $('loading').classList.remove('show');
    showLobby();
    const mine = R;
    R.stop = NET.watch('races/' + code, (room) => { if (R === mine) onRoom(room); }, () => { if (R === mine && R.phase === 'lobby') raceFail(); });
  }
  function lobbyHtml() {
    const room = R.room, me = room && room[R.role], foe = room && room[otherRole()];
    const slot = (p, label) => `<div class="race-p${p ? '' : ' empty'}">${p ? `<span class="pf skin-${PACK[p.s] ? p.s : 'classic'}">${face({ name: p.n, g: 'f', letter: (p.n || '?')[0], color: '#7aa7ff', emoji: '🙂' }, PACK[p.s] ? p.s : 'classic')}</span><b>${esc(p.n)}</b>` : `<span class="race-dots">…</span><b>${label}</b>`}</div>`;
    const inv = R.invitee;
    const status = !room ? tr('Connecting…') : !foe && R.declined ? tr("{0} can't duel right now.", esc(inv.n))
      : !foe && inv && R.slow ? tr('{0} may be offline. Send the code another way, or try later.', esc(inv.n))
      : !foe && inv && R.noInbox ? tr("{0} can't get invites yet. Send the code another way.", esc(inv.n))
      : !foe && inv ? tr('Invite sent to {0}. Waiting…', esc(inv.n)) : !foe ? tr('Waiting for your friend to join…') : room.go ? tr('Get ready!') : tr('{0} joined! Starting…', esc(foe.n));
    return `<div class="race-vs">${slot(me, tr('You'))}<span class="race-x">VS</span>${slot(foe, inv ? esc(inv.n) : tr('Friend'))}</div><p class="race-status">${status}</p>
      ${room ? `<p><small>${esc(dname(room.diff))}</small></p>` : ''}
      ${room && room.stake > 0 ? `<p class="stake-note">${coinIc()} <b>${tr('Stake: {0} coins each. The winner takes {1}.', I.num(room.stake), I.num(room.stake * 2))}</b></p>` : ''}`;
  }
  function showLobby() {
    const host = R.role === 'host';
    modal(`<div class="big">${ic('knife', '⚔️')}</div><h2>${tr('Live duel')}</h2>
      ${host ? `<p>${tr('Send this code or the invite link to a friend:')}</p><div class="race-code" dir="ltr">${R.code}</div>` : ''}
      <div id="race-lobby">${lobbyHtml()}</div>
      <div class="row">${host ? `<button class="primary" data-act="invite">${ic('share', '📤')} ${tr('Send invite')}</button>` : ''}<button class="secondary" data-act="cancel">${tr('Cancel')}</button></div>`, {
      invite: () => share(tr('Duel me on Crime Grid! Same case, first to solve it wins. Code: {0}', R.code), raceUrl(R.code)),
      cancel: () => { raceLeave(); closeModal(); },
    }, true);
  }
  function raceLeave() {
    if (!R) return;
    const r = R;
    R = null;
    if (r.stop) r.stop();
    if (r.phase === 'done' && !r.paid) { R = r; raceReward(true); R = null; }   // left the result screen early: settle with what we know
    if (r.phase === 'play' && store.stakeBet && store.stakeBet.code === r.code) {   // leaving a duel with a stake forfeits it
      const lost = store.stakeBet.amt; store.stakeBet = null; save();
      toast(`<span class="ti">${ic('knife', '⚔️')}</span><span><b>${tr('You left a duel with a stake. The stake was lost.')}</b><small>${tr('You lost {0} coins.', I.num(lost))}</small></span>`);
    }
    if (r.role === 'host' && r.phase === 'lobby') NET.del('races/' + r.code).catch(() => {});
    else if (r.phase !== 'done') NET.put(`races/${r.code}/left/${r.role}`, true).catch(() => {});
  }
  function onRoom(room) {
    const prevFoe = R.foe;
    R.room = room;
    if (!room || !room.host) {
      if (R.phase === 'lobby') return raceFail(null, tr('Your friend cancelled the duel.'));
      if (R.stop) R.stop();
      return;
    }
    R.foe = room[otherRole()] ? { ...room[otherRole()], n: safeName(room[otherRole()].n, 'Detective') } : null;
    if (R.foe && !prevFoe) {   // friends both ways, no link swapping needed
      addFriend({ i: R.foe.i, n: R.foe.n, l: R.foe.l, s: R.foe.s, d: 0, t: R.foe.t, u: R.foe.uid }, true);
      sfx('coin');
    }
    if (!R.puzzle && !R.building) {
      R.building = true;
      const mine = R;
      buildCase(room.diff, room.seed, (puzzle) => { if (R !== mine) return; R.puzzle = puzzle; if (R.room) onRoom(R.room); }, room.seed);
    }
    if (R.role === 'host' && R.foe && !room.go && !R.goSent) { R.goSent = true; NET.put(`races/${R.code}/go`, NET.TS).catch(() => { R.goSent = false; }); }
    if (R.phase === 'lobby') {
      const el = $('race-lobby');
      if (el) el.innerHTML = lobbyHtml();
      if (room.go && R.puzzle) countdown();
      return;
    }
    if (R.phase === 'play') {
      paintRaceBar();
      const foeRes = room.res && room.res[otherRole()];
      if (foeRes && !R.toldFoe) { R.toldFoe = true; toast(`<span class="ti">${ic('knife', '⚔️')}</span><span><b>${tr('{0} solved it first!', esc(R.foe.n))}</b><small>${tr('Finish the case anyway.')}</small></span>`); }
      if (room.left && room.left[otherRole()] && !R.toldLeft) { R.toldLeft = true; toast(`<span class="ti">${ic('knife', '⚔️')}</span><span><b>${tr('{0} left the duel.', esc(R.foe.n))}</b></span>`); }
    }
    raceReferral();
    if (R.phase === 'done') {
      const el = $('race-result');
      if (el) el.innerHTML = raceResultHtml();
      raceReward();
      if (room.res && room.res.host && room.res.guest) {
        const r = R;
        if (r.stop) r.stop();
        if (r.role === 'host') setTimeout(() => NET.del('races/' + r.code).catch(() => {}), 60000);
      }
    }
  }
  function countdown() {
    R.phase = 'count';
    let n = 3;
    const step = () => {
      if (!R || R.phase !== 'count') return;
      if (n === 0) return startRaceGame();
      modal(`<div class="race-count">${n}</div><p>${tr('Dueling {0}', esc(R.foe ? R.foe.n : ''))}</p>`, {}, true);
      sfx('place');
      n--;
      setTimeout(step, 800);
    };
    step();
  }
  function startRaceGame() {
    closeModal();
    R.stake = Math.max(0, Math.min(500, Math.floor(+R.room.stake || 0)));
    if (R.stake > 0) {
      if (coins() < R.stake) { const r = R; toast(`<span class="ti">${ic('knife', '⚔️')}</span><span><b>${tr('Not enough coins for this stake.')}</b></span>`); raceLeave(); showHome(); return r && null; }
      store.coins -= R.stake; store.stakeBet = { code: R.code, amt: R.stake, at: Date.now() }; save(); renderCoins();
    }
    R.phase = 'play';
    if (!$('race-bar')) {
      const bar = document.createElement('div');
      bar.id = 'race-bar';
      bar.className = 'race-bar';
      $('case-sub').insertAdjacentElement('afterend', bar);
    }
    prog('race').cur = null;
    begin(R.room.diff, R.room.seed, R.puzzle, 'race');
    paintRaceBar();
    const mine = R;
    const tick = setInterval(() => {
      if (R !== mine || R.phase !== 'play' || !S || S.slot !== 'race') { clearInterval(tick); return; }
      const k = S.place.filter((x) => x >= 0).length;
      if (k !== R.lastP) { R.lastP = k; NET.put(`races/${R.code}/p/${R.role}`, k).catch(() => {}); }
    }, 1500);
  }
  function paintRaceBar() {
    const bar = $('race-bar');
    if (!bar || !R || !R.foe || !S) return;
    const total = S.P.N, k = Math.min(total, (R.room.p && R.room.p[otherRole()]) || 0), done = R.room.res && R.room.res[otherRole()];
    bar.innerHTML = `${ic('knife', '⚔️')} <b>${esc(R.foe.n)}</b> <span class="rb-track"><i style="width:${Math.round((done ? total : k) / total * 100)}%"></i></span> <span>${done ? tr('Solved!') : `${k}/${total}`}</span>`;
  }
  function raceFinished() {
    if (!R || R.phase !== 'play') return;
    R.phase = 'done';
    R.finAt = Date.now();
    NET.put(`races/${R.code}/res/${R.role}`, { at: NET.TS, sec: S.elapsed, help: S.hints + S.helps }).catch(() => {});
    // the win screen appears a moment later, so keep its result line fresh for a while
    const mine = R;
    let n = 0;
    const t = setInterval(() => {
      const el = $('race-result');
      if (R !== mine || ++n > 120) { clearInterval(t); return; }
      if (el) el.innerHTML = raceResultHtml();
      raceReward();
      if (mine.room && mine.room.res && mine.room.res.host && mine.room.res.guest && el) clearInterval(t);
    }, 500);
  }
  function raceOutcome() {
    const res = (R && R.room && R.room.res) || {}, me = res[R.role], foe = res[otherRole()];
    if (!me) return null;
    if (!foe) return { won: true, me };
    return { won: me.at <= foe.at, me, foe };
  }
  // the result counts once the other result is in, or 3 seconds after ours (so a near-tie is not paid out too early)
  function raceSettled() {
    const o = raceOutcome();
    return !!o && !!(o.foe || Date.now() - (R.finAt || 0) >= 3000);
  }
  function raceResultHtml() {
    if (!R) return '';
    const o = raceOutcome(), name = esc(R.foe ? R.foe.n : ''), st = R.stake || 0;
    if (!o || !raceSettled()) return `<div class="duel">${tr('Checking who was first…')}</div>`;
    if (o.won) return `<div class="duel won">${tr('You won the duel against {0}! +{1} coins', name, st || RACE_WIN)}${o.foe ? `<br><small>${tr('You {0} · {1} {2}', fmtTime(o.me.sec), name, fmtTime(o.foe.sec))}</small>` : ''}</div>`;
    return `<div class="duel lost">${st ? tr('{0} solved it first. You lost {1} coins.', name, I.num(st)) : tr('{0} solved it first.', name)}<br><small>${tr('You {0} · {1} {2}', fmtTime(o.me.sec), name, fmtTime(o.foe.sec))}</small></div>`;
  }
  function raceReward(force) {
    const o = raceOutcome();
    if (!o || R.paid || (!force && !raceSettled())) return;
    R.paid = true;
    const st = R.stake || 0;
    if (st > 0) {
      store.stakeBet = null;
      if (o.won) addCoins(st * 2); else save();   // the stake was taken when the duel started
      if (o.won) sfx('coin');
    } else if (o.won) { addCoins(RACE_WIN); sfx('coin'); }
  }
  // inviting a new detective: both get coins and the exclusive pack, once the newcomer has finished the race
  function raceReferral() {
    const room = R.room, g = room.guest, gDone = room.res && room.res.guest;
    if (!g || !g.nb || !gDone || R.refDone) return;
    R.refDone = true;
    if (R.role === 'guest') {
      if (store.refBy) return;
      store.refBy = room.host.i;
      grantReferral(room.host.n);
    } else {
      store.refs = store.refs || [];
      if (store.refs.includes(g.i) || store.refs.length >= REF_MAX || g.i === myId()) return;
      store.refs.push(g.i);
      grantReferral(g.n);
    }
  }
  function grantReferral(name) {
    store.owned = store.owned || ['classic'];
    const fresh = !store.owned.includes('partners');
    if (fresh) store.owned.push('partners');
    addCoins(REF_COINS);
    sfx('unlock'); confetti();
    toast(`<span class="ti">${ic('gift', '🎁')}</span><span><b>${tr('+{0} coins for dueling {1}!', REF_COINS, esc(name))}</b><small>${fresh ? tr('Partners in Crime pack unlocked. Equip it in the shop.') : tr('Thanks for bringing a new detective!')}</small></span>`);
  }

  /* ---------- online friends: a short detective ID, live profiles and in-game invites (no links needed) ---------- */
  let inboxStop = null, seenTimer = null, tagJob = null;
  const ONLINE_MS = 180000, INVITE_MS = 10 * 60000;
  function publishProfile() {
    const c = myCard();
    return NET.patch('users/' + NET.uid(), { n: String(c.n).slice(0, 18), s: c.s, l: c.l, t: c.t, i: c.i, tag: store.netTag, seen: NET.TS });
  }
  function ensureTag() {
    if (!NET) return Promise.reject(new Error('off'));
    if (store.netOff) { store.netOff = false; save(); }   // inviting a friend means the player wants an ID again
    if (tagJob) return tagJob;
    tagJob = (async () => {
      await NET.signIn();
      const uid = NET.uid();
      if (store.netTag) {
        const t = await NET.get('tags/' + store.netTag).catch(() => null);
        if (!t || t.uid !== uid) { store.netTag = null; save(); }   // e.g. restored on a new phone
      }
      for (let k = 0; k < 5 && !store.netTag; k++) {
        const tag = raceCode();
        try { await NET.put('tags/' + tag, { uid }); store.netTag = tag; save(); } catch (e) { /* taken, try another */ }
      }
      if (!store.netTag) throw new Error('tag');
      await publishProfile();
      startInbox();
      cleanupOnline();
      return store.netTag;
    })();
    tagJob.catch(() => {}).then(() => { tagJob = null; });
    return tagJob;
  }
  function cleanupOnline() {   // profiles unused for ~6 months are removed by any active player, at most once a day
    if (store.netClean === today().num) return;
    store.netClean = today().num; save();
    const old = Date.now() - 180 * 86400000;
    NET.query('users', `&orderBy=%22seen%22&endAt=${old}&limitToFirst=20`).then((users) => {
      for (const [uid, p] of Object.entries(users || {})) {
        NET.del('users/' + uid).then(() => Promise.all([p && p.tag ? NET.del('tags/' + p.tag) : 0, NET.del('inbox/' + uid)])).catch(() => {});
      }
    }).catch(() => {});
  }
  function startInbox() {
    if (inboxStop || !NET || !NET.uid()) return;
    const handled = new Set();
    inboxStop = NET.watch('inbox/' + NET.uid(), (box) => {
      for (const [id, m] of Object.entries(box || {})) if (!handled.has(id)) { handled.add(id); onInbox(id, m); }
    }, () => { inboxStop = null; });
    if (!seenTimer) seenTimer = setInterval(() => { if (!document.hidden && store.netTag) NET.patch('users/' + NET.uid(), { seen: NET.TS }).catch(() => {}); }, 120000);
  }
  function onInbox(id, m) {
    const drop = () => NET.del(`inbox/${NET.uid()}/${id}`).catch(() => {});
    if (!m || !m.from || !m.n || (store.blocked || []).includes(m.from)) return drop();
    m.n = safeName(m.n, 'Detective');
    const card = { i: m.i || String(m.from).slice(0, 12), n: m.n, l: m.l, s: m.s, d: 0, t: 0, u: m.from };
    if (m.t === 'friend') {
      const known = (store.friends || []).some((f) => f.u === m.from);
      addFriend(card, true);
      if (!known) toast(`<span class="ti">${ic('hand', '🤝')}</span><span><b>${tr('{0} added you as a friend!', esc(m.n))}</b><small>${tr('You can now invite each other to duels.')}</small></span>`);
      const fl = $('friend-list'); if (fl) fl.innerHTML = friendListHtml();
      return drop();
    }
    if (m.t === 'no') {
      if (R && R.code === m.code && R.phase === 'lobby') { R.declined = true; const el = $('race-lobby'); if (el) el.innerHTML = lobbyHtml(); }
      return drop();
    }
    if (m.t !== 'race' || !DIFF[m.diff] || Date.now() - (+m.at || 0) > INVITE_MS || (R && R.phase !== 'done')) return drop();
    addFriend(card, true);
    const stake = Math.max(0, Math.min(500, Math.floor(+m.stake || 0)));
    const decline = () => { drop(); NET.put(`inbox/${m.from}/no_${m.code}`, { t: 'no', from: NET.uid(), n: String(myCard().n).slice(0, 18), code: m.code, at: NET.TS }).catch(() => {}); };
    sfx('unlock');
    modal(`<div class="big">${ic('knife', '⚔️')}</div><h2>${tr('Duel invite!')}</h2>
      <div class="race-vs"><div class="race-p"><span class="pf skin-${PACK[m.s] ? m.s : 'classic'}">${face({ name: m.n, g: 'f', letter: m.n[0], color: '#7aa7ff', emoji: '🙂' }, PACK[m.s] ? m.s : 'classic')}</span><b>${esc(m.n)}</b></div></div>
      <p>${stake ? tr('{0} invites you to a live duel ({1}) for {2} coins each. The winner takes {3}!', esc(m.n), esc(dname(m.diff)), I.num(stake), I.num(stake * 2)) : tr('{0} invites you to a live duel ({1}). First to solve the case wins!', esc(m.n), esc(dname(m.diff)))}</p>
      ${stake && coins() < stake ? `<p><small>${tr('You need {0} coins to join this duel.', I.num(stake))}</small></p>` : ''}
      <div class="row"><button class="primary" data-act="join"${stake && coins() < stake ? ' disabled' : ''}>${ic('knife', '⚔️')} ${tr('Join')}</button><button class="secondary" data-act="no">${tr('Not now')}</button></div>
      <p class="forget"><button class="linkish" data-act="blk">${tr('Block {0}', esc(m.n))}</button></p>`, {
      blk: () => { drop(); blockUid(m.from); closeModal(); toast(`<span class="ti">${ic('check', '✓')}</span><span><b>${tr('Blocked. {0} can no longer invite you.', esc(m.n))}</b></span>`); },
      join: () => { drop(); joinRace(m.code, stake); },
      no: () => { decline(); closeModal(); },
    }, true);
  }
  async function refreshFriends() {
    const list = (store.friends || []).filter((f) => f.u);
    if (!list.length) return;
    const online = {};
    await Promise.all(list.map((f) => NET.get('users/' + f.u).then((p) => {
      if (!p) return;
      addFriend({ i: p.i || f.i, n: p.n || f.n, l: p.l, s: p.s, t: p.t, d: f.d, u: f.u, tag: p.tag }, true);
      online[f.u] = p.seen && Date.now() - p.seen < ONLINE_MS;
    }).catch(() => {})));
    const fl = $('friend-list');
    if (fl) fl.innerHTML = friendListHtml(online);
  }
  async function addById(raw) {
    const tag = String(raw || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    const say = (t) => { const el = $('id-msg'); if (el) el.innerHTML = `<small>${t}</small>`; };
    if (tag.length !== 6) { shake($('modal-body')); return say(tr('An ID has 6 letters and numbers.')); }
    try {
      await ensureTag();
      if (tag === store.netTag) return say(tr("That's your own ID."));
      const t = await NET.get('tags/' + tag);
      if (!t || !t.uid) { shake($('modal-body')); return say(tr('No detective with this ID.')); }
      const p = (await NET.get('users/' + t.uid)) || {};
      const known = (store.friends || []).some((f) => f.u === t.uid);
      addFriend({ i: p.i || String(t.uid).slice(0, 12), n: p.n || tag, l: p.l, s: p.s, t: p.t, u: t.uid, tag }, true);
      const c = myCard();
      if (!known) NET.put(`inbox/${t.uid}/f${NET.uid()}`, { t: 'friend', from: NET.uid(), n: String(c.n).slice(0, 18), s: c.s, i: c.i, l: c.l, at: NET.TS }).catch(() => {});
      sfx('coin');
      const inp = $('id-in'); if (inp) inp.value = '';
      say(known ? tr('{0} updated!', esc(p.n || tag)) : tr('{0} added! They will see you in their friends list too.', esc(p.n || tag)));
      refreshFriends();
      if ($('map').classList.contains('active')) showMap();
    } catch (e) { say(navigator.onLine === false ? tr('Live duels need an internet connection.') : tr('Could not reach the duel server. Try again in a moment.')); }
  }
  function forgetOnline() {
    modal(`<h2>${tr('Delete my online ID')}</h2><p>${tr('This removes your detective ID and online profile from the server. Your progress on this device stays. Friends will no longer be able to invite you in the game.')}</p>
      <div class="row"><button class="primary" data-act="yes">${tr('Delete')}</button><button class="secondary" data-act="back">${tr('Back')}</button></div>`, {
      yes: async () => {
        try {
          await NET.signIn();
          const uid = NET.uid(), tag = store.netTag;
          if (inboxStop) { inboxStop(); inboxStop = null; }
          await NET.del('users/' + uid);
          if (tag) await NET.del('tags/' + tag).catch(() => {});
          await NET.del('inbox/' + uid).catch(() => {});
          await NET.deleteAccount().catch(() => {});   // the anonymous sign-in account itself
          store.netTag = null; store.netOff = true; save();
          NET.forget();
          toast(`<span class="ti">${ic('check', '✓')}</span><span><b>${tr('Online ID deleted.')}</b></span>`);
          showFriends();
        } catch (e) { raceFail(e); }
      },
      back: showFriends,
    });
  }

  function handleLink() {
    const h = pendingLink || location.hash;
    if (!h || h.length < 2) return;
    if (!store.profile) { pendingLink = h; return; }   // ask for a name first, then come back here
    pendingLink = null;
    history.replaceState(null, '', location.pathname);
    if (h === '#daily') return startDaily();
    const m = h.match(/^#(friend|challenge|race)=([A-Za-z0-9_-]+)/);
    if (!m) return;
    if (m[1] === 'race') return joinRace(m[2]);
    const data = b64d(m[2]);
    if (m[1] === 'friend') {
      if (!addFriend(data, true)) return;
      showMap();
      offerShareBack(data.n, m[2]);
    } else startChallenge(data);
  }

  function offerTutorial() {
    modal(`<div class="big">${ic('cap', '🎓')}</div><h2>${tr('New here?')}</h2><p>${tr("Take the 2-minute tutorial: we'll solve a tiny case together, step by step.")}</p>
      <div class="row"><button class="primary" data-act="go">${tr('Start tutorial')}</button><button class="secondary" data-act="skip">${tr('I know how to play')}</button></div>`, {
      go: () => { closeModal(); startTutorial(); },
      skip: () => { store.tutorialDone = true; save(); closeModal(); },   // do not ask again on the next launch
    }, true);
  }

  /* ---------- game ---------- */
  function startDaily() {
    const t = today(), diff = DAILY_DIFF[t.weekday], p = prog('daily');
    const go = (puzzle) => { $('loading').classList.remove('show'); begin(diff, t.num, puzzle, 'daily'); };
    if (p.cur && p.cur.caseNum === t.num && p.cur.puzzle) return go(p.cur.puzzle);
    $('loading-text').textContent = tr("Opening today's case file…");
    $('loading').classList.add('show');
    buildCase(diff, t.num, go, 1000000 + t.num);
  }

  function startJourney() {
    const p = prog('journey'), n = p.caseNum, diff = journeyDiff(n);
    const go = (puzzle) => { $('loading').classList.remove('show'); begin(diff, n, puzzle, 'journey'); };
    if (p.cur && p.cur.caseNum === n && p.cur.puzzle) return go(p.cur.puzzle);
    if (p.next && p.next.caseNum === n && p.next.puzzle) { const pz = p.next.puzzle; p.next = null; return go(pz); }
    $('loading-text').textContent = isBoss(n) ? tr('Building a boss level…') : tr('Building the crime scene…');
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
    $('loading-text').textContent = diff === 'extreme' ? tr('Building a really nasty crime scene…') : tr('Building the crime scene…');
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
    $('game').classList.toggle('tut', slot === 'tutorial');
    paintCaseHeader();
    buildLegend();
    setMode('place');
    render();
    window.scrollTo(0, 0);
    requestAnimationFrame(() => { $('play-area').style.top = $('topbar').offsetHeight + 'px'; });
    startTimer();
    if (slot === 'journey' || DIFF[slot]) prefetchNext(slot, caseNum);
    if (slot === 'tutorial') renderCoach();
    else if (!store.seenHowto && !store.tutorialDone) { store.seenHowto = true; save(); showHowto(); }
    else if (slot !== 'race' && !store.seenWhatIf && puzzle.grade && puzzle.grade.level >= 2) showWhatIf();
    checkDone(true);
  }

  // title, subtitle and intro of the open case, in the current language
  function caseText() {
    const P = S.P, slot = S.slot;
    const [title, intro] = slot === 'tutorial' ? [tr('Your First Case'), tr("A quiet evening, a loud scream. Let's learn the ropes together.")] : I.story(P.title, P.intro);
    return { title, intro };
  }
  function paintCaseHeader() {
    if (!S) return;
    const P = S.P, slot = S.slot, { title, intro } = caseText();
    const rb = $('race-bar'); if (rb) rb.hidden = slot !== 'race';
    const label = slot === 'race' ? tr('Live duel: {0}', title) : slot === 'challenge' && S.challenge ? tr("{0}'s challenge: {1}", S.challenge.n, title) : slot === 'daily' ? tr('Daily Case: {0}', title) : slot === 'tutorial' ? title : slot === 'journey' ? tr('Level {0}: {1}', S.caseNum, title) : tr('Level {0}: {1}', S.caseNum, title);
    $('case-title').innerHTML = (ART ? `<span class="tic">${ART.theme(P.theme.id)}</span>` : P.theme.icon + ' ') + esc(label);
    $('intro').textContent = slot === 'race' && R && R.foe ? tr('First to solve it wins. {0} is dueling you right now!', R.foe.n) : slot === 'challenge' && S.challenge ? tr('⚔ {0} solved this in {1}. Can you beat that?', S.challenge.n, fmtTime(S.challenge.time)) : intro;
    updateSub();
  }

  function tutIllustration(kind) {
    const P = S.P;
    if (kind === 'rows') {
      let g = '';
      for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
        const inRow = r === 1, inCol = c === 1, me = r === 1 && c === 1;
        g += `<i class="${inRow || inCol ? 'hl' : ''}${me ? ' me' : ''}" style="--d:${(inRow ? Math.abs(c - 1) : Math.abs(r - 1)) * 0.25 + 0.5}s">${me ? face(P.people[0]) : (inRow || inCol ? '<s>✕</s>' : '')}</i>`;
      }
      return `<div class="ill ill-rows" dir="ltr">${g}</div>`;
    }
    if (kind === 'objs') {
      const it = (name, ok, inner) => `<div class="ob ${ok ? 'yes' : 'no'}"><span>${inner}</span><b>${ok ? '✓' : '✕'}</b></div>`;
      return `<div class="ill ill-objs" dir="ltr">${it('chair', 1, ART.icon('chair'))}${it('bed', 1, ART.icon('bed'))}${it('rug', 1, '<u class="rugp"></u>')}${it('table', 0, ART.icon('table'))}${it('plant', 0, ART.icon('plant'))}${it('tv', 0, ART.icon('tv'))}</div>`;
    }
    if (kind === 'room') {
      return `<div class="ill ill-room" dir="ltr"><div class="rm"><span class="f k">${face(P.people[1])}</span><span class="kn">${ART.ui('knife')}</span><span class="f v">${face(P.people[3])}</span></div><div class="wl"></div><div class="rm out"><span class="f">${face(P.people[0])}</span><span class="f">${face(P.people[2])}</span></div></div>`;
    }
    return '';
  }

  function tutMsg(text, bad) {
    S.tmsg = text ? { text, bad: !!bad } : null;
    const el = $('coach-msg');
    if (!el) return;
    el.textContent = text || '';
    el.className = 'coach-msg' + (text ? (bad ? ' bad' : ' ok') : '');
    if (text) { void el.offsetWidth; el.classList.add('pulse'); }
    if (bad) sfx('wrong');
  }

  function renderCoach() {
    const el = $('coach');
    if (!S || S.tut < 0) { el.hidden = true; el.classList.remove('coach2'); return; }
    const step = TUTORIAL[S.tut];
    el.hidden = false;
    if (ART) {
      const P = S.P, zone = I.zone(P.zones[P.zoneOf[P.solution[P.victim]]].name);
      const dots = Array.from({ length: TUT_STEPS }, (_, k) => `<i class="${k + 1 < step.n ? 'done' : k + 1 === step.n ? 'now' : ''}"></i>`).join('');
      el.classList.add('coach2');
      el.innerHTML = `<div class="coach-top"><span class="coach-step">${tr('Step {0} of {1}', step.n, TUT_STEPS)}</span><span class="coach-dots" aria-hidden="true">${dots}</span><button class="coach-skip" id="coach-skip">${tr('Skip')}</button></div>
        ${step.ill ? tutIllustration(step.ill) : ''}
        <div class="coach-tx">${plain(step.text(P, zone))}</div>
        <div class="coach-msg${S.tmsg ? (S.tmsg.bad ? ' bad' : ' ok') : ''}" id="coach-msg" aria-live="polite">${S.tmsg ? esc(S.tmsg.text) : ''}</div>
        <div class="coach-btns">${S.tut > 0 ? `<button class="secondary coach-back" id="coach-back">${tr('Back')}</button>` : '<span></span>'}${step.next ? `<button class="primary coach-next" id="coach-next">${tr('Next')}</button>` : ''}</div>`;
      $('coach-skip').addEventListener('click', skipTutorial);
      if (S.tut > 0) $('coach-back').addEventListener('click', tutBack);
      if (step.next) $('coach-next').addEventListener('click', () => { S.tmsg = null; S.tut++; renderCoach(); render(); });
      return;
    }
    el.innerHTML = `<div class="coach-face">${ART ? ART.ui('logo') : '🕵️'}</div><div class="coach-tx">${plain(tr(step.text))}</div>
      ${step.next ? `<button class="primary coach-next" id="coach-next">${tr('Next')}</button>` : ''}`;
    if (step.next) $('coach-next').addEventListener('click', () => { S.tut++; renderCoach(); render(); });
  }

  // one step back: undo whatever the previous step did, so the player can always retry
  function tutBack() {
    if (!S || S.tut <= 0) return;
    S.tut--;
    const prev = TUTORIAL[S.tut];
    if (prev.expect) S.place[prev.expect.p] = -1;
    for (let k = S.tut + 1; k < TUTORIAL.length; k++) if (TUTORIAL[k].expect) S.place[TUTORIAL[k].expect.p] = -1;
    S.sel = -1; S.tmsg = null; S.solvedGrid = false; S.wrongAccuse = [];
    renderCoach(); render();
  }
  function skipTutorial() {
    store.tutorialDone = true; store.seenHowto = true; save();
    if (S) S.tut = -1;
    renderCoach();
    showHome();
  }
  // the player tapped the right square (with or without picking the card first)
  function tutPlace(p, cell) {
    S.place[p] = cell; S.sel = -1; sfx('place');
    const words = PRAISE();
    S.tmsg = { text: words[S.tut % words.length], bad: false };
    S.tut++;
    renderCoach(); render(); checkDone(false);
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
    const dn = dname(S.diff);
    const kind = S.slot === 'race' ? tr('Live duel') + ' · ' + dn : S.slot === 'challenge' ? tr('Challenge') + ' · ' + dn : S.slot === 'daily' ? tr('Daily') + ' · ' + dn : S.slot === 'tutorial' ? tr('Tutorial') : S.slot === 'journey' ? tr('Level {0}', S.caseNum) + ' · ' + dn + (isBoss(S.caseNum) ? ' · ' + tr('Boss') : '') : dn + ' · ' + tr('Level {0}', S.caseNum);
    $('case-sub').textContent = ART ? `${fmtTime(S.elapsed)} · ${kind} · ${I.themeName(S.P.theme.name)}` : `${I.themeName(S.P.theme.name)} · ${kind} · ⏱ ${fmtTime(S.elapsed)}`;
  }

  function shake(el) { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }
  function setStatus(msg, bad) { $('status').textContent = plain(msg); if (bad) { shake($('status')); sfx('wrong'); } }

  function setMode(m) {
    S.mode = m;
    $('mode-place').classList.toggle('on', m === 'place');
    $('mode-x').classList.toggle('on', m === 'x');
    document.body.classList.toggle('mode-x', m === 'x');
    $('mode-draft').classList.toggle('on', m === 'draft');
    if (m === 'x') { S.sel = -1; setStatus(tr('Mark mode: tap a square to cross it out ✕')); }
    else if (m === 'draft') setStatus(S.sel >= 0 ? tr('Draft: tap every square where {0} might be.', S.P.people[S.sel].name) : tr('Draft mode: pick a suspect, then tap all the squares where they might be.'));
    else setStatus(tr('Pick a suspect below, then tap a square.'));
    render();
  }

  function snapshot() {
    S.history.push({ place: S.place.slice(), xs: [...S.xs], draft: JSON.parse(JSON.stringify(S.draft)) });
    if (S.history.length > 300) S.history.shift();
  }
  const whoAt = (cell) => S.place.indexOf(cell);
  // squares crossed out automatically: the row and column of everyone already placed
  function autoXSet() {
    const N = S.P.N, a = new Set();
    S.place.forEach((c) => { if (c < 0) return; const r = Math.floor(c / N), k = c % N; for (let t = 0; t < N; t++) { a.add(r * N + t); a.add(t * N + k); } a.delete(c); });
    return a;
  }

  /* Mark mode: tap a square, or slide a finger across a row/column to cross out everything touched */
  (function setupSwipe() {
    const board = $('board');
    let paint = null, snapped = false, last = -1;
    const cellAt = (e) => { const el = document.elementFromPoint(e.clientX, e.clientY); const c = el && el.closest && el.closest('.cell'); return c && board.contains(c) ? +c.dataset.i : -1; };
    const apply = (i) => {
      if (i < 0 || i === last) return;
      last = i;
      if (S.solvedGrid || whoAt(i) >= 0 || autoXSet().has(i)) return;
      const has = S.xs.has(i);
      if (paint === null) paint = !has;
      if (has === paint) return;
      if (!snapped) { snapshot(); snapped = true; }
      if (paint) { S.xs.add(i); delete S.draft[i]; } else S.xs.delete(i);
      const c = board.querySelector(`.cell[data-i="${i}"]`);
      const m = c && c.querySelector('.xmark');
      if (paint && c && !m) { const x = document.createElement('div'); x.className = 'xmark'; x.textContent = '✕'; c.appendChild(x); }
      if (!paint && m) m.remove();
    };
    board.addEventListener('pointerdown', (e) => {
      if (S.mode !== 'x' || S.tut >= 0) return;
      paint = null; snapped = false; last = -1;
      board.dataset.swiping = '1';
      apply(cellAt(e));
    });
    board.addEventListener('pointermove', (e) => { if (board.dataset.swiping) apply(cellAt(e)); });
    const end = () => { if (!board.dataset.swiping) return; delete board.dataset.swiping; if (snapped) { sfx('tick'); render(); persist(); } };
    ['pointerup', 'pointercancel', 'pointerleave'].forEach((n) => board.addEventListener(n, end));
    board.addEventListener('touchmove', (e) => { if (board.dataset.swiping) e.preventDefault(); }, { passive: false });
  })();

  function onCell(i) {
    if (S.solvedGrid) return;
    const P = S.P, occ = whoAt(i);
    if (S.mode === 'x') {
      if (occ >= 0 || autoXSet().has(i)) return;
      snapshot();
      if (S.xs.has(i)) S.xs.delete(i); else { S.xs.add(i); delete S.draft[i]; }
      render(); persist();
      return;
    }
    if (S.mode === 'draft') {
      if (S.sel < 0) { setStatus(tr('Pick a suspect first, then tap the squares where they might be 👇'), true); return; }
      if (E.isBlocked(P.obj[i])) { setStatus(tr('Nobody can stand there!'), true); return; }
      if (occ >= 0) return;
      if (S.xs.has(i) || autoXSet().has(i)) { setStatus(tr('Nobody can stand there!'), true); return; }
      snapshot();
      const list = S.draft[i] || [];
      const k = list.indexOf(S.sel);
      if (k >= 0) list.splice(k, 1); else { list.push(S.sel); list.sort((x, y) => x - y); }
      if (list.length) S.draft[i] = list; else delete S.draft[i];
      sfx('tick');
      render(); persist();
      return;
    }
    if (S.tut >= 0 && ART) {
      const step = TUTORIAL[S.tut];
      if (!step.expect) { tutMsg(step.next ? tr('Tap Next to continue 🙂') : tr('Pick the killer below 👇'), true); return; }
      if (i === step.expect.cell) return tutPlace(step.expect.p, i);
      tutMsg(S.sel >= 0 && S.sel !== step.expect.p ? tr('Not that card. Tap the glowing card, then the glowing square.') : tr('Not that square. Tap the glowing one 🙂'), true);
      return;
    }
    if (S.tut >= 0) {
      const step = TUTORIAL[S.tut];
      if (!step.expect) { setStatus(step.next ? tr('Tap Next in the box above first.') : tr('Pick a suspect card below.'), true); return; }
      if (S.sel < 0) { setStatus(tr("First tap {0}'s card below 👇", P.people[step.expect.p].name), true); return; }
      if (S.sel !== step.expect.p) { setStatus(tr("Let's place {0} first.", P.people[step.expect.p].name), true); S.sel = -1; render(); return; }
      if (i !== step.expect.cell) { setStatus(tr('Not quite. Read the clue again 🙂'), true); return; }
      S.place[S.sel] = i; S.sel = -1; S.tut++; sfx('place');
      setStatus('');
      renderCoach(); render(); checkDone(false);
      return;
    }
    if (S.sel >= 0) {
      if (E.isBlocked(P.obj[i])) { setStatus(I.lang === 'en' ? `Nobody can stand on ${E.OBJECTS[P.obj[i]].name === 'TV' ? 'the TV' : 'the ' + E.OBJECTS[P.obj[i]].name}!` : tr('Nobody can stand there!'), true); return; }
      snapshot();
      if (occ >= 0) S.place[occ] = -1;
      S.place[S.sel] = i; S.xs.delete(i); sfx('place');
      clearDrafts(S.sel);
      S.sel = -1;
      setStatus(tr('Pick a suspect below, then tap a square.'));
      render(); persist(); checkDone(false);
      return;
    }
    if (occ >= 0) {
      snapshot();
      S.place[occ] = -1; S.sel = occ;
      setStatus(tr('You picked up {0}. Tap a new square.', P.people[occ].name));
      render(); persist();
      return;
    }
    setStatus(tr('First pick a suspect from the list below 👇'), true);
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
    if (S.sel >= 0) setStatus(S.mode === 'draft' ? tr('Draft: tap every square where {0} might be. Tap again to erase.', S.P.people[p].name) : tr('Where was {0}? Tap a square.', S.P.people[p].name));
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
    if (conflicts().size) { if (!silent) setStatus(tr("Two people share a row or column. That can't be right!"), true); return; }
    if (!S.place.every((x, p) => x === P.solution[p])) {
      if (!silent) setStatus(tr("🤔 Something doesn't add up… someone breaks one of their clues."), true);
      return;
    }
    S.solvedGrid = true;
    persist(); render();
    setStatus(tr('✅ Everyone is in place! Now… who did it?'));
    setTimeout(showAccuse, 450);
  }

  /* ---------- drawing ---------- */
  // board side in pixels. On short phone screens small boards are drawn smaller, so more clue cards fit under them
  function boardPx(N) {
    const h = window.innerHeight, w = window.innerWidth;
    let px = Math.min(w * 0.94, 470, h * (h <= 720 ? 0.39 : 0.44));
    if (h <= 760 && w <= 480 && N <= 6) px = Math.min(px, h * 0.35);
    return Math.floor(px);
  }
  function zoneLabelCells(P, occupied) {
    // one label per area, on a square near its bottom, without two labels overlapping
    const N = P.N, cellPx = boardPx(N) / N;
    const fontPx = Math.max(8, cellPx * 0.19);
    const span = (z) => (I.zone(P.zones[z].name).n.length * fontPx * 0.58 + 10) / cellPx; // label width in squares
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
        const score = r * 10 + Math.min(run, w) * 3 + (P.obj[i] ? -2 : 0) - (occupied && occupied.has(i) ? 60 : 0) - Math.abs(c - (N - 1) / 2) * 0.2;
        cells.push([i, score]);
      });
      cells.sort((a, b) => b[1] - a[1]);
      let chosen = cells[0][0];
      for (const [i] of cells) {
        const r = Math.floor(i / N), c = i % N + 0.5;
        const from = Math.max(0, c - w / 2), to = Math.min(N, c + w / 2);
        if (!taken.some(([tRow, tf, tt]) => tRow === r && from < tt && to > tf)) { chosen = i; break; }
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
    const P = S.P, N = P.N, big = N > 6, autoX = autoXSet();
    const board = $('board');
    board.style.setProperty('--n', N);
    board.style.setProperty('--bs', boardPx(N) + 'px');
    board.style.gridTemplateColumns = `repeat(${N}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${N}, 1fr)`;
    board.innerHTML = '';
    const labels = zoneLabelCells(P, new Set(S.place)), bad = conflicts();
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
      if (ART && step && step.expect && i === step.expect.cell && S.place[step.expect.p] < 0 && S.sel === step.expect.p) cell.insertAdjacentHTML('beforeend', '<div class="coach-arrow cell-arrow"></div>');
      const w = P.walls[i];
      ['n', 's', 'e', 'w'].forEach((s) => { if (w[s] && !isOuter(N, i, s)) cell.classList.add('wall-' + s); });
      const o = P.obj[i], def = o && E.OBJECTS[o];
      if (def && def.css === 'rug') cell.classList.add('rug');
      const who = whoAt(i);
      if (who >= 0) cell.classList.add('has-token');
      if (S.solvedGrid && P.zoneOf[i] === P.zoneOf[P.solution[P.victim]]) cell.classList.add('vzone');
      if (S.sel >= 0 && (usedR.has(Math.floor(i / N)) || usedC.has(i % N) || E.isBlocked(o))) cell.classList.add('dim');
      const crossed = who < 0 && (S.xs.has(i) || autoX.has(i));
      const drafts = who < 0 && !crossed ? S.draft[i] || [] : [];
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
        lb.className = 'zone-label' + (i % N === 0 ? ' zl-l' : i % N === N - 1 ? ' zl-r' : ''); lb.textContent = I.zone(P.zones[labels[i]].name).n;
        cell.appendChild(lb); cell.classList.add('has-zl');
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
        if (crossed) { const x = document.createElement('div'); x.className = 'xmark' + (S.xs.has(i) ? '' : ' auto'); x.textContent = '✕'; cell.appendChild(x); }
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
      cell.dataset.i = i;
      cell.addEventListener('click', () => { if (S.mode !== 'x') onCell(i); });
      board.appendChild(cell);
    }

    const notes = $('extra');
    notes.hidden = !S.extra.length;
    notes.innerHTML = `<b>${ART ? '' : '🧾 '}${tr('Extra clues from headquarters')}</b>` + S.extra.map((x) => `<div>• ${rich((x.d && I.fact(x.d, P)) || x.text)}</div>`).join('');

    const list = $('suspects');
    list.innerHTML = '';
    P.people.forEach((person, p) => {
      const card = document.createElement('button');
      card.className = 'suspect' + (person.isVictim ? ' is-victim' : '') + (S.sel === p ? ' sel' : '') + (S.place[p] >= 0 ? ' placed' : '')
        + (S.tut >= 0 && TUTORIAL[S.tut].card === p && S.place[p] < 0 ? ' coach-hl' : '');
      const clues = person.isVictim
        ? `<div>${tr('<b>The victim.</b> Found in the last remaining square.')}</div>`
        : clueLines(person).map((c) => `<div>${rich(c)}</div>`).join('');
      card.style.setProperty('--sc', person.color);
      if (ART && S.place[p] >= 0) card.dataset.stamp = tr('FILED');
      card.innerHTML = `<div class="face">${face(person)}<span class="lt" style="background:${person.color}">${person.letter}</span></div>
        <div><div class="nm">${esc(person.name)}${person.isVictim ? (ART ? ` <span class="rip">${tr('rip')}</span>` : ' ☠️') : ''}</div><div class="cl">${clues}</div></div>`;
      if (ART && S.tut >= 0 && TUTORIAL[S.tut].card === p && S.place[p] < 0 && S.sel !== p) card.insertAdjacentHTML('beforeend', '<div class="coach-arrow"></div>');
      card.addEventListener('click', () => onSuspect(p));
      list.appendChild(card);
    });
    renderAccuse();
    updateMeter();
  }

  // progress: how many of the people are already placed on the board (v2 only)
  function updateMeter() {
    const n = $('meter-n'), m = $('meter'), f = $('meter-fill');
    if (!n || !m || !S) return;
    const total = S.P.people.length, done = S.place.filter((x) => x >= 0).length;
    n.hidden = m.hidden = false;
    n.textContent = `${done}/${total}`;
    n.title = tr('{0}/{1} placed', done, total);
    n.classList.toggle('full', done === total);
    f.style.width = (100 * done / total) + '%';
  }

  // the clue lines of a suspect in the current language (English comes straight from the engine)
  function clueLines(person) {
    const P = S.P;
    return (person.rawClues || []).map((c, i) => I.clue(c, P, person) || (person.clues || [])[i] || '');
  }

  function buildLegend() {
    if (!S) return;
    const P = S.P, T = P.theme;
    const present = [...new Set(P.obj.filter(Boolean))];
    const show = (o) => (ART && ART.has(o) ? `<span class="ic lg">${ART.icon(o)}</span>` : E.OBJECTS[o].e || (o === 'rug' ? '▨' : '▬')) + ' ' + I.objName(o);
    const can = present.filter((o) => !E.isBlocked(o)).map(show);
    const cant = present.filter((o) => E.isBlocked(o)).map(show);
    const local = I.legend(P, can, cant);
    if (local) { $('legend').innerHTML = `<summary>${ART ? '' : '📖 '}${tr("Detective's dictionary")}</summary><ul>${local}</ul>`; return; }
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
    modal(`<div class="big">${ic('trash', '🗑️')}</div><h2>${tr('Clear the board?')}</h2><p>${tr('All placements, drafts and ✕ marks will be erased. Extra clues stay.')}</p>
      <div class="row"><button class="primary" data-act="yes">${tr('Yes, clear')}</button><button class="secondary" data-act="close">${tr('Cancel')}</button></div>`, {
      yes: () => { snapshot(); S.place.fill(-1); S.xs.clear(); S.draft = {}; S.sel = -1; render(); persist(); closeModal(); },
    });
  });
  $('hint').addEventListener('click', () => {
    if (S.solvedGrid) return;
    if (S.tut >= 0) { setStatus(tr('Follow the hints in the box above 🙂')); return; }
    const price = (k) => `<span class="price">${coinIc()} ${COST[k]}</span>`;
    modal(`<div class="big">${ic('bulb', '💡')}</div><h2>${tr('Need a hand, detective?')}</h2>
      <p>${tr('You have {0} <b>{1}</b> coins.', coinIc(), I.num(coins()))}</p>
      <div class="help-list">
        <button class="primary" data-act="clue">${ic('note', '🧾')} ${tr('Give me an extra clue')} ${price('clue')}<small>${tr("A fact about the whole scene. Nobody's spot is revealed.")}</small></button>
        <button class="secondary" data-act="check">${ic('check', '✔️')} ${tr('Check my placements')} ${price('check')}<small>${tr('Tells you if someone on the board is in the wrong spot.')}</small></button>
        <button class="secondary" data-act="reveal">${ic('eye', '👁️')} ${tr('Reveal one suspect')} ${price('reveal')}<small>${tr('The last resort.')}</small></button>
        ${adBridgeReady() && adHintsLeft() > 0 ? `<button class="secondary" data-act="adclue">${ic('note', '🎬')} ${tr('Watch a short video: free clue')}<small>${tr('{0} left today', adHintsLeft())}</small></button>` : ''}
      </div>
      <div class="row"><button class="secondary" data-act="close">${tr('Never mind')}</button></div>`, {
      clue: () => { closeModal(); if (pay('clue')) giveExtraClue(); },
      check: () => { closeModal(); if (pay('check')) checkPlacements(); },
      reveal: () => { closeModal(); if (pay('reveal')) revealOne(); },
      adclue: () => { closeModal(); watchAd(() => { if (adHintsLeft() > 0) { store.adHints.n++; save(); giveExtraClue(); } }); },
    });
  });

  function pay(kind) {
    if (coins() < COST[kind]) { setStatus(tr('Not enough coins ({0} needed). Solve cases and collect your daily gift to earn more!', COST[kind]), true); return false; }
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
    if (!facts.length) { setStatus(tr('Headquarters has no more extra clues for this case. Try another kind of help.'), true); return; }
    const top = facts[0].score;
    const pool = facts.filter((f) => f.score >= top * 0.8);
    const f = pool[Math.floor(Math.random() * pool.length)];
    S.extra.push({ id: f.id, text: f.text, d: f.d });
    S.helps++;
    setStatus(tr('🧾 New clue added above the suspects.'));
    render(); persist();
    const el = $('extra');
    el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function checkPlacements() {
    const P = S.P;
    const placed = S.place.map((x, p) => [x, p]).filter(([x]) => x >= 0);
    if (!placed.length) { setStatus(tr('Place somebody on the board first, then I can check.'), true); return; }
    S.helps++;
    const wrong = placed.filter(([x, p]) => x !== P.solution[p]);
    if (!wrong.length) setStatus(trp(placed.length, '✅ So far so good: the 1 person you placed is in the right spot.', '✅ So far so good: all {0} people you placed are in the right spot.'));
    else setStatus(wrong.length === 1 ? tr('🔴 {0} is in the wrong spot.', P.people[wrong[0][1]].name) : trp(wrong.length, '🔴 1 person is in the wrong spot.', '🔴 {0} people are in the wrong spot.'), true);
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
    setStatus(wasWrong ? tr('👁️ {0} was in the wrong place. Fixed it.', person.name) : tr('👁️ Placed {0} in the right spot.', person.name));
    render(); persist(); checkDone(false);
  }
  $('back').addEventListener('click', () => { persist(); showHome(); });
  $('howto-home').addEventListener('click', showHowto);
  $('howto-game').addEventListener('click', showHowto);
  $('greet').addEventListener('click', askProfile);
  $('tut-btn').addEventListener('click', startTutorial);
  $('ach-btn').addEventListener('click', showTrophies);
  $('shop-btn').addEventListener('click', showShop);
  $('settings-btn').addEventListener('click', showSettings);
  $('map-back').addEventListener('click', () => { $('map').classList.remove('active'); showHome(); });
  $('map-friends').addEventListener('click', showFriends);
  window.addEventListener('hashchange', handleLink);
  $('coins-pill').addEventListener('click', showShop);
  // bottom navigation on the home screen (v2 only): the page has no #home-nav in the emoji edition
  if ($('home-nav')) {
    const more = $('more-panel'), navBtns = ['cases', 'daily', 'shop', 'friends', 'more'].reduce((o, k) => (o[k] = $('nav-' + k), o), {});
    const mark = (k) => Object.entries(navBtns).forEach(([n, b]) => { b.classList.toggle('on', n === k); if (n === k) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
    const openMore = (free) => {
      more.hidden = false; $('free-fold').open = !!free; mark(free ? 'cases' : 'more');
      (free ? $('free-fold') : more).scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    navBtns.cases.addEventListener('click', () => { if (!more.hidden && $('free-fold').open) { more.hidden = true; $('free-fold').open = false; mark('cases'); window.scrollTo({ top: 0, behavior: 'smooth' }); } else openMore(true); });
    navBtns.daily.addEventListener('click', showDailyMenu);
    navBtns.shop.addEventListener('click', showShop);
    navBtns.friends.addEventListener('click', showFriends);
    navBtns.more.addEventListener('click', () => { if (!more.hidden && !$('free-fold').open) { more.hidden = true; mark('cases'); } else openMore(false); });
    const resetNav = () => { more.hidden = true; $('free-fold').open = false; mark('cases'); };
    window.__resetHomeNav = resetNav;
  }


  /* ---------- modals ---------- */
  let modalActions = {}, modalSticky = false;
  function modal(html, actions, sticky) {
    $('modal-body').innerHTML = html;
    $('modal-body').className = /class="(shop|ach|friend)-list/.test(html) ? 'modal long' : 'modal';
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

  // shown once, before the first case that needs trial-and-contradiction reasoning
  function showWhatIf() {
    store.seenWhatIf = true; save();
    modal(`<div class="big">${ic('bulb', '💡')}</div><h2>${tr('New trick: "What if?"')}</h2>
      <p>${tr('Stuck? Pretend a suspect stands on one square and follow the clues.')}</p>
      <div class="howto"><ul>
        <li>${tr('Pencil the guess in with <b>Draft</b>, so it is only an idea.')}</li>
        <li>${tr('If two people end up in the same row or column, or a clue breaks, the guess was impossible.')}</li>
        <li>${tr('Cross that square out with <b>Mark</b> and try another one.')}</li></ul></div>
      <p><small>${tr('Bigger cases need this a lot. Take your time.')}</small></p>
      <div class="row"><button class="primary" data-act="close">${tr('Got it')}</button></div>`);
  }
  function showHowto() {
    modal(`<div class="big">${ic('logo', '👮')}</div><h2>${tr('Welcome, detective!')}</h2>
      <div class="howto">
      <p>${tr('There was (yep, you guessed it) a murder last night. The good news? We have a lineup of suspects and a clue about each of them.')}</p>
      <p>${tr('<b>Your goal:</b> find the murderer: the one person who was <b>alone with the victim</b> in the same room.')}</p>
      <ul>
        <li>${tr('Every person was in a <b>different row</b> and a <b>different column</b>, like sudoku.')}</li>
        <li>${tr("Some objects can be stood on (chairs, beds, rugs…), others can't (tables, plants…). Check the dictionary under the suspects.")}</li>
        <li>${tr('The victim (<b>V</b>) is in the <b>last remaining square</b>.')}</li>
      </ul>
      <p>${tr('<b>How to play:</b> tap a suspect card, then a square. Tap a placed suspect to pick them up again. Use <b>✏️ Draft</b> to pencil in every square where a suspect <i>might</i> be, and <b>✕ Mark</b> to cross out squares nobody can use.')}</p>
      <p>${tr('<b>Stuck?</b> 💡 gives you an extra clue about the whole scene, checks your board, or (last resort) reveals a suspect.')}</p>
      <p>${tr('Each scene is different: a mansion, a ship, a forest, a space station and more.')}</p>
      </div>
      <div class="row"><button class="primary" data-act="close">${tr("Let's investigate!")}</button><button class="secondary" data-act="tut">${tr('Guided tutorial')}</button></div>`, {
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
        const P = S.P, zone = I.zone(P.zones[P.zoneOf[P.solution[P.victim]]].name);
        if (p === P.murderer) return win();
        if (!S.wrongAccuse.includes(p)) S.wrongAccuse.push(p);
        persist(); renderAccuse();
        $('acc-msg').textContent = tr("{0} wasn't alone with {1} {2}! Look again.", P.people[p].name, P.people[P.victim].name, zone.in);
        if (ART && S.tut >= 0) tutMsg(tr('Not them. Who else was in the same room? Try the glowing one 🙂'), true);
        shake(el); sfx('wrong');
      });
    }
    const on = !!(S && S.solvedGrid);
    el.hidden = !on;
    $('game').classList.toggle('accusing', on);
    if (!on) return;
    const P = S.P, v = P.people[P.victim], zone = I.zone(P.zones[P.zoneOf[P.solution[P.victim]]].name);
    if (S.won) {
      const m = P.people[P.murderer];
      const nextLabel = S.slot === 'journey' ? tr('Level {0} →', S.caseNum + 1) : S.slot === 'tutorial' ? tr('Play level 1 →') : S.slot === 'daily' || S.slot === 'challenge' || S.slot === 'race' ? '' : tr('Next case →');
      el.innerHTML = `<div class="acc-t">${tr('Case closed: <b>{0}</b> did it.', esc(m.name))}</div>
        <div class="acc-btns">${nextLabel ? `<button class="primary" data-next="1">${nextLabel}</button>` : ''}<button class="secondary" data-home="1">${tr('Menu')}</button></div>`;
      return;
    }
    const btns = P.people.map((person, p) => person.isVictim ? '' :
      `<button data-p="${p}" class="${S.wrongAccuse.includes(p) ? 'nope' : ''}"><span class="af">${face(person)}</span>${esc(person.name)}</button>`).join('');
    el.innerHTML = `<div class="acc-t">${ic('knife', '🔪')} <b>${tr('Who did it?')}</b> ${v.g === 'm' ? tr('{0} was found {1} (highlighted). Who was alone with him?', esc(v.name), `<b>${esc(zone.in)}</b>`) : tr('{0} was found {1} (highlighted). Who was alone with her?', esc(v.name), `<b>${esc(zone.in)}</b>`)}</div>
      <div class="acc-row">${btns}</div><div class="acc-msg" id="acc-msg"></div>`;
    if (ART && S.tut >= 0) {
      const b = el.querySelector(`button[data-p="${P.murderer}"]`);
      if (b) { b.classList.add('coach-hl'); b.insertAdjacentHTML('beforeend', '<div class="coach-arrow"></div>'); }
    }
  }

  function win() {
    const P = S.P, pg = prog(S.slot);
    const m = P.people[P.murderer], v = P.people[P.victim];
    const zone = I.zone(P.zones[P.zoneOf[P.solution[P.victim]]].name);
    stopTimer();
    S.won = true; renderAccuse();
    if (S.slot === 'tutorial') {
      store.tutorialDone = true; store.seenHowto = true; save();
      S.tut = -1; renderCoach();
      modal(`<div class="big">${ic('cap', '🎓')}</div><h2>${tr('You did it, detective!')}</h2>
        <p>${tr('<b>{0}</b> was alone with {1} {2}. Case closed!', 'Ben', 'Victor', zone.in)}</p>
        <div class="howto"><p>${tr('Real cases have more suspects and trickier clues. Your tools:')}</p><ul>
          <li>${tr('<b>Draft</b>: pencil in every square where a suspect <i>might</i> be.')}</li>
          <li>${tr('<b>Mark</b>: cross out squares nobody can use.')}</li>
          <li>${tr("<b>Help</b>: an extra clue when you're stuck.")}</li></ul></div>
        <div class="row"><button class="primary" data-act="first">${tr('Play level 1')}</button><button class="secondary" data-act="home">${tr('Menu')}</button></div>`, {
        first: () => { closeModal(); startJourney(); },
        home: () => { closeModal(); showHome(); },
      });
      return;
    }
    const nStars = !S.hints && !S.helps && !S.wrongAccuse.length ? 3 : !S.hints ? 2 : 1;
    let earned = (COIN_BASE[S.diff] + (nStars === 3 ? 5 : nStars === 2 ? 2 : 0)) * (S.slot === 'daily' ? 2 : 1);
    const ret = retentionOnWin({ diff: S.diff, slot: S.slot, stars: nStars, clean: !S.hints && !S.helps, hints: S.hints });
    earned += ret.coins;
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
      dailyTxt = `<br>${ic('flame', '🔥')} ${tr('{0}-day streak! Come back tomorrow for a new case.', n)}`;
      if (n > 0 && n % 7 === 0) { store.freezes = Math.min(2, (store.freezes || 0) + 1); dailyTxt += `<br>${ic('gift', '🎁')} ${tr('Streak freeze earned! It saves your streak if you miss one day.')}`; }
    } else if (S.slot === 'race') {
      pg.cur = null;
      raceFinished();
      dailyTxt = `<div id="race-result">${raceResultHtml()}</div>`;
    } else if (S.slot === 'challenge') {
      pg.cur = null;
      const c = S.challenge, diff = c ? S.elapsed - c.time : 0;
      if (c && diff < 0) store.coins += 30;
      dailyTxt = c ? `<div class="duel ${diff < 0 ? 'won' : 'lost'}">${diff < 0 ? tr('You beat {0} by {1}! +30 coins', esc(c.n), fmtTime(-diff)) : diff === 0 ? tr('A perfect tie with {0}!', esc(c.n)) : tr('{0} was faster by {1}.', esc(c.n), fmtTime(diff))}<br><small>${tr('You {0} · {1} {2}', fmtTime(S.elapsed), esc(c.n), fmtTime(c.time))}</small></div>` : '';
    } else {
      if (S.slot === 'journey') { store.jStars = store.jStars || {}; store.jStars[S.caseNum] = Math.max(store.jStars[S.caseNum] || 0, nStars); }
      pg.solved++; pg.caseNum++; pg.cur = null;
      isBest = !S.hints && !S.helps && (pg.best == null || S.elapsed < pg.best);
      if (isBest) pg.best = S.elapsed;
    }
    save();
    const showResult = () => {
    sfx('win'); confetti();
    const levelTxt = S.slot === 'journey' ? `<div class="lvl-done">${tr('Level {0} complete!', S.caseNum)}</div>` : '';
    const helpTxt = [S.helps ? '🧾 ' + trp(S.helps, '1 clue/check', '{0} clues/checks') : '', S.hints ? '👁️ ' + trp(S.hints, '1 reveal', '{0} reveals') : ''].filter(Boolean).join(' · ');
    const lockLine = m.g === 'm' ? tr("He's on the way to jail.") : tr("She's on the way to jail.");
    const hasNext = S.slot !== 'daily' && S.slot !== 'challenge' && S.slot !== 'race';
    if (ART) {
      const bestSec = isBest ? S.elapsed : (store[S.diff] && store[S.diff].best);
      const stat = (cls, html) => `<span class="w-stat ${cls}">${html}</span>`;
      const stats = [stat('', `⏱ ${fmtTime(S.elapsed)}`),
        bestSec != null ? stat(isBest ? 'hot' : '', `${ic('trophy', '🏆')} ${isBest ? tr('New personal best!') : tr('Best {0}', fmtTime(bestSec))}`) : '',
        stat('', esc(dname(S.diff)))].filter(Boolean).join('<i>·</i>');
      const hdr = S.slot === 'journey' ? tr('Level {0} complete!', S.caseNum) : tr('Case closed!');
      const extra = ret.lines.length ? `<details class="w-more"><summary>${ic('gift', '🎁')} ${tr('Bonuses ({0})', ret.lines.length)}</summary><div class="ret-lines">${ret.lines.map((l) => `<div>${l}</div>`).join('')}</div></details>` : '';
      modal(`<div class="win2">
        <div class="w-h">${esc(hdr)}</div>
        <div class="w-polaroid"><div class="w-photo">${face(m)}</div><div class="w-name">${esc(m.name)}</div><div class="w-stamp">${tr('CLOSED')}</div></div>
        <p class="w-story">${tr('<b>{0}</b> was alone with {1} {2}.', esc(m.name), esc(v.name), esc(zone.in))} ${lockLine} ${ic('lock', '🔒')}</p>
        <div class="w-stars" dir="ltr">${[1, 2, 3].map((k) => `<span class="ic w-star${k <= nStars ? ' on' : ''}" style="--i:${k}">${ART.ui(k <= nStars ? 'star' : 'starOff')}</span>`).join('')}</div>
        <div class="w-coins">${coinIc()} <span>+<b id="earned">0</b></span></div>
        ${adBridgeReady() && earned > 0 && S.slot !== 'race' ? `<button class="secondary w-sec" data-act="dbl">${ic('coin', '🪙')} ${tr('Watch a short video: double coins (+{0})', I.num(earned))}</button>` : ''}
        <div class="w-stats">${stats}</div>
        ${dailyTxt ? `<div class="w-note">${dailyTxt.replace(/^<br>/, '')}</div>` : ''}
        ${shareCardHtml(nStars)}
        ${extra}
        <div class="w-actions">
          <button class="primary w-main" data-act="${hasNext ? 'next' : 'shareres'}">${hasNext ? (S.slot === 'journey' ? tr('Level {0} →', S.caseNum + 1) : tr('Next case →')) : `${ic('share', '📤')} ${tr('Share result')}`}</button>
          ${hasNext ? `<button class="secondary w-sec share-res" data-act="shareres">${ic('share', '📤')} ${tr('Share result')}</button>` : ''}
          <div class="w-links"><button data-act="home">${tr('Menu')}</button><button data-act="duel">${ic('knife', '⚔️')} ${S.slot === 'race' ? tr('New duel') : S.slot === 'challenge' ? tr('Challenge back') : tr('Challenge a friend')}</button></div>
        </div></div>`, {
      next: nextCase,
      shareres: () => shareResult(nStars),
      duel: () => (S.slot === 'race' ? raceMenu() : share(tr('I solved "{0}" in {1} on Crime Grid. Can you beat my time?', caseText().title, fmtTime(S.elapsed)), challengeLink())),
      home: () => { closeModal(); showHome(); },
    });
      $('modal-body').classList.add('win-modal');
      const dbl = $('modal-body').querySelector('[data-act="dbl"]');
      if (dbl) dbl.addEventListener('click', () => { dbl.disabled = true; watchAd(() => { addCoins(earned); sfx('coin'); dbl.textContent = tr('Coins doubled!'); }); });
    } else {
      modal(`<div class="big">${ART ? `<span class="ic win-face">${face(m)}</span><span class="ic">${ART.ui('siren')}</span>` : m.emoji + '🚔'}</div><h2>${tr('Case closed!')}</h2>
      <p>${tr('<b>{0}</b> was alone with {1} {2}.', esc(m.name), esc(v.name), esc(zone.in))}<br>${lockLine} ${ic('lock', '🔒')}</p>
      ${levelTxt}<p class="stars-row" style="font-size:28px;margin:6px 0">${stars(nStars)}</p>
      <p class="earned">${coinIc()} ${tr('+{0} coins', '<b id="earned">0</b>')}</p>
      <p>${ART ? '' : '⏱ '}${fmtTime(S.elapsed)}${helpTxt ? ' · ' + plain(helpTxt) : ''}${isBest ? '<br>' + tr('New personal best!') : ''}${dailyTxt}</p>
      ${ART ? shareCardHtml(nStars) : ''}
      ${ret.lines.length ? `<div class="ret-lines">${ret.lines.map((l) => `<div>${l}</div>`).join('')}</div>` : ''}
      <div class="row">${S.slot === 'daily' || S.slot === 'challenge' || S.slot === 'race' ? '' : `<button class="primary" data-act="next">${S.slot === 'journey' ? tr('Level {0} →', S.caseNum + 1) : tr('Next case →')}</button>`}<button class="${S.slot === 'daily' || S.slot === 'challenge' || S.slot === 'race' ? 'primary' : 'secondary'}" data-act="home">${tr('Menu')}</button></div>
      ${ART ? `<div class="row"><button class="primary share-res" data-act="shareres">${ic('share', '📤')} ${tr('Share result')}</button></div>` : ''}
      <div class="row"><button class="secondary duel-btn" data-act="duel">${ic('knife', '⚔️')} ${S.slot === 'race' ? tr('New duel') : S.slot === 'challenge' ? tr('Challenge back') : tr('Challenge a friend')}</button></div>`, {
      next: nextCase,
      shareres: () => shareResult(nStars),
      duel: () => (S.slot === 'race' ? raceMenu() : share(tr('I solved "{0}" in {1} on Crime Grid. Can you beat my time?', caseText().title, fmtTime(S.elapsed)), challengeLink())),
      home: () => { closeModal(); showHome(); },
    });
    }
    // count the coins up, then hand out any new trophies
    let shown = 0;
    const calmWin = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
    const runTick = () => {
      const tick = setInterval(() => {
        shown = Math.min(earned, shown + Math.ceil(earned / 18));
        const el = $('earned'); if (el) el.textContent = shown;
        if (shown >= earned) { clearInterval(tick); sfx('coin'); }
      }, 45);
    };
    if (ART && !calmWin) setTimeout(runTick, 1000); else runTick();
    checkAchievements({ diff: S.diff, clean: !S.hints && !S.helps, time: S.elapsed });
    };
    if (ART) closedAnimation(m, showResult); else showResult();
  }

  /* ---------- "case closed" cinematic (v2) and the Wordle-style result card ---------- */
  const GAME_URL = location.origin + location.pathname.replace(/[^/]*$/, '');   // always the address the game is served from, so moving it needs no code change
  // one square per suspect (no spoilers): green = solved by logic alone, yellow = used a clue/check, red = a suspect was revealed
  function resultSquares() {
    const n = S.P.people.length, red = Math.min(S.hints || 0, n), yellow = Math.min(S.helps || 0, n - red);
    return [].concat(Array(n - red - yellow).fill('g'), Array(yellow).fill('y'), Array(red).fill('r'));
  }
  const SQ_EMOJI = { g: '🟩', y: '🟨', r: '🟥' };
  function resultLabel() {
    const dn = dname(S.diff);
    return S.slot === 'journey' ? tr('Level {0}', S.caseNum) + ' · ' + dn : S.slot === 'daily' ? tr('Daily') + ' · ' + dn : S.slot === 'challenge' ? tr('Challenge') + ' · ' + dn : tr('Level {0}', S.caseNum) + ' · ' + dn;
  }
  // the result screen already shows level, time and stars once, so there is no separate result card any more
  function shareCardHtml() { return ''; }
  function shareResult(nStars) {
    const streakLn = S.slot === 'daily' && dailyStreak() > 1 ? `\n🔥 ${tr('{0}-day streak', dailyStreak())}` : '';
    const text = `🕵️ Crime Grid · ${resultLabel()}\n⏱ ${fmtTime(S.elapsed)} · ${'⭐'.repeat(nStars)}${streakLn}\n${tr('Can you solve it?')}\n${GAME_URL}`;
    return shareText(text);
  }
  async function shareText(text) {
    try { if (navigator.share) { await navigator.share({ title: 'Crime Grid', text }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
    try { await navigator.clipboard.writeText(text); toast(`<span class="ti">${ic('check', '✓')}</span><span><b>${tr('Link copied!')}</b><small>${tr('Paste it to your friend in any chat.')}</small></span>`); return; } catch (e) { /* fall through */ }
    modal(`<h2>${tr('Send this to a friend')}</h2><textarea class="name-in share-box" readonly>${esc(text)}</textarea>
      <div class="row"><button class="primary" data-act="close">${tr('Done')}</button></div>`);
  }
  function closedAnimation(m, done) {
    const calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tape = `<span>${tr('POLICE LINE · DO NOT CROSS')}</span>`.repeat(6);
    const ov = document.createElement('div');
    ov.className = 'closed-ov' + (calm ? ' calm' : '');
    ov.innerHTML = `<div class="co-tape t1"><div>${tape}</div></div><div class="co-tape t2"><div>${tape}</div></div><div class="co-spot"></div>
      <div class="co-card"><div class="co-photo">${face(m)}<b class="co-q">?</b></div><div class="co-label">${tr('The killer')}</div><div class="co-name">${esc(m.name)}</div></div>
      <div class="co-stamp">${tr('CLOSED')}</div><div class="co-skip">${tr('Tap to skip')}</div>`;
    document.body.appendChild(ov);
    let over = false;
    const timers = [];
    const finish = () => { if (over) return; over = true; timers.forEach(clearTimeout); ov.classList.add('out'); setTimeout(() => ov.remove(), 400); done(); };
    const at = (ms, fn) => timers.push(setTimeout(fn, calm ? ms / 3 : ms));
    at(1500, () => { ov.classList.add('rev'); sfx('unlock'); });
    at(2500, () => { ov.classList.add('stamped'); sfx('place'); if (navigator.vibrate && (!navigator.userActivation || navigator.userActivation.hasBeenActive)) try { navigator.vibrate(40); } catch (e) { /* ignore */ } });
    at(3900, finish);
    ov.addEventListener('click', finish);
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
    modal(`<div class="big">${ic('phone', '📲')}</div><h2>${tr('Install on iPhone')}</h2>
      <ol class="steps">
        <li>${tr('Open this page in <b>Safari</b>.')}</li>
        <li>${tr('Tap the <b>Share</b> button (square with an arrow).')}</li>
        <li>${tr('Choose <b>"Add to Home Screen"</b>.')}</li>
        <li>${tr('From now on, open the game from the icon.')}</li>
      </ol>
      <p><small>${tr('Install before you start playing: on iPhone the app keeps its progress separately from Safari.')}</small></p>
      <div class="row"><button class="primary" data-act="close">${tr('Got it')}</button></div>`);
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
  I.setLang(store.lang || I.detect());
  applySkin();
  IAP.init().then(() => { if ($('home').classList.contains('active')) renderShopCard(); });
  showHome();
  // one-tap start: no name or language dialog. A default name is used (it can be changed later from the greeting)
  // and brand-new players go straight into the guided first case.
  const brandNew = !store.profile;
  if (brandNew) { store.profile = { name: tr('Detective'), auto: true }; save(); renderGreet(); }
  else if (store.profile.auto && store.profile.name === 'Detective' && tr('Detective') !== 'Detective') { store.profile.name = tr('Detective'); save(); renderGreet(); }
  if (store.stakeBet) {   // the game was closed in the middle of a duel with a stake
    const lost = store.stakeBet.amt; store.stakeBet = null; save();
    setTimeout(() => toast(`<span class="ti">${ic('knife', '⚔️')}</span><span><b>${tr('You left a duel with a stake. The stake was lost.')}</b><small>${tr('You lost {0} coins.', I.num(lost))}</small></span>`), 1200);
  }
  const hadLink = location.hash.length > 1;
  if (NET && store.netTag) ensureTag().catch(() => {});
  handleLink();
  if (!hadLink && !store.tutorialDone && !totalSolved()) { if (brandNew) startTutorial(); else offerTutorial(); }   // reloaded mid-tutorial: offer it again
})();
