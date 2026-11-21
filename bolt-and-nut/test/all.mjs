import { execFileSync } from 'child_process';
let ok = true;
const runs = [...Array.from({ length: 18 }, (_, i) => [`Shift ${i + 1}`, `l${i + 1}`]), ...[1, 2, 3, 4, 5, 6, 7, 8].map(k => [`Overtime ${k}`, `ot${k}`])];
for (const [name, f] of runs) {
  const out = execFileSync('node', [new URL(`./${f}.mjs`, import.meta.url).pathname], { stdio: ['ignore', 'pipe', 'ignore'] }).toString();
  const done = /complete true/.test(out); ok = ok && done;
  console.log(`${name}: ${done ? 'solved' : 'FAILED'}`);
}
process.exit(ok ? 0 : 1);
