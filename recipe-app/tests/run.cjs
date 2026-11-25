// Runs every browser test in turn. Run: node tests/run.cjs
const { spawnSync } = require('child_process'); const path = require('path');
let failed = 0;
for (const t of ['flow', 'private', 'notes', 'comments']) {
  const r = spawnSync(process.execPath, [path.join(__dirname, t + '.cjs')], { encoding: 'utf8' });
  const out = r.stdout + r.stderr, fails = out.split('\n').filter(l => l.startsWith('FAIL'));
  console.log(out.trim().split('\n').slice(-2).join('\n')); fails.forEach(l => console.log('  ' + l));
  if (r.status) failed++;
}
console.log(failed ? `\n${failed} test file(s) failed` : '\nall test files passed'); process.exitCode = failed ? 1 : 0;
