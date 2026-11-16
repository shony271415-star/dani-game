/* Crime Grid translations: the engine and the app write English; this file turns it into the player's language.
   - t('English text {0}', arg) looks the English text up in the language pack (falls back to English).
   - Puzzle text (clues, scene facts, area names, titles) is built from structured data, so a case already in
     progress switches language instantly.
   Language packs live in i18n-he.js, i18n-ru.js and i18n-es.js. */
(function (root) {
  'use strict';
  const LANGS = [
    { code: 'en', label: 'English', dir: 'ltr' },
    { code: 'he', label: 'עברית', dir: 'rtl' },
    { code: 'ru', label: 'Русский', dir: 'ltr' },
    { code: 'es', label: 'Español', dir: 'ltr' },
  ];
  const I = { lang: 'en', langs: LANGS, packs: {} };
  const norm = (s) => String(s).replace(/\s+/g, ' ').trim();
  const pack = () => I.packs[I.lang] || null;

  I.fill = (s, args) => s.replace(/\{(\d+)\}/g, (m, k) => (args[+k] === undefined ? m : args[+k]));
  // t('Level {0} complete!', 7)
  I.t = (key, ...args) => {
    const p = pack(), k = norm(key);
    const hit = p && p.ui && p.ui[k];
    return I.fill(hit == null ? k : hit, args);
  };
  // tagged template: T`Level ${n} complete!`
  I.T = (strings, ...vals) => I.t(strings.reduce((a, s, i) => a + '{' + (i - 1) + '}' + s), ...vals);
  // plural: tp(n, '1 level', '{0} levels') (English one/other; the pack may have its own plural forms)
  I.tp = (n, one, other, ...args) => {
    const p = pack(), k = norm(other);
    const forms = p && p.pl && p.pl[k];
    if (!forms) return I.fill(n === 1 ? one : other, [n, ...args]);
    const cat = new Intl.PluralRules(I.lang).select(n);
    return I.fill(forms[cat] || forms.other, [n, ...args]);
  };

  I.setLang = (code) => {
    const L = LANGS.find((x) => x.code === code) || LANGS[0];
    I.lang = I.packs[L.code] || L.code === 'en' ? L.code : 'en';
    const d = document.documentElement;
    d.lang = I.lang; d.dir = L.dir;
    document.body.classList.remove('lang-en', 'lang-he', 'lang-ru', 'lang-es');
    document.body.classList.add('lang-' + I.lang);
    document.body.classList.toggle('rtl', L.dir === 'rtl');
    I.applyStatic();
  };
  I.detect = () => {
    const l = String(navigator.language || 'en').slice(0, 2).toLowerCase();
    return l === 'iw' ? 'he' : LANGS.some((x) => x.code === l) ? l : 'en';
  };
  // static page text: <span data-t="English"> and attributes data-t-placeholder / data-t-title / data-t-label
  I.applyStatic = (root0) => {
    const r = root0 || document;
    r.querySelectorAll('[data-t]').forEach((el) => { el.textContent = I.t(el.dataset.t); });
    r.querySelectorAll('[data-t-placeholder]').forEach((el) => { el.placeholder = I.t(el.dataset.tPlaceholder); });
    r.querySelectorAll('[data-t-label]').forEach((el) => { el.setAttribute('aria-label', I.t(el.dataset.tLabel)); });
    const title = document.querySelector('title');
    if (title) title.textContent = 'Crime Grid';
  };

  /* ---------- puzzle content ---------- */
  const flat = () => (I._flat = I._flat || (root.MysteryEngine ? root.MysteryEngine.THEMES.flatMap((th) => th.stories.map((s) => s[0])) : []));
  I.story = (title, intro) => {
    const p = pack();
    if (!p || !p.stories) return [title, intro];
    const k = flat().indexOf(title);
    return k >= 0 && p.stories[k] ? p.stories[k] : [title, intro];
  };
  I.zone = (name) => { const p = pack(); const z = p && p.zones && p.zones[name]; return z ? { n: z[0], in: z[1] } : { n: name, in: 'in the ' + name }; };
  I.themeName = (name) => { const p = pack(); return (p && p.themes && p.themes[name]) || name; };
  I.objName = (o) => { const p = pack(), e = p && p.objs && p.objs[o]; return e ? p.objLabel(e) : (root.MysteryEngine ? root.MysteryEngine.OBJECTS[o].name : o); };

  const ctxFor = (P, person) => ({
    P, person, g: person ? person.g : 'm',
    name: (q) => P.people[q].name,
    zone: (z) => I.zone(P.zones[z].name),
    obj: (o) => pack().objs[o],
    outdoor: P.theme.center === 'not at the edge of any area',
    area: P.theme.area, edge: P.theme.edge, floor: P.theme.floor,
    pk: pack(),
  });
  // one clue in the current language, with **bold** markers; null in English (the engine already wrote it)
  I.clue = (c, P, person) => {
    const p = pack();
    if (!p || !p.clue) return null;
    return p.clue(c, ctxFor(P, person));
  };
  I.fact = (d, P) => {
    const p = pack();
    if (!p || !p.fact || !d) return null;
    return p.fact(d, ctxFor(P, null));
  };
  // the long legend of the in-game dictionary
  I.legend = (P, can, cant) => {
    const p = pack();
    return p && p.legend ? p.legend(ctxFor(P, null), can, cant) : null;
  };
  I.weekdayNarrow = (i) => new Date(2024, 0, 7 + i).toLocaleDateString(I.lang, { weekday: 'narrow' });
  I.weekday = (i) => new Date(2024, 0, 7 + i).toLocaleDateString(I.lang, { weekday: 'long' });
  I.month = (d, style) => d.toLocaleString(I.lang, { month: style || 'long' });
  I.monthYear = (d) => d.toLocaleString(I.lang, { month: 'short', year: 'numeric' });
  I.num = (n) => Number(n).toLocaleString(I.lang === 'he' ? 'he-IL' : I.lang);

  root.I18N = I;
})(typeof window !== 'undefined' ? window : globalThis);
