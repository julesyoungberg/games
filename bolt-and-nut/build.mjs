import { build } from 'esbuild';
import fs from 'fs';
const r = await build({ entryPoints: ['src/main.js'], bundle: true, minify: true, format: 'iife', write: false, target: 'chrome110', legalComments: 'none' });
const js = r.outputFiles[0].text.replace(/<\/script/g, '<\\/script');
const html = fs.readFileSync('src/template.html', 'utf8').replace('/*GAME*/', () => js);
fs.mkdirSync('dist', { recursive: true });
fs.writeFileSync('dist/index.html', html);
console.log('dist/index.html', (html.length / 1024).toFixed(0), 'KB');
