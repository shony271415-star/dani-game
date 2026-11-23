/* Crime Grid original artwork: hand-written SVG icons, scenes and characters.
   Loaded only by the illustrated edition (v2/). Everything is drawn here, no emoji. */
(function (root) {
  'use strict';
  const INK = '#3d3250';
  const st = (w = 2) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  const svg = (body, vb = 48) => `<svg viewBox="0 0 ${vb} ${vb}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${body}</svg>`;

  /* ---------- objects ---------- */
  const wheelSpokes = () => {
    let s = '';
    for (let k = 0; k < 8; k++) {
      const a = (k * Math.PI) / 4, c = Math.cos(a), n = Math.sin(a);
      s += `<path d="M${24 + c * 4} ${24 + n * 4}L${24 + c * 19} ${24 + n * 19}" ${st(2.4)}/><circle cx="${24 + c * 19}" cy="${24 + n * 19}" r="2.2" fill="#b8763f" ${st(1.4)}/>`;
    }
    return s;
  };

  const ICONS = {
    chair: `<rect x="14" y="5" width="20" height="21" rx="4" fill="#c98b55" ${st()}/><path d="M18 10h12M18 15h12" stroke="#e8b27a" stroke-width="2" stroke-linecap="round"/>
      <rect x="10" y="24" width="28" height="7" rx="3" fill="#e0a26b" ${st()}/><path d="M14 31v12M34 31v12" ${st(2.6)}/>`,
    bed: `<rect x="5" y="6" width="38" height="37" rx="5" fill="#c98b55" ${st()}/><rect x="8" y="10" width="32" height="30" rx="3" fill="#fffaf3" ${st()}/>
      <rect x="12" y="13" width="24" height="8" rx="4" fill="#fff" ${st()}/><path d="M8 25h32v11a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4Z" fill="#b9a2ec" ${st()}/>
      <path d="M12 31h24" stroke="#fff" stroke-width="1.6" stroke-dasharray="2 3" stroke-linecap="round"/>`,
    tv: `<path d="M18 4l6 7 6-7" fill="none" ${st()}/><rect x="5" y="11" width="38" height="26" rx="5" fill="#6b5f86" ${st()}/>
      <rect x="9" y="15" width="30" height="18" rx="3" fill="#8fd3f4"/><path d="M13 19l5 0M13 23l8 0" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".8"/>
      <path d="M18 43h12M24 37v6" ${st(2.4)}/>`,
    plant: `<ellipse cx="24" cy="13" rx="5" ry="9" fill="#89d18c" ${st()}/><path d="M24 27C23 17 17 11 8 10c0 9 7 15 16 17Z" fill="#6fbf73" ${st()}/>
      <path d="M24 27c1-10 7-16 16-17 0 9-7 15-16 17Z" fill="#6fbf73" ${st()}/><path d="M15 29h18l-3 15H18Z" fill="#e07a4f" ${st()}/><rect x="12" y="26" width="24" height="5" rx="2" fill="#ee9a72" ${st()}/>`,
    bathtub: `<path d="M8 17V10a4 4 0 0 1 8 0v1" fill="none" ${st()}/><circle cx="21" cy="14" r="3" fill="#d6ecfb" ${st(1.4)}/><circle cx="28" cy="11" r="2" fill="#d6ecfb" ${st(1.4)}/>
      <path d="M4 21h40v6a13 13 0 0 1-13 13H17A13 13 0 0 1 4 27Z" fill="#fffaf3" ${st()}/><path d="M7 25h34" stroke="#8fd3f4" stroke-width="3" stroke-linecap="round"/>
      <path d="M12 39l-2 5M36 39l2 5" ${st(2.4)}/>`,
    piano: `<rect x="5" y="6" width="38" height="34" rx="4" fill="#7a5a9a" ${st()}/><rect x="8" y="24" width="32" height="10" rx="1" fill="#fffaf3" ${st(1.6)}/>
      <path d="M14 24v6M20 24v6M28 24v6M34 24v6" stroke="${INK}" stroke-width="2.6"/><path d="M11 40v4M37 40v4" ${st(2.4)}/>
      <path d="M14 13h4M14 13v-2" ${st(1.6)}/><circle cx="30" cy="13" r="2.5" fill="#f6c85f" ${st(1.4)}/>`,
    seat: `<rect x="15" y="4" width="18" height="9" rx="4" fill="#5aa9e6" ${st()}/><rect x="12" y="12" width="24" height="20" rx="4" fill="#5aa9e6" ${st()}/>
      <path d="M17 17v10M24 17v10M31 17v10" stroke="#8cc8f0" stroke-width="2" stroke-linecap="round"/><rect x="9" y="30" width="30" height="8" rx="3.5" fill="#3d86c6" ${st()}/>
      <path d="M14 38v6M34 38v6" ${st(2.4)}/>`,
    crate: `<rect x="6" y="8" width="36" height="34" rx="2" fill="#dba56b" ${st()}/><path d="M6 16h36M6 34h36" ${st()}/><path d="M10 34L38 16" ${st(2.4)}/>
      <circle cx="9.5" cy="12" r="1" fill="${INK}"/><circle cx="38.5" cy="12" r="1" fill="${INK}"/><circle cx="9.5" cy="38" r="1" fill="${INK}"/><circle cx="38.5" cy="38" r="1" fill="${INK}"/>`,
    barrel: `<path d="M14 5h20c5 7 5 31 0 38H14c-5-7-5-31 0-38Z" fill="#b8763f" ${st()}/><path d="M10 14h28M10 34h28" stroke="#6b5f86" stroke-width="3.4"/>
      <path d="M20 5c-2 8-2 30 0 38M28 5c2 8 2 30 0 38" stroke="#9a5f34" stroke-width="1.4" fill="none"/>`,
    lifebuoy: `<circle cx="24" cy="24" r="17" fill="#fffaf3" ${st()}/><circle cx="24" cy="24" r="12.5" fill="none" stroke="#e8615a" stroke-width="9" stroke-dasharray="9.82 9.82"/>
      <circle cx="24" cy="24" r="17" fill="none" ${st()}/><circle cx="24" cy="24" r="8" fill="#9fd8ee" ${st()}/>`,
    anchor: `<circle cx="24" cy="9" r="4.5" fill="none" stroke="#5b6f8f" stroke-width="3.2"/><path d="M24 13.5V41M15 20h18" stroke="#5b6f8f" stroke-width="3.6" stroke-linecap="round"/>
      <path d="M8 29c2 8 8 12 16 12s14-4 16-12" fill="none" stroke="#5b6f8f" stroke-width="3.6" stroke-linecap="round"/><path d="M5 32l3-4 4 3M43 32l-3-4-4 3" fill="none" stroke="#5b6f8f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,
    wheel: `${wheelSpokes()}<circle cx="24" cy="24" r="13" fill="none" stroke="#b8763f" stroke-width="4.5"/><circle cx="24" cy="24" r="13" fill="none" ${st(1.2)}/><circle cx="24" cy="24" r="4.5" fill="#dba56b" ${st()}/>`,
    tree: `<path d="M24 3L9 21h7L7 33h34L32 21h7Z" fill="#4fa36a" ${st()}/><path d="M17 21h14M14 33h20" stroke="#7cc58f" stroke-width="2" stroke-linecap="round"/><rect x="20.5" y="33" width="7" height="11" rx="1.5" fill="#9a5f34" ${st()}/>`,
    rock: `<path d="M7 38c-3-9 2-18 10-21 4-7 14-8 19-2 7 3 10 11 6 18-1 4-4 6-8 6H13c-3 0-5-1-6-1Z" fill="#b8b2c6" ${st()}/><path d="M17 22c3-3 7-4 10-3M33 22c3 1 5 4 5 7" stroke="#e3dfea" stroke-width="2.2" fill="none" stroke-linecap="round"/>`,
    log: `<rect x="4" y="17" width="38" height="18" rx="9" fill="#b8763f" ${st()}/><path d="M12 22h10M14 30h14" stroke="#8a5530" stroke-width="2" stroke-linecap="round"/>
      <ellipse cx="38" cy="26" rx="6" ry="9" fill="#ecc08c" ${st()}/><ellipse cx="38" cy="26" rx="2.6" ry="4.4" fill="none" stroke="#b8763f" stroke-width="1.6"/>`,
    tent: `<path d="M24 4v4" ${st()}/><path d="M24 4l7 2-7 2" fill="#e8615a" ${st(1.4)}/><path d="M24 8L4 42h40Z" fill="#f6c85f" ${st()}/><path d="M24 8L16 42h16Z" fill="#e39a33" ${st()}/><path d="M24 26v16" ${st(1.4)}/>`,
    campfire: `<path d="M24 6c7 7 11 12 11 18a11 11 0 0 1-22 0c0-4 2-8 5-10 0 4 2 7 5 7-3-5-1-11 1-15Z" fill="#f59e42" ${st()}/>
      <path d="M24 20c3 3 5 6 5 9a5 5 0 0 1-10 0c0-3 2-5 5-9Z" fill="#fde07a"/><path d="M8 41l32-8M8 33l32 8" stroke="#9a5f34" stroke-width="5.5" stroke-linecap="round"/>
      <path d="M8 41l32-8M8 33l32 8" stroke="${INK}" stroke-width="1" stroke-linecap="round" opacity=".35"/>`,
    mushroom: `<path d="M17 24h14l2 19H15Z" fill="#fffaf3" ${st()}/><path d="M4 25a20 16 0 0 1 40 0Z" fill="#e8615a" ${st()}/>
      <circle cx="16" cy="16" r="3" fill="#fffaf3"/><circle cx="28" cy="13" r="2.5" fill="#fffaf3"/><circle cx="35" cy="20" r="2" fill="#fffaf3"/><circle cx="22" cy="21" r="1.8" fill="#fffaf3"/>`,
    canoe: `<path d="M33 4L17 32" ${st(2.4)}/><path d="M17 32l-3 7 6-4Z" fill="#e0a26b" ${st(1.6)}/><path d="M2 25h44c-4 10-12 13-22 13S6 35 2 25Z" fill="#c98b55" ${st()}/>
      <path d="M5 25c9 4 29 4 38 0" fill="none" ${st(1.6)}/><path d="M14 31h20" stroke="#e8b27a" stroke-width="2" stroke-linecap="round"/>`,
    computer: `<rect x="5" y="6" width="38" height="26" rx="4" fill="#6b5f86" ${st()}/><rect x="9" y="10" width="30" height="18" rx="2" fill="#9ee6c9"/>
      <path d="M13 15h10M13 20h16M13 25h7" stroke="#3a8f6c" stroke-width="2" stroke-linecap="round"/><path d="M19 32l-2 6h14l-2-6" fill="#b8b2c6" ${st()}/>
      <rect x="9" y="39" width="30" height="6" rx="2" fill="#e3dfea" ${st()}/>`,
    robot: `<path d="M24 3v5" ${st()}/><circle cx="24" cy="3.5" r="2.5" fill="#e8615a" ${st(1.4)}/><rect x="12" y="8" width="24" height="17" rx="5" fill="#a9c9e8" ${st()}/>
      <circle cx="19" cy="16" r="3" fill="#fff" ${st(1.4)}/><circle cx="29" cy="16" r="3" fill="#fff" ${st(1.4)}/><circle cx="19" cy="16" r="1.2" fill="${INK}"/><circle cx="29" cy="16" r="1.2" fill="${INK}"/>
      <path d="M20 21h8" ${st(1.6)}/><rect x="14" y="27" width="20" height="15" rx="4" fill="#cfe0f2" ${st()}/><circle cx="24" cy="34" r="3" fill="#f6c85f" ${st(1.4)}/>
      <path d="M14 31l-6 6M34 31l6 6M19 42v3M29 42v3" ${st(2.4)}/>`,
    telescope: `<path d="M24 27l-9 17M24 27l9 17M24 27v17" ${st(2.2)}/><path d="M6 23l28-13 4 9-28 13Z" fill="#a88be0" ${st()}/>
      <path d="M34 10l5-2 4 9-5 2" fill="#c7b3f2" ${st()}/><circle cx="24" cy="25" r="2.6" fill="#f6c85f" ${st(1.4)}/>`,
    statue: `<rect x="13" y="33" width="22" height="11" rx="1.5" fill="#bdb6cc" ${st()}/><path d="M11 33h26" ${st(2.4)}/>
      <path d="M12 33c0-8 5-11 12-11s12 3 12 11Z" fill="#e3dfea" ${st()}/><circle cx="24" cy="14" r="8" fill="#e3dfea" ${st()}/>
      <path d="M16 11c2-5 14-5 16 0" fill="none" stroke="#7cc58f" stroke-width="2.4" stroke-linecap="round"/><path d="M21 15h0M27 15h0" ${st(2.4)}/>`,
    dino: `<path d="M5 34c3 1 6 0 8-2" fill="none" ${st()}/><path d="M11 33c0-8 6-13 14-13h3c1-6 5-10 10-10 4 0 6 3 6 6s-2 5-5 5h-3v7c0 7-4 11-11 11h-1v6h-5v-6h-3v6h-5v-6c-1 0-0-2 0-6Z" fill="#7fcf8a" ${st()}/>
      <circle cx="38" cy="15" r="1.6" fill="${INK}"/><path d="M17 21l2-4 2 4M23 20l2-4 2 4" fill="#f6c85f" ${st(1.4)}/><path d="M31 25l3 2" ${st(1.6)}/>`,
    vase: `<path d="M19 5h10v4c5 2 8 7 8 14 0 9-5 15-13 20-8-5-13-11-13-20 0-7 3-12 8-14Z" fill="#e8956b" ${st()}/>
      <path d="M19 10c-6 0-8 6-4 9M29 10c6 0 8 6 4 9" fill="none" ${st()}/><path d="M12 22l4 4 4-4 4 4 4-4 4 4 4-4" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="M14 31h20" stroke="#fffaf3" stroke-width="2" stroke-linecap="round"/>`,
    suitcase: `<path d="M18 14v-4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4" fill="none" ${st()}/><rect x="6" y="14" width="36" height="27" rx="4" fill="#5aa9e6" ${st()}/>
      <path d="M16 14v27M32 14v27" stroke="#3d86c6" stroke-width="3"/><circle cx="24" cy="24" r="3.5" fill="#f6c85f" ${st(1.4)}/><rect x="9" y="30" width="5" height="5" rx="1" fill="#f4a3b5" ${st(1.2)}/>`,
    drum: `<path d="M12 4l8 10M36 4l-8 10" ${st(2.4)}/><path d="M8 17v18c0 3 7 6 16 6s16-3 16-6V17" fill="#e8615a" ${st()}/>
      <path d="M8 24l5 11 5-11 6 11 6-11 5 11 5-11" fill="none" stroke="#fffaf3" stroke-width="2" stroke-linejoin="round"/><ellipse cx="24" cy="17" rx="16" ry="6" fill="#fffaf3" ${st()}/>`,
    elephant: `<ellipse cx="28" cy="27" rx="15" ry="11" fill="#a9b4c8" ${st()}/><path d="M19 36v7h5v-6M32 37v6h5v-8" fill="#a9b4c8" ${st()}/>
      <circle cx="14" cy="21" r="9" fill="#a9b4c8" ${st()}/><path d="M7 24c-3 4-3 10 1 13 1 1 3 0 3-1-2-3-2-7 0-10" fill="#a9b4c8" ${st()}/>
      <ellipse cx="19" cy="20" rx="5" ry="7" fill="#c8d0e0" ${st()}/><circle cx="11" cy="19" r="1.4" fill="${INK}"/><path d="M42 24c3 0 4 3 3 5" fill="none" ${st()}/>`,
    popcorn: `<circle cx="17" cy="14" r="5" fill="#fff3c4" ${st(1.6)}/><circle cx="25" cy="10" r="5.5" fill="#fff3c4" ${st(1.6)}/><circle cx="32" cy="14" r="5" fill="#fff3c4" ${st(1.6)}/><circle cx="21" cy="17" r="4" fill="#fff3c4" ${st(1.6)}/><circle cx="29" cy="17" r="4" fill="#fff3c4" ${st(1.6)}/>
      <path d="M11 18h26l-3 26H14Z" fill="#fffaf3" ${st()}/><path d="M18 18l1 26M24 18v26M30 18l-1 26" stroke="#e8615a" stroke-width="3.2"/><path d="M11 18h26l-3 26H14Z" fill="none" ${st()}/>`,
    hay: `<rect x="4" y="13" width="40" height="26" rx="5" fill="#f6d36b" ${st()}/><path d="M7 21h34M7 31h34" stroke="#d8a93a" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M15 13v26M33 13v26" stroke="#c0792b" stroke-width="3"/><path d="M9 13l-2-4M26 13l1-4M40 13l2-3" ${st(1.4)}/>`,
    balloon: `<path d="M14 26l10 18M24 24v20M34 26l-10 18" stroke="${INK}" stroke-width="1.2" fill="none"/>
      <ellipse cx="14" cy="17" rx="8" ry="10" fill="#f4a3b5" ${st()}/><ellipse cx="34" cy="17" rx="8" ry="10" fill="#8fd3f4" ${st()}/><ellipse cx="24" cy="13" rx="8" ry="10" fill="#f6c85f" ${st()}/>
      <path d="M21 8c1-2 3-3 5-3" stroke="#fff" stroke-width="2" stroke-linecap="round" fill="none"/>`,
    fireplace: `<rect x="6" y="11" width="36" height="33" fill="#e0917b" ${st()}/><path d="M6 20h36M6 29h36M15 11v9M33 11v9M24 20v9" stroke="#c4705c" stroke-width="1.4"/>
      <path d="M13 44V31a11 11 0 0 1 22 0v13Z" fill="#4a3d5e" ${st()}/><path d="M24 31c4 4 6 7 6 9a6 6 0 0 1-12 0c0-2 2-5 6-9Z" fill="#f59e42"/>
      <rect x="2" y="7" width="44" height="6" rx="2" fill="#9a5f34" ${st()}/>`,
    skis: `<path d="M13 4c3 0 4 2 4 5l3 33" fill="none" stroke="#e8615a" stroke-width="5" stroke-linecap="round"/><path d="M35 4c-3 0-4 2-4 5l-3 33" fill="none" stroke="#5aa9e6" stroke-width="5" stroke-linecap="round"/>
      <path d="M8 14l9 28M40 14l-9 28" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/><circle cx="8" cy="14" r="2" fill="#f6c85f" ${st(1.2)}/><circle cx="40" cy="14" r="2" fill="#f6c85f" ${st(1.2)}/>`,
    snowman: `<circle cx="24" cy="33" r="11" fill="#fffaf3" ${st()}/><circle cx="24" cy="16" r="8" fill="#fffaf3" ${st()}/><rect x="16" y="6" width="16" height="3" rx="1" fill="#6b5f86" ${st(1.4)}/><rect x="19" y="1" width="10" height="7" rx="1" fill="#6b5f86" ${st(1.4)}/>
      <circle cx="21" cy="15" r="1.2" fill="${INK}"/><circle cx="27" cy="15" r="1.2" fill="${INK}"/><path d="M24 18l7 1.5-7 1.5Z" fill="#f59e42" ${st(1)}/><path d="M16 24c5 3 11 3 16 0l2 4c-6 2-14 2-20 0Z" fill="#e8615a" ${st(1.4)}/>
      <circle cx="24" cy="31" r="1.3" fill="${INK}"/><circle cx="24" cy="37" r="1.3" fill="${INK}"/>`,
    hottub: `<path d="M16 12c-2-3 2-5 0-8M24 12c-2-3 2-5 0-8M32 12c-2-3 2-5 0-8" fill="none" stroke="#b8b2c6" stroke-width="1.8" stroke-linecap="round"/>
      <ellipse cx="24" cy="31" rx="20" ry="12" fill="#c98b55" ${st()}/><ellipse cx="24" cy="29" rx="15" ry="7.5" fill="#8fd3f4" ${st()}/>
      <circle cx="17" cy="28" r="2" fill="#fff"/><circle cx="27" cy="31" r="1.6" fill="#fff"/><circle cx="31" cy="26" r="1.3" fill="#fff"/>`,
    armor: `<path d="M24 3c3 0 5 2 5 4" fill="none" stroke="#e8615a" stroke-width="3" stroke-linecap="round"/><path d="M14 21a10 10 0 0 1 20 0v7H14Z" fill="#c8d0e0" ${st()}/>
      <path d="M17 21h14" ${st(2.4)}/><path d="M11 29h26l-3 15H14Z" fill="#c8d0e0" ${st()}/><path d="M24 29v15M18 35h12" stroke="#a9b4c8" stroke-width="1.8"/>`,
    throne: `<path d="M12 33V9l4 4 4-7 4 7 4-7 4 7 4-4v24Z" fill="#f6c85f" ${st()}/><circle cx="24" cy="21" r="3" fill="#e8615a" ${st(1.4)}/>
      <rect x="9" y="31" width="30" height="7" rx="3" fill="#e8615a" ${st()}/><path d="M12 38v6M36 38v6" ${st(2.6)}/>`,
    candle: `<path d="M12 23c0 8 24 8 24 0" fill="none" stroke="#e3b33f" stroke-width="3"/><path d="M24 30v10M17 44h14l-2-4H19Z" fill="#f6c85f" ${st()}/><path d="M24 30v10" stroke="#e3b33f" stroke-width="3"/>
      <rect x="9.5" y="12" width="5" height="11" rx="1" fill="#fffaf3" ${st(1.6)}/><rect x="21.5" y="9" width="5" height="14" rx="1" fill="#fffaf3" ${st(1.6)}/><rect x="33.5" y="12" width="5" height="11" rx="1" fill="#fffaf3" ${st(1.6)}/>
      <path d="M12 5c2 2 2 4 0 6-2-2-2-4 0-6ZM24 2c2 2 2 4 0 6-2-2-2-4 0-6ZM36 5c2 2 2 4 0 6-2-2-2-4 0-6Z" fill="#f59e42"/>`,
    swords: `<path d="M8 6l24 24M40 6L16 30" stroke="#c8d0e0" stroke-width="4.4" stroke-linecap="round"/><path d="M8 6l24 24M40 6L16 30" stroke="${INK}" stroke-width="1" stroke-linecap="round" opacity=".5"/>
      <path d="M28 34l6-6M14 28l6 6" stroke="#9a5f34" stroke-width="3.4" stroke-linecap="round"/><path d="M33 33l7 7M15 33l-7 7" stroke="#b8763f" stroke-width="3.2" stroke-linecap="round"/>
      <circle cx="41" cy="41" r="2.4" fill="#f6c85f" ${st(1.2)}/><circle cx="7" cy="41" r="2.4" fill="#f6c85f" ${st(1.2)}/>`,
    coal: `<path d="M6 40l5-10 8-2 6 5 7-7 8 4 3 10Z" fill="#5b5470" ${st()}/><path d="M14 31l4 5M27 29l3 4" stroke="#8d86a3" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M17 26l6-6 6 4-3 6-7 1Z" fill="#6b6485" ${st(1.6)}/>`,
    cactus: `<path d="M20 38V12a4 4 0 0 1 8 0v26" fill="#6fbf73" ${st()}/><path d="M20 26h-5a3 3 0 0 1-3-3v-6a2 2 0 0 1 4 0v5h4M28 22h5v-6a2 2 0 0 1 4 0v7a3 3 0 0 1-3 3h-6" fill="#6fbf73" ${st()}/>
      <path d="M15 37h18l-2 7H17Z" fill="#e07a4f" ${st()}/>`,
    table: `<rect x="4" y="9" width="40" height="30" rx="5" fill="#c98b55" ${st()}/><path d="M8 19h32M8 29h32" stroke="#e0a26b" stroke-width="2" stroke-linecap="round"/>
      <circle cx="31" cy="16" r="4" fill="#fffaf3" ${st(1.4)}/><path d="M35 16h2" ${st(1.4)}/>`,
  };

  /* ---------- scenes ---------- */
  const THEMES = {
    mansion: `<path d="M6 22L24 7l18 15" fill="none" ${st()}/><path d="M10 20v22h28V20" fill="#f4a3b5" ${st()}/><path d="M6 22L24 7l18 15" fill="#b9a2ec" ${st()}/><rect x="20" y="30" width="8" height="12" rx="1" fill="#c98b55" ${st()}/><rect x="13" y="25" width="6" height="6" fill="#8fd3f4" ${st(1.4)}/><rect x="29" y="25" width="6" height="6" fill="#8fd3f4" ${st(1.4)}/><path d="M32 13V6h4v10" fill="#e0917b" ${st(1.6)}/>`,
    ship: `<path d="M24 4v24" ${st()}/><path d="M24 6l12 18H24Z" fill="#fffaf3" ${st()}/><path d="M22 10L12 24h10Z" fill="#f4a3b5" ${st()}/><path d="M4 30h40l-6 10H10Z" fill="#5aa9e6" ${st()}/><path d="M2 44c4 0 4-2 8-2s4 2 8 2 4-2 8-2 4 2 8 2 4-2 8-2" fill="none" stroke="#5aa9e6" stroke-width="2" stroke-linecap="round"/>`,
    forest: `<path d="M16 6L5 24h5L3 36h26l-7-12h5Z" fill="#4fa36a" ${st()}/><path d="M32 12l-9 14h4l-6 10h22l-6-10h4Z" fill="#7cc58f" ${st()}/><path d="M16 36v6M32 36v6" ${st(2.6)}/>`,
    space: `<path d="M24 4c7 6 9 14 7 24H17c-2-10 0-18 7-24Z" fill="#fffaf3" ${st()}/><circle cx="24" cy="16" r="4" fill="#8fd3f4" ${st(1.6)}/><path d="M17 22l-6 8 6 0M31 22l6 8-6 0" fill="#e8615a" ${st()}/><path d="M20 28c0 6 2 10 4 14 2-4 4-8 4-14" fill="#f59e42" ${st(1.6)}/><circle cx="8" cy="10" r="1.4" fill="#f6c85f"/><circle cx="40" cy="8" r="1.2" fill="#f6c85f"/><circle cx="42" cy="36" r="1.4" fill="#f6c85f"/>`,
    museum: `<path d="M4 16L24 5l20 11Z" fill="#e3dfea" ${st()}/><rect x="6" y="38" width="36" height="5" fill="#e3dfea" ${st()}/><path d="M10 18v19M18 18v19M30 18v19M38 18v19" stroke="${INK}" stroke-width="3.4"/><path d="M10 18v19M18 18v19M30 18v19M38 18v19" stroke="#fffaf3" stroke-width="1.6"/><rect x="6" y="16" width="36" height="3" fill="#e3dfea" ${st(1.6)}/>`,
    train: `<rect x="6" y="14" width="26" height="20" rx="3" fill="#e8615a" ${st()}/><rect x="32" y="20" width="10" height="14" rx="2" fill="#5aa9e6" ${st()}/><rect x="10" y="18" width="8" height="7" rx="1" fill="#8fd3f4" ${st(1.4)}/><path d="M24 14V8h6v6" fill="#6b5f86" ${st()}/><circle cx="13" cy="37" r="4" fill="#6b5f86" ${st()}/><circle cx="27" cy="37" r="4" fill="#6b5f86" ${st()}/><circle cx="38" cy="37" r="3" fill="#6b5f86" ${st()}/><path d="M28 6c2-3 6-3 8-1" fill="none" stroke="#b8b2c6" stroke-width="2" stroke-linecap="round"/>`,
    circus: `<path d="M24 4v6" ${st()}/><path d="M24 4l6 2-6 2" fill="#f6c85f" ${st(1.4)}/><path d="M24 10L4 26h40Z" fill="#fffaf3" ${st()}/><path d="M24 10l-7 16h7ZM24 10l14 16h-7Z" fill="#e8615a" ${st(1.4)}/><rect x="7" y="26" width="34" height="16" fill="#fffaf3" ${st()}/><path d="M14 26v16M34 26v16" stroke="#e8615a" stroke-width="4"/><path d="M20 42v-9a4 4 0 0 1 8 0v9" fill="#6b5f86" ${st()}/>`,
    castle: `<path d="M6 42V18h6v4h5v-4h6v4h5v-4h6v4h-2" fill="none"/><rect x="8" y="20" width="32" height="22" fill="#c8d0e0" ${st()}/><path d="M6 12h8v30H6ZM34 12h8v30h-8Z" fill="#a9b4c8" ${st()}/><path d="M6 12V8h2v2h2V8h2v2h2V8" fill="none" ${st(1.6)}/><path d="M34 12V8h2v2h2V8h2v2h2V8" fill="none" ${st(1.6)}/><path d="M19 42v-9a5 5 0 0 1 10 0v9" fill="#9a5f34" ${st()}/><path d="M10 4l4 2-4 2Z" fill="#f4a3b5" ${st(1.2)}/>`,
    ski: `<path d="M3 42L19 14l9 12 5-6 12 22Z" fill="#a9c9e8" ${st()}/><path d="M19 14l-5 9 3-1 2 3 3-3 3 2Z" fill="#fffaf3" ${st(1.4)}/><path d="M33 20l-3 5 3 0 2 2 2-2" fill="#fffaf3" ${st(1.2)}/><circle cx="38" cy="9" r="4" fill="#f6c85f" ${st(1.4)}/>`,
  };

  /* ---------- interface ---------- */
  const UI = {
    logo: `<path d="M31 31L43.5 43.5" stroke="#1c1822" stroke-width="8.5" stroke-linecap="round"/><path d="M31 31L43.5 43.5" stroke="#5c3d2b" stroke-width="5.5" stroke-linecap="round"/><path d="M33 33l9 9" stroke="#8a5d3f" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M28.6 28.6l3.4 3.4" stroke="#1c1822" stroke-width="7.5"/><path d="M28.6 28.6l3.4 3.4" stroke="#e2b04a" stroke-width="5"/>
      <circle cx="19" cy="19" r="15.2" fill="#1c1822"/><circle cx="19" cy="19" r="13.6" fill="#d9a441"/><circle cx="19" cy="19" r="11.4" fill="#dcebf2"/>
      <g fill="none" stroke="#b5243a" stroke-width="1.35" stroke-linecap="round"><path d="M13 22.5c0-4 2.7-7 6-7s6 3 6 7"/><path d="M15.3 23.5c0-3 1.7-5 3.7-5s3.7 2 3.7 5v1.8"/><path d="M17.6 24.6c0-1.6.6-2.8 1.4-2.8s1.4 1.2 1.4 2.8v3"/><path d="M11.4 19.6c.9-4.2 4-7 7.6-7 3.8 0 6.8 2.8 7.6 6.8"/><path d="M14 14c1.4-1 3.1-1.6 5-1.6 1.6 0 3.1.4 4.4 1.2"/><path d="M13.6 26c.6.9 1.2 1.6 2 2.2"/></g>
      <path d="M10.6 15.2a9.6 9.6 0 0 1 6.4-4.8" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".85"/>`,
    bulb: `<path d="M24 5a13 13 0 0 0-8 23c2 2 3 4 3 6h10c0-2 1-4 3-6a13 13 0 0 0-8-23Z" fill="#fde07a" ${st()}/><path d="M19 38h10M20 42h8" ${st()}/><path d="M21 28c-1-4 1-6 3-6s4 2 3 6" fill="none" stroke="#e3b33f" stroke-width="1.6"/>`,
    knife: `<path d="M8 40L32 16c4-4 8-5 10-3s1 6-3 10L15 47Z" fill="#e3dfea" ${st()}/><path d="M8 40l7 7" ${st(2.6)}/><path d="M3 45l5-5 7 7-5 5Z" fill="#9a5f34" ${st()}/>`,
    siren: `<path d="M12 36V24a12 12 0 0 1 24 0v12Z" fill="#e8615a" ${st()}/><rect x="8" y="36" width="32" height="6" rx="2" fill="#6b5f86" ${st()}/><path d="M18 24a6 6 0 0 1 6-6" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><path d="M5 18l4 2M43 18l-4 2M24 4v5M10 8l3 4M38 8l-3 4" ${st()}/>`,
    trash: `<path d="M10 13h28l-3 30H13Z" fill="#e3dfea" ${st()}/><path d="M6 13h36M19 13V8h10v5" fill="none" ${st()}/><path d="M19 20v16M24 20v16M29 20v16" ${st(1.6)}/>`,
    phone: `<rect x="13" y="4" width="22" height="40" rx="4" fill="#a88be0" ${st()}/><rect x="16" y="9" width="16" height="27" rx="1" fill="#d6ecfb"/><circle cx="24" cy="40" r="1.6" fill="#fff"/><path d="M24 14v12M19 21l5 5 5-5" fill="none" ${st(2)}/>`,
    star: `<path d="M24 4l6 13 14 1.5-10.5 9.5 3 14L24 35l-12.5 7 3-14L4 18.5 18 17Z" fill="#f6c85f" ${st()}/>`,
    starOff: `<path d="M24 4l6 13 14 1.5-10.5 9.5 3 14L24 35l-12.5 7 3-14L4 18.5 18 17Z" fill="#e3dfea" ${st()}/>`,
    calendar: `<rect x="5" y="9" width="38" height="34" rx="4" fill="#efe4cf" ${st()}/><path d="M5 18h38" ${st()}/><path d="M5 13a4 4 0 0 1 4-4h30a4 4 0 0 1 4 4v5H5Z" fill="#b5243a" ${st()}/><path d="M15 5v8M33 5v8" ${st(2.6)}/><path d="M18 25l12 12M30 25L18 37" stroke="#b5243a" stroke-width="3.6" stroke-linecap="round"/>`,
    cap: `<path d="M2 18l22-10 22 10-22 10Z" fill="#6b5f86" ${st()}/><path d="M12 23v10c4 4 20 4 24 0V23" fill="#8b7fa6" ${st()}/><path d="M42 20v12" ${st()}/><circle cx="42" cy="34" r="2.4" fill="#f6c85f" ${st(1.4)}/>`,
    lock: `<rect x="9" y="21" width="30" height="23" rx="4" fill="#f6c85f" ${st()}/><path d="M15 21v-6a9 9 0 0 1 18 0v6" fill="none" ${st(2.6)}/><circle cx="24" cy="31" r="3" fill="${INK}"/><path d="M24 33v5" ${st(2.4)}/>`,
    flame: `<path d="M24 4c8 8 13 14 13 22a13 13 0 0 1-26 0c0-5 3-9 6-12 0 5 2 8 6 8-3-6-1-13 1-18Z" fill="#f59e42" ${st()}/><path d="M24 24c3 3 6 6 6 10a6 6 0 0 1-12 0c0-3 3-6 6-10Z" fill="#fde07a"/>`,
    note: `<path d="M9 4h22l8 8v32H9Z" fill="#fff3c4" ${st()}/><path d="M31 4v8h8" fill="none" ${st()}/><path d="M15 20h18M15 27h18M15 34h12" ${st(1.8)}/>`,
    check: `<circle cx="24" cy="24" r="19" fill="#9ee6c9" ${st()}/><path d="M14 25l7 7 13-14" fill="none" ${st(3.4)}/>`,
    eye: `<path d="M3 24c6-10 13-15 21-15s15 5 21 15c-6 10-13 15-21 15S9 34 3 24Z" fill="#fffaf3" ${st()}/><circle cx="24" cy="24" r="8" fill="#a88be0" ${st()}/><circle cx="24" cy="24" r="3.4" fill="${INK}"/><circle cx="27" cy="21" r="1.6" fill="#fff"/>`,
    pencil: `<path d="M8 40l3-10L33 8l7 7-22 22Z" fill="#f6c85f" ${st()}/><path d="M29 12l7 7" ${st()}/><path d="M8 40l3-10 7 7Z" fill="#f4d8b0" ${st(1.6)}/><path d="M33 8l3-3 7 7-3 3" fill="#f4a3b5" ${st()}/>`,
    cross: `<path d="M12 12l24 24M36 12L12 36" stroke="#e8615a" stroke-width="6" stroke-linecap="round"/>`,
    undo: `<path d="M18 10L8 20l10 10" fill="none" ${st(3.6)}/><path d="M9 20h17a12 12 0 0 1 0 24h-6" fill="none" ${st(3.6)}/>`,
    hand: `<circle cx="24" cy="15" r="8" fill="#f1c19a" ${st()}/><path d="M10 44c0-10 6-16 14-16s14 6 14 16Z" fill="#a88be0" ${st()}/>`,
    wave: `<path d="M14 26V12a3 3 0 0 1 6 0v10V8a3 3 0 0 1 6 0v14V10a3 3 0 0 1 6 0v14-8a3 3 0 0 1 6 0v12c0 10-6 16-14 16-6 0-10-3-13-8l-5-9a3 3 0 0 1 5-3Z" fill="#f1c19a" ${st()}/>`,
    coin: `<circle cx="24" cy="24" r="19" fill="#e2b04a" ${st()}/><circle cx="24" cy="24" r="13.5" fill="none" stroke="#b9862c" stroke-width="2.4"/><path d="M24 15.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8Z" fill="#fff1cc" ${st(1.3)}/>`,
    trophy: `<path d="M14 6h20v12a10 10 0 0 1-20 0Z" fill="#f6c85f" ${st()}/><path d="M14 9H7v3a7 7 0 0 0 7 7M34 9h7v3a7 7 0 0 1-7 7" fill="none" ${st()}/><path d="M21 28h6v7h-6Z" fill="#e3a92b" ${st()}/><rect x="14" y="35" width="20" height="8" rx="2" fill="#a88be0" ${st()}/><path d="M19 12l2 0M20 11v2" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`,
    trophyOff: `<path d="M14 6h20v12a10 10 0 0 1-20 0Z" fill="#e3dfea" ${st()}/><path d="M14 9H7v3a7 7 0 0 0 7 7M34 9h7v3a7 7 0 0 1-7 7" fill="none" ${st()}/><path d="M21 28h6v7h-6Z" fill="#d2ccdc" ${st()}/><rect x="14" y="35" width="20" height="8" rx="2" fill="#d2ccdc" ${st()}/>`,
    gift: `<rect x="6" y="20" width="36" height="23" rx="3" fill="#b5243a" ${st()}/><rect x="4" y="14" width="40" height="8" rx="2" fill="#cf3a4f" ${st()}/><path d="M24 14v29" stroke="#e2b04a" stroke-width="5"/><path d="M24 14v29" ${st(1.2)}/><path d="M24 14c-4-8-13-8-11-2 1 3 7 2 11 2Zm0 0c4-8 13-8 11-2-1 3-7 2-11 2Z" fill="#e2b04a" ${st()}/>`,
    play: `<circle cx="24" cy="24" r="20" fill="#9ee6c9" ${st()}/><path d="M19 14l14 10-14 10Z" fill="#fff" ${st()}/>`,
    sound: `<path d="M6 18h8l10-8v28l-10-8H6Z" fill="#a88be0" ${st()}/><path d="M31 17c3 4 3 10 0 14M36 12c6 7 6 17 0 24" fill="none" ${st(2.6)}/>`,
    mute: `<path d="M6 18h8l10-8v28l-10-8H6Z" fill="#d2ccdc" ${st()}/><path d="M31 18l11 12M42 18L31 30" ${st(2.8)}/>`,
    medal: `<path d="M15 4h8l3 12h-8ZM33 4h-8l-3 12h8Z" fill="#8fd3f4" ${st(1.6)}/><circle cx="24" cy="30" r="13" fill="#f6c85f" ${st()}/><path d="M24 22l2.6 5.2 5.6.6-4.2 3.8 1.2 5.6L24 34.4l-5.2 2.8 1.2-5.6-4.2-3.8 5.6-.6Z" fill="#fff3c4" ${st(1.2)}/>`,
    map: `<path d="M5 10l12-4 14 5 12-4v31l-12 4-14-5-12 4Z" fill="#fff3c4" ${st()}/><path d="M17 6v31M31 11v31" ${st(1.6)}/><path d="M10 30c4-6 8 2 12-4s8-2 12-8" fill="none" stroke="#e8615a" stroke-width="2" stroke-dasharray="3 3" stroke-linecap="round"/><path d="M36 15l3 3m0-3l-3 3" stroke="#e8615a" stroke-width="2.4" stroke-linecap="round"/>`,
    gear: `<path d="M20 4h8l1.4 5.2 4.2 1.8 4.7-2.8 5.7 5.7-2.8 4.7 1.8 4.2L48 20v8l-5.2 1.4-1.8 4.2 2.8 4.7-5.7 5.7-4.7-2.8-4.2 1.8L28 44h-8l-1.4-5.2-4.2-1.8-4.7 2.8-5.7-5.7 2.8-4.7-1.8-4.2L-.0 28v-8l5.2-1.4 1.8-4.2-2.8-4.7 5.7-5.7 4.7 2.8 4.2-1.8Z" transform="translate(0 0) scale(.96) translate(1 1)" fill="#d9a441" ${st(1.8)}/><circle cx="24" cy="24" r="7.5" fill="#fffaf3" ${st(1.8)}/>`,
    sparkle: `<path d="M24 3c2 12 5 15 18 18-13 3-16 6-18 18-2-12-5-15-18-18C19 18 22 15 24 3Z" fill="#f6c85f" ${st(1.6)}/>`,
  };


  function appIcon(pad = 0) {
    const k = 1 - pad * 2, o = 256 * pad * 2;
    let grid = '';
    for (let i = 1; i < 6; i++) grid += `<path d="M${i * 85} -40V560M-40 ${i * 85}H560" stroke="#e2b04a" stroke-opacity=".10" stroke-width="3"/>`;
    return `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <defs><radialGradient id="bg" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="#43243f"/><stop offset=".55" stop-color="#22172c"/><stop offset="1" stop-color="#0e0b14"/></radialGradient>
      <radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ff4d5e" stop-opacity=".45"/><stop offset="1" stop-color="#ff4d5e" stop-opacity="0"/></radialGradient></defs>
      <rect width="512" height="512" fill="url(#bg)"/>
      <g transform="rotate(-8 256 256)">${grid}</g>
      <g transform="translate(${o / 2 + 30 * k} ${o / 2 + 30 * k}) scale(${k})">
        <circle cx="200" cy="200" r="190" fill="url(#glow)"/>
        <g transform="scale(9.4)" filter="drop-shadow(0 .4px .6px rgba(0,0,0,.5))">${UI.logo}</g>
      </g>
    </svg>`;
  }

  /* ---------- characters ---------- */
  const SKIN = ['#fde2c8', '#f6cfa8', '#e8b48a', '#c98d62', '#a96f47', '#7e5236'];
  const HAIR = ['#3a2a22', '#6b4226', '#a8652f', '#e3b65c', '#b8452f', '#2b2340', '#cfc8d8', '#8a4f7d'];
  function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

  function avatar(person) {
    const h = hash(person.name + person.letter);
    const pick = (arr, k) => arr[(h >>> k) % arr.length];
    const skin = pick(SKIN, 1), hair = person.name === 'Bruno' ? HAIR[6] : pick(HAIR, 5);
    const shirt = person.color || '#a88be0';
    const f = person.g === 'f';
    const style = (h >>> 9) % (f ? 5 : 5);
    const glasses = ((h >>> 13) % 4) === 0;
    const beard = !f && ((h >>> 15) % 3) === 0;
    const dead = person.isVictim;
    let back = '', front = '';
    if (f) {
      if (style === 0) back = `<path d="M16 32c-1-14 6-21 16-21s17 7 16 21v14H16Z" fill="${hair}" ${st(1.6)}/>`; // long
      if (style === 1) back = `<path d="M17 30c-1-12 6-18 15-18s16 6 15 18c0 4-1 7-3 8H20c-2-1-3-4-3-8Z" fill="${hair}" ${st(1.6)}/>`; // bob
      if (style === 2) back = `<circle cx="32" cy="9" r="6" fill="${hair}" ${st(1.6)}/>`; // bun
      if (style === 3) back = `<path d="M44 22c6 2 8 9 5 16-1 2-4 2-4 0 1-5 0-9-3-12Z" fill="${hair}" ${st(1.6)}/>`; // ponytail
      if (style === 4) back = `<g fill="${hair}" ${st(1.4)}><circle cx="19" cy="22" r="6"/><circle cx="45" cy="22" r="6"/><circle cx="18" cy="32" r="5.5"/><circle cx="46" cy="32" r="5.5"/><circle cx="20" cy="40" r="4.5"/><circle cx="44" cy="40" r="4.5"/></g>`; // curls
      front = style === 4
        ? `<g fill="${hair}" ${st(1.4)}><circle cx="24" cy="16" r="6"/><circle cx="32" cy="13" r="6.5"/><circle cx="40" cy="16" r="6"/></g>`
        : `<path d="M19 27c0-9 6-14 13-14s13 5 13 14c-4-2-7-6-8-9-3 4-10 8-18 9Z" fill="${hair}" ${st(1.6)}/>`;
    } else {
      if (style === 0) front = `<path d="M18 27c-1-10 5-15 14-15s15 5 14 15c-2-4-6-7-14-7s-12 3-14 7Z" fill="${hair}" ${st(1.6)}/>`; // short
      if (style === 1) front = `<path d="M18 26l1-9 4 3 3-7 4 5 4-7 3 7 4-3 1 6 1 5c-4-4-8-5-14-5s-10 1-15 5Z" fill="${hair}" ${st(1.6)}/>`; // spiky
      if (style === 2) front = `<path d="M18 28c-1-11 6-16 14-16 9 0 15 5 14 16-3-6-8-9-18-8 3-1 5-3 6-5-6 2-12 6-16 13Z" fill="${hair}" ${st(1.6)}/>`; // side part
      if (style === 3) front = `<path d="M18 28c-2-3-1-7 1-8M46 28c2-3 1-7-1-8" fill="none" stroke="${hair}" stroke-width="4" stroke-linecap="round"/>`; // bald
      if (style === 4) front = `<g fill="${hair}" ${st(1.4)}><circle cx="21" cy="20" r="5"/><circle cx="27" cy="15" r="5.5"/><circle cx="34" cy="14" r="5.5"/><circle cx="41" cy="18" r="5"/><circle cx="44" cy="25" r="3.6"/><circle cx="19" cy="26" r="3.6"/></g>`; // curly
    }
    const eyes = dead
      ? `<path d="M24 28l4 4M28 28l-4 4M36 28l4 4M40 28l-4 4" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`
      : `<ellipse cx="26" cy="30" rx="1.9" ry="2.4" fill="${INK}"/><ellipse cx="38" cy="30" rx="1.9" ry="2.4" fill="${INK}"/><circle cx="26.7" cy="29.2" r=".7" fill="#fff"/><circle cx="38.7" cy="29.2" r=".7" fill="#fff"/>`;
    const mouth = dead ? `<path d="M28 38c2-1 6-1 8 0" fill="none" ${st(1.6)}/>` : `<path d="M28 36.5c2 2.4 6 2.4 8 0" fill="none" ${st(1.6)}/>`;
    const blush = '';
    const gl = glasses ? `<circle cx="26" cy="30" r="4.6" fill="none" ${st(1.5)}/><circle cx="38" cy="30" r="4.6" fill="none" ${st(1.5)}/><path d="M30.6 30h2.8" ${st(1.5)}/>` : '';
    const bd = beard ? `<path d="M20 31c1 9 6 13 12 13s11-4 12-13c-2 3-5 4-7 4h-10c-2 0-5-1-7-4Z" fill="${hair}" ${st(1.4)}/><path d="M28 37c2 1.6 6 1.6 8 0" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>` : '';
    const ear = f && !glasses && ((h >>> 17) % 2) ? `<circle cx="18.5" cy="36" r="1.6" fill="#f6c85f" ${st(1)}/><circle cx="45.5" cy="36" r="1.6" fill="#f6c85f" ${st(1)}/>` : '';
    return `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      ${back}
      <path d="M10 64c0-11 9-17 22-17s22 6 22 17Z" fill="${shirt}" ${st(1.6)}/>
      <path d="M27 42h10v7c-3 2-7 2-10 0Z" fill="${skin}" ${st(1.4)}/>
      <circle cx="18.5" cy="31" r="3.4" fill="${skin}" ${st(1.4)}/><circle cx="45.5" cy="31" r="3.4" fill="${skin}" ${st(1.4)}/>
      <ellipse cx="32" cy="30" rx="13.5" ry="14" fill="${skin}" ${st(1.6)}/>
      ${bd}${eyes}${blush}${dead ? mouth : beard ? '' : mouth}${gl}${front}${ear}
    </svg>`;
  }

  /* ---------- character skins for the shop ---------- */
  const SVG64 = (body, defs = '') => `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${defs}${body}</svg>`;
  const eyesAt = (dead, x1, x2, y, r = 2.3, col = INK) => dead
    ? `<path d="M${x1 - 2.4} ${y - 2.4}l4.8 4.8M${x1 + 2.4} ${y - 2.4}l-4.8 4.8M${x2 - 2.4} ${y - 2.4}l4.8 4.8M${x2 + 2.4} ${y - 2.4}l-4.8 4.8" stroke="${col}" stroke-width="2" stroke-linecap="round"/>`
    : `<circle cx="${x1}" cy="${y}" r="${r}" fill="${col}"/><circle cx="${x2}" cy="${y}" r="${r}" fill="${col}"/><circle cx="${x1 + 0.8}" cy="${y - 0.9}" r="${r * 0.33}" fill="#fff"/><circle cx="${x2 + 0.8}" cy="${y - 0.9}" r="${r * 0.33}" fill="#fff"/>`;
  const smile = (dead, y = 39, w = 4) => dead ? `<path d="M${32 - w} ${y + 1}c2-1.2 ${w * 2 - 4} -1.2 ${w * 2} 0" fill="none" ${st(1.6)}/>` : `<path d="M${32 - w} ${y}c2 2.4 ${w * 2 - 4} 2.4 ${w * 2} 0" fill="none" ${st(1.6)}/>`;
  const shirt = (c) => `<path d="M10 64c0-11 9-17 22-17s22 6 22 17Z" fill="${c}" ${st(1.6)}/>`;
  const pickH = (person, k, arr) => arr[(hash(person.name + person.letter) >>> k) % arr.length];
  // better mixing so neighbouring letters/names look different; slot = place in the cast (A..I, victim last)
  const fmix = (h) => { h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16; return h >>> 0; };
  const rn = (p, salt, n) => fmix((hash(p.name + p.letter) ^ Math.imul(salt + 1, 0x9e3779b1)) >>> 0) % n;
  const slotOf = (p) => { const i = 'ABCDEFGHIJ'.indexOf(p.letter); return i >= 0 ? i : p.letter === 'V' ? 9 : rn(p, 99, 10); };
  const glassesSvg = (k, col = INK) => (k === 1 ? `<circle cx="27" cy="31" r="4.6" fill="#fff" fill-opacity=".3" stroke="${col}" stroke-width="1.5"/><circle cx="37" cy="31" r="4.6" fill="#fff" fill-opacity=".3" stroke="${col}" stroke-width="1.5"/><path d="M31.6 31h.8M22.4 30l-3-1M41.6 30l3-1" stroke="${col}" stroke-width="1.4" stroke-linecap="round"/>`
    : k === 2 ? `<rect x="22" y="27.5" width="10" height="7" rx="1.6" fill="#fff" fill-opacity=".3" stroke="${col}" stroke-width="1.5"/><rect x="32" y="27.5" width="10" height="7" rx="1.6" fill="#fff" fill-opacity=".3" stroke="${col}" stroke-width="1.5"/><path d="M32 30h0" stroke="${col}"/>` : '');
  const stacheSvg = (k, col) => (k === 1 ? `<path d="M24.5 38c3-3 5-2.4 7.5-.6 2.5-1.8 4.5-2.4 7.5.6-2.2-.2-3.4.6-4.4 1.8-1-1-2-1.4-3.1-1.4s-2.1.4-3.1 1.4c-1-1.2-2.2-2-4.4-1.8Z" fill="${col}"/><path d="M23.5 37.6c-1.2-1-2.6-.4-2.6.8M40.5 37.6c1.2-1 2.6-.4 2.6.8" fill="none" stroke="${col}" stroke-width="1.5" stroke-linecap="round"/>`
    : k === 2 ? `<path d="M28 37.5c2-1 6-1 8 0-1.2 1.2-2.6 1.4-4 1.4s-2.8-.2-4-1.4Z" fill="${col}"/><path d="M29.5 41c1 4 4 4 5 0Z" fill="${col}" ${st(1)}/>`
    : k === 3 ? `<path d="M26 37.4c3-1.6 9-1.6 12 0" fill="none" stroke="${col}" stroke-width="2" stroke-linecap="round"/>`
    : k === 4 ? `<path d="M20 33c1 9 5 13 12 13s11-4 12-13c-2 3-5 4-7 4H27c-2 0-5-1-7-4Z" fill="${col}" ${st(1.3)}/>` : '');

  // Pet Detectives: animal heads with a little bow tie
  function petAvatar(p) {
    const d = p.isVictim, kind = pickH(p, 3, ['cat', 'dog', 'fox', 'bunny', 'bear', 'panda', 'owl', 'frog']);
    const fur = { cat: pickH(p, 7, ['#f2a65a', '#9a9aa8', '#3d3540', '#f4e6d0']), dog: pickH(p, 7, ['#c98d62', '#e8c48f', '#7a5236']), fox: '#e8833a', bunny: pickH(p, 7, ['#f1ece6', '#c9b4a0']), bear: '#9a6a43', panda: '#fbfbfb', owl: '#a9805a', frog: '#7cc47a' }[kind];
    const bow = `<path d="M24 50l8 3.5-8 3.5ZM40 50l-8 3.5 8 3.5Z" fill="${p.color}" ${st(1.3)}/><circle cx="32" cy="53.5" r="2" fill="${p.color}" ${st(1.2)}/>`;
    let head = '', ex = 25.5, ex2 = 38.5, ey = 31;
    if (kind === 'cat') head = `<path d="M17 24l2-13 9 8ZM47 24l-2-13-9 8Z" fill="${fur}" ${st(1.5)}/><circle cx="32" cy="32" r="15.5" fill="${fur}" ${st(1.6)}/><path d="M30 36l2 2 2-2Z" fill="#f4a3b5" ${st(1)}/><path d="M16 35h8M16 39l8-2M48 35h-8M48 39l-8-2" stroke="${INK}" stroke-width="1"/>`;
    if (kind === 'dog') head = `<circle cx="32" cy="32" r="15" fill="${fur}" ${st(1.6)}/><path d="M17 22c-6 2-6 14-2 17 3-1 4-9 4-15ZM47 22c6 2 6 14 2 17-3-1-4-9-4-15Z" fill="#6b4226" ${st(1.5)}/><ellipse cx="32" cy="38" rx="6.5" ry="5" fill="#f4e6d0" ${st(1.3)}/><ellipse cx="32" cy="35.5" rx="2.6" ry="1.9" fill="${INK}"/>`;
    if (kind === 'fox') head = `<path d="M17 25l1-15 10 8ZM47 25l-1-15-10 8Z" fill="${fur}" ${st(1.5)}/><path d="M16 28c0-8 7-13 16-13s16 5 16 13c0 9-7 16-16 18-9-2-16-9-16-18Z" fill="${fur}" ${st(1.6)}/><path d="M20 33c4 2 8 6 12 12 4-6 8-10 12-12-3 8-7 12-12 13-5-1-9-5-12-13Z" fill="#fff" ${st(1.2)}/><ellipse cx="32" cy="41" rx="2.2" ry="1.6" fill="${INK}"/>`;
    if (kind === 'bunny') head = `<ellipse cx="25" cy="12" rx="4.5" ry="11" fill="${fur}" ${st(1.5)}/><ellipse cx="39" cy="12" rx="4.5" ry="11" fill="${fur}" ${st(1.5)}/><ellipse cx="25" cy="13" rx="2" ry="7" fill="#f4a3b5"/><ellipse cx="39" cy="13" rx="2" ry="7" fill="#f4a3b5"/><circle cx="32" cy="33" r="15" fill="${fur}" ${st(1.6)}/><path d="M30.4 36.5h3.2l-1.6 2Z" fill="#f4a3b5"/>`;
    if (kind === 'bear') head = `<circle cx="19" cy="20" r="6" fill="${fur}" ${st(1.5)}/><circle cx="45" cy="20" r="6" fill="${fur}" ${st(1.5)}/><circle cx="32" cy="32" r="15.5" fill="${fur}" ${st(1.6)}/><ellipse cx="32" cy="38" rx="7" ry="5.5" fill="#d9b48a" ${st(1.2)}/><ellipse cx="32" cy="35.5" rx="2.6" ry="1.9" fill="${INK}"/>`;
    if (kind === 'panda') head = `<circle cx="19" cy="19" r="6" fill="#2b2530" ${st(1.4)}/><circle cx="45" cy="19" r="6" fill="#2b2530" ${st(1.4)}/><circle cx="32" cy="32" r="15.5" fill="${fur}" ${st(1.6)}/><ellipse cx="25" cy="31" rx="4.6" ry="5.6" fill="#2b2530" transform="rotate(-20 25 31)"/><ellipse cx="39" cy="31" rx="4.6" ry="5.6" fill="#2b2530" transform="rotate(20 39 31)"/><ellipse cx="32" cy="37.5" rx="2.4" ry="1.7" fill="${INK}"/>`;
    if (kind === 'owl') { head = `<path d="M17 19l5 6M47 19l-5 6" ${st(2)}/><ellipse cx="32" cy="34" rx="16" ry="16" fill="${fur}" ${st(1.6)}/><circle cx="25" cy="31" r="6.5" fill="#fff" ${st(1.4)}/><circle cx="39" cy="31" r="6.5" fill="#fff" ${st(1.4)}/><path d="M32 34l-2.6 3h5.2Z" fill="#f6c85f" ${st(1.1)}/>`; ex = 25; ex2 = 39; }
    if (kind === 'frog') { head = `<circle cx="23" cy="21" r="6.5" fill="${fur}" ${st(1.5)}/><circle cx="41" cy="21" r="6.5" fill="${fur}" ${st(1.5)}/><ellipse cx="32" cy="35" rx="17" ry="12.5" fill="${fur}" ${st(1.6)}/><circle cx="23" cy="21" r="3.6" fill="#fff"/><circle cx="41" cy="21" r="3.6" fill="#fff"/>`; ex = 23; ex2 = 41; ey = 21; }
    const panda = kind === 'panda';
    return SVG64(`${shirt(p.color)}${head}${eyesAt(d, ex, ex2, ey, 2.2, panda && !d ? '#fff' : INK)}${kind === 'frog' ? smile(d, 38, 7) : smile(d, 41, 3)}${bow}`);
  }

  // Noir Gangsters: fedoras, trench coats, shades and a mustache or two
  function gangsterAvatar(p) {
    const d = p.isVictim, h = hash(p.name + p.letter), f = p.g === 'f';
    const skin = ['#f2d3b5', '#e0b28a', '#c48a5e', '#8f6040'][h % 4], hat = ['#2b2530', '#3d3540', '#5a4a3a'][(h >>> 3) % 3];
    const shades = !d && (h >>> 5) % 3 === 0, stache = !f && (h >>> 7) % 2 === 0;
    const coat = `<path d="M8 64c0-12 10-18 24-18s24 6 24 18Z" fill="#b59a6c" ${st(1.6)}/><path d="M32 46l-8 18M32 46l8 18" ${st(1.4)}/><path d="M24 46l8 9 8-9" fill="#efe4cf" ${st(1.3)}/><path d="M30 52h4l-1 12h-2Z" fill="${p.color}" ${st(1)}/>`;
    const hair = f ? `<path d="M18 30c-2 6 0 14 4 16 0-6-1-10 1-14M46 30c2 6 0 14-4 16 0-6 1-10-1-14" fill="#2b2530" ${st(1.3)}/>` : '';
    const face = `<ellipse cx="32" cy="32" rx="12.5" ry="13.5" fill="${skin}" ${st(1.6)}/>`;
    const hatSvg = `<path d="M12 23c6 2 34 2 40 0-1 3-6 5-20 5s-19-2-20-5Z" fill="${hat}" ${st(1.5)}/><path d="M20 24c0-9 4-14 12-14s12 5 12 14c-6 1.5-18 1.5-24 0Z" fill="${hat}" ${st(1.5)}/><path d="M20.5 20.5c7 1.4 16 1.4 23 0v3.4c-7 1.4-16 1.4-23 0Z" fill="${p.color}"/><path d="M28 12c2 2 6 2 8 0" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="1.4"/>`;
    const eyes = shades ? `<path d="M21 30h22v2c0 3-2 5-5 5h-2c-2 0-4-2-4-4 0 2-2 4-4 4h-2c-3 0-5-2-5-5Z" fill="#1c1822"/><path d="M24 31.5h3" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/>` : eyesAt(d, 27, 37, 31.5, 1.9);
    const mouth = stache ? `<path d="M26 38c2-2 4-2 6-.6 2-1.4 4-1.4 6 .6-2 1.6-4 1.4-6 .2-2 1.2-4 1.4-6-.2Z" fill="#2b2530"/>` : f ? `<path d="M29 38.5c2 1.4 4 1.4 6 0-1 2-5 2-6 0Z" fill="#b5243a" ${st(1)}/>` : smile(d, 38, 3);
    return SVG64(`${coat}${hair}${face}${eyes}${mouth}${hatSvg}`);
  }

  // Monster Mash
  function monsterAvatar(p) {
    const d = p.isVictim, kind = ['vampire', 'witch', 'ghost', 'wolf', 'zombie', 'cyclops', 'mummy', 'vampiress', 'franken', 'skeleton'][slotOf(p)];
    let b = '';
    if (kind === 'vampire') b = `<path d="M8 64c2-12 10-18 24-18s22 6 24 18Z" fill="#2b2530" ${st(1.6)}/><path d="M14 50l18 8 18-8-4 14H18Z" fill="#b5243a" ${st(1.4)}/><ellipse cx="32" cy="31" rx="12.5" ry="14" fill="#e9e4ef" ${st(1.6)}/><path d="M19.5 28c0-9 6-14 12.5-14s12.5 5 12.5 14c-3-3-6-5-9-5l-3.5 6-3.5-6c-3 0-6 2-9 5Z" fill="#1c1822" ${st(1.4)}/>${eyesAt(d, 27, 37, 31, 2, '#b5243a')}<path d="M27 38c3 2 7 2 10 0" fill="none" ${st(1.5)}/>${d ? '' : '<path d="M29 38.6l1 3 1-2.6M35 38.6l-1 3-1-2.6" fill="#fff" stroke="#3d3250" stroke-width=".9"/>'}`;
    if (kind === 'zombie') b = `${shirt('#6b7a5a')}<path d="M20 52l4 4 4-4 4 4 4-4 4 4 4-4" fill="none" ${st(1.3)}/><ellipse cx="32" cy="31" rx="13" ry="14" fill="#9cc48c" ${st(1.6)}/><path d="M19 24l4-8 3 5 4-7 3 6 4-6 2 6 5-3-2 8c-6-2-16-2-23-1Z" fill="#4a3a2a" ${st(1.3)}/>${d ? eyesAt(d, 27, 37, 31) : `<circle cx="27" cy="31" r="3.4" fill="#fff" ${st(1.2)}/><circle cx="27" cy="31.5" r="1.4" fill="${INK}"/><circle cx="37" cy="31" r="2" fill="${INK}"/>`}<path d="M27 39h10" ${st(1.5)}/><path d="M29 37.5v3M32 37.5v3M35 37.5v3" stroke="${INK}" stroke-width="1"/><path d="M39 22l4 4M41 21l-1 4" stroke="#b5243a" stroke-width="1.2"/>`;
    if (kind === 'mummy') b = `${shirt('#e9dfc8')}<ellipse cx="32" cy="31" rx="13.5" ry="14.5" fill="#efe6d2" ${st(1.6)}/><path d="M19 22c8-3 18-3 26 1M18.5 28c9-2 18-2 27 0M19 35c8 2 18 2 26-1M21 41c7 2 15 2 22-1M20 25l24 4M20 38l23-3" fill="none" stroke="#c9b48a" stroke-width="1.6"/><rect x="22" y="28" width="20" height="6" rx="3" fill="#2b2530"/>${eyesAt(d, 27, 37, 31, 1.6, d ? '#efe6d2' : '#f6c85f')}`;
    if (kind === 'ghost') b = `<path d="M14 64V32c0-11 8-19 18-19s18 8 18 19v32l-4.5-4-4.5 4-4.5-4-4.5 4-4.5-4-4.5 4-4.5-4Z" fill="#f7f4fb" ${st(1.6)}/>${d ? eyesAt(d, 26, 38, 30, 2.4) : '<ellipse cx="26" cy="30" rx="3" ry="4.2" fill="#1c1822"/><ellipse cx="38" cy="30" rx="3" ry="4.2" fill="#1c1822"/>'}<ellipse cx="32" cy="41" rx="3" ry="${d ? 1.4 : 3.6}" fill="#1c1822"/>`;
    if (kind === 'witch') b = `${shirt('#4a2a5a')}<path d="M20 36c-3 6-2 12 2 14M44 36c3 6 2 12-2 14" fill="none" stroke="#7a3b2e" stroke-width="4" stroke-linecap="round"/><ellipse cx="32" cy="33" rx="12" ry="13" fill="#a8d29a" ${st(1.6)}/>${eyesAt(d, 27, 37, 33, 2)}${smile(d, 40, 3)}<path d="M30 34l2 4 1-1" fill="none" ${st(1.3)}/><path d="M10 23c8 3 36 3 44 0-3 4-12 5-22 5s-19-1-22-5Z" fill="#2b2530" ${st(1.5)}/><path d="M20 24c4-4 7-12 10-20 2 2 6 3 10 2-2 6-1 13 4 18-8 1.4-16 1.4-24 0Z" fill="#2b2530" ${st(1.5)}/><path d="M21 21c7 1.4 15 1.4 22 0" stroke="${p.color}" stroke-width="2.6"/>`;
    if (kind === 'franken') b = `${shirt('#3d3540')}<rect x="19" y="18" width="26" height="28" rx="6" fill="#8fbf85" ${st(1.6)}/><path d="M19 24V16h26v8c-4-2-8-3-13-3s-9 1-13 3Z" fill="#1c1822" ${st(1.3)}/><path d="M14 33h5M45 33h5" stroke="#9a9aa8" stroke-width="3.4" stroke-linecap="round"/>${eyesAt(d, 27, 37, 30, 2)}<path d="M26 39h12M28 37.5v3M31 37.5v3M34 37.5v3M37 37.5v3" stroke="${INK}" stroke-width="1.2"/><path d="M25 23l3 2M33 22l4 1" stroke="${INK}" stroke-width="1.6"/>`;
    if (kind === 'wolf') b = `${shirt(p.color)}<path d="M16 26l2-15 10 9ZM48 26l-2-15-10 9Z" fill="#6b5a4e" ${st(1.5)}/><path d="M16 30c0-9 7-15 16-15s16 6 16 15c0 6-3 10-6 12l-10 6-10-6c-3-2-6-6-6-12Z" fill="#7a6a5e" ${st(1.6)}/><path d="M25 36c2 6 4 9 7 10 3-1 5-4 7-10-3-2-11-2-14 0Z" fill="#c9b8a6" ${st(1.2)}/><ellipse cx="32" cy="37" rx="2.6" ry="1.9" fill="${INK}"/>${eyesAt(d, 26, 38, 29, 2, d ? INK : '#f6c85f')}${d ? '' : '<path d="M29 43l1 2 1-2M33 43l1 2 1-2" fill="#fff" stroke="#3d3250" stroke-width=".8"/>'}`;
    if (kind === 'skeleton') b = `<path d="M10 64c0-11 9-17 22-17s22 6 22 17Z" fill="#2b2530" ${st(1.6)}/><path d="M22 52h20M24 56h16M26 60h12M32 47v17" stroke="#efe6d2" stroke-width="2"/><path d="M19 30c0-9 6-15 13-15s13 6 13 15c0 5-2 8-4 9v5H23v-5c-2-1-4-4-4-9Z" fill="#f5efe2" ${st(1.6)}/>${d ? eyesAt(d, 27, 37, 30, 2) : '<ellipse cx="27" cy="30" rx="3.6" ry="4" fill="#1c1822"/><ellipse cx="37" cy="30" rx="3.6" ry="4" fill="#1c1822"/>'}<path d="M32 33l-2 4h4Z" fill="#1c1822"/><path d="M27 42v2M30 42v2M33 42v2M36 42v2" stroke="${INK}" stroke-width="1"/>`;
    if (kind === 'vampiress') b = `<path d="M15 30c-2-12 6-18 17-18s19 6 17 18c0 10 2 18 5 24H10c3-6 5-14 5-24Z" fill="#1c1822" ${st(1.6)}/><path d="M8 64c2-12 10-18 24-18s22 6 24 18Z" fill="#4a1a2e" ${st(1.6)}/><path d="M18 50l14 9 14-9-3 14H21Z" fill="#b5243a" ${st(1.4)}/><ellipse cx="32" cy="32" rx="12" ry="13.5" fill="#f1ecf5" ${st(1.6)}/><path d="M19.500 27c0-8 5-12 12.500-12s12.500 4 12.500 12c-4-3-8-5-12.500-5s-8.500 2-12.500 5Z" fill="#1c1822" ${st(1.3)}/><path d="M33 16c4 3 7 7 8 12" fill="none" stroke="#b5243a" stroke-width="2"/>${eyesAt(d, 27, 37, 31, 2, '#b5243a')}<path d="M28 38.500c2 2 6 2 8 0-1 1.200-3 1.600-4 1.600s-3-.4-4-1.600Z" fill="#b5243a" ${st(1)}/>${d ? '' : '<path d="M29.500 39.500l.8 2.400.8-2M33.500 39.500l.8 2.400.8-2" fill="#fff" stroke="#3d3250" stroke-width=".8"/>'}<path d="M42 17l5 2-3 3 5 1-6 3Z" fill="#7a1a30" ${st(1)}/>`;
    if (kind === 'cyclops') b = `${shirt(p.color)}<path d="M18 24l-4-11 9 5ZM46 24l4-11-9 5Z" fill="#f1ecf5" ${st(1.4)}/><path d="M14 32c0-11 8-18 18-18s18 7 18 18c0 9-7 14-18 14s-18-5-18-14Z" fill="#9a7be0" ${st(1.7)}/><path d="M17 40l2 2M45 40l-2 2M21 20l2 2M43 20l-2 2M32 15v3" stroke="#7a5fc4" stroke-width="1.6" stroke-linecap="round"/><circle cx="32" cy="29" r="8" fill="#fff" ${st(1.5)}/>${d ? '<path d="M28 25l8 8M36 25l-8 8" stroke="#3d3250" stroke-width="2" stroke-linecap="round"/>' : '<circle cx="32" cy="29.500" r="4" fill="#2fbf71"/><circle cx="32" cy="29.500" r="2" fill="#1c1822"/><circle cx="33.200" cy="28.200" r=".9" fill="#fff"/>'}<path d="M22 39c6 5 14 5 20 0-1 4-5 7-10 7s-9-3-10-7Z" fill="#fff" ${st(1.3)}/><path d="M26 40.500v3M30 42v3.500M34 42v3.500M38 40.500v3" stroke="#3d3250" stroke-width="1"/>`;
    return SVG64(b);
  }

  // Royal Court: crowns, jewels and an ermine cape
  // Royal Court: ten different crowns and hats by cast slot, cape colour by slot, hair and beards by name
  function royalAvatar(p) {
    const d = p.isVictim, f = p.g === 'f', s = slotOf(p);
    const skin = SKIN[rn(p, 1, 6)], hair = s === 8 ? '#f5f0f8' : ['#3a2a22', '#a8652f', '#e3b65c', '#b8452f', '#cfc8d8', '#6b4226'][rn(p, 2, 6)];
    const capeC = ['#6b2a8a', '#b5243a', '#1d4ed8', '#1f7a52', '#3a3a4a', '#0f766e', '#9a3b6b', '#8a5a1a', '#312e81', '#7a1f1f'][s];
    const fur = capeC === '#3a3a4a' ? '#e8e4ee' : '#fbf8f2';
    const cape = `<path d="M8 64c0-12 10-18 24-18s24 6 24 18Z" fill="${capeC}" ${st(1.6)}/><path d="M14 52c6-4 12-6 18-6s12 2 18 6l-2 5c-5-3-11-4-16-4s-11 1-16 4Z" fill="${fur}" ${st(1.3)}/><path d="M20 53v1.400M26 51.500v1.400M32 51v1.400M38 51.500v1.400M44 53v1.400" stroke="#1c1822" stroke-width="1.600" stroke-linecap="round"/><circle cx="32" cy="59" r="2.600" fill="${['#e8615a', '#8fd3f4', '#9ee6a0', '#ffd166'][rn(p, 3, 4)]}" ${st(1.2)}/>`;
    const longHair = f && s !== 8 && s !== 5 && s !== 7;
    const back = longHair ? `<path d="M18 30c-1-10 6-16 14-16s15 6 14 16c0 7-1 12-4 15H22c-3-3-4-8-4-15Z" fill="${hair}" ${st(1.4)}/>` : '';
    const face = `<ellipse cx="32" cy="32" rx="12.500" ry="13.500" fill="${skin}" ${st(1.6)}/>`;
    const hairdo = s === 8 ? `<g fill="${hair}" ${st(1.3)}><circle cx="17.500" cy="25" r="4.500"/><circle cx="16.500" cy="33" r="4.500"/><circle cx="46.500" cy="25" r="4.500"/><circle cx="47.500" cy="33" r="4.500"/><path d="M19 28c0-9 5-14 13-14s13 5 13 14c-4-3-8-5-13-5s-9 2-13 5Z"/></g>`
      : (s === 5 || s === 7) ? '' : `<path d="M19.500 29c0-8 5-12 12.500-12s12.500 4 12.500 12c-4-3-8-5-12.500-5s-8.500 2-12.500 5Z" fill="${hair}" ${st(1.3)}/>`;
    const gem = (x, y, c = '#8fd3f4', r = 1.500) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" ${st(.8)}/>`;
    let hat = '';
    if (s === 0) hat = `<path d="M20 20V9l5.500 5 6.500-8 6.500 8L44 9v11Z" fill="#f6c85f" ${st(1.4)}/><path d="M20 20h24" ${st(1.4)}/>${gem(32, 13.500, '#e8615a', 2)}${gem(25, 17)}${gem(39, 17)}`;
    if (s === 1) hat = `<path d="M20 20l-1-9 5 4 4-7 4 7 4-7 4 7 5-4-1 9Z" fill="#f6c85f" ${st(1.4)}/><path d="M24 11c4-6 12-6 16 0" fill="none" ${st(1.3)}/><circle cx="32" cy="6.500" r="2.200" fill="#e8615a" ${st(1)}/>${gem(26, 17, '#9ee6a0')}${gem(38, 17, '#9ee6a0')}`;
    if (s === 2) hat = `<path d="M21 22c2-4 5-6 11-6s9 2 11 6c-3-2-6-3-11-3s-8 1-11 3Z" fill="#e9e4ef" ${st(1.3)}/><path d="M23 21l2-5 2 4 2-6 3 6 3-6 2 6 2-4 2 5" fill="#f6c85f" ${st(1.2)}/>${gem(32, 14.500, '#c4a2f0', 1.800)}${gem(26.500, 17.500, '#fff', 1)}${gem(37.500, 17.500, '#fff', 1)}`;
    if (s === 3) hat = `<path d="M18 26c-2-6 0-10 4-13M46 26c2-6 0-10-4-13M22 13c4-3 16-3 20 0" fill="none" stroke="#4a8f3d" stroke-width="2"/><g fill="#6bbf4f" ${st(1)}><ellipse cx="19.500" cy="22" rx="3.500" ry="1.800" transform="rotate(-60 19.500 22)"/><ellipse cx="20.500" cy="16.500" rx="3.500" ry="1.800" transform="rotate(-30 20.500 16.500)"/><ellipse cx="25" cy="13" rx="3.500" ry="1.800" transform="rotate(-10 25 13)"/><ellipse cx="44.500" cy="22" rx="3.500" ry="1.800" transform="rotate(60 44.500 22)"/><ellipse cx="43.500" cy="16.500" rx="3.500" ry="1.800" transform="rotate(30 43.500 16.500)"/><ellipse cx="39" cy="13" rx="3.500" ry="1.800" transform="rotate(10 39 13)"/></g>${gem(32, 14.500, '#f6c85f', 1.600)}`;
    if (s === 4) hat = `<ellipse cx="32" cy="14" rx="12" ry="6" fill="${p.color}" ${st(1.4)}/><path d="M20 15c1 4 6 6 12 6s11-2 12-6" fill="${p.color}" ${st(1.4)}/><path d="M24 22l8 6 8-6" fill="none" stroke="${INK}" stroke-width=".9" stroke-dasharray="1.500 1.500" opacity=".8"/><path d="M38 10c6-6 12-4 12 0-4-1-8 0-12 0Z" fill="#fff" ${st(1.2)}/><path d="M20 22h24v5c-4 1-8 1-12 1s-8 0-12-1Z" fill="${INK}" fill-opacity=".15"/>`;
    if (s === 5) hat = `<path d="M24 24c0-8 4-18 8-20 4 2 8 12 8 20-5-2-11-2-16 0Z" fill="${capeC}" ${st(1.4)}/><path d="M32 4c8 2 14 7 16 16-3-2-6-4-9-5" fill="#fff" fill-opacity=".7" ${st(1)}/><path d="M25 21h14" stroke="#f6c85f" stroke-width="2.400"/>${gem(32, 21, '#e8615a', 1.400)}<path d="M20 24c3 2 5 3 4 6M44 24c-3 2-5 3-4 6" fill="none" stroke="${hair}" stroke-width="3.500" stroke-linecap="round"/>`;
    if (s === 6) hat = `<path d="M18 22c0-8 6-12 14-12 6 0 11 3 12 9-8-2-18-3-26 3Z" fill="${capeC}" ${st(1.4)}/><path d="M18 22c8-5 18-4 26-3v3c-8-1-18-2-26 3Z" fill="#f6c85f" ${st(1.1)}/><path d="M42 14c6-8 12-6 13-3-3 0-6 2-9 6 3-1 5 0 6 1-4 2-8 1-12-1Z" fill="#fff" ${st(1.2)}/>${gem(24, 20, '#e8615a', 1.400)}`;
    if (s === 7) hat = `<path d="M17 27c0-9 6-15 15-15s15 6 15 15c-5-3-9-4-15-4s-10 1-15 4Z" fill="#f3e3b5" ${st(1.5)}/><path d="M18 24c6-3 16-4 26 0M21 18c6-3 14-3 20 1" fill="none" stroke="#c9a84a" stroke-width="1.400"/><path d="M19 28c4-3 8-4 13-4" fill="none" stroke="#c9a84a" stroke-width="1.400"/><circle cx="32" cy="21" r="3" fill="#e8615a" ${st(1.1)}/><path d="M32 18c-1-4 0-7 3-9 0 4 1 6 4 8-3 0-5 1-7 1Z" fill="#6b8fd6" ${st(1)}/>`;
    if (s === 8) hat = `<path d="M23 17l2-6 3 4 4-6 4 6 3-4 2 6Z" fill="#f6c85f" ${st(1.2)}/>${gem(32, 14, '#e8615a', 1.200)}`;
    if (s === 9) hat = `<path d="M19.500 26c0-7 5-12 12.500-12s12.500 5 12.500 12c-5-3-9-4-12.500-4s-7.500 1-12.500 4Z" fill="${hair}" ${st(1.3)}/><path d="M21 21c7-4 15-4 22 0" fill="none" stroke="#f6c85f" stroke-width="2.200" stroke-linecap="round"/><path d="M32 17l3 4-3 5-3-5Z" fill="#c4a2f0" ${st(1.1)}/>`;
    const beardK = f || s === 4 || s === 5 ? 0 : rn(p, 4, 4);
    const beard = beardK === 1 ? stacheSvg(4, hair) : beardK === 2 ? stacheSvg(1, hair) : '';
    const ear = f && s !== 8 ? `<circle cx="19" cy="37" r="1.800" fill="#8fd3f4" ${st(1)}/><circle cx="45" cy="37" r="1.800" fill="#8fd3f4" ${st(1)}/>` : '';
    const veil = s === 4 ? `<path d="M20 24h24v7c-4 2-8 2-12 2s-8 0-12-2Z" fill="#fff" fill-opacity=".28"/>` : '';
    const blush = d ? '' : '<circle cx="23" cy="36" r="1.800" fill="#f4a3b5" opacity=".6"/><circle cx="41" cy="36" r="1.800" fill="#f4a3b5" opacity=".6"/>';
    return SVG64(`${back}${cape}${face}${blush}${beard}${eyesAt(d, 27, 37, 31.5)}${beardK === 1 ? '' : smile(d, 38, 3)}${hairdo}${hat}${veil}${ear}`);
  }

  // Space Crew: astronauts and the odd alien
  // Space Crew: seven astronaut styles and three kinds of alien, picked by cast slot; suit colour and mission patch differ per person
  function spaceAvatar(p) {
    const d = p.isVictim, s = slotOf(p), f = p.g === 'f';
    const stars = '<circle cx="8" cy="10" r="1" fill="#fff"/><circle cx="56" cy="8" r="1.3" fill="#fff"/><circle cx="54" cy="30" r=".9" fill="#fff"/><circle cx="7" cy="34" r="1.1" fill="#fff"/><circle cx="14" cy="20" r=".7" fill="#f6c85f"/>';
    const bg = '<circle cx="32" cy="32" r="32" fill="#1b1a3a"/>' + stars;
    const suitC = ['#eef1f6', '#f59e42', '#6b8fd6', '#e8615a', '#7cc47a', '#f6c85f', '#c4a2f0', '#8fd3f4', '#f28da5', '#aab3c2'][s];
    const pk = rn(p, 3, 5), pc = p.color;
    const patch = [`<circle cx="21" cy="57" r="4" fill="#1b1a3a" ${st(1)}/><path d="M21 54l1 2.200 2.200.2-1.700 1.500.5 2.300-2-1.200-2 1.200.5-2.300-1.700-1.500 2.200-.2Z" fill="#ffd166"/>`,
      `<path d="M16.500 54.500h9v6h-9Z" fill="${pc}" ${st(1)}/><path d="M16.500 60.500l9-6" stroke="#fff" stroke-width="1.600"/><circle cx="23" cy="57" r="1" fill="#fff"/>`,
      `<circle cx="21" cy="57" r="3" fill="#7cc47a" ${st(1)}/><ellipse cx="21" cy="57" rx="5.500" ry="1.600" fill="none" stroke="#ffd166" stroke-width="1.300" transform="rotate(-20 21 57)"/>`,
      `<path d="M21 53c2 2 2.500 5 2 8h-4c-.5-3 0-6 2-8Z" fill="#fff" ${st(1)}/><circle cx="21" cy="57" r="1.100" fill="${pc}"/><path d="M19 60l-2 2M23 60l2 2" stroke="${pc}" stroke-width="1.400"/>`,
      `<circle cx="21" cy="57" r="4.200" fill="#ffd166" ${st(1)}/><circle cx="23" cy="56" r="3.400" fill="${suitC}"/>`][pk];
    const suit = `<path d="M8 64c0-12 10-18 24-18s24 6 24 18Z" fill="${suitC}" ${st(1.6)}/><rect x="28" y="52" width="10" height="6" rx="1.500" fill="#fff" fill-opacity=".7" ${st(1.1)}/><circle cx="31" cy="55" r="1.100" fill="#e8615a"/><circle cx="35" cy="55" r="1.100" fill="${pc}"/><path d="M10 58c3-2 6-2 8 0M46 58c3-2 5-2 8 0" fill="none" stroke="${pc}" stroke-width="2.600"/>${patch}`;
    // aliens: slots 2, 5 and 8
    if (s === 2) {
      const skin = ['#9ee6a0', '#7fd6b8', '#b9e68a'][rn(p, 4, 3)];
      return SVG64(`${bg}${suit}<path d="M24 14l-4-7M40 14l4-7" ${st(1.6)}/><circle cx="20" cy="7" r="2.4" fill="${skin}" ${st(1.2)}/><circle cx="44" cy="7" r="2.4" fill="${skin}" ${st(1.2)}/><path d="M17 28c0-10 7-15 15-15s15 5 15 15c0 9-8 17-15 17s-15-8-15-17Z" fill="${skin}" ${st(1.6)}/>${d ? eyesAt(d, 25, 39, 29, 2.6) : '<ellipse cx="25" cy="29" rx="5" ry="6.500" fill="#1c1822" transform="rotate(-15 25 29)"/><ellipse cx="39" cy="29" rx="5" ry="6.500" fill="#1c1822" transform="rotate(15 39 29)"/><circle cx="24" cy="27" r="1.400" fill="#fff"/><circle cx="38" cy="27" r="1.400" fill="#fff"/>'}${smile(d, 39, 2.500)}<circle cx="32" cy="30" r="20" fill="#bfe6ff" fill-opacity=".18" ${st(1.4)}/><path d="M18 22a16 16 0 0 1 9-8" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"/>`);
    }
    if (s === 5) {
      const skin = ['#c4a2f0', '#f28da5', '#8fd3f4'][rn(p, 4, 3)];
      return SVG64(`${bg}${suit}<path d="M32 13c-1-4 0-7 4-9" fill="none" ${st(1.6)}/><circle cx="37" cy="4" r="2.600" fill="#ffd166" ${st(1.2)}/><path d="M14 34c0-12 8-20 18-20s18 8 18 20c0 8-7 12-18 12S14 42 14 34Z" fill="${skin}" ${st(1.6)}/><circle cx="32" cy="29" r="9" fill="#fff" ${st(1.5)}/>${d ? '<path d="M27 24l10 10M37 24l-10 10" stroke="#3d3250" stroke-width="2.200" stroke-linecap="round"/>' : '<circle cx="32" cy="29.500" r="5.500" fill="#1c1822"/><circle cx="34" cy="27" r="1.800" fill="#fff"/>'}<path d="M25 40c4 3 10 3 14 0" fill="none" ${st(1.600)}/><path d="M20 22l-3-2M44 22l3-2" ${st(1.4)}/>`);
    }
    if (s === 8) {
      const skin = ['#b9c0d6', '#d8c4e8', '#a8d4c8'][rn(p, 4, 3)];
      return SVG64(`${bg}${suit}<path d="M20 32c0-14 5-24 12-24s12 10 12 24c0 8-5 14-12 14s-12-6-12-14Z" fill="${skin}" ${st(1.6)}/>${d ? '<path d="M22 24l5 5M27 24l-5 5M37 24l5 5M42 24l-5 5" stroke="#3d3250" stroke-width="1.800" stroke-linecap="round"/>' : '<ellipse cx="25" cy="27" rx="3" ry="3.800" fill="#1c1822" transform="rotate(-12 25 27)"/><ellipse cx="39" cy="27" rx="3" ry="3.800" fill="#1c1822" transform="rotate(12 39 27)"/><circle cx="32" cy="20" r="2.600" fill="#1c1822"/><circle cx="25.800" cy="25.800" r=".9" fill="#fff"/><circle cx="39.800" cy="25.800" r=".9" fill="#fff"/><circle cx="32.800" cy="19.200" r=".8" fill="#fff"/>'}<path d="M28 38c2 1.600 6 1.600 8 0" fill="none" ${st(1.5)}/><path d="M29 33.500v2M35 33.500v2" stroke="${INK}" stroke-width="1.200" stroke-linecap="round"/><path d="M16 49l16 6 16-6" fill="none" stroke="#ffd166" stroke-width="2"/>`);
    }
    const hum = [0, 1, 3, 4, 6, 7, 9].indexOf(s);
    const skin = SKIN[rn(p, 5, 6)], hair = HAIR[rn(p, 6, 6)];
    const face = (cx = 32, cy = 32, rx = 10, ry = 11) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${skin}" ${st(1.3)}/>${eyesAt(d, 28, 36, cy - 1, 1.8)}${smile(d, cy + 5, 2.600)}`;
    let top = '';
    if (hum === 0) top = `<circle cx="32" cy="30" r="19" fill="#eef1f6" ${st(1.6)}/><circle cx="32" cy="31" r="14.500" fill="#24315c" ${st(1.4)}/>${face()}<path d="M21 24a13 13 0 0 1 8-7" fill="none" stroke="#fff" stroke-width="2.200" stroke-linecap="round" opacity=".75"/><rect x="47" y="24" width="4" height="10" rx="2" fill="${pc}" ${st(1.2)}/>`;
    if (hum === 1) top = `<circle cx="32" cy="30" r="19" fill="#eef1f6" ${st(1.6)}/><path d="M17 31c0-9 6-15 15-15s15 6 15 15c0 7-6 12-15 12s-15-5-15-12Z" fill="#d9a441" ${st(1.4)}/><path d="M20 26c2-4 6-7 11-8" fill="none" stroke="#fff3c4" stroke-width="2.600" stroke-linecap="round"/><path d="M24 36c4 3 12 3 16 0" fill="none" stroke="#b9862c" stroke-width="1.400"/>${d ? '<path d="M24 24l16 14M40 24L24 38" stroke="#fff3c4" stroke-width="2"/>' : ''}`;
    if (hum === 2) top = `<path d="M19 27c0-8 6-12 13-12s13 4 13 12v4H19Z" fill="${hair}" ${st(1.4)}/><ellipse cx="32" cy="32" rx="12.500" ry="13" fill="${skin}" ${st(1.5)}/><path d="M19 26c0-9 6-14 13-14s13 5 13 14c-5-2-9-6-12-8-3 4-8 7-14 8Z" fill="${hair}" ${st(1.4)}/>${eyesAt(d, 27, 37, 31, 1.9)}${smile(d, 37.500, 3)}<path d="M18 31c0-9 5-15 14-15s14 6 14 15" fill="none" stroke="#cfd6e2" stroke-width="3"/><circle cx="18" cy="33" r="4" fill="#cfd6e2" ${st(1.3)}/><circle cx="46" cy="33" r="4" fill="#cfd6e2" ${st(1.3)}/><path d="M18 36c0 6 6 8 10 7" fill="none" stroke="#2b2530" stroke-width="1.500" stroke-linecap="round"/><circle cx="28" cy="43" r="1.500" fill="#2b2530"/><path d="M22 14c3-3 17-3 20 0v5c-3-2-17-2-20 0Z" fill="${pc}" ${st(1.3)}/>`;
    if (hum === 3) top = `<path d="M32 12V4" ${st(1.8)}/><circle cx="32" cy="3.500" r="2.400" fill="#e8615a" ${st(1.1)}/><circle cx="32" cy="30" r="19" fill="#d6dce8" ${st(1.6)}/><circle cx="32" cy="31" r="14.500" fill="#12304a" ${st(1.4)}/>${face()}<circle cx="14.500" cy="30" r="2.600" fill="#9ee6a0" ${st(1.1)}/><circle cx="49.500" cy="30" r="2.600" fill="#9ee6a0" ${st(1.1)}/><path d="M24 22a11 11 0 0 1 6-4" fill="none" stroke="#8fd3f4" stroke-width="2.200" stroke-linecap="round"/>`;
    if (hum === 4) top = `<path d="M18 32c0-12 6-19 14-19s14 7 14 19c0 8-6 14-14 14s-14-6-14-14Z" fill="#fff" ${st(1.6)}/><path d="M30 13h4v6h-4Z" fill="${pc}"/><path d="M32 13v8" stroke="${pc}" stroke-width="5"/><ellipse cx="32" cy="33" rx="10.500" ry="11.500" fill="${skin}" ${st(1.3)}/>${eyesAt(d, 28, 36, 32, 1.8)}${smile(d, 38, 2.800)}<path d="M18 34h6M40 34h6" stroke="#cfd6e2" stroke-width="3.400" stroke-linecap="round"/>`;
    if (hum === 5) top = `<circle cx="32" cy="30" r="19" fill="#eef1f6" ${st(1.6)}/><path d="M16 29c0-3 3-5 6-5h20c3 0 6 2 6 5v4c0 4-4 7-9 7H25c-5 0-9-3-9-7Z" fill="#3a4a8a" ${st(1.5)}/><path d="M20 28h24" stroke="#8fd3f4" stroke-width="2" stroke-linecap="round" opacity=".8"/>${d ? '<path d="M24 29l5 5M29 29l-5 5M35 29l5 5M40 29l-5 5" stroke="#fff" stroke-width="1.800" stroke-linecap="round"/>' : `<circle cx="26" cy="33" r="2" fill="#fff"/><circle cx="38" cy="33" r="2" fill="#fff"/>`}<path d="M28 44h8" stroke="${INK}" stroke-width="1.5"/><path d="M13 27h4v8h-4ZM47 27h4v8h-4Z" fill="${pc}" ${st(1.2)}/>`;
    if (hum === 6) top = `<path d="M17 32c0-10 6-17 15-17s15 7 15 17c0 6-2 9-4 11H21c-2-2-4-5-4-11Z" fill="#fff" ${st(1.6)}/><path d="M17 33c-2 3-2 8 1 11M47 33c2 3 2 8-1 11" fill="#fff" ${st(1.4)}/><ellipse cx="32" cy="34" rx="11" ry="10.500" fill="${skin}" ${st(1.3)}/>${eyesAt(d, 28, 36, 33, 1.8)}${smile(d, 39, 2.600)}<path d="M20 25c3-5 8-8 12-8s9 3 12 8c-4-3-8-4-12-4s-8 1-12 4Z" fill="${pc}" ${st(1.3)}/><circle cx="32" cy="22" r="2" fill="#fff"/>`;
    return SVG64(`${bg}${suit}${top}`);
  }

  // Neon Legends: glowing outlines on a midnight disc
  // Neon Legends: glowing outlines on a midnight disc; ten colours and ten silhouettes (hair, hats, accessories) by cast slot
  function neonAvatar(p) {
    const d = p.isVictim, s = slotOf(p), f = p.g === 'f';
    const c = d ? '#ff3b5c' : ['#3bf0ff', '#ff4fd8', '#9dff4a', '#ffd84a', '#a77bff', '#ff8a3b', '#3bffb0', '#ff3b7a', '#5b8bff', '#e0ff3b'][s];
    const id = 'ng' + hash(p.name + p.letter);
    const glow = `<defs><filter id="${id}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="1.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;
    const S = `fill="none" stroke="${c}" stroke-width="2.200" stroke-linecap="round" stroke-linejoin="round"`;
    const heads = [`<ellipse cx="32" cy="32" rx="12.500" ry="13.500" ${S}/>`, `<ellipse cx="32" cy="32" rx="11" ry="14.500" ${S}/>`, `<path d="M20 22h24v14c0 5-5 9-12 9s-12-4-12-9Z" ${S}/>`, `<ellipse cx="32" cy="32" rx="12.500" ry="13.500" ${S}/>`, `<path d="M20 28c0-8 5-12 12-12s12 4 12 12c0 7-6 13-12 17-6-4-12-10-12-17Z" ${S}/>`, `<ellipse cx="32" cy="32" rx="12.500" ry="13.500" ${S}/>`, `<ellipse cx="32" cy="33" rx="11.500" ry="13" ${S}/>`, `<ellipse cx="32" cy="32" rx="12.500" ry="13.500" ${S}/>`, `<path d="M25 18h14l7 8v12l-7 8H25l-7-8V26Z" ${S}/>`, `<ellipse cx="32" cy="32" rx="12.500" ry="13.500" ${S}/>`][s];
    const hair = [
      `<path d="M19 27l3-10 4 6 3-9 3 8 4-8 2 9 4-5 2 8" ${S}/>`,
      `<path d="M21 30c-2-11 4-17 11-17s13 6 11 17M21 30c0 8 0 14-2 18M43 30c0 8 0 14 2 18" ${S}/>`,
      `<path d="M19 22v-6h26v6" ${S}/><path d="M21 28v-5M43 28v-5" ${S}/>`,
      `<path d="M30 14l2-8 2 8 2-9 2 9 2-7 1 9M26 17l2-5" ${S}/>`,
      `<path d="M19 30c-2-10 3-16 13-16s15 6 13 16c0 5-1 8-3 10M19 30c0 5 1 8 3 10M26 19c4 3 9 4 13 3" ${S}/>`,
      `<circle cx="20" cy="22" r="5" ${S}/><circle cx="27" cy="15" r="5" ${S}/><circle cx="37" cy="15" r="5" ${S}/><circle cx="44" cy="22" r="5" ${S}/><circle cx="18" cy="31" r="3.500" ${S}/><circle cx="46" cy="31" r="3.500" ${S}/>`,
      `<path d="M19 20h26M23 20v-10h18v10" ${S}/>`,
      `<path d="M20 27c0-9 5-13 12-13s12 4 12 13" ${S}/><path d="M17 28c-4 3-4 9-1 14M47 28c4 3 4 9 1 14" ${S}/><circle cx="17" cy="26" r="2" ${S}/><circle cx="47" cy="26" r="2" ${S}/>`,
      `<path d="M32 14V6" ${S}/><circle cx="32" cy="4" r="1.600" ${S}/><ellipse cx="32" cy="9" rx="9" ry="2.200" ${S}/>`,
      `<path d="M19 28c0-9 5-13 13-13s13 4 13 13M17 29h30" ${S}/><circle cx="32" cy="12" r="2" ${S}/>`][s];
    const acc = [`<path d="M21 29h22l-1 4c-1 2-3 3-5 3h-2c-2 0-3-1-3-3 0 2-1 3-3 3h-2c-2 0-4-1-5-3Z" fill="${c}" fill-opacity=".25" stroke="${c}" stroke-width="2"/>`,
      `<circle cx="20.500" cy="38" r="1.600" ${S}/><circle cx="43.500" cy="38" r="1.600" ${S}/>`,
      `<path d="M17 30c0-9 6-15 15-15s15 6 15 15" ${S}/><rect x="14" y="28" width="5" height="9" rx="2" ${S}/><rect x="45" y="28" width="5" height="9" rx="2" ${S}/>`,
      `<path d="M47 38l1.500 3 3 .4-2.200 2 .6 3-2.900-1.500-2.900 1.500.6-3-2.200-2 3-.4Z" ${S}/>`,
      `<path d="M19 18l-3-8 8 4ZM45 18l3-8-8 4Z" ${S}/>`,
      `<circle cx="26" cy="31" r="4.600" ${S}/><circle cx="38" cy="31" r="4.600" ${S}/><path d="M30.600 31h2.800" ${S}/>`,
      `<path d="M26 49l6 2.500 6-2.500v5l-6-2.500-6 2.500Z" ${S}/>`,
      `<path d="M16 24l-4-3 1 5M48 24l4-3-1 5" ${S}/>`,
      '', `<path d="M20 38c0 5 5 10 12 10s12-5 12-10" ${S}/>`][s];
    const visor = s === 5 || s === 0 ? '' : '';
    const eyes = s === 0 && !d ? '' : s === 5 && !d ? '' : eyesAt(d, 27, 37, 31, 2, c);
    const mouth = d ? `<path d="M28 39.500c2-1.200 6-1.200 8 0" ${S}/>` : `<path d="M28 38c2 2.400 6 2.400 8 0" ${S}/>`;
    return SVG64(`<circle cx="32" cy="32" r="32" fill="#0b0a18"/><g filter="url(#${id})"><path d="M10 64c0-11 9-17 22-17s22 6 22 17" ${S}/><path d="M32 47v8" ${S}/>${heads}${hair}${acc}${eyes}${s === 9 ? '' : mouth}${visor}</g>`, glow);
  }

  // Masquerade Ball (premium): venetian masks with feathers, on velvet
  // Masquerade Ball (premium): ten different masks and headdresses by cast slot, on velvet
  function masqueradeAvatar(p) {
    const d = p.isVictim, h = hash(p.name + p.letter), f = p.g === 'f', s = slotOf(p);
    const skin = SKIN[rn(p, 1, 6)], hair = ['#2b1a24', '#6b3a2a', '#e3b65c', '#1c1822', '#8a4f7d', '#b8452f'][rn(p, 2, 6)];
    const base = ['#f0c35f', '#1c1822', '#f5f0ea', '#b5243a', '#4a6fd6', '#2d8f6f', '#c24fa8', '#e8923a', '#2b2340', '#f0c35f'][s];
    const trim = base === '#f0c35f' ? '#b9862c' : '#f0c35f', feather = p.color;
    const bg = `<defs><radialGradient id="mq${h}" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="#6a1f45"/><stop offset="1" stop-color="#22071a"/></radialGradient></defs><circle cx="32" cy="32" r="32" fill="url(#mq${h})"/>
      <circle cx="9" cy="14" r="1.2" fill="#f0c35f"/><circle cx="55" cy="11" r="1" fill="#f0c35f"/><circle cx="52" cy="40" r=".9" fill="#f0c35f"/><circle cx="11" cy="44" r="1" fill="#f0c35f"/>`;
    const back = f && s !== 4 && s !== 3 ? `<path d="M17 32c-2-12 5-19 15-19s17 7 15 19c0 7-2 11-5 14H22c-3-3-5-7-5-14Z" fill="${hair}" ${st(1.3)}/>` : '';
    const body = `<path d="M10 64c0-11 9-17 22-17s22 6 22 17Z" fill="${s === 8 ? '#2b2340' : '#1c1822'}" ${st(1.6)}/><path d="M26 47l6 8 6-8" fill="#f5f0ea" ${st(1.2)}/><path d="M29 50l3 4 3-4" fill="${feather}"/>`;
    const face = `<ellipse cx="32" cy="32" rx="12.500" ry="13.500" fill="${skin}" ${st(1.6)}/>`;
    const fringe = f ? `<path d="M19.500 28c1-8 6-12 12.500-12s11.500 4 12.500 12c-5-4-9-6-14-5-3 1-6 3-11 5Z" fill="${hair}" ${st(1.2)}/>` : `<path d="M19 27c0-8 6-12 13-12s13 4 13 12c-3-3-7-5-13-5s-10 2-13 5Z" fill="${hair}" ${st(1.3)}/>`;
    const hole = (cx, cy, rx = 3.600, ry = 2.200) => d ? `<path d="M${cx - 2.500} ${cy - 2.500}l5 5M${cx + 2.500} ${cy - 2.500}l-5 5" stroke="#fff" stroke-width="1.800" stroke-linecap="round"/>` : `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#1c1822"/><circle cx="${cx + .8}" cy="${cy - .5}" r="1" fill="#fff"/>`;
    const mouth = d ? `<path d="M28.500 40c2-1 5-1 7 0" fill="none" ${st(1.5)}/>` : f ? `<path d="M29 39c2 1.600 4 1.600 6 0-1 2.200-5 2.200-6 0Z" fill="#b5243a" ${st(1)}/>` : `<path d="M28.500 39c2 2 5 2 7 0" fill="none" ${st(1.5)}/>`;
    const plume = (x, y, c, rot = 0, big = 1) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${big})"><path d="M0 0c3-6 7-9 12-10-2 4-5 7-9 9 3-1 6-1 9 0-3 2-7 3-11 2Z" fill="${c}" ${st(1.1)}/><path d="M1 -1c3-4 6-6 9-7" fill="none" stroke="#fff" stroke-width=".8" opacity=".7"/></g>`;
    let masks = '', over = '', cover = false;
    if (s === 0) masks = `<path d="M16 29c4-4 10-4 16-1 6-3 12-3 16 1-1 5-5 8-9 8-3 0-5-2-7-4-2 2-4 4-7 4-4 0-8-3-9-8Z" fill="${base}" ${st(1.4)}/><path d="M17 29.500c4-3 9-3 14-.6M33 28.900c5-2.400 10-2.400 14 .6" fill="none" stroke="${trim}" stroke-width="1.200"/>${hole(24.5, 31.5)}${hole(39.5, 31.5)}${plume(44, 27, feather, 0, 1)}<circle cx="44" cy="28" r="1.800" fill="#f0c35f" ${st(.8)}/>`;
    if (s === 1) masks = `<path d="M17 29c3-4 8-4 15-1 7-3 12-3 15 1-1 5-5 8-9 8-3 0-5-2-6-3-1 1-3 3-6 3-5 0-8-3-9-8Z" fill="${base}" stroke="${trim}" stroke-width="1.500"/><path d="M20 28.500c2 1 4 1 6 0M38 28.500c2 1 4 1 6 0" fill="none" stroke="${trim}" stroke-width="1.100"/>${hole(24.500, 31.500)}${hole(39.500, 31.500)}<path d="M32 18c-4-6-12-9-14-3M32 18c4-6 12-9 14-3M32 17c0-7 0-11 0-13" fill="none" stroke="${feather}" stroke-width="3" stroke-linecap="round"/><circle cx="32" cy="5" r="2" fill="#8fd3f4" ${st(1)}/>`;
    if (s === 2) { masks = `<path d="M14 26c4 0 8 2 12 4 2-1 4-1 6-1s4 0 6 1c4-2 8-4 12-4-1 8-5 12-11 12-3 0-5-2-7-4-2 2-4 4-7 4-6 0-10-4-11-12Z" fill="${base}" ${st(1.4)}/><path d="M17 28c4 1 7 2 10 4M47 28c-4 1-7 2-10 4" stroke="${trim}" stroke-width="1.200" fill="none"/>${hole(25, 32.500, 3.200, 1.800)}${hole(39, 32.500, 3.200, 1.800)}`; over = `<g transform="rotate(14 44 14)"><ellipse cx="44" cy="14" rx="7" ry="3" fill="${feather}" ${st(1.2)}/></g>${plume(41, 12, '#fff', -20, .9)}`; }
    if (s === 3) { cover = true; masks = `<path d="M18 28c0-9 6-13 14-13s14 4 14 13c0 8-3 12-6 16-2 3-5 4-8 4s-6-1-8-4c-3-4-6-8-6-16Z" fill="${base}" ${st(1.6)}/><path d="M22 41c4 3 16 3 20 0" fill="none" stroke="${trim}" stroke-width="1.200"/>${hole(26, 29.500, 3.200, 2.600)}${hole(38, 29.500, 3.200, 2.600)}<path d="M30 33l2 5 2-5Z" fill="${INK}" fill-opacity=".25"/><path d="M26 37.500c3 2 9 2 12 0" fill="none" stroke="${INK}" stroke-width="1.400" stroke-linecap="round"/>`; over = `<path d="M12 22c6-8 12-11 20-11s14 3 20 11c-6 2-12 3-20 3s-14-1-20-3Z" fill="#1c1822" ${st(1.5)}/><path d="M15 21c5-1 11-2 17-2s12 1 17 2" fill="none" stroke="${trim}" stroke-width="1.400"/>`; }
    if (s === 4) { cover = true; masks = `<path d="M18 28c0-9 6-13 14-13s14 4 14 13c0 5-2 8-4 10H22c-2-2-4-5-4-10Z" fill="${base}" ${st(1.6)}/><path d="M26 33c-2 6-1 12 6 17 7-5 8-11 6-17-4 2-8 2-12 0Z" fill="${base}" ${st(1.6)}/><circle cx="26" cy="29.500" r="3.400" fill="#fff" ${st(1.2)}/><circle cx="38" cy="29.500" r="3.400" fill="#fff" ${st(1.2)}/>${d ? '<path d="M24 27.500l4 4M28 27.500l-4 4M36 27.500l4 4M40 27.500l-4 4" stroke="#3d3250" stroke-width="1.500"/>' : '<circle cx="26.500" cy="30" r="1.500" fill="#1c1822"/><circle cx="37.500" cy="30" r="1.500" fill="#1c1822"/>'}`; over = `<path d="M10 22c6 2 12 2 22 2s16 0 22-2c-3-3-6-4-9-4-2-6-6-8-13-8s-11 2-13 8c-3 0-6 1-9 4Z" fill="#1c1822" ${st(1.5)}/><path d="M22 18h20" stroke="${feather}" stroke-width="2.200"/>`; }
    if (s === 5) masks = `<path d="M32 28C26 20 14 18 11 24c-2 5 3 9 9 8 4-1 8-2 12-2 4 0 8 1 12 2 6 1 11-3 9-8-3-6-15-4-21 4Z" fill="${base}" ${st(1.4)}/><path d="M32 30c-5 2-9 8-14 8-3 0-6-2-6-4 4 5 12 3 20-4 8 7 16 9 20 4 0 2-3 4-6 4-5 0-9-6-14-8Z" fill="${trim}" fill-opacity=".5"/>${hole(25, 30.500, 3.200, 2.200)}${hole(39, 30.500, 3.200, 2.200)}<circle cx="32" cy="28" r="2" fill="#fff" ${st(.9)}/><circle cx="16" cy="25" r="1.400" fill="#fff"/><circle cx="48" cy="25" r="1.400" fill="#fff"/>`;
    if (s === 6) { masks = `<path d="M17 29c4-4 9-4 15-1 6-3 11-3 15 1-1 5-5 8-9 8-3 0-5-2-6-4-1 2-3 4-6 4-5 0-8-3-9-8Z" fill="${base}" ${st(1.4)}/><path d="M32 28l-3 4 3 4 3-4Z" fill="#f0c35f" ${st(.9)}/><path d="M22 29l3 3-3 3M42 29l-3 3 3 3" fill="none" stroke="#f0c35f" stroke-width="1"/>${hole(24.500, 31.500)}${hole(39.500, 31.500)}`; over = `<path d="M17 22c-3-6-1-12 3-14 0 4 2 7 6 9ZM47 22c3-6 1-12-3-14 0 4-2 7-6 9ZM26 17c3-4 9-4 12 0 0 4-3 7-6 7s-6-3-6-7Z" fill="${base}" ${st(1.4)}/><path d="M21 19c3 3 5 4 11 4s8-1 11-4" fill="none" stroke="#f0c35f" stroke-width="1.600"/><circle cx="20" cy="8" r="2.200" fill="#f0c35f" ${st(1)}/><circle cx="44" cy="8" r="2.200" fill="#f0c35f" ${st(1)}/><circle cx="32" cy="13" r="2" fill="#f0c35f" ${st(1)}/>`; }
    if (s === 7) { let rays = ''; for (let k = 0; k < 14; k++) { const a = (k / 14) * Math.PI * 2; rays += `M${(32 + Math.cos(a) * 15).toFixed(1)} ${(30 + Math.sin(a) * 16).toFixed(1)}L${(32 + Math.cos(a + .11) * 23).toFixed(1)} ${(30 + Math.sin(a + .11) * 24).toFixed(1)}L${(32 + Math.cos(a + .22) * 15).toFixed(1)} ${(30 + Math.sin(a + .22) * 16).toFixed(1)}Z`; } cover = true; masks = `<path d="${rays}" fill="#f0c35f" ${st(1.1)}/><ellipse cx="32" cy="31" rx="14.500" ry="15.500" fill="${base}" ${st(1.6)}/>${hole(25.500, 29.500, 3.400, 2.200)}${hole(38.500, 29.500, 3.400, 2.200)}<path d="M30 33l2 5 2-5Z" fill="#b9862c" ${st(.9)}/><path d="M27 40c3 2 7 2 10 0" fill="none" stroke="#b9862c" stroke-width="1.500" stroke-linecap="round"/>`; }
    if (s === 8) { masks = `<path d="M16 29c4-4 10-4 16-1 6-3 12-3 16 1-1 5-5 8-9 8-3 0-5-2-7-4-2 2-4 4-7 4-4 0-8-3-9-8Z" fill="${base}" ${st(1.4)}/><g fill="#fff"><circle cx="19" cy="28" r=".9"/><circle cx="23" cy="26.500" r=".9"/><circle cx="41" cy="26.500" r=".9"/><circle cx="45" cy="28" r=".9"/><circle cx="32" cy="27" r=".9"/></g>${hole(24.500, 31.500)}${hole(39.500, 31.500)}`; over = `<rect x="22" y="3" width="20" height="15" rx="1.500" fill="#1c1822" ${st(1.5)}/><path d="M13 19c6 2 12 2 19 2s13 0 19-2c-1-3-4-4-7-4H20c-3 0-6 1-7 4Z" fill="#1c1822" ${st(1.5)}/><path d="M22 13h20" stroke="${feather}" stroke-width="3"/>`; }
    if (s === 9) { masks = `<path d="M16 29c4-4 10-4 16-1 6-3 12-3 16 1-1 5-5 8-9 8-3 0-5-2-7-4-2 2-4 4-7 4-4 0-8-3-9-8Z" fill="${base}" ${st(1.4)}/><path d="M17 29.500c4-3 9-3 14-.6M33 28.900c5-2.400 10-2.400 14 .6" fill="none" stroke="${trim}" stroke-width="1.200"/>${hole(24.500, 31.500)}${hole(39.500, 31.500)}<path d="M29 27l1.500-3 1.500 3-1.500 3Z" fill="#fff"/><path d="M40 27.800l1.200-2.400 1.200 2.400-1.200 2.400Z" fill="#fff"/>`; over = `<g fill="${feather}" ${st(1.2)}><ellipse cx="32" cy="8" rx="4" ry="9"/><ellipse cx="22" cy="12" rx="3.600" ry="8" transform="rotate(-28 22 12)"/><ellipse cx="42" cy="12" rx="3.600" ry="8" transform="rotate(28 42 12)"/></g><path d="M32 2v12M22 6l-1 10M42 6l1 10" stroke="#fff" stroke-width=".9" opacity=".7"/><rect x="25" y="17" width="14" height="3" rx="1.500" fill="#f0c35f" ${st(1)}/>`; }
    const beard = !f && s !== 3 && s !== 4 && s !== 7 && rn(p, 5, 3) === 0 ? stacheSvg(1, hair) : '';
    return SVG64(`${bg}${back}${body}${face}${cover ? '' : fringe}${masks}${beard}${cover || s === 4 ? '' : mouth}${over}`);
  }

  // Cyber Agents (premium): glowing visors, circuits and a moving scan line
  // Cyber Agents (premium): ten glowing looks by cast slot (visors, goggles, HUD monocle, VR box, cables), with live scan lines
  function cyberAvatar(p) {
    const d = p.isVictim, s = slotOf(p), f = p.g === 'f';
    const c = d ? '#ff3b5c' : ['#3bf0ff', '#ff4fd8', '#9dff4a', '#ffb300', '#a77bff', '#ff6b3b', '#3bffb0', '#5b8bff', '#ff3b7a', '#e0ff3b'][s];
    const skin = ['#d9c4b8', '#b89a8a', '#8e6f60', '#c8b0d8'][rn(p, 1, 4)], hair = ['#1c1822', '#f0f0f0', c][rn(p, 2, 3)];
    let grid = '';
    for (let i = 8; i < 64; i += 8) grid += `<path d="M${i} 0V64M0 ${i}H64" stroke="${c}" stroke-opacity=".12" stroke-width=".6"/>`;
    const bg = `<circle cx="32" cy="32" r="32" fill="#070912"/>${grid}`;
    const body = `<path d="M10 64c0-11 9-17 22-17s22 6 22 17Z" fill="#1d2233" ${st(1.4)}/><path d="M16 56l8-4h16l8 4M32 47v17" fill="none" stroke="${c}" stroke-width="1.400" opacity=".9"/><circle cx="32" cy="57" r="2" fill="${c}"/>`;
    const face = `<ellipse cx="32" cy="32" rx="12.500" ry="13.500" fill="${skin}" ${st(1.6)}/><path d="M21 38l3-2h3M43 38l-3-2h-3" fill="none" stroke="${c}" stroke-width=".9" opacity=".8"/>`;
    const lens = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#0b0f1e" stroke="${c}" stroke-width="1.600"/><circle cx="${x}" cy="${y}" r="${r * .45}" fill="${c}" opacity=".9"/>`;
    const X = `<path d="M23 28.500l4 4M27 28.500l-4 4M37 28.500l4 4M41 28.500l-4 4" stroke="${c}" stroke-width="1.600" stroke-linecap="round"/>`;
    const mouth = d ? `<path d="M28.500 40.500c2-1 5-1 7 0" fill="none" ${st(1.5)}/>` : `<path d="M28.500 39.500h7" ${st(1.5)}/>`;
    let hd = '', front = '';
    if (s === 0) { hd = f ? `<path d="M19 30c-1-10 5-16 13-16s14 5 14 13c-6-2-12-6-15-9-2 5-7 9-12 12Z" fill="${hair}" ${st(1.3)}/>` : `<path d="M20 26c0-8 5-12 12-12 8 0 12 4 13 10-7-3-15-3-25 2Z" fill="${hair}" ${st(1.3)}/>`; front = `<path d="M18 27h28c1 0 1 1 1 2v3c0 2-1 3-3 3H20c-2 0-3-1-3-3v-3c0-1 0-2 1-2Z" fill="#0b0f1e" stroke="${c}" stroke-width="1.600"/><path d="M20 31h24" stroke="${c}" stroke-width="2.400" stroke-linecap="round" opacity=".9"><animate attributeName="opacity" values=".35;1;.35" dur="1.6s" repeatCount="indefinite"/></path>${d ? X : ''}${mouth}`; }
    if (s === 1) { hd = `<path d="M28 14l2-7 2 6 2-6 2 7c-2 3-6 3-8 0Z" fill="${hair}" ${st(1.3)}/><path d="M21 24c4-5 18-5 22 0-6-2-16-2-22 0Z" fill="${hair}" ${st(1.3)}/>`; front = `<path d="M17 29h30" stroke="#1d2233" stroke-width="3"/>${lens(26, 31, 5)}${lens(38, 31, 5)}<path d="M31 31h2" stroke="${c}" stroke-width="2"/>${d ? X : ''}${mouth}`; }
    if (s === 2) { hd = `<path d="M22 22c3-4 17-4 20 0M26 18l2 3M38 18l-2 3M32 15v4" fill="none" stroke="${c}" stroke-width="1.200" opacity=".9"/>`; front = `<path d="M22 27h20v8H22Z" fill="#0b0f1e" stroke="${c}" stroke-width="1.400"/><ellipse cx="32" cy="31" rx="7" ry="2.600" fill="${c}" opacity=".9"><animate attributeName="rx" values="7;4;7" dur="2s" repeatCount="indefinite"/></ellipse>${d ? X : ''}${mouth}`; }
    if (s === 3) { hd = `<path d="M20 25c0-7 5-12 12-12s12 5 12 12c-4-3-8-4-12-4s-8 1-12 4Z" fill="${hair}" ${st(1.3)}/>`; front = `<path d="M21 36h22l-2 8c-2 3-6 4-9 4s-7-1-9-4Z" fill="#8a94a6" ${st(1.4)}/><path d="M26 40h12M26 43h12" stroke="${INK}" stroke-width="1"/><path d="M21 29h22" stroke="${c}" stroke-width="2.600" stroke-linecap="round"/>${d ? X : `<circle cx="27" cy="31" r="2" fill="#fff"/><circle cx="37" cy="31" r="2" fill="#fff"/>`}`; }
    if (s === 4) { hd = `<path d="M19 30c-1-10 5-16 13-16s14 5 14 13c0 6 2 12-1 20-2-8-1-14-2-17-6-1-12-5-15-9-2 5-5 8-9 9Z" fill="${hair}" ${st(1.3)}/>`; front = `${eyesAt(d, 27, 37, 31, 1.8)}<circle cx="38" cy="31" r="5.600" fill="#0b0f1e" fill-opacity=".7" stroke="${c}" stroke-width="1.600"/><path d="M35 29h6M35 32h4" stroke="${c}" stroke-width="1" opacity=".9"/><path d="M43 31l7-4v12" fill="none" stroke="${c}" stroke-width="1.200"/>${mouth}`; }
    if (s === 5) { hd = `<path d="M23 16l-3-8M41 16l3-8" ${st(1.4)}/><circle cx="20" cy="7" r="2" fill="${c}"/><circle cx="44" cy="7" r="2" fill="${c}"/>`; front = `<path d="M15 25h34v13H15Z" fill="#2b3350" stroke="${c}" stroke-width="1.600"/><path d="M19 28h26v7H19Z" fill="#0b0f1e"/><circle cx="26" cy="31.500" r="2" fill="${c}"/><circle cx="38" cy="31.500" r="2" fill="${c}"/><path d="M15 31H11M49 31h4" stroke="${c}" stroke-width="1.600"/>${d ? X : ''}${mouth}`; }
    if (s === 6) { hd = `<path d="M20 25l3-11 5 6 4-8 4 8 5-6 3 11c-6-3-18-3-24 0Z" fill="${hair}" ${st(1.3)}/>`; front = `<path d="M17 27l3 14h-3ZM47 27l-3 14h3Z" fill="#8a94a6" ${st(1.3)}/>${d ? X : `<path d="M23 30l5 2M41 30l-5 2" stroke="${c}" stroke-width="2.400" stroke-linecap="round"/><circle cx="27" cy="32" r="1.800" fill="${c}"/><circle cx="37" cy="32" r="1.800" fill="${c}"/>`}${mouth}`; }
    if (s === 7) { hd = `<path d="M17 32c0-11 7-18 15-18s15 7 15 18c0 3-1 5-2 7H19c-1-2-2-4-2-7Z" fill="#2b3350" ${st(1.5)}/><path d="M22 18c4-2 16-2 20 0" stroke="${c}" stroke-width="1.600" fill="none"/>`; front = `<path d="M20 29h24c1 0 2 1 2 2s-1 2-2 2H20c-1 0-2-1-2-2s1-2 2-2Z" fill="#0b0f1e" stroke="${c}" stroke-width="1.400"/><path d="M22 31h20" stroke="${c}" stroke-width="1.800" stroke-linecap="round" opacity=".9"/><path d="M27 39h10" stroke="${c}" stroke-width="1.400"/>${d ? X : ''}`; }
    if (s === 8) { hd = `<path d="M18 28c-4 4-4 14-2 20M23 22c-4 6-5 16-4 24M46 28c4 4 4 14 2 20M41 22c4 6 5 16 4 24" fill="none" stroke="#2b3350" stroke-width="3.400" stroke-linecap="round"/><path d="M18 28c-4 4-4 14-2 20M46 28c4 4 4 14 2 20" fill="none" stroke="${c}" stroke-width="1" stroke-dasharray="2 3"/><path d="M20 24c0-6 5-10 12-10s12 4 12 10c-4-2-8-3-12-3s-8 1-12 3Z" fill="${hair}" ${st(1.3)}/>`; front = `<path d="M16 29c4-4 28-4 32 0v4c-2 3-6 4-9 3-3-1-5-1-7-1s-4 0-7 1c-3 1-7 0-9-3Z" fill="#0b0f1e" stroke="${c}" stroke-width="1.600"/><path d="M20 31h24" stroke="${c}" stroke-width="2" stroke-linecap="round" opacity=".9"/>${d ? X : ''}${mouth}`; }
    if (s === 9) { hd = `<path d="M14 28c0-3 2-5 5-5h2v12h-2c-3 0-5-2-5-5ZM50 28c0-3-2-5-5-5h-2v12h2c3 0 5-2 5-5Z" fill="#2b3350" stroke="${c}" stroke-width="1.400"/><path d="M18 24c1-7 7-11 14-11s13 4 14 11" fill="none" stroke="#8a94a6" stroke-width="2.400"/>`; front = `<path d="M24 20l4 4h4M40 20l-4 4M22 40h4l2 3M42 40h-4l-2 3M32 15v6" fill="none" stroke="${c}" stroke-width="1.200" opacity=".9"/><circle cx="32" cy="15" r="1.400" fill="${c}"/>${d ? eyesAt(d, 27, 37, 31, 1.8, c) : `<circle cx="27" cy="31" r="2.400" fill="${c}"/><circle cx="37" cy="31" r="2.400" fill="${c}"/><circle cx="27" cy="31" r=".9" fill="#fff"/><circle cx="37" cy="31" r=".9" fill="#fff"/>`}${mouth}`; }
    const scan = `<rect x="0" y="0" width="64" height="3" fill="${c}" opacity=".18"><animate attributeName="y" values="-4;64" dur="2.4s" repeatCount="indefinite"/></rect>`;
    return SVG64(`${bg}${body}${face}${hd}${front}${scan}`);
  }

  /* ---------- budget packs (cheap, lots of variety) ---------- */
  const headBase = (skin) => `<circle cx="18.5" cy="32" r="3.2" fill="${skin}" ${st(1.4)}/><circle cx="45.5" cy="32" r="3.2" fill="${skin}" ${st(1.4)}/><ellipse cx="32" cy="32" rx="12.5" ry="13.5" fill="${skin}" ${st(1.6)}/>`;
  const skinOf = (p, k = 0) => SKIN[(hash(p.name + p.letter) >>> k) % SKIN.length];

  // Kitchen Crew: chef hats, neckerchiefs, curly mustaches
  // Kitchen Crew: six hat shapes by cast slot, plus colours, scarves, glasses and facial hair by name
  function chefAvatar(p) {
    const d = p.isVictim, f = p.g === 'f', s = slotOf(p), skin = skinOf(p), hair = HAIR[rn(p, 1, 6)], acc = p.color;
    const coatC = ['#fbfbf7', '#fbfbf7', '#f3e4cf', '#e3eefa', '#f7e0e4'][rn(p, 2, 5)];
    const tint = s < 6 ? '#ffffff' : ['#fff0b8', '#c6e6f7', '#ffd0da', '#d6efcf'][s - 6];
    const rows = rn(p, 3, 3);
    const coat = `<path d="M10 64c0-11 9-17 22-17s22 6 22 17Z" fill="${coatC}" ${st(1.6)}/>` + (rows === 0 ? `<path d="M32 50v14" ${st(1.2)}/><circle cx="27" cy="56" r="1.4" fill="${INK}"/><circle cx="27" cy="61" r="1.4" fill="${INK}"/><circle cx="37" cy="56" r="1.4" fill="${INK}"/><circle cx="37" cy="61" r="1.4" fill="${INK}"/>` : rows === 1 ? `<circle cx="32" cy="54" r="1.4" fill="${INK}"/><circle cx="32" cy="59" r="1.4" fill="${INK}"/><rect x="38" y="56" width="9" height="7" rx="1" fill="none" ${st(1.1)}/>` : `<path d="M22 64V54h20v10" fill="${acc}" ${st(1.3)}/><path d="M25 47v7M39 47v7" stroke="${acc}" stroke-width="2.6"/>`);
    const neckK = rn(p, 4, 4);
    const neck = neckK === 0 ? `<path d="M24 46l8 9 8-9-3-1-5 3-5-3Z" fill="${acc}" ${st(1.2)}/><circle cx="30" cy="50" r=".8" fill="#fff"/><circle cx="34" cy="50" r=".8" fill="#fff"/>`
      : neckK === 1 ? `<path d="M32 49l-7-3v6ZM32 49l7-3v6Z" fill="${acc}" ${st(1.2)}/><circle cx="32" cy="49" r="1.6" fill="${acc}" ${st(1)}/>`
      : neckK === 2 ? `<path d="M29 47h6l1 3-4 11-4-11Z" fill="${acc}" ${st(1.2)}/>` : `<path d="M25 47l7 5 7-5-2 4h-10Z" fill="${acc}" ${st(1.2)}/>`;
    const hk = s % 6;
    let hatBack = '', hat = '';
    if (hk === 0) hat = `<path d="M22 24V12c-5-1-6-8-1-9 3-4 9-4 11-1 2-3 8-3 11 1 5 1 4 8-1 9v12Z" fill="${tint}" ${st(1.5)}/><path d="M27 8v14M32 6v16M37 8v14" stroke="#d8d4cc" stroke-width="1.2"/><rect x="21" y="21" width="22" height="5" rx="1.5" fill="${tint}" ${st(1.5)}/>`;
    if (hk === 1) hat = `<path d="M21 22c-6 0-8-8-3-11 2-6 9-6 11-3 3-4 10-3 11 1 6-1 9 6 5 10-1 2-3 3-5 3Z" fill="${tint}" ${st(1.5)}/><rect x="21" y="19" width="22" height="6" rx="1.5" fill="${tint}" ${st(1.5)}/><path d="M26 19v6M32 19v6M38 19v6" stroke="#d8d4cc" stroke-width="1.2"/>`;
    if (hk === 2) hat = `<g transform="rotate(-10 32 20)"><ellipse cx="32" cy="18" rx="15" ry="7" fill="${acc}" ${st(1.5)}/><path d="M19 22c4 3 22 3 26 0" fill="none" ${st(1.3)}/><path d="M32 11v-3" ${st(1.8)}/></g>`;
    if (hk === 3) { hat = `<path d="M18.5 28c-1-11 5-17 13.5-17s14.5 6 13.5 17c-4-5-9-7-13.5-7s-9.500 2-13.5 7Z" fill="${acc}" ${st(1.5)}/><circle cx="25" cy="17" r="1.1" fill="#fff"/><circle cx="32" cy="15" r="1.1" fill="#fff"/><circle cx="39" cy="17" r="1.1" fill="#fff"/><circle cx="29" cy="22" r="1.1" fill="#fff"/><circle cx="36" cy="22" r="1.1" fill="#fff"/><path d="M45 24l7 3-3 3 4 3-8-1Z" fill="${acc}" ${st(1.3)}/>`; }
    if (hk === 4) hat = `<path d="M20 24c-1-6 4-10 12-10s13 4 12 10Z" fill="${tint}" ${st(1.5)}/><path d="M24 15v9M28 14v10M32 14v10M36 14v10M40 15v9" stroke="#d8d4cc" stroke-width="1.2"/><rect x="19.5" y="22" width="25" height="4" rx="1.5" fill="${acc}" ${st(1.4)}/>`;
    if (hk === 5) { const cc = ['#6b4a3a', '#3d4a6b', '#5a6b3a', '#7a3b4a', '#444'][rn(p, 6, 5)]; hat = `<path d="M18.5 27c-1-9 5-14 13.5-14 7 0 13 3 14 10-5-2-9-3-13-3s-9 1-14.500 7Z" fill="${cc}" ${st(1.5)}/><path d="M18 26c-2 0-3 1-3 2.600 6-1 13-1 20 0Z" fill="${cc}" ${st(1.5)}/><circle cx="32" cy="12.500" r="1.800" fill="${cc}" ${st(1)}/>`; }
    // hair peeking out
    const hairK = hk === 3 ? 0 : rn(p, 7, 3);
    hatBack = f ? (hairK === 0 ? '' : hairK === 1 ? `<path d="M17 28c-3 7-3 15 1 19h4c-3-5-3-11-1-17ZM47 28c3 7 3 15-1 19h-4c3-5 3-11 1-17Z" fill="${hair}" ${st(1.3)}/>` : `<path d="M44 24c8 2 9 10 6 16-1 2-4 1-3-1 1-4 0-8-3-11Z" fill="${hair}" ${st(1.3)}/>`) : (hairK === 1 ? `<path d="M18 28c-2-1-2-4 0-5M46 28c2-1 2-4 0-5" fill="none" stroke="${hair}" stroke-width="4" stroke-linecap="round"/>` : '');
    const fk = f ? 0 : rn(p, 8, 5), gk = rn(p, 9, 4) < 2 ? 0 : rn(p, 10, 2) + 1;
    const mouth = fk === 0 || fk === 3 || fk === 4 ? smile(d, 38, 3.5) : '';
    const blush = d ? '' : `<circle cx="23" cy="36" r="2" fill="#f4a3b5" opacity=".6"/><circle cx="41" cy="36" r="2" fill="#f4a3b5" opacity=".6"/>`;
    const lips = f && !d && rn(p, 11, 2) ? `<path d="M29 38c1.600 2 4.400 2 6 0-1 2.400-5 2.400-6 0Z" fill="#d6334d"/>` : '';
    return SVG64(`${hatBack}${coat}${neck}${headBase(skin)}${blush}${eyesAt(d, 27, 37, 31, 2)}${f ? (lips ? '' : mouth) : mouth}${lips}${stacheSvg(fk === 4 ? 0 : fk === 3 ? 3 : fk, hair)}${glassesSvg(gk)}${hat}`);
  }

  // Circus Clowns: puffy hair, red noses, painted smiles
  // Circus Clowns: ten different wigs, hats and costumes by cast slot; face paint, noses and smiles by name
  function clownAvatar(p) {
    const d = p.isVictim, s = slotOf(p), pc = p.color;
    const hairs = ['#ff5e7e', '#3bc4ff', '#ffb300', '#8a5cff', '#2ecc71'], hair = hairs[(s + rn(p, 1, 2) * 2) % 5];
    const collar = ['#fff', '#ffe27a', '#bfe6ff', '#ffc4d6'][rn(p, 2, 4)];
    const ruff = `<path d="M10 64c0-11 9-17 22-17s22 6 22 17Z" fill="${s === 7 ? '#b5243a' : pc}" ${st(1.6)}/>` + (s === 7 ? `<circle cx="26" cy="56" r="1.600" fill="#ffd166"/><circle cx="38" cy="56" r="1.600" fill="#ffd166"/><circle cx="26" cy="61" r="1.600" fill="#ffd166"/><circle cx="38" cy="61" r="1.600" fill="#ffd166"/><path d="M23 47l9 8 9-8" fill="#fff" ${st(1.3)}/>` : rn(p, 3, 2) ? `<path d="M22 64V54M42 64V54" stroke="#fff" stroke-width="3"/><circle cx="32" cy="58" r="3" fill="#ffd166" ${st(1)}/>` : `<circle cx="24" cy="56" r="2.400" fill="#fff" ${st(1)}/><circle cx="40" cy="58" r="2.400" fill="#fff" ${st(1)}/>`) + (s === 7 ? '' : `<path d="M16 49c3 3 6 3 8 0 2 3 6 3 8 0 2 3 6 3 8 0 2 3 5 3 8 0l-2 5c-10 3-18 3-28 0Z" fill="${collar}" ${st(1.3)}/>`);
    const face = `<ellipse cx="32" cy="32" rx="12.500" ry="13.500" fill="#fff6ee" ${st(1.6)}/>`;
    const pk = rn(p, 4, 5);
    const paint = d ? '' : [`<path d="M24.500 25l2 3M39.500 25l-2 3" stroke="#3b6fd8" stroke-width="1.400" stroke-linecap="round"/>`, `<path d="M40 27l1.200 2.600 2.800.3-2.100 1.900.6 2.800-2.500-1.400-2.500 1.400.6-2.800-2.100-1.900 2.800-.3Z" fill="#ffd166" ${st(.8)}/>`, `<path d="M26 34c-1.500 2-1.500 4 0 4s1.500-2 0-4Z" fill="#6bc5f2" ${st(.8)}/>`, `<path d="M24 28l3-3 3 3-3 3ZM34 28l3-3 3 3-3 3Z" fill="#f4a3b5" fill-opacity=".8" ${st(.7)}/>`, `<path d="M22 36c-1-2 1-4 2-2 1-2 3 0 2 2l-2 2Z" fill="#e63946"/><path d="M38 36c-1-2 1-4 2-2 1-2 3 0 2 2l-2 2Z" fill="#e63946"/>`][pk];
    const mk = rn(p, 5, 3);
    const mouth = d ? smile(d, 39, 3.500) : mk === 0 ? `<path d="M24 38c3 5 13 5 16 0-2 6-14 6-16 0Z" fill="#e63946" ${st(1.1)}/>` : mk === 1 ? `<path d="M27 38.500c3 3 7 3 10 0" fill="none" stroke="#e63946" stroke-width="2.600" stroke-linecap="round"/>` : `<ellipse cx="32" cy="40" rx="3.600" ry="2.800" fill="#e63946" ${st(1)}/><path d="M29 38.600c2 1 4 1 6 0" stroke="#fff" stroke-width="1" fill="none"/>`;
    const noseC = ['#e63946', '#e63946', '#ff9f1c', '#2b8be6', '#2ecc71'][rn(p, 6, 5)];
    const nose = `<circle cx="32" cy="34.500" r="3.400" fill="${noseC}" ${st(1.2)}/><circle cx="31" cy="33.500" r="1" fill="#fff" opacity=".8"/>`;
    const puff = (x, y, r, c = hair) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" ${st(1.4)}/>`;
    let back = '', top = '';
    if (s === 0) { back = puff(15, 27, 6.500) + puff(15, 37, 5.500) + puff(49, 27, 6.500) + puff(49, 37, 5.500); top = `<path d="M26 19l6-13 6 13Z" fill="#fff" ${st(1.4)}/><path d="M28 14h8M29.500 10h5" stroke="${hair}" stroke-width="1.800"/><circle cx="32" cy="6" r="2.400" fill="${hair}" ${st(1)}/>`; }
    if (s === 1) { back = `<circle cx="32" cy="22" r="20" fill="#ff5e7e" ${st(1.4)}/><circle cx="32" cy="22" r="15" fill="#ffb300"/><circle cx="32" cy="22" r="10" fill="#2ecc71"/>`; top = `<rect x="26" y="9" width="12" height="7" rx="1" fill="#2b2530" ${st(1.3)}/><path d="M23 16h18" stroke="${INK}" stroke-width="2.400" stroke-linecap="round"/>`; }
    if (s === 2) { back = puff(16, 34, 4.500); top = `<path d="M20 22c-1-6 2-9 6-9l2 5 4-9 4 9 2-5c4 0 7 3 6 9-8-3-16-3-24 0Z" fill="${hair}" ${st(1.4)}/>` + puff(48, 34, 4.500); }
    if (s === 3) { back = ''; top = puff(18, 27, 4.500, '#ffb300') + puff(46, 27, 4.500, '#ffb300') + `<path d="M21 22c0-7 5-10 11-10s11 3 11 10Z" fill="#3a2a3a" ${st(1.4)}/><path d="M17 22h30" stroke="${INK}" stroke-width="2.600" stroke-linecap="round"/><circle cx="40" cy="14" r="2.600" fill="#ff5e7e" ${st(1)}/><circle cx="40" cy="14" r="1" fill="#ffd166"/>`; }
    if (s === 4) { top = `<path d="M18 24c-5-3-7-9-5-14 2 4 6 6 11 8ZM46 24c5-3 7-9 5-14-2 4-6 6-11 8ZM24 18c0-6 4-10 8-10s8 4 8 10c-5-2-11-2-16 0Z" fill="${hair}" ${st(1.4)}/><path d="M21 19c8 2 14 2 22 0" stroke="#ffd166" stroke-width="2"/><circle cx="13" cy="10" r="2.400" fill="#ffd166" ${st(1)}/><circle cx="51" cy="10" r="2.400" fill="#ffd166" ${st(1)}/><circle cx="32" cy="7" r="2.400" fill="#ffd166" ${st(1)}/>`; }
    if (s === 5) { back = `<path d="M18 28c-6-2-8 6-5 9 3 2 6-2 6-6M46 28c6-2 8 6 5 9-3 2-6-2-6-6" fill="${hair}" ${st(1.4)}/>`; top = `<path d="M19 27c0-9 5-14 13-14s13 5 13 14c-4-3-8-5-13-5s-9 2-13 5Z" fill="${hair}" ${st(1.4)}/><path d="M14 22l-4-3 1 6M50 22l4-3-1 6" fill="#ff5e7e" ${st(1.2)}/><path d="M29 15l3-3 3 3-3 3Z" fill="#fff" ${st(.8)}/>`; }
    if (s === 6) { back = puff(17, 30, 6, '#ff7a3b') + puff(47, 30, 6, '#ff7a3b') + puff(23, 20, 6, '#ff7a3b') + puff(41, 20, 6, '#ff7a3b') + puff(32, 16, 6.500, '#ff7a3b'); top = `<path d="M22 20c0-5 4-8 10-8s10 3 10 8c-6-2-14-2-20 0Z" fill="${pc}" ${st(1.4)}/><path d="M32 12V8M27 8h10" ${st(1.8)}/>`; }
    if (s === 7) { top = `<rect x="23" y="2" width="18" height="16" rx="1.500" fill="#1c1822" ${st(1.5)}/><path d="M23 14h18" stroke="#b5243a" stroke-width="3.400"/><path d="M17 19c6 2 10 2 15 2s9 0 15-2c-1-3-3-4-6-4H23c-3 0-5 1-6 4Z" fill="#1c1822" ${st(1.5)}/><path d="M25 38c3-3 5-2 7-.5 2-1.500 4-2.500 7 .5-2 0-3 1-4 2-1-1-2-1.500-3-1.500s-2 .5-3 1.500c-1-1-2-2-4-2Z" fill="#2b2530"/>`; }
    if (s === 8) { back = puff(15, 28, 6.500, '#3bc4ff') + puff(49, 28, 6.500, '#3bc4ff') + puff(21, 19, 6.500, '#3bc4ff') + puff(43, 19, 6.500, '#3bc4ff') + puff(32, 15, 7, '#3bc4ff'); top = `<g transform="translate(40 14)"><g fill="#ffd166" ${st(.9)}><circle cx="0" cy="-4.500" r="2.600"/><circle cx="4.500" cy="0" r="2.600"/><circle cx="0" cy="4.500" r="2.600"/><circle cx="-4.500" cy="0" r="2.600"/></g><circle r="2.600" fill="#8a5a1a" ${st(.9)}/></g>`; }
    if (s === 9) { back = puff(16, 32, 5.500, '#2ecc71') + puff(48, 32, 5.500, '#2ecc71'); top = `<path d="M20 22c0-6 5-8 12-8s12 2 12 8Z" fill="#f2d08a" ${st(1.4)}/><path d="M13 22h38" stroke="${INK}" stroke-width="2.600" stroke-linecap="round"/><path d="M20 18h24" stroke="#e63946" stroke-width="3"/>`; }
    return SVG64(`${ruff}${back}${face}${eyesAt(d, 27, 37, 30, 2)}${paint}${mouth}${nose}${top}`);
  }

  // Wild West: cowboy hats, bandanas, sheriff stars
  function cowboyAvatar(p) {
    const d = p.isVictim, h = hash(p.name + p.letter), f = p.g === 'f', skin = skinOf(p, 2);
    const hatC = ['#8a5a32', '#3d2a1e', '#d9b48a', '#f2f0ea'][h % 4], hair = HAIR[(h >>> 5) % 6];
    const vest = `<path d="M10 64c0-11 9-17 22-17s22 6 22 17Z" fill="#c9a27a" ${st(1.6)}/><path d="M24 48l8 16 8-16" fill="#f3e6c8" ${st(1.3)}/><path d="M44 54l1.3 2.6 2.9.4-2.1 2 .5 2.9-2.6-1.4-2.6 1.4.5-2.9-2.1-2 2.9-.4Z" fill="#ffd166" ${st(.9)}/>`;
    const bandana = `<path d="M22 44c3 3 7 5 10 5s7-2 10-5l-3 8-7 4-7-4Z" fill="${p.color}" ${st(1.3)}/><circle cx="29" cy="49" r=".9" fill="#fff"/><circle cx="35" cy="49" r=".9" fill="#fff"/>`;
    const long = f ? `<path d="M19 28c-3 6-2 14 1 18h4c-2-5-2-11 0-16M45 28c3 6 2 14-1 18h-4c2-5 2-11 0-16" fill="${hair}" ${st(1.3)}/>` : '';
    const hat = `<path d="M9 24c2 4 8 6 23 6s21-2 23-6c-3 1-6 1-9 0H18c-3 1-6 1-9 0Z" fill="${hatC}" ${st(1.5)}/><path d="M19 24c-1-9 3-14 7-14 2 0 4 2 6 2s4-2 6-2c4 0 8 5 7 14-8 2-18 2-26 0Z" fill="${hatC}" ${st(1.5)}/><path d="M19.5 20.5c8 2 17 2 25 0v3c-8 2-17 2-25 0Z" fill="#5a3a22"/>`;
    const grin = !f && (h >>> 7) % 2 ? `<path d="M26 37c3-1.6 9-1.6 12 0-1 1-3 1.4-6 1.4s-5-.4-6-1.4Z" fill="#5a3a22"/>${smile(d, 40, 2.5)}` : smile(d, 38.5, 3.5);
    return SVG64(`${long}${vest}${headBase(skin)}${eyesAt(d, 27, 37, 31.5, 2)}${grin}${bandana}${hat}`);
  }

  // Robo Squad: box heads, antennas, LED eyes
  // Robo Squad: ten differently built robot heads by cast slot (box, ball, TV, barrel, radio, bucket...), metal colour by slot
  function robotAvatar(p) {
    const d = p.isVictim, s = slotOf(p), pc = p.color;
    const metal = ['#b8c4d6', '#d6c9b0', '#a9d6c9', '#c9b8e0', '#f2b6a0', '#a8c8f0', '#e6d88a', '#b5e0a0', '#e0a8c8', '#c0c0c8'][s];
    const led = d ? '#555' : ['#3bf0ff', '#ff4fd8', '#9dff4a', '#ffd84a'][rn(p, 1, 4)];
    const dark = '#8a94a6', bolt = (x, y) => `<circle cx="${x}" cy="${y}" r="1" fill="#6b7280"/>`;
    const body = `<path d="M12 64v-9c0-5 4-8 9-8h22c5 0 9 3 9 8v9Z" fill="${metal}" ${st(1.6)}/><rect x="25" y="52" width="14" height="8" rx="2" fill="#2b2530" ${st(1.2)}/><circle cx="29" cy="56" r="1.600" fill="${led}"/><circle cx="35" cy="56" r="1.600" fill="${pc}"/>`;
    const neck = (spring) => spring ? `<path d="M26 44h12M26 46h12M27 48h10" stroke="#6b7280" stroke-width="1.500" stroke-linecap="round"/>` : `<rect x="28" y="43" width="8" height="5" fill="${dark}" ${st(1.2)}/>`;
    const X = (x1, x2, y) => `<path d="M${x1 - 2.500} ${y - 2.500}l5 5M${x1 + 2.500} ${y - 2.500}l-5 5M${x2 - 2.500} ${y - 2.500}l5 5M${x2 + 2.500} ${y - 2.500}l-5 5" stroke="#ff3b5c" stroke-width="1.800" stroke-linecap="round"/>`;
    const grille = (x, y, w) => d ? `<path d="M${x} ${y}h${w}" stroke="#2b2530" stroke-width="1.800"/>` : `<rect x="${x}" y="${y - 2}" width="${w}" height="4" rx="2" fill="#2b2530"/>`;
    let head = '', nk = neck(false);
    if (s === 0) head = `<rect x="16" y="16" width="32" height="28" rx="7" fill="${metal}" ${st(1.7)}/><rect x="13" y="25" width="4" height="10" rx="1.500" fill="${dark}" ${st(1.2)}/><rect x="47" y="25" width="4" height="10" rx="1.500" fill="${dark}" ${st(1.2)}/><path d="M32 16V9" ${st(1.6)}/><circle cx="32" cy="7" r="3" fill="${pc}" ${st(1.2)}/>${bolt(20, 20)}${bolt(44, 20)}<rect x="20" y="23" width="24" height="11" rx="5" fill="#1c1822" ${st(1.3)}/>${d ? X(26, 38, 28.500) : `<rect x="23" y="26" width="6" height="5" rx="2.500" fill="${led}"/><rect x="35" y="26" width="6" height="5" rx="2.500" fill="${led}"/>`}${grille(25, 39, 14)}`;
    if (s === 1) head = `<circle cx="32" cy="29" r="17" fill="${metal}" ${st(1.7)}/><path d="M32 12V6M32 6c-4 0-8 1-9 3M32 6c4 0 8 1 9 3" ${st(1.5)}/><path d="M18 20c3-4 8-6 14-6" fill="none" stroke="#fff" stroke-width="2" opacity=".6" stroke-linecap="round"/><circle cx="32" cy="29" r="9" fill="#fff" ${st(1.5)}/>${d ? X(32, 32, 29) : `<circle cx="32" cy="29" r="5.500" fill="${led}"/><circle cx="32" cy="29" r="2.400" fill="#1c1822"/><circle cx="33.800" cy="27.200" r="1.200" fill="#fff"/>`}${grille(27, 41, 10)}`;
    if (s === 2) { nk = neck(true); head = `<path d="M24 16l-6-9M40 16l6-9" ${st(1.6)}/><rect x="13" y="16" width="38" height="29" rx="9" fill="${metal}" ${st(1.7)}/><rect x="18" y="20" width="28" height="21" rx="6" fill="#1b3a2f" ${st(1.4)}/><path d="M21 23c2-1 5-1.500 8-1.500" stroke="#fff" stroke-width="1.600" opacity=".35" stroke-linecap="round"/>${d ? X(26, 38, 28) : `<circle cx="26" cy="28" r="2.200" fill="#8bf5a6"/><circle cx="38" cy="28" r="2.200" fill="#8bf5a6"/>`}<path d="M26 34c3 3 9 3 12 0" fill="none" stroke="#8bf5a6" stroke-width="1.800" stroke-linecap="round"/><circle cx="48" cy="38" r="1.200" fill="${pc}"/>`; }
    if (s === 3) head = `<rect x="19" y="10" width="26" height="36" rx="5" fill="${metal}" ${st(1.7)}/><path d="M19 18h26M19 38h26" stroke="#6b7280" stroke-width="1.600"/><circle cx="16" cy="28" r="4" fill="${dark}" ${st(1.3)}/><circle cx="48" cy="28" r="4" fill="${dark}" ${st(1.3)}/><rect x="22" y="24" width="20" height="7" rx="3.500" fill="#1c1822" ${st(1.3)}/>${d ? X(27, 37, 27.500) : `<path d="M25 27.500h14" stroke="${led}" stroke-width="3" stroke-linecap="round"><animate attributeName="opacity" values="1;.4;1" dur="2s" repeatCount="indefinite"/></path>`}${grille(26, 35, 12)}<rect x="30" y="4" width="4" height="6" fill="${dark}" ${st(1.2)}/>`;
    if (s === 4) head = `<path d="M20 15h24l6 24c0 3-2 5-5 5H19c-3 0-5-2-5-5Z" fill="${metal}" ${st(1.7)}/><path d="M32 15V8" ${st(1.6)}/><path d="M24 4c3 4 13 4 16 0-2 1-4 2-8 2s-6-1-8-2Z" fill="${dark}" ${st(1.3)}/><rect x="17" y="21" width="13" height="13" rx="6.500" fill="#1c1822" ${st(1.4)}/><rect x="34" y="21" width="13" height="13" rx="6.500" fill="#1c1822" ${st(1.4)}/>${d ? X(23.500, 40.500, 27.500) : `<circle cx="23.500" cy="27.500" r="4.500" fill="${led}"/><circle cx="40.500" cy="27.500" r="4.500" fill="${led}"/><circle cx="23.500" cy="27.500" r="1.800" fill="#1c1822"/><circle cx="40.500" cy="27.500" r="1.800" fill="#1c1822"/>`}${grille(26, 39, 12)}`;
    if (s === 5) { nk = neck(true); head = `<path d="M23 15h18l8 8v14l-8 8H23l-8-8V23Z" fill="${metal}" ${st(1.7)}/><path d="M32 15v-6" ${st(1.6)}/><path d="M28 9h8" ${st(2)}/>${bolt(20, 22)}${bolt(44, 22)}<rect x="19" y="25" width="26" height="8" rx="4" fill="#1c1822" ${st(1.3)}/>${d ? X(25, 39, 29) : `<circle cx="25" cy="29" r="2.200" fill="${led}"/><circle cx="32" cy="29" r="2.200" fill="${led}"/><circle cx="39" cy="29" r="2.200" fill="${led}"/>`}<path d="M24 38h16" stroke="#2b2530" stroke-width="1.800" stroke-dasharray="2.500 2"/>`; }
    if (s === 6) head = `<path d="M24 14L14 3M40 14L50 3" ${st(1.4)}/><circle cx="14" cy="3" r="1.800" fill="${pc}"/><circle cx="50" cy="3" r="1.800" fill="${pc}"/><rect x="12" y="14" width="40" height="31" rx="6" fill="${metal}" ${st(1.7)}/><circle cx="21" cy="25" r="5.500" fill="#fff" ${st(1.4)}/><path d="M21 21v4l2 2" stroke="${INK}" stroke-width="1.400" stroke-linecap="round" fill="none"/><circle cx="43" cy="25" r="5.500" fill="#fff" ${st(1.4)}/><path d="M43 21v4l-2 2" stroke="${INK}" stroke-width="1.400" stroke-linecap="round" fill="none"/>${d ? X(21, 43, 25) : `<circle cx="32" cy="22" r="1.200" fill="${led}"/>`}<rect x="19" y="33" width="26" height="9" rx="2" fill="#2b2530" ${st(1.2)}/><path d="M23 33v9M27 33v9M31 33v9M35 33v9M39 33v9M43 33v9" stroke="${led}" stroke-width="1" opacity=".8"/>`;
    if (s === 7) head = `<path d="M32 14V9" ${st(1.6)}/><path d="M26 9a6 6 0 0 1 12 0" fill="none" ${st(1.8)}/><path d="M20 14h24l5 30H15Z" fill="${metal}" ${st(1.7)}/><path d="M17 22h30M16 30h32" stroke="#6b7280" stroke-width="1.200"/><path d="M20 24h24c1 0 2 1 2 2v4c0 1-1 2-2 2H20c-1 0-2-1-2-2v-4c0-1 1-2 2-2Z" fill="#1c1822" ${st(1.3)}/>${d ? X(26, 38, 28) : `<rect x="23" y="26" width="7" height="3.500" rx="1.700" fill="${led}"/><rect x="34" y="26" width="7" height="3.500" rx="1.700" fill="${led}"/>`}${grille(27, 39, 10)}`;
    if (s === 8) head = `<g fill="${dark}" ${st(1.3)}><circle cx="32" cy="8" r="5"/></g><path d="M32 3v10M27 8h10M28.500 4.500l7 7M35.500 4.500l-7 7" stroke="#6b7280" stroke-width="1.500" stroke-linecap="round"/><rect x="15" y="14" width="34" height="30" rx="8" fill="${metal}" ${st(1.7)}/><rect x="19" y="20" width="26" height="14" rx="4" fill="#1c1822" ${st(1.3)}/>${d ? X(26, 38, 27) : `<path d="M26 31c-4-3-3-7 0-7 1 0 2 1 2.500 2 .5-1 1.500-2 2.500-2 3 0 4 4 0 7Z" fill="${led}" transform="translate(-1 -1)"/><path d="M38 31c-4-3-3-7 0-7 1 0 2 1 2.500 2 .5-1 1.500-2 2.500-2 3 0 4 4 0 7Z" fill="${led}" transform="translate(-5 -1)"/>`}<rect x="19" y="38" width="26" height="4" rx="2" fill="#fff" ${st(1.1)}/><rect x="21" y="39.500" width="14" height="1.500" rx=".7" fill="${led}"/>`;
    if (s === 9) head = `<path d="M18 22c0-8 6-12 14-12s14 4 14 12Z" fill="#cfe9f5" fill-opacity=".8" ${st(1.5)}/><path d="M23 20c1-3 3-5 6-5" fill="none" stroke="#fff" stroke-width="1.800" stroke-linecap="round"/><circle cx="32" cy="17" r="4" fill="#f4a3b5" ${st(1.1)}/><path d="M29 17c1-2 2 0 3-1s2 1 3 1" fill="none" stroke="#c0607a" stroke-width=".9"/><rect x="16" y="22" width="32" height="23" rx="6" fill="${metal}" ${st(1.7)}/>${bolt(20, 26)}${bolt(44, 26)}<path d="M20 31h24c1 0 2 1 2 2v2c0 1-1 2-2 2H20c-1 0-2-1-2-2v-2c0-1 1-2 2-2Z" fill="#1c1822" ${st(1.3)}/>${d ? X(26, 38, 34) : `<circle cx="26" cy="34" r="2.400" fill="${led}"/><circle cx="38" cy="34" r="2.400" fill="${led}"/>`}${grille(26, 41, 12)}`;
    return SVG64(`${body}${nk}${head}`);
  }

  // Pirate Crew: bandanas and tricorns, eye patches, beards
  function pirateAvatar(p) {
    const d = p.isVictim, h = hash(p.name + p.letter), f = p.g === 'f', skin = skinOf(p, 1), hair = HAIR[(h >>> 4) % 6];
    const tricorn = (h >>> 2) % 2 === 0;
    const shirtS = `<path d="M10 64c0-11 9-17 22-17s22 6 22 17Z" fill="#f3ead8" ${st(1.6)}/><path d="M12 56h40M11 61h42" stroke="#b5243a" stroke-width="2.4"/><path d="M27 47l5 6 5-6" fill="none" ${st(1.3)}/>`;
    const long = f ? `<path d="M18 30c-3 7-2 13 1 16h5c-2-4-2-10 0-14M46 30c3 7 2 13-1 16h-5c2-4 2-10 0-14" fill="${hair}" ${st(1.3)}/>` : '';
    const beard = !f && (h >>> 6) % 2 === 0 ? `<path d="M20 33c1 9 6 13 12 13s11-4 12-13c-2 3-5 4-7 4H27c-2 0-5-1-7-4Z" fill="${hair}" ${st(1.4)}/>` : '';
    const patch = !d && (h >>> 8) % 3 !== 2;
    const eyes = patch ? `${eyesAt(d, 27, 27, 31, 2)}<ellipse cx="37" cy="31" rx="4" ry="3.6" fill="#1c1822"/><path d="M20 25l21 4M41 29l4-3" stroke="#1c1822" stroke-width="1.4"/>` : eyesAt(d, 27, 37, 31, 2);
    const hat = tricorn
      ? `<path d="M12 22c6-6 14-9 20-9s14 3 20 9c-6 2-12 3-20 3s-14-1-20-3Z" fill="#2b2530" ${st(1.5)}/><path d="M15 21c5-1 11-2 17-2s12 1 17 2" fill="none" stroke="#ffd166" stroke-width="1.4"/><path d="M29 15l3 2 3-2-1 3.6h-4Z" fill="#fff" ${st(.8)}/>`
      : `<path d="M19 26c0-8 6-13 13-13s13 5 13 13c-8-2-18-2-26 0Z" fill="${p.color}" ${st(1.5)}/><path d="M44 24c3 0 6 2 7 5-3 0-5-1-6-2" fill="${p.color}" ${st(1.3)}/><circle cx="26" cy="19" r="1" fill="#fff"/><circle cx="33" cy="17" r="1" fill="#fff"/><circle cx="39" cy="20" r="1" fill="#fff"/>`;
    const earring = !d ? `<circle cx="18.5" cy="37" r="1.8" fill="none" stroke="#ffd166" stroke-width="1.3"/>` : '';
    return SVG64(`${long}${shirtS}${headBase(skin)}${beard}${eyes}${beard ? '' : smile(d, 38.5, 3.2)}${hat}${earring}`);
  }

  // Shadow Ninjas: hoods, eye slits, coloured headbands
  // Shadow Ninjas: ten different head coverings by cast slot (hoods, masks, straw hat, helmet, face paint), cloth colour by slot
  function ninjaAvatar(p) {
    const d = p.isVictim, s = slotOf(p), skin = skinOf(p, 3), hair = HAIR[rn(p, 1, 5)], pc = p.color;
    const cloth = ['#1c1822', '#2b2340', '#3a2238', '#1d3a36', '#3b2a1e', '#1f2f4a', '#eceaf2', '#4a1f1f', '#2d2d33', '#3a3a1e'][s];
    const line = cloth === '#eceaf2' ? '#9a94aa' : '#000';
    const body = `<path d="M10 64c0-11 9-17 22-17s22 6 22 17Z" fill="${cloth}" ${st(1.6)}/><path d="M22 49l10 7 10-7" fill="none" stroke="${line}" stroke-opacity=".4" stroke-width="1.600"/><path d="M12 58h40" stroke="${pc}" stroke-width="3"/>`;
    const w = rn(p, 2, 4);
    const weapon = d ? '' : w === 0 ? `<path d="M49 50l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1Z" fill="#c9ced6" ${st(1)}/><circle cx="50" cy="56" r="1" fill="${cloth}"/>` : w === 1 ? `<path d="M14 44l10 14M50 44L40 58" stroke="#8a94a6" stroke-width="2.200" stroke-linecap="round"/><path d="M12 42l4 3M52 42l-4 3" stroke="${pc}" stroke-width="3" stroke-linecap="round"/>` : w === 2 ? `<path d="M48 54l5 5-3 3-5-5Z" fill="#c9ced6" ${st(1)}/><circle cx="46" cy="52" r="1.800" fill="none" stroke="${INK}" stroke-width="1.200"/>` : '';
    const hood = `<path d="M17 32c0-11 7-18 15-18s15 7 15 18-7 16-15 16-15-5-15-16Z" fill="${cloth}" ${st(1.7)}/>`;
    const slit = `<path d="M20 27h24c1 0 2 1 2 2v3c0 1-1 2-2 2H20c-1 0-2-1-2-2v-3c0-1 1-2 2-2Z" fill="${skin}" ${st(1.3)}/>`;
    const eyes = (y = 31.2) => d ? eyesAt(d, 27, 37, y - .7, 2) : `<path d="M24.500 ${y - 1.700}l5 1.600M39.500 ${y - 1.700}l-5 1.600" ${st(1.4)}/><circle cx="27.200" cy="${y}" r="1.700" fill="${INK}"/><circle cx="36.800" cy="${y}" r="1.700" fill="${INK}"/>`;
    let head = '';
    if (s === 0) head = `${hood}${slit}${eyes()}<path d="M17.500 24c9-2 20-2 29 0v3c-9-2-20-2-29 0Z" fill="${pc}" ${st(1.2)}/><path d="M46 25c4 0 7 2 9 6-3-1-5-1-7-2M46 26c3 2 5 5 5 9-2-2-3-4-5-5" fill="${pc}" ${st(1.1)}/>`;
    if (s === 1) head = `<path d="M44 38c5 2 8 6 9 12-4-3-7-4-10-4Z" fill="${cloth}" ${st(1.4)}/>${hood}<path d="M21 28h22c1 0 1.500.5 1.500 1.500v2c0 1-.5 1.500-1.500 1.500H21c-1 0-1.500-.5-1.500-1.500v-2c0-1 .5-1.500 1.500-1.500Z" fill="${skin}" ${st(1.1)}/>${eyes(30.600)}<path d="M20 38c4 2 20 2 24 0" fill="none" stroke="${line}" stroke-opacity=".35" stroke-width="1.200"/>`;
    if (s === 2) head = `${hood}${slit}${eyes()}<path d="M20 36c4 6 20 6 24 0v6c-4 4-20 4-24 0Z" fill="${cloth}" ${st(1.2)}/><path d="M30 6c-1 0-2 1-2 2L6 28c10 4 42 4 52 0L36 8c0-1-1-2-2-2Z" fill="#d9b36a" ${st(1.5)}/><path d="M32 6L18 30M32 6l14 24M32 6v26M12 28c8 3 32 3 40 0" fill="none" stroke="#a8823a" stroke-width="1.100"/><path d="M23 28v8M41 28v8" stroke="${pc}" stroke-width="1.600" stroke-linecap="round"/>`;
    if (s === 3) head = `<circle cx="32" cy="9" r="5" fill="${hair}" ${st(1.4)}/><ellipse cx="32" cy="32" rx="12.500" ry="13.500" fill="${skin}" ${st(1.6)}/><path d="M19.500 28c0-9 5-14 12.500-14s12.500 5 12.500 14c-3-3-7-5-12.500-5s-9.500 2-12.500 5Z" fill="${hair}" ${st(1.4)}/><path d="M18 25c10-3 18-3 28 0v3c-10-3-18-3-28 0Z" fill="${pc}" ${st(1.2)}/>${eyes()}<path d="M19.500 35c0 6 5 11 12.500 11s12.500-5 12.500-11c-4 2-8 3-12.500 3s-8.500-1-12.500-3Z" fill="${cloth}" ${st(1.4)}/>`;
    if (s === 4) head = `${hood}${slit}${eyes()}<path d="M21 18h22c1 0 2 1 2 2v5c0 1-1 2-2 2H21c-1 0-2-1-2-2v-5c0-1 1-2 2-2Z" fill="#b9c0cc" ${st(1.4)}/><path d="M32 19.500l1.600 2.200 2.600.2-1.800 1.800.5 2.600-2.900-1.400-2.900 1.400.5-2.600-1.800-1.800 2.600-.2Z" fill="${cloth}"/><circle cx="23" cy="22.500" r=".9" fill="#6b7280"/><circle cx="41" cy="22.500" r=".9" fill="#6b7280"/>`;
    if (s === 5) head = `<path d="M44 34c7 0 11 4 12 9-5-3-9-3-13-2ZM44 30c6-2 11-1 14 3-6-1-9-1-12 1Z" fill="${pc}" ${st(1.2)}/>${hood}<path d="M19 27h26c1 0 1.500 1 1.500 2v4c0 1.500-1 2.500-2.500 2.500H20c-1.500 0-2.500-1-2.500-2.500v-4c0-1 .5-2 1.500-2Z" fill="#1c1822" ${st(1.4)}/>${d ? '<path d="M24 29l5 5M29 29l-5 5M35 29l5 5M40 29l-5 5" stroke="#ff6b6b" stroke-width="1.800" stroke-linecap="round"/>' : `<path d="M22 30.500h8M34 30.500h8" stroke="${pc}" stroke-width="2.200" stroke-linecap="round"/>`}<path d="M18.500 24c9-2 18-2 27 0" stroke="${pc}" stroke-width="2.200" stroke-linecap="round" fill="none"/>`;
    if (s === 6) head = `${hood}${slit}${eyes()}<path d="M17.500 24c9-2 20-2 29 0v3c-9-2-20-2-29 0Z" fill="${pc}" ${st(1.2)}/><circle cx="19" cy="23" r="3" fill="#fff" ${st(1)}/><circle cx="45" cy="23" r="3" fill="#fff" ${st(1)}/><circle cx="15" cy="30" r="4.500" fill="#9fb4e8" ${st(1.2)}/><circle cx="49" cy="30" r="4.500" fill="#9fb4e8" ${st(1.2)}/>`;
    if (s === 7) head = `<path d="M17 22l1-12 9 7ZM47 22l-1-12-9 7Z" fill="${cloth}" ${st(1.5)}/><path d="M20 19l.5-5 4 3ZM44 19l-.5-5-4 3Z" fill="#f4a3b5"/>${hood}${slit}${eyes()}<path d="M18 38l-6-1M18 41l-6 2M46 38l6-1M46 41l6 2" stroke="${INK}" stroke-width="1.200" stroke-linecap="round"/><path d="M30 37l2 2 2-2Z" fill="#f4a3b5" ${st(.8)}/>`;
    if (s === 8) head = `<ellipse cx="32" cy="32" rx="12.500" ry="13.500" fill="${skin}" ${st(1.6)}/><circle cx="18.500" cy="32" r="3.200" fill="${skin}" ${st(1.4)}/><circle cx="45.500" cy="32" r="3.200" fill="${skin}" ${st(1.4)}/><path d="M18 28l1-9 4 3 3-8 4 6 4-8 3 8 4-4 1 8c-4-5-8-6-14-6s-10 1-14 6Z" fill="${hair}" ${st(1.5)}/><path d="M18.500 24c9-3 18-3 27 0v3c-9-3-18-3-27 0Z" fill="#fff" ${st(1.2)}/>${d ? eyesAt(d, 27, 37, 31, 2) : `<path d="M24 29l6 1.500M40 29l-6 1.500" ${st(1.4)}/><circle cx="27" cy="31.500" r="1.700" fill="${INK}"/><circle cx="37" cy="31.500" r="1.700" fill="${INK}"/>`}<path d="M22 35l5 3M42 35l-5 3M22 38l4 2.500M42 38l-4 2.500" stroke="#d6334d" stroke-width="1.800" stroke-linecap="round"/>${smile(d, 40, 2.500)}`;
    if (s === 9) head = `<path d="M17 32c0-11 7-18 15-18s15 7 15 18-7 16-15 16-15-5-15-16Z" fill="#8a94a6" ${st(1.7)}/><path d="M12 34c3 6 6 10 10 12l-2-14ZM52 34c-3 6-6 10-10 12l2-14Z" fill="#6b7280" ${st(1.3)}/><path d="M17 26c10-4 20-4 30 0v3c-10-3-20-3-30 0Z" fill="#6b7280" ${st(1.3)}/><path d="M24 14l-3-8 11 5 11-5-3 8" fill="#f6c85f" ${st(1.3)}/><path d="M32 9v9" stroke="#f6c85f" stroke-width="3"/><path d="M20 29h24c1 0 2 1 2 2v3c0 1-1 2-2 2H20c-1 0-2-1-2-2v-3c0-1 1-2 2-2Z" fill="${skin}" ${st(1.3)}/>${eyes(32.200)}<path d="M21 38c3 6 8 7 11 7s8-1 11-7c-4 2-7 2-11 2s-7 0-11-2Z" fill="#b9c0cc" ${st(1.3)}/><path d="M25 41h14M28 39v5M32 39v6M36 39v5" stroke="#6b7280" stroke-width=".9"/>`;
    return SVG64(`${body}${head}${weapon}`);
  }

  // Wizard Academy: starry hats, long beards, glowing wands
  function wizardAvatar(p) {
    const d = p.isVictim, h = hash(p.name + p.letter), f = p.g === 'f', skin = skinOf(p, 2);
    const robe = ['#3b2a7a', '#1d3a6b', '#6b2a5a', '#2a5a4a'][h % 4], hair = f ? HAIR[(h >>> 4) % 6] : ['#e9e4ef', '#cfc8d8', '#8a7a6a'][(h >>> 4) % 3];
    const body = `<path d="M10 64c0-11 9-17 22-17s22 6 22 17Z" fill="${robe}" ${st(1.6)}/><path d="M18 60l1.2 2.4 2.6.4-1.9 1.8M44 54l1.2 2.4 2.6.4-1.9 1.8-1.9-1.8 2.6-.4Z" fill="#ffd166"/>`;
    const long = f ? `<path d="M18 28c-3 8-2 15 2 19h5c-3-5-3-11-1-17M46 28c3 8 2 15-2 19h-5c3-5 3-11 1-17" fill="${hair}" ${st(1.3)}/>` : '';
    const beard = !f ? `<path d="M20 34c0 12 6 22 12 26 6-4 12-14 12-26-3 3-6 4-8 4h-8c-2 0-5-1-8-4Z" fill="${hair}" ${st(1.4)}/><path d="M27 37c2-1.6 3-1.6 5 0 2-1.6 3-1.6 5 0" fill="none" stroke="${hair}" stroke-width="2.4"/>` : '';
    const hat = `<path d="M11 23c4 3 12 4 21 4s17-1 21-4c-3-2-9-3-14-3H25c-5 0-11 1-14 3Z" fill="${robe}" ${st(1.5)}/><path d="M20 22c3-6 6-12 9-17 2-3 6-3 9 0 2 2 4 5 6 9-2-1-3-1-4 0l3 8c-8 1.4-16 1.4-23 0Z" fill="${robe}" ${st(1.5)}/><path d="M30 13l1 2 2 .3-1.5 1.4.4 2.2-1.9-1-1.9 1 .4-2.2-1.5-1.4 2-.3Z" fill="#ffd166"/><circle cx="36" cy="18" r="1" fill="#ffd166"/><path d="M21 21.5c7 1.4 15 1.4 22 0" stroke="#ffd166" stroke-width="1.6"/>`;
    const wand = !d ? `<path d="M50 62l6-14" stroke="#5c3d2b" stroke-width="2.4" stroke-linecap="round"/><circle cx="56.5" cy="47" r="2.6" fill="${p.color}" opacity=".9"/><circle cx="56.5" cy="47" r="4.5" fill="${p.color}" opacity=".25"/>` : '';
    return SVG64(`${long}${body}${headBase(skin)}${eyesAt(d, 27, 37, 31, 2)}${beard}${f ? smile(d, 38.5, 3) : ''}${hat}${wand}`);
  }

  // Dino Hoodies: kids in dinosaur onesies
  function dinoAvatar(p) {
    const d = p.isVictim, h = hash(p.name + p.letter), skin = skinOf(p, 5);
    const dino = ['#7cc47a', '#f2a65a', '#8fb8f0', '#c4a2f0', '#f28da5'][h % 5], belly = '#fff3c4';
    const body = `<path d="M10 64c0-11 9-17 22-17s22 6 22 17Z" fill="${dino}" ${st(1.6)}/><path d="M24 64c0-7 4-11 8-11s8 4 8 11Z" fill="${belly}" ${st(1.2)}/>`;
    const spikes = `<path d="M18 22l-4-6 7 1M24 14l-2-7 6 4M32 11v-7l4 6M40 14l2-7 2 7M46 22l4-6-1 7" fill="${belly}" ${st(1.2)}/>`;
    const hood = `<path d="M14 34c0-13 8-22 18-22s18 9 18 22c0 7-3 12-6 14H20c-3-2-6-7-6-14Z" fill="${dino}" ${st(1.7)}/>`;
    const teeth = `<path d="M17 30c4 2 26 2 30 0" fill="none" ${st(1.2)}/><path d="M19 30.6l2 3 2-2.6 2 3 2-2.7 2 3 2-2.8 2 3 2-2.8 2 3 2-2.7 2 3 2-2.6 2 3 2-3" fill="#fff" ${st(.9)}/>`;
    const face = `<ellipse cx="32" cy="39" rx="11" ry="9.5" fill="${skin}" ${st(1.5)}/>`;
    const hoodEyes = `<circle cx="22" cy="21" r="3" fill="#fff" ${st(1.1)}/><circle cx="42" cy="21" r="3" fill="#fff" ${st(1.1)}/><circle cx="22.6" cy="21.4" r="1.4" fill="${INK}"/><circle cx="41.4" cy="21.4" r="1.4" fill="${INK}"/>`;
    return SVG64(`${body}${spikes}${hood}${hoodEyes}${teeth}${face}${eyesAt(d, 28, 36, 38, 1.8)}${smile(d, 42.5, 2.6)}${d ? '' : '<circle cx="24.5" cy="41" r="1.6" fill="#f4a3b5" opacity=".7"/><circle cx="39.5" cy="41" r="1.6" fill="#f4a3b5" opacity=".7"/>'}`);
  }

  // Super Squad: domino masks, capes and big chest emblems
  function heroAvatar(p) {
    const d = p.isVictim, h = hash(p.name + p.letter), f = p.g === 'f', skin = skinOf(p, 4), hair = HAIR[(h >>> 6) % 6];
    const suit = p.color, cape = ['#e63946', '#1d4ed8', '#ffb300', '#7c3aed'][h % 4];
    const emblem = ['M32 52l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4Z', 'M29 51h7l-3 5h4l-8 8 2-6h-4Z', 'M32 51c3 0 6 2 6 5s-6 8-6 8-6-5-6-8 3-5 6-5Z'][(h >>> 3) % 3];
    const capeB = `<path d="M8 64l6-16h36l6 16Z" fill="${cape}" ${st(1.5)}/>`;
    const body = `<path d="M12 64c0-10 8-16 20-16s20 6 20 16Z" fill="${suit}" ${st(1.6)}/><circle cx="32" cy="57" r="7.5" fill="#fff" ${st(1.3)}/><path d="${emblem}" fill="${cape}" ${st(1)}/>`;
    const hairS = f ? `<path d="M18 30c-2 7-1 13 2 17h5c-2-5-3-10-1-15M46 30c2 7 1 13-2 17h-5c2-5 3-10 1-15" fill="${hair}" ${st(1.3)}/>` : '';
    const top = f ? `<path d="M19 28c0-9 6-14 13-14s13 5 13 14c-5-3-9-7-11-10-3 4-9 8-15 10Z" fill="${hair}" ${st(1.4)}/>` : `<path d="M19 27c-1-9 5-14 13-14s14 4 14 12c-3-3-6-4-10-4 2 2 2 4 1 6-3-4-8-5-12-4-3 1-5 2-6 4Z" fill="${hair}" ${st(1.4)}/>`;
    const mask = `<path d="M18 28c4-2 8-2 14 0 6-2 10-2 14 0 0 4-3 7-7 7-3 0-5-2-7-3-2 1-4 3-7 3-4 0-7-3-7-7Z" fill="${cape}" ${st(1.3)}/>`;
    const eyes = d ? `<path d="M23 29.5l4 4M27 29.5l-4 4M37 29.5l4 4M41 29.5l-4 4" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>` : `<ellipse cx="25" cy="31" rx="3" ry="2" fill="#fff"/><ellipse cx="39" cy="31" rx="3" ry="2" fill="#fff"/><circle cx="25.3" cy="31" r="1.2" fill="${INK}"/><circle cx="39.3" cy="31" r="1.2" fill="${INK}"/>`;
    return SVG64(`${capeB}${hairS}${body}${headBase(skin)}${mask}${eyes}${smile(d, 39, 3.5)}${top}`);
  }

  // Deep Sea Gang: octopus, shark, pufferfish, crab, jellyfish, narwhal
  // Deep Sea Gang: ten different sea creatures, picked by cast slot (A..I, victim), with colours and a prop by name
  function seaAvatar(p) {
    const d = p.isVictim, kind = ['octopus', 'shark', 'turtle', 'crab', 'seahorse', 'jelly', 'puffer', 'starfish', 'whale', 'swordfish'][slotOf(p)];
    const bg = `<circle cx="32" cy="32" r="32" fill="#bfe6f5"/><circle cx="10" cy="16" r="2" fill="#fff" opacity=".7"/><circle cx="14" cy="9" r="1.2" fill="#fff" opacity=".7"/><circle cx="55" cy="22" r="1.6" fill="#fff" opacity=".7"/><path d="M0 58c8-4 14 4 22 0s14 4 22 0 14 4 20 0v6H0Z" fill="#f2dca0"/>`;
    const tie = `<path d="M27 52l5 2-5 2ZM37 52l-5 2 5 2Z" fill="${p.color}" ${st(1.1)}/>`;
    const pk = (arr, k) => arr[rn(p, k, arr.length)];
    let b = '', ey = 30, ex1 = 26, ex2 = 38, own = '', noTie = false, sm = 38;
    if (kind === 'octopus') { const c = pk(['#f07a98', '#b38ae8', '#f2a65a', '#7cc4d4'], 1); b = `<g fill="${c}" ${st(1.4)}><path d="M16 42c-4 6-4 12 0 14 1-5 4-8 6-10Z"/><path d="M48 42c4 6 4 12 0 14-1-5-4-8-6-10Z"/><path d="M22 46c-2 6 0 12 4 13 0-5 1-8 3-10Z"/><path d="M42 46c2 6 0 12-4 13 0-5-1-8-3-10Z"/></g><path d="M14 30c0-11 8-18 18-18s18 7 18 18c0 9-6 16-18 16S14 39 14 30Z" fill="${c}" ${st(1.7)}/><circle cx="22" cy="20" r="2" fill="#fff" opacity=".5"/><circle cx="41" cy="18" r="1.6" fill="#fff" opacity=".5"/>`; }
    if (kind === 'shark') { const c = pk(['#8fafcc', '#a3a8b8', '#7aa6a0'], 1); b = `<path d="M28 12l6-9 4 10Z" fill="${c}" ${st(1.4)}/><path d="M12 34c0-12 9-21 20-21s20 9 20 21-9 16-20 16-20-4-20-16Z" fill="${c}" ${st(1.7)}/><path d="M18 38c4 7 9 10 14 10s10-3 14-10c-8 2-20 2-28 0Z" fill="#f5f2ea" ${st(1.2)}/><path d="M21 39l2 3 2-2.6 2 3 2-2.8 2 3 2-3 2 3 2-2.8 2 3 2-2.6 2 3 2-2.6" fill="#fff" stroke="#3d3250" stroke-width=".8"/><path d="M14 30l-3 2 3 2M50 30l3 2-3 2" fill="none" stroke="#5e7a96" stroke-width="1.2"/>`; ey = 27; ex1 = 24; ex2 = 40; sm = 0; noTie = true; }
    if (kind === 'puffer') { const c = pk(['#ffd166', '#f2a65a', '#9ee6c9'], 1); b = `<g stroke="#3d3250" stroke-width="1.3"><path d="M32 8v6M18 12l3 5M46 12l-3 5M10 24l6 2M54 24l-6 2M9 38l6-1M55 38l-6-1M16 50l4-4M48 50l-4-4"/></g><circle cx="32" cy="32" r="19" fill="${c}" ${st(1.7)}/><path d="M18 38c4 6 9 9 14 9s10-3 14-9c-6 2-22 2-28 0Z" fill="#fff6d0"/><path d="M50 30c5-4 9-3 10 0-1 3-5 4-10 0Z" fill="#f2a65a" ${st(1.2)}/>`; ey = 28; sm = 37; }
    if (kind === 'crab') { const c = pk(['#ff7a6b', '#e8615a', '#f2994a'], 1); b = `<path d="M10 22c-4-6 2-12 6-8l-3 3 5 1c0 4-4 6-8 4ZM54 22c4-6-2-12-6-8l3 3-5 1c0 4 4 6 8 4Z" fill="${c}" ${st(1.4)}/><path d="M16 26l6 6M48 26l-6 6" stroke="${c}" stroke-width="3" stroke-linecap="round"/><path d="M14 44l-4 6M18 46l-3 7M50 44l4 6M46 46l3 7" stroke="${c}" stroke-width="2.6" stroke-linecap="round"/><ellipse cx="32" cy="38" rx="18" ry="12" fill="${c}" ${st(1.7)}/><path d="M26 24v-4M38 24v-4" ${st(1.6)}/><circle cx="26" cy="20" r="3.6" fill="#fff" ${st(1.2)}/><circle cx="38" cy="20" r="3.6" fill="#fff" ${st(1.2)}/>`; ey = 20; sm = 41; }
    if (kind === 'jelly') { const c = pk(['#d7b8ff', '#ffc4de', '#b8e6ff'], 1); b = `<g fill="none" stroke="#b38ae8" stroke-width="2" stroke-linecap="round"><path d="M20 38c-2 6 2 10 0 16M26 40c2 6-2 10 0 16M32 40c-2 6 2 10 0 16M38 40c2 6-2 10 0 16M44 38c-2 6 2 10 0 16"/></g><path d="M12 36c0-14 9-24 20-24s20 10 20 24c-3 2-6 2-8 0-3 2-6 2-8 0-3 2-5 2-8 0-3 2-5 2-8 0-2 2-5 2-8 0Z" fill="${c}" fill-opacity=".92" ${st(1.6)}/><path d="M18 26c2-6 6-9 10-10" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".8"/>`; ey = 28; sm = 34; noTie = true; }
    if (kind === 'whale') { b = `<path d="M32 12V4" stroke="#8fd3f4" stroke-width="2"/><path d="M27 6c2-3 8-3 10 0" fill="none" stroke="#8fd3f4" stroke-width="2" stroke-linecap="round"/><path d="M10 34c0-12 10-20 22-20s22 8 22 20c0 9-8 14-22 14S10 43 10 34Z" fill="#5b7fd6" ${st(1.7)}/><path d="M14 40c6 5 12 7 18 7s12-2 18-7c-8 2-28 2-36 0Z" fill="#dce8ff" ${st(1.1)}/><path d="M20 43v3M26 44.500v3M32 45v3M38 44.500v3M44 43v3" stroke="#9ab0e0" stroke-width="1"/>`; ex1 = 24; ex2 = 40; ey = 31; }
    if (kind === 'turtle') { const c = pk(['#6fbf73', '#8fb86a', '#5fb3a1'], 1); b = `<ellipse cx="13" cy="44" rx="6" ry="3.600" transform="rotate(-25 13 44)" fill="${c}" ${st(1.4)}/><ellipse cx="51" cy="44" rx="6" ry="3.600" transform="rotate(25 51 44)" fill="${c}" ${st(1.4)}/><path d="M9 38c0-14 10-24 23-24s23 10 23 24c0 4-6 7-23 7S9 42 9 38Z" fill="#a3763f" ${st(1.7)}/><path d="M20 22l6 5h12l6-5M26 27l-4 10M38 27l4 10M26 27l6 8 6-8M32 35v9" fill="none" stroke="#6b4a24" stroke-width="1.5"/><circle cx="32" cy="35" r="12.500" fill="${c}" ${st(1.6)}/>`; ey = 33; ex1 = 27; ex2 = 37; sm = 39; }
    if (kind === 'swordfish') { const c = pk(['#6b8fd6', '#5aa0c4', '#7a7ad0'], 1); b = `<path d="M32 2l3.500 21h-7Z" fill="#c9ced6" ${st(1.4)}/><path d="M16 22l-5-8 11 3ZM48 22l5-8-11 3Z" fill="${c}" ${st(1.3)}/><path d="M13 38c0-12 8-18 19-18s19 6 19 18-8 14-19 14-19-2-19-14Z" fill="${c}" ${st(1.7)}/><path d="M18 42c4 5 9 7 14 7s10-2 14-7c-8 2-20 2-28 0Z" fill="#e8f0ff" ${st(1.1)}/><path d="M53 36c4-3 7-2 8 1-1 3-4 4-8 2" fill="${c}" ${st(1.2)}/>`; ey = 33; ex1 = 25; ex2 = 39; sm = 43; }
    if (kind === 'seahorse') { const c = pk(['#f2a65a', '#f6c85f', '#f28da5'], 1); b = `<path d="M26 4c4-2 8 0 8 4M24 6l-4-3M28 6l-2-4" fill="none" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/><path d="M24 8c8-3 15 1 15 8 0 5-2 8-6 10 3 4 4 8 2 13-1 5-5 8-9 8-4 0-7-3-5-6 3 2 6 0 6-3 0-4-3-5-5-9-2-5-1-11 2-15" fill="${c}" ${st(1.6)}/><path d="M24 10C14 8 12 16 18 18c3 1 5-1 6-3Z" fill="${c}" ${st(1.5)}/><path d="M39 14l9-1-1 5Z" fill="${c}" ${st(1.4)}/><path d="M30 28c4 0 7 2 7 5M30 36c3 0 6 2 6 4" fill="none" stroke="#fff" stroke-width="1.4" opacity=".6"/><path d="M42 36c4 0 6 4 4 8" fill="none" stroke="${c}" stroke-width="3"/>`; own = d ? `<path d="M27 15l4 4M31 15l-4 4" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/>` : `<circle cx="29" cy="17" r="2.2" fill="${INK}"/><circle cx="29.7" cy="16.2" r=".7" fill="#fff"/>`; noTie = true; sm = 0; ey = -99; }
    if (kind === 'starfish') { const c = pk(['#f2994a', '#f06b8a', '#e8c24a'], 1); b = `<path d="M32 4l7.500 17 18 2-13.500 12 4 18-16-9.500-16 9.500 4-18L6.500 23l18-2Z" fill="${c}" ${st(1.7)}/><g fill="#fff" opacity=".55"><circle cx="32" cy="12" r="1.2"/><circle cx="50" cy="26" r="1.2"/><circle cx="44" cy="48" r="1.2"/><circle cx="20" cy="48" r="1.2"/><circle cx="14" cy="26" r="1.2"/></g>`; ey = 30; ex1 = 27; ex2 = 37; sm = 37; noTie = true; }
    // a little prop by name: bow, snorkel goggles, pearl, bubble hat or nothing
    const prop = pk(['', '', 'bubbles', 'pearl', 'hat'], 5);
    const bubbles = prop === 'bubbles' ? '<circle cx="50" cy="12" r="3" fill="#fff" opacity=".7"/><circle cx="55" cy="6" r="2" fill="#fff" opacity=".7"/>' : '';
    const hatS = prop === 'hat' && kind !== 'seahorse' && kind !== 'swordfish' ? `<path d="M22 16c1-6 9-9 12-3 3-1 7 1 8 5-9 2-15 3-20-2Z" fill="${p.color}" ${st(1.2)}/>` : '';
    const pearl = prop === 'pearl' ? '<circle cx="32" cy="51" r="2" fill="#fff" stroke="#3d3250" stroke-width=".9"/>' : '';
    const eyes = ey === -99 ? own : eyesAt(d, ex1, ex2, ey, 2.2);
    const cheeks = ey === -99 || d ? '' : `<circle cx="${ex1 - 4}" cy="${ey + 5}" r="1.8" fill="#f4a3b5" opacity=".7"/><circle cx="${ex2 + 4}" cy="${ey + 5}" r="1.8" fill="#f4a3b5" opacity=".7"/>`;
    return SVG64(`${bg}${b}${eyes}${sm ? smile(d, sm, 3) : ''}${noTie ? pearl : tie}${cheeks}${hatS}${bubbles}`);
  }

  const SKINS = {
    classic: { name: 'Classic Detectives', price: 0, rarity: 'Basic', desc: 'The original cast.', draw: (p) => avatar(p), emoji: null },
    pets: { name: 'Pet Detectives', price: 120, rarity: 'Common', desc: 'Cats, dogs, foxes, owls and more. Paws off the evidence!', draw: petAvatar, emoji: ['🐱', '🐶', '🦊', '🐰', '🐻', '🐼', '🦉', '🐸', '🐯', '🐨'] },
    gangsters: { name: 'Noir Gangsters', price: 280, rarity: 'Rare', desc: 'Fedoras, trench coats and very dark sunglasses.', draw: gangsterAvatar, emoji: ['🕴️', '🤵', '🤵‍♀️', '🧔‍♂️', '👩‍🦰', '🧑‍💼', '👨‍💼', '👩‍💼'] },
    monsters: { name: 'Monster Mash', price: 560, rarity: 'Epic', desc: 'Vampires, mummies, ghosts, a cyclops and one very polite werewolf.', draw: monsterAvatar, emoji: ['🧛', '🧟', '👻', '🧙', '🧌', '🐺', '🎃', '💀', '🧞'] },
    royals: { name: 'Royal Court', price: 650, rarity: 'Epic', desc: 'Crowns, jewels and ermine. Comes with a golden frame.', draw: royalAvatar, emoji: ['🤴', '👸', '🫅', '👑', '🦄', '💎'] },
    space: { name: 'Space Crew', price: 800, rarity: 'Epic', desc: 'Astronauts and aliens, framed by the stars.', draw: spaceAvatar, emoji: ['👩‍🚀', '🧑‍🚀', '👨‍🚀', '👽', '🤖', '👾', '🛸'] },
    neon: { name: 'Neon Legends', price: 1500, rarity: 'Legendary', desc: 'Glowing neon characters with a pulsing frame. The finest skins in town.', draw: neonAvatar, emoji: ['🌟', '💫', '⚡', '🔮', '🌈', '🪩', '✨'] },
    chefs: { name: 'Kitchen Crew', price: 90, rarity: 'Common', desc: 'Chef hats, curly mustaches and a pinch of suspicion.', draw: chefAvatar },
    clowns: { name: 'Circus Clowns', price: 100, rarity: 'Common', desc: 'Red noses, wild hair. Nobody trusts a clown.', draw: clownAvatar },
    cowboys: { name: 'Wild West', price: 110, rarity: 'Common', desc: 'Cowboy hats, bandanas and a shiny sheriff star.', draw: cowboyAvatar },
    robots: { name: 'Robo Squad', price: 120, rarity: 'Common', desc: 'Beep boop. Box heads with glowing LED eyes.', draw: robotAvatar },
    pirates: { name: 'Pirate Crew', price: 150, rarity: 'Rare', desc: 'Eye patches, tricorns and gold earrings. Arr!', draw: pirateAvatar },
    ninjas: { name: 'Shadow Ninjas', price: 180, rarity: 'Rare', desc: 'Silent hoods, colourful headbands, one throwing star.', draw: ninjaAvatar },
    wizards: { name: 'Wizard Academy', price: 250, rarity: 'Rare', desc: 'Starry hats, long beards and glowing wands.', draw: wizardAvatar },
    dinos: { name: 'Dino Hoodies', price: 210, rarity: 'Rare', desc: 'Everyone in a dinosaur onesie. Rawr.', draw: dinoAvatar },
    heroes: { name: 'Super Squad', price: 400, rarity: 'Epic', desc: 'Masks, capes and big shiny emblems.', draw: heroAvatar },
    sea: { name: 'Deep Sea Gang', price: 480, rarity: 'Epic', desc: 'Ten sea creatures: octopus, shark, turtle, crab, seahorse, jellyfish, pufferfish, starfish, whale and swordfish.', draw: seaAvatar },
    masquerade: { name: 'Masquerade Ball', price: 0, rarity: 'Premium', desc: 'Venetian masks and feathers.', draw: masqueradeAvatar },
    cyber: { name: 'Cyber Agents', price: 0, rarity: 'Premium', desc: 'Glowing visors and scan lines.', draw: cyberAvatar },
  };

  /* floor finish for each area: wood, tiles, grass, metal, deck... */
  const FLOORS = {
    mansion: ['wood', 'tile', 'wood', 'check', 'wood', 'tile', 'carpet', 'check'],
    ship: ['deck', 'deck', 'wood', 'metal', 'deck', 'wood', 'deck', 'metal'],
    forest: ['grass', 'grass', 'dirt', 'grass', 'stone', 'grass', 'dirt', 'grass'],
    space: ['metal', 'metal', 'tile', 'metal', 'metal', 'tile', 'metal', 'metal'],
    museum: ['marble', 'wood', 'marble', 'tile', 'wood', 'marble', 'check', 'tile'],
    train: ['wood', 'carpet', 'wood', 'metal', 'carpet', 'wood', 'carpet', 'wood'],
    circus: ['dirt', 'wood', 'grass', 'dirt', 'check', 'wood', 'grass', 'dirt'],
    castle: ['stone', 'stone', 'wood', 'stone', 'carpet', 'stone', 'wood', 'stone'],
    ski: ['wood', 'carpet', 'wood', 'snow', 'wood', 'tile', 'snow', 'wood'],
  };

  const API = {
    icon: (o) => (ICONS[o] ? svg(ICONS[o]) : ''),
    has: (o) => !!ICONS[o],
    theme: (id) => svg(THEMES[id] || THEMES.mansion),
    ui: (name) => svg(UI[name] || ''),
    avatar,
    SKINS,
    skinAvatar: (person, id) => (SKINS[id] || SKINS.classic).draw(person),
    appIcon,
    floor: (themeId, z) => (FLOORS[themeId] || FLOORS.mansion)[z % 8],
  };
  root.MysteryArt = API;
})(typeof window !== 'undefined' ? window : globalThis);
