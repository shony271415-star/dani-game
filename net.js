/* Crime Grid: tiny Firebase client (anonymous sign-in + Realtime Database over REST), used only for live races.
   No SDK, no analytics. Nothing is sent until the player starts or joins a live race. */
(function () {
  'use strict';
  // Filled in once the Firebase project exists (see store/MULTIPLAYER-SETUP.md). Empty = live races are hidden.
  const CONFIG = window.CG_NET_CONFIG || {
    apiKey: 'AIzaSyBgmE2YO5YNVwi9GyyzBqBHfU9ELjOXFxs',
    dbUrl: 'https://crimegrid-7c6da-default-rtdb.europe-west1.firebasedatabase.app',          // e.g. https://crime-grid-xxxx-default-rtdb.europe-west1.firebasedatabase.app
  };
  const AUTH_BASE = CONFIG.authBase || 'https://';           // emulator: http://127.0.0.1:9099/
  const DB_QS = CONFIG.ns ? `&ns=${CONFIG.ns}` : '';          // emulator namespace
  const AUTH_KEY = 'crime-grid-net';                          // separate from the save key on purpose
  const enabled = !!(CONFIG.apiKey && CONFIG.dbUrl);

  let auth = null;
  try { auth = JSON.parse(localStorage.getItem(AUTH_KEY) || 'null'); } catch (e) { auth = null; }

  async function post(url, body, form) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': form ? 'application/x-www-form-urlencoded' : 'application/json' },
      body: form ? new URLSearchParams(body).toString() : JSON.stringify(body),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((j.error && j.error.message) || 'auth ' + res.status);
    return j;
  }
  async function token() {
    if (!enabled) throw new Error('offline-mode');
    if (auth && auth.exp > Date.now() + 60000) return auth.tok;
    let j;
    if (auth && auth.ref) {
      try {
        j = await post(`${AUTH_BASE}securetoken.googleapis.com/v1/token?key=${CONFIG.apiKey}`, { grant_type: 'refresh_token', refresh_token: auth.ref }, true);
        auth = { tok: j.id_token, ref: j.refresh_token, uid: j.user_id, exp: Date.now() + (+j.expires_in || 3600) * 1000 };
      } catch (e) { auth = null; }
    }
    if (!auth || !auth.tok || auth.exp <= Date.now() + 60000) {
      j = await post(`${AUTH_BASE}identitytoolkit.googleapis.com/v1/accounts:signUp?key=${CONFIG.apiKey}`, { returnSecureToken: true });
      auth = { tok: j.idToken, ref: j.refreshToken, uid: j.localId, exp: Date.now() + (+j.expiresIn || 3600) * 1000 };
    }
    try { localStorage.setItem(AUTH_KEY, JSON.stringify(auth)); } catch (e) { /* private mode */ }
    return auth.tok;
  }
  const url = async (path, qs = '') => `${CONFIG.dbUrl}/${path}.json?auth=${await token()}${DB_QS}${qs}`;
  async function req(method, path, body, qs) {
    const res = await fetch(await url(path, qs), { method, body: body === undefined ? undefined : JSON.stringify(body) });
    const j = await res.json().catch(() => null);
    if (!res.ok) throw new Error((j && j.error) || 'db ' + res.status);
    return j;
  }

  // live view of one path: cb(tree) on every change. Returns a stop() function.
  function watch(path, cb, onError) {
    let es = null, tree = null, stopped = false, retries = 0;
    const setAt = (t, parts, v) => {
      if (!parts.length) return v;
      t = t && typeof t === 'object' ? t : {};
      const [k, ...rest] = parts;
      const nv = setAt(t[k], rest, v);
      if (nv === null || nv === undefined) delete t[k]; else t[k] = nv;
      return Object.keys(t).length ? t : null;
    };
    const split = (p) => p.split('/').filter(Boolean);
    async function open() {
      if (stopped) return;
      try { es = new EventSource(await url(path)); } catch (e) { if (onError) onError(e); return; }
      es.addEventListener('put', (e) => { retries = 0; const m = JSON.parse(e.data); tree = setAt(tree, split(m.path), m.data); cb(tree); });
      es.addEventListener('patch', (e) => {
        const m = JSON.parse(e.data);
        for (const k of Object.keys(m.data || {})) tree = setAt(tree, split(m.path + '/' + k), m.data[k]);
        cb(tree);
      });
      const reopen = () => { if (es) es.close(); es = null; if (!stopped && retries++ < 8) setTimeout(open, 1000 * retries); else if (onError) onError(new Error('stream')); };
      es.addEventListener('auth_revoked', () => { if (auth) auth.exp = 0; reopen(); });
      es.addEventListener('cancel', reopen);
      es.onerror = () => { if (es && es.readyState === 2) reopen(); };
    }
    open();
    return () => { stopped = true; if (es) es.close(); es = null; };
  }

  const TS = { '.sv': 'timestamp' };
  window.CGNet = {
    enabled,
    TS,
    uid: () => (auth && auth.uid) || null,
    signIn: token,
    get: (p) => req('GET', p),
    put: (p, v) => req('PUT', p, v),
    patch: (p, v) => req('PATCH', p, v),
    del: (p) => req('DELETE', p),
    query: (p, qs) => req('GET', p, undefined, qs),
    watch,
    // deletes the anonymous Firebase account itself (call after the profile, tag and inbox are gone)
    deleteAccount: async () => { const t = await token(); await post(`${AUTH_BASE}identitytoolkit.googleapis.com/v1/accounts:delete?key=${CONFIG.apiKey}`, { idToken: t }); },
    forget: () => { auth = null; try { localStorage.removeItem(AUTH_KEY); } catch (e) { /* ignore */ } },
  };
})();
