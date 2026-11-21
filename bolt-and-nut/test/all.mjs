import { execFileSync } from 'child_process';
let ok = true;
const runs = [...Array.from({ length: 14 }, (_, i) => [`Shift ${i + 1}`, `l${i + 1}`]), ['Overtime 4', 'ot4'], ['Overtime 5', 'ot5']];
for (const [name, f] of runs) {
  const out = execFileSync('node', [new URL(`./${f}.mjs`, import.meta.url).pathname], { stdio: ['ignore', 'pipe', 'ignore'] }).toString();
  const done = /complete true/.test(out); ok = ok && done;
  console.log(`${name}: ${done ? 'solved' : 'FAILED'}`);
}
process.exit(ok ? 0 : 1);
