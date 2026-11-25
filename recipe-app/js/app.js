// Boot, routing, and the handful of things that happen when you tap.
import { data } from './data.js';
import * as V from './views.js';
import { icon, toText, KINDS, cap } from './ui.js';

const view = document.getElementById('view'), tabs = document.getElementById('tabs'), toastEl = document.getElementById('toast');

const routes = [
  [/^\/?$/, V.home], [/^\/k\/([\w-]+)$/, V.list], [/^\/e\/([\w-]+)$/, V.detail],
  [/^\/add$/, V.addPick], [/^\/add\/(\w+)$/, V.form], [/^\/edit\/([\w-]+)$/, V.edit], [/^\/made\/([\w-]+)$/, V.made],
  [/^\/friends$/, V.friends], [/^\/p\/([\w-]+)$/, V.profile], [/^\/you$/, V.you], [/^\/who$/, V.who],
  [/^\/trash$/, V.trash], [/^\/search$/, V.search],
];
const path = () => location.hash.replace(/^#/, '') || '/';
const go = (to, replace) => replace ? location.replace('#' + to) : (location.hash = to);

async function context() {
  const [people, me] = await Promise.all([data.people(), data.me()]);
  const byId = Object.fromEntries(people.map(p => [p.id, p]));
  return { people, me, person: id => byId[id], name: id => byId[id]?.name || '' };
}
let ctx;

// ---- scroll memory, so Back returns you to where you were in a list
const trail = [], scrolls = new Map();
let shown = null;

async function render() {
  ctx = await context();
  const p = path();
  if (!ctx.me && p !== '/who') return go('/who', true);
  if (shown !== null) scrolls.set(shown, scrollY);
  const goingBack = trail.length > 1 && trail[trail.length - 2] === p;
  goingBack ? trail.pop() : (trail[trail.length - 1] !== p && trail.push(p));

  let out = V.missing();
  for (const [re, fn] of routes) { const m = p.match(re); if (m) { out = await fn(ctx, ...m.slice(1).map(decodeURIComponent)); break; } }
  view.innerHTML = out.html;
  view.className = out.bare ? 'bare' : '';
  document.title = out.title === 'The Smoke Ring' ? out.title : `${out.title} · The Smoke Ring`;
  tabs.hidden = !!out.bare;
  tabs.innerHTML = [['home', '/', 'Home', 'home'], ['search', '/search', 'Search', 'search'], ['add', '/add', 'Add', 'plus'], ['friends', '/friends', 'Friends', 'friends'], ['you', '/you', 'You', 'user']]
    .map(([id, to, label, ic]) => id === 'add'
      ? `<a class="tab add" href="#${to}" ${out.tab === id ? 'aria-current="page"' : ''}><b>${icon(ic, 32, 2.6)}</b>${label}</a>`
      : `<a class="tab" href="#${to}" ${out.tab === id ? 'aria-current="page"' : ''}>${icon(ic)}${label}</a>`).join('');
  shown = p;
  scrollTo(0, goingBack ? (scrolls.get(p) || 0) : 0);
  view.focus({ preventScroll: true });
}

// ---- toast
let toastTimer;
function toast(text, undo) {
  toastEl.innerHTML = `<span>${text}</span>${undo ? '<button type="button">Undo</button>' : ''}`;
  toastEl.hidden = false;
  if (undo) toastEl.querySelector('button').onclick = async () => { toastEl.hidden = true; await undo(); };
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toastEl.hidden = true), undo ? 7000 : 3500);
}

async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch { /* fall through to the old way */ }
  const t = Object.assign(document.createElement('textarea'), { value: text });
  t.style.cssText = 'position:fixed;opacity:0'; document.body.append(t); t.select();
  const ok = document.execCommand('copy'); t.remove(); return ok;
}
function applyTheme(t) { t === 'auto' ? delete document.documentElement.dataset.theme : (document.documentElement.dataset.theme = t); }

// ---- taps
const actions = {
  back() { history.length > 1 && trail.length > 1 ? history.back() : go('/'); },
  async copy(el) {
    const e = await data.entry(el.dataset.id);
    toast(await copyText(toText(e, ctx)) ? 'Copied as text' : 'Couldn’t copy. Your browser blocked the clipboard.');
  },
  async trash(el) {
    const id = el.dataset.id;
    if (!(await data.trashEntry(id, ctx.me.id))) return toast('Only the person who added this can trash it.');
    go('/', true);
    toast('Moved to trash', async () => { await data.restoreEntry(id); toast('Restored'); render(); });
  },
  async restore(el) { await data.restoreEntry(el.dataset.id); toast('Restored'); render(); },
  async 'pick-me'(el) { await data.setMe(el.dataset.id); go('/', true); if (path() === '/') render(); },
  async theme() {
    const next = { auto: 'light', light: 'dark', dark: 'auto' }[await data.theme()];
    await data.setTheme(next); applyTheme(next); render();
  },
};
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-action]');
  if (el && actions[el.dataset.action]) { ev.preventDefault(); actions[el.dataset.action](el); }
});

// ---- inputs that react as you go
document.addEventListener('change', async ev => {
  const el = ev.target, kind = el.dataset?.change;
  if (kind === 'rate') document.getElementById('rate-word').textContent = V.WORDS[el.value];
  if (kind === 'preview' && el.files[0]) {
    const box = el.closest('.pick');
    box.classList.add('has');
    [...box.childNodes].forEach(n => n !== el && n.remove());
    box.insertAdjacentHTML('beforeend', `<img src="${URL.createObjectURL(el.files[0])}" alt=""><b>Change photo</b>`);
  }
  if (kind === 'add-photo' && el.files[0]) {
    try { await data.addPhotoToEntry(el.dataset.id, await data.addPhoto(el.files[0], ctx.me.id)); toast('Photo added'); render(); }
    catch { toast('That photo couldn’t be read. Try another.'); }
  }
});
document.addEventListener('input', async ev => {
  if (ev.target.dataset?.input === 'search') document.getElementById('results').innerHTML = await V.searchResults(ctx, ev.target.value);
});

// ---- forms
const linesOf = s => String(s || '').split('\n').map(l => l.replace(/^\s*(?:[-*•]|\d+[.)])\s+/, '').trim()).filter(Boolean);
document.addEventListener('submit', async ev => {
  const form = ev.target.closest('[data-form]');
  if (!form) return;
  ev.preventDefault();
  const fd = new FormData(form), get = k => String(fd.get(k) || '').trim();
  const file = fd.get('photo'), hasFile = file && file.size > 0;
  const button = form.querySelector('[type=submit]');

  if (form.dataset.form === 'entry') {
    const first = form.querySelector('[required]:invalid') || [...form.querySelectorAll('[required]')].find(i => !i.value.trim());
    if (first) { first.focus(); return toast(`Add a ${first.name === 'title' ? 'name' : first.name} first.`); }
    const kind = form.dataset.kind, old = form.dataset.id ? await data.entry(form.dataset.id) : null;
    const e = { ...(old || { kind, by: ctx.me.id }), title: get('title'), note: get('note') };
    for (const k of ['aka', 'serves', 'cut', 'heat', 'time', 'wood', 'pullAt', 'goodOn', 'type', 'maker', 'price', 'where', 'link', 'city', 'area', 'order']) if (fd.has(k)) e[k] = get(k);
    for (const k of ['ingredients', 'steps']) if (fd.has(k)) e[k] = linesOf(fd.get(k));
    if (e.link && !/^https?:\/\//i.test(e.link)) e.link = 'https://' + e.link;
    button.disabled = true;
    try {
      if (hasFile) e.photos = [await data.addPhoto(file, ctx.me.id), ...(old?.photos || []).slice(1)];
      const saved = await data.saveEntry(e);
      go('/e/' + saved.id, true);
      toast(`${cap(KINDS[kind].one)} saved`);
    } catch { button.disabled = false; toast('That didn’t save. Try again, or try a smaller photo.'); }
  }

  if (form.dataset.form === 'made') {
    const rating = Number(fd.get('rating'));
    if (!rating) { form.querySelector('[name=rating]').focus(); return toast('Pick a rating from 1 to 5 first.'); }
    button.disabled = true;
    try {
      await data.saveVerdict({ entryId: form.dataset.id, by: ctx.me.id, rating, note: get('note') });
      if (hasFile) await data.addPhotoToEntry(form.dataset.id, await data.addPhoto(file, ctx.me.id));
      go('/e/' + form.dataset.id, true);
      toast('Verdict saved');
    } catch { button.disabled = false; toast('That didn’t save. Try again.'); }
  }
});

// ---- go
addEventListener('hashchange', render);
(async () => {
  await data.init();
  applyTheme(await data.theme());
  try { await document.fonts.load('900 20px "Big Shoulders"'); } catch { /* posters fall back to estimated sizes */ }
  await render();
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
})();
