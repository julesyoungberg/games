import { execFileSync } from 'child_process';
let ok = true;
for (let l = 1; l <= 12; l++) {
  const out = execFileSync('node', [new URL(`./l${l}.mjs`, import.meta.url).pathname]).toString();
  const done = /complete true/.test(out); ok = ok && done;
  console.log(`Shift ${l}: ${done ? 'solved' : 'FAILED'}`);
}
process.exit(ok ? 0 : 1);
