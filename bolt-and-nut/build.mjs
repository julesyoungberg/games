import { build } from 'esbuild';
import fs from 'fs';
const r = await build({ entryPoints: ['src/main.js'], bundle: true, minify: true, format: 'iife', write: false, target: 'chrome110', legalComments: 'none' });
const js = r.outputFiles[0].text.replace(/<\/script/g, '<\\/script');
// fonts are embedded so the game works offline (desktop app, saved page)
const font = (fam, file, wt) => `@font-face{font-family:'${fam}';font-weight:${wt};font-style:normal;font-display:block;src:url(data:font/woff2;base64,${fs.readFileSync('node_modules/@fontsource/' + file).toString('base64')}) format('woff2');}`;
const fonts = [font('Fredoka', 'fredoka/files/fredoka-latin-600-normal.woff2', 600), font('Fredoka', 'fredoka/files/fredoka-latin-700-normal.woff2', 700),
  font('Nunito', 'nunito/files/nunito-latin-700-normal.woff2', 700), font('Nunito', 'nunito/files/nunito-latin-800-normal.woff2', 800)].join('\n');
const html = fs.readFileSync('src/template.html', 'utf8').replace('/*FONTS*/', () => fonts).replace('/*GAME*/', () => js);
fs.mkdirSync('dist', { recursive: true });
fs.writeFileSync('dist/index.html', html);
console.log('dist/index.html', (html.length / 1024).toFixed(0), 'KB');
