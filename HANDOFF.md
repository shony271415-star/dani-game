# Crime Grid: handoff for a new session

Read `README.md` first, then skim `engine.js`, `app.js`, `art.js`, `i18n.js`, `net.js`.
The owner speaks Hebrew: answer in short, simple Hebrew. Be honest about what was not tested.
The owner wants proactive upgrades: keep looking for what can be improved without being asked (UX, bugs, retention, store assets, performance), do the safe ones on the work branch and report them, and ask before anything goes to the live branch.

## Branches (important)
- `claude/practical-keller-9slz4t` = LIVE branch (GitHub Pages serves it to players). Never push to it without an explicit request. To release: merge from `claude/crimegrid-next`, run a Playwright smoke test (new player and old save, 0 errors, coins/packs/skin kept), then push.
- `claude/crimegrid-next` = work branch. All changes go here first.
- `main` is nearly empty. No PRs or merges to `main` unless asked.
- Push with `git -c push.negotiate=true push -u origin <branch>`.
- Never change the storage key `mystery-grid-v1`. After every change bump the cache name in `sw.js` and `v2/sw.js`. Add new UI strings by hand to `i18n-he.js`, `i18n-ru.js`, `i18n-es.js` (inside the `ui` object).

## Architecture
- Hosting: GitHub Pages. `/` = emoji edition (do not touch), `/v2/` = main illustrated noir edition. Both share `engine.js`, `app.js`, `i18n*.js`, `net.js`.
- `engine.js`: seeded generator with an exact solver (every case has one solution), 5 difficulties, 9 themes, 144 story titles. Story titles in the language packs are matched BY INDEX, so keep the order when renaming.
- `app.js`: all UI and systems: journey, daily case, coins and shop (`PACKS`, `store/ECONOMY.md`), trophies, missions, friends, duels, backup code (`MG1.` + base64, keys in `BACKUP_KEYS`), Play Billing through the Digital Goods API (`IAP`).
- `art.js`: original SVG art and one avatar function per skin pack.
- Languages: English, Hebrew (RTL), Russian, Spanish. English strings are the keys: `tr('Text {0}', a)`.

## Online features (Firebase, optional)
- `net.js` is a tiny REST client (anonymous sign-in plus Realtime Database). It is enabled only when the API key and database URL are set. The key is not secret; it is restricted to the game's web address, and the database rules in `store/database.rules.json` do the protecting.
- Live duel: same case at the same moment, 6-letter code, server time decides the winner (+40 coins, or the stake). Stakes: the host picks 0/25/50/100/250/500 coins; the guest must confirm; both pay when the duel starts (`store.stakeBet`), the winner gets 2x; leaving or closing the game forfeits. Coins are local, so stakes are trust-based (no server check); keep that in mind before adding bigger stakes. Invite bonus: a new player who finishes a duel with their inviter gives both 500 coins and the exclusive "Partners in Crime" pack (max 5 per inviter).
- Detective ID: a 6-character ID per player. Friends add each other by ID, see an online dot, and send duel invites that pop up inside the game (only while the game is open). "Delete my online ID" removes the profile.
- Setup and Play Data safety notes: `store/MULTIPLAYER-SETUP.md`. Privacy policy: `privacy.html`.
- Test locally with the Firebase Database and Auth emulators (set `window.CG_NET_CONFIG` with `authBase`, `ns`). Two Playwright contexts simulate two players.

## Rewarded video (version 2)
- `window.CGAdBridge = { isReady(), showRewarded(cb) }` is the contract for the native wrapper. Without it nothing is shown. With it: a free clue (3 a day) in the Help menu and a double-coins button on the win screen.

## Ads and Remove Ads
- The game has NO ads yet (`ADS_ON = false` in `app.js`). A "No ads" button (top corner of the home screen) and the `remove_ads` purchase are already built but stay hidden until `ADS_ON` is true. Any future ad code must check `window.CGAds.allowed()` first. The purchase sets `store.noAds` (kept in the backup code, restored by `listPurchases`, acknowledged).

## Google Play plan
- Package through PWABuilder (Trusted Web Activity). Version 1: no ads, purchases only. Version 2: native wrapper for rewarded ads and push.
- `assetlinks.json` must be served from the ROOT of the domain (a project page cannot do it). It needs a separate user-site repo, plus both signing fingerprints.
- New personal developer accounts need a closed test (12+ testers, 14 days) before production.
- Audience 13+. Store text: no competitor names, no "#1", no rating incentives.
- Real-money purchases have never been tested on a real device.

## Known gaps
- Not tested on a real device or in an installed app.
- Zone labels can cover tokens on 8x8 and 10x10 boards; very small text (7px) there.
- The viewport blocks zoom; the board cannot be played by keyboard or screen reader.
- The restore-backup dialog is a native `confirm()`.
- `promo/crime-grid-playable.html` still contains the old story titles (rebuild with `tools/promo/make-playable.js`).
