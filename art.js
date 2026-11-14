/* Mystery Grid original artwork: hand-written SVG icons, scenes and characters.
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
    logo: `<circle cx="20" cy="20" r="13" fill="#fffaf3" ${st(2.6)}/><circle cx="20" cy="20" r="9.5" fill="#d6ecfb"/><path d="M29.5 29.5L42 42" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M29.5 29.5L42 42" stroke="#a88be0" stroke-width="3" stroke-linecap="round"/><path d="M20 27c-5-3.5-8-6-8-9.2C12 15.6 13.7 14 15.8 14c1.8 0 3.2 1 4.2 2.4 1-1.4 2.4-2.4 4.2-2.4 2.1 0 3.8 1.6 3.8 3.8 0 3.2-3 5.7-8 9.2Z" fill="#f4a3b5" ${st(1.6)}/><path d="M13 13c2-2 4-3 7-3" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`,
    bulb: `<path d="M24 5a13 13 0 0 0-8 23c2 2 3 4 3 6h10c0-2 1-4 3-6a13 13 0 0 0-8-23Z" fill="#fde07a" ${st()}/><path d="M19 38h10M20 42h8" ${st()}/><path d="M21 28c-1-4 1-6 3-6s4 2 3 6" fill="none" stroke="#e3b33f" stroke-width="1.6"/>`,
    knife: `<path d="M8 40L32 16c4-4 8-5 10-3s1 6-3 10L15 47Z" fill="#e3dfea" ${st()}/><path d="M8 40l7 7" ${st(2.6)}/><path d="M3 45l5-5 7 7-5 5Z" fill="#9a5f34" ${st()}/>`,
    siren: `<path d="M12 36V24a12 12 0 0 1 24 0v12Z" fill="#e8615a" ${st()}/><rect x="8" y="36" width="32" height="6" rx="2" fill="#6b5f86" ${st()}/><path d="M18 24a6 6 0 0 1 6-6" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><path d="M5 18l4 2M43 18l-4 2M24 4v5M10 8l3 4M38 8l-3 4" ${st()}/>`,
    trash: `<path d="M10 13h28l-3 30H13Z" fill="#e3dfea" ${st()}/><path d="M6 13h36M19 13V8h10v5" fill="none" ${st()}/><path d="M19 20v16M24 20v16M29 20v16" ${st(1.6)}/>`,
    phone: `<rect x="13" y="4" width="22" height="40" rx="4" fill="#a88be0" ${st()}/><rect x="16" y="9" width="16" height="27" rx="1" fill="#d6ecfb"/><circle cx="24" cy="40" r="1.6" fill="#fff"/><path d="M24 14v12M19 21l5 5 5-5" fill="none" ${st(2)}/>`,
    star: `<path d="M24 4l6 13 14 1.5-10.5 9.5 3 14L24 35l-12.5 7 3-14L4 18.5 18 17Z" fill="#f6c85f" ${st()}/>`,
    starOff: `<path d="M24 4l6 13 14 1.5-10.5 9.5 3 14L24 35l-12.5 7 3-14L4 18.5 18 17Z" fill="#e3dfea" ${st()}/>`,
    calendar: `<rect x="5" y="9" width="38" height="34" rx="5" fill="#fffaf3" ${st()}/><path d="M5 18h38" ${st()}/><path d="M5 14a5 5 0 0 1 5-5h28a5 5 0 0 1 5 5v4H5Z" fill="#f4a3b5" ${st()}/><path d="M15 5v8M33 5v8" ${st(2.6)}/><path d="M24 36c-4-3-7-5-7-8 0-2 1.5-3.5 3.5-3.5 1.6 0 2.8.9 3.5 2 .7-1.1 1.9-2 3.5-2 2 0 3.5 1.5 3.5 3.5 0 3-3 5-7 8Z" fill="#e8615a" ${st(1.4)}/>`,
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
    coin: `<circle cx="24" cy="24" r="19" fill="#f6c85f" ${st()}/><circle cx="24" cy="24" r="13.5" fill="none" stroke="#e3a92b" stroke-width="2.4"/><path d="M24 31c-4.6-3.2-7.2-5.4-7.2-8.2 0-2 1.5-3.4 3.4-3.4 1.6 0 2.9.9 3.8 2.2.9-1.3 2.2-2.2 3.8-2.2 1.9 0 3.4 1.4 3.4 3.4 0 2.8-2.6 5-7.2 8.2Z" fill="#fff3c4" ${st(1.4)}/>`,
    trophy: `<path d="M14 6h20v12a10 10 0 0 1-20 0Z" fill="#f6c85f" ${st()}/><path d="M14 9H7v3a7 7 0 0 0 7 7M34 9h7v3a7 7 0 0 1-7 7" fill="none" ${st()}/><path d="M21 28h6v7h-6Z" fill="#e3a92b" ${st()}/><rect x="14" y="35" width="20" height="8" rx="2" fill="#a88be0" ${st()}/><path d="M19 12l2 0M20 11v2" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`,
    trophyOff: `<path d="M14 6h20v12a10 10 0 0 1-20 0Z" fill="#e3dfea" ${st()}/><path d="M14 9H7v3a7 7 0 0 0 7 7M34 9h7v3a7 7 0 0 1-7 7" fill="none" ${st()}/><path d="M21 28h6v7h-6Z" fill="#d2ccdc" ${st()}/><rect x="14" y="35" width="20" height="8" rx="2" fill="#d2ccdc" ${st()}/>`,
    gift: `<rect x="6" y="20" width="36" height="23" rx="3" fill="#f4a3b5" ${st()}/><rect x="4" y="14" width="40" height="8" rx="2" fill="#f7bccb" ${st()}/><path d="M24 14v29" stroke="#a88be0" stroke-width="5"/><path d="M24 14v29" ${st(1.2)}/><path d="M24 14c-4-8-13-8-11-2 1 3 7 2 11 2Zm0 0c4-8 13-8 11-2-1 3-7 2-11 2Z" fill="#a88be0" ${st()}/>`,
    play: `<circle cx="24" cy="24" r="20" fill="#9ee6c9" ${st()}/><path d="M19 14l14 10-14 10Z" fill="#fff" ${st()}/>`,
    sound: `<path d="M6 18h8l10-8v28l-10-8H6Z" fill="#a88be0" ${st()}/><path d="M31 17c3 4 3 10 0 14M36 12c6 7 6 17 0 24" fill="none" ${st(2.6)}/>`,
    mute: `<path d="M6 18h8l10-8v28l-10-8H6Z" fill="#d2ccdc" ${st()}/><path d="M31 18l11 12M42 18L31 30" ${st(2.8)}/>`,
    medal: `<path d="M15 4h8l3 12h-8ZM33 4h-8l-3 12h8Z" fill="#8fd3f4" ${st(1.6)}/><circle cx="24" cy="30" r="13" fill="#f6c85f" ${st()}/><path d="M24 22l2.6 5.2 5.6.6-4.2 3.8 1.2 5.6L24 34.4l-5.2 2.8 1.2-5.6-4.2-3.8 5.6-.6Z" fill="#fff3c4" ${st(1.2)}/>`,
    map: `<path d="M5 10l12-4 14 5 12-4v31l-12 4-14-5-12 4Z" fill="#fff3c4" ${st()}/><path d="M17 6v31M31 11v31" ${st(1.6)}/><path d="M10 30c4-6 8 2 12-4s8-2 12-8" fill="none" stroke="#e8615a" stroke-width="2" stroke-dasharray="3 3" stroke-linecap="round"/><path d="M36 15l3 3m0-3l-3 3" stroke="#e8615a" stroke-width="2.4" stroke-linecap="round"/>`,
    sparkle: `<path d="M24 3c2 12 5 15 18 18-13 3-16 6-18 18-2-12-5-15-18-18C19 18 22 15 24 3Z" fill="#f6c85f" ${st(1.6)}/>`,
  };

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
    const blush = dead ? '' : `<ellipse cx="22.5" cy="35" rx="2.6" ry="1.6" fill="#f4a3b5" opacity=".75"/><ellipse cx="41.5" cy="35" rx="2.6" ry="1.6" fill="#f4a3b5" opacity=".75"/>`;
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
    floor: (themeId, z) => (FLOORS[themeId] || FLOORS.mansion)[z % 8],
  };
  root.MysteryArt = API;
})(typeof window !== 'undefined' ? window : globalThis);
