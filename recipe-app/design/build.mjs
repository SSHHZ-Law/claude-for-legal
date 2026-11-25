// Builds the static direction mocks into ./directions/<name>/{home,detail}.html
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
const only = process.argv[2];
for (const k of ['a','b','c']) {
  if (only && only !== k) continue;
  if (!existsSync(new URL(`./src/${k}.mjs`, import.meta.url))) continue;
  const d = (await import(`./src/${k}.mjs`)).default;
  const out = new URL(`./directions/${d.dir}/`, import.meta.url);
  mkdirSync(out, { recursive: true });
  writeFileSync(new URL('home.html', out), d.home);
  writeFileSync(new URL('detail.html', out), d.detail);
  console.log('built', d.dir);
}
