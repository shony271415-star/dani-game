/* Builds the single-file playable ad: node tools/promo/make-playable.js [store-url]
   Output: promo/crime-grid-playable.html (everything inlined: no external requests, as ad networks require) */
'use strict';
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..', '..');
let html = fs.readFileSync(path.join(__dirname, 'playable.html'), 'utf8');
const fonts = [
  ['Playfair Display', 900, 'playfair-display-latin-900-normal'], ['Oswald', 600, 'oswald-latin-600-normal'],
  ['Quicksand', 700, 'quicksand-latin-700-normal'], ['Courier Prime', 700, 'courier-prime-latin-700-normal'],
  ['Special Elite', 400, 'special-elite-latin-400-normal'], ['Fredoka', 600, 'fredoka-latin-600-normal'],
];
const css = fonts.map(([f, w, file]) => `@font-face{font-family:"${f}";font-weight:${w};src:url(data:font/woff2;base64,${fs.readFileSync(path.join(root, 'tools/fonts', file + '.woff2')).toString('base64')}) format("woff2")}`).join('\n');
html = html.replace('<!--FONTS-->', `<style>${css}</style>`);
const js = ['engine.js', 'art.js'].map((f) => `<script>${fs.readFileSync(path.join(root, f), 'utf8').replace(/<\/script/gi, '<\\/script')}</script>`).join('\n');
html = html.replace('<!--SCRIPTS-->', js);
if (process.argv[2]) html = html.replace(/var STORE_URL = '[^']*';/, `var STORE_URL = ${JSON.stringify(process.argv[2])};`);
const out = path.join(root, 'promo', 'crime-grid-playable.html');
fs.writeFileSync(out, html);
console.log('wrote', out, (html.length / 1024).toFixed(0) + ' KB');
