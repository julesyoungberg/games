import { execFileSync } from 'child_process';
let ok = true;
import { readdirSync } from 'fs';
// every level test in this folder: l<N>.mjs (shift files) and ot<N>.mjs (Overtime files)
const files = readdirSync(new URL('.', import.meta.url)).map(f => /^(l|ot)(\d+)\.mjs$/.exec(f)).filter(Boolean).sort((a, b) => a[1].localeCompare(b[1]) || a[2] - b[2]);
const runs = files.map(m => [`${m[1] === 'l' ? 'Shift file' : 'Overtime file'} ${m[2]}`, m[1] + m[2]]);
for (const [name, f] of runs) {
  const out = execFileSync('node', [new URL(`./${f}.mjs`, import.meta.url).pathname], { stdio: ['ignore', 'pipe', 'ignore'] }).toString();
  const done = /complete true/.test(out); ok = ok && done;
  console.log(`${name}: ${done ? 'solved' : 'FAILED'}`);
}
process.exit(ok ? 0 : 1);
