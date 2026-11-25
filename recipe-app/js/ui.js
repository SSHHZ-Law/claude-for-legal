// Small building blocks shared by every screen: escaping, icons, dates, cards.
import { data } from './data.js';

export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const KINDS = {
  recipe: { path: 'recipes', label: 'Recipes', one: 'recipe', many: 'recipes', verb: 'I made this', did: 'made', have: 'made it', past: 'made it', hint: 'Things to cook' },
  sauce:  { path: 'rubs-and-sauces', label: 'Rubs & sauces', one: 'rub or sauce', many: 'rubs and sauces', verb: 'I made this', did: 'made', have: 'made it', past: 'made it', hint: 'What goes on before and after' },
  method: { path: 'methods', label: 'Methods', one: 'method', many: 'methods', verb: 'I tried this', did: 'tried', have: 'tried it', past: 'tried it', hint: 'Cut, heat, time and wood' },
  find:   { path: 'finds', label: 'Finds', one: 'find', many: 'finds', verb: 'I tried this', did: 'tried', have: 'tried it', past: 'tried it', hint: 'Things worth buying' },
  place:  { path: 'restaurants', label: 'Restaurants', one: 'restaurant', many: 'restaurants', verb: 'I went here', did: 'went to', have: 'been', past: 'went here', hint: 'Where to eat, city by city' },
};
export const KIND_ORDER = ['recipe', 'sauce', 'method', 'find', 'place'];
export const kindByPath = path => KIND_ORDER.find(k => KINDS[k].path === path);
// The word stamped on a card: "Recipe", "Rub", "Sauce", "Method", "Find", "Restaurant".
export const kindWord = e => e.kind === 'sauce' ? (e.type || 'Rub') : e.kind === 'place' ? 'Restaurant' : cap(KINDS[e.kind].one);
export const cap = s => s ? s[0].toUpperCase() + s.slice(1) : '';
export const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
export const list = names => names.length < 2 ? names.join('') : names.slice(0, -1).join(', ') + ' and ' + names.at(-1);

const P = {
  home: '<path d="M3.5 11 12 4l8.5 7v8.5a1 1 0 0 1-1 1h-5v-6h-5v6h-5a1 1 0 0 1-1-1z"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 5 5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  friends: '<circle cx="9" cy="9" r="3.2"/><path d="M3 19c.6-3.2 3-5 6-5s5.4 1.8 6 5"/><circle cx="17" cy="8" r="2.6"/><path d="M16.5 13.2c2.6.2 4.2 1.8 4.7 4.8"/>',
  user: '<circle cx="12" cy="8.5" r="3.5"/><path d="M5 20c.8-3.8 3.6-5.500 7-5.500s6.200 1.700 7 5.500"/>',
  back: '<path d="m15 5-7 7 7 7"/>',
  go: '<path d="m9 5 7 7-7 7"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  temp: '<path d="M10 14.5V5a2 2 0 1 1 4 0v9.5a4 4 0 1 1-4 0z"/><path d="M12 9v7"/>',
  pin: '<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
  log: '<ellipse cx="6.5" cy="12" rx="2.5" ry="4.5"/><path d="M6.5 7.5h10c1.700 0 3 2 3 4.500s-1.300 4.500-3 4.500h-10"/><path d="M11 10.500h4M12 13.500h3"/>',
  camera: '<path d="M4 8.500a2 2 0 0 1 2-2h1.500l1.500-2h6l1.500 2H18a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><circle cx="12" cy="12.500" r="3.500"/>',
  trash: '<path d="M4 7h16M9 7V4.500h6V7M6.500 7l1 12.500h9l1-12.500"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.700 0l3-3a4 4 0 0 0-5.700-5.700l-1 1"/><path d="M14 10a4 4 0 0 0-5.700 0l-3 3a4 4 0 0 0 5.700 5.700l1-1"/>',
};
export const icon = (n, size = 24, sw = 1.8) =>
  `<svg class="i" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]}</svg>`;

export const ring = (size = 30) => `<svg width="${size}" height="${size}" viewBox="0 0 30 30" aria-hidden="true"><circle cx="15" cy="15" r="12.5" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="15" cy="15" r="6.5" fill="none" stroke="var(--red-ink)" stroke-width="4"/></svg>`;

// "today", "yesterday", "Sunday", "Nov 12". Lower-case forms read inside a sentence.
export function day(iso) {
  const d = new Date(iso), n = new Date();
  const days = Math.round((new Date(n.getFullYear(), n.getMonth(), n.getDate()) - new Date(d.getFullYear(), d.getMonth(), d.getDate())) / 864e5);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return d.toLocaleDateString('en-US', { weekday: 'long' });
  return d.toLocaleDateString('en-US', d.getFullYear() === n.getFullYear() ? { month: 'short', day: 'numeric' } : { month: 'short', day: 'numeric', year: 'numeric' });
}
// "put this up today / yesterday / Sunday / on Nov 12"
export const onDay = iso => { const s = day(iso); return /^\w{3} \d/.test(s) ? 'on ' + s : s; };

export const avatar = (p, size = '') => `<span class="avatar ${size}" style="--c:${esc(p?.color || '#1E1410')}" aria-hidden="true">${esc(p?.name?.[0] || '?')}</span>`;
export const score = n => `<span class="score" role="img" aria-label="${n} out of 5"><b>${n}</b><small>of 5</small></span>`;

const hash = s => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
// Fit a title into a poster: the biggest size (in % of poster width) where every word fits
// on a line and the wrapped lines fit the height. Widths are measured with the real font,
// so words never break in the middle. `room` is the poster's height / width.
let pen;
const em = t => { pen ||= document.createElement('canvas').getContext('2d'); pen.font = '900 100px "Big Shoulders"'; return pen.measureText(t.toUpperCase()).width / 100; };
function fit(text, room) {
  const words = text.split(/\s+/).flatMap(w => w.split(/(?<=-)/)).filter(Boolean);
  const wide = words.map(em), gap = em(' '), W = 84, H = room * 100 - 12;
  for (let fs = 30; fs > 7; fs--) {
    if (Math.max(...wide) * fs > W) continue;
    let rows = 1, cur = 0;
    words.forEach((w, i) => {
      const lead = cur && !words[i - 1].endsWith('-') ? gap * fs : 0;
      if (cur && cur + lead + wide[i] * fs > W) { rows++; cur = wide[i] * fs; } else cur += lead + wide[i] * fs;
    });
    if (rows * fs * 0.88 <= H) return fs;
  }
  return 7;
}
// What an entry looks like with no photo. `mini` is for thumbnails: first word only.
export function poster(e, { room = 0.86, mini = false } = {}) {
  const text = mini ? e.title.split(/[\s,]+/)[0] : e.title;
  return `<div class="cover poster p${hash(e.id) % 3}"><span style="--fs:${fit(text, room)}cqw">${esc(text)}</span></div>`;
}
export const photoTag = (ph, ctx) => {
  const who = ph.credit || ctx.name(ph.by);
  return who ? `<span class="phototag">Photo: ${esc(who)}</span>` : '';
};
// An entry's picture: its first photo, or a type poster when it has none.
export function cover(e, ctx, { tag = false, room, mini } = {}) {
  const ph = e.photos?.[0];
  if (!ph) return poster(e, { room, mini });
  return `<div class="cover shot"><img src="${esc(data.photoUrl(ph.src))}" alt="" loading="lazy">${tag ? photoTag(ph, ctx) : ''}</div>`;
}

export function strip(e) {
  const bits = [];
  if (e.heat) bits.push(icon('temp', 20, 2.2) + esc(e.heat));
  if (e.time) bits.push(icon('clock', 20, 2.2) + esc(e.time));
  if (e.wood) bits.push(icon('log', 20, 2.2) + esc(e.wood));
  if (e.kind === 'place' && e.city) bits.push(icon('pin', 20, 2.2) + esc(e.city));
  return bits.length ? `<p class="strip">${bits.map(b => `<span>${b}</span>`).join('')}</p>` : '';
}

// "Priya and Dana have made it."
export function whoHas(e, verdicts, ctx) {
  const names = [...new Set(verdicts.filter(v => v.entryId === e.id).map(v => ctx.name(v.by)))];
  if (!names.length) return '';
  return ` ${list(names)} ${names.length > 1 ? 'have' : 'has'} ${KINDS[e.kind].have}.`;
}

export function ticket(e, ctx, { stamp, verdicts = [] } = {}) {
  return `<a class="ticket" href="#/e/${e.id}">${cover(e, ctx, { tag: true })}
  <div class="in">${stamp ? `<span class="stamp">${esc(stamp)}</span>` : ''}
    <h2>${esc(e.title)}</h2>${e.aka ? `<p class="aka">${esc(e.aka)}</p>` : ''}
    <p class="by">${avatar(ctx.person(e.by), 's')}<span><b>${esc(ctx.name(e.by))}</b> put this up ${onDay(e.at)}.${esc(whoHas(e, verdicts, ctx))}</span></p>
    ${strip(e)}
  </div></a>`;
}
export const slip = (e, ctx, { label } = {}) => `<a class="slip" href="#/e/${e.id}">${cover(e, ctx)}
  <div class="in"><p class="k">${esc(label || kindWord(e) + (e.kind === 'place' && e.city ? ', ' + e.city : ''))}</p><h3>${esc(e.title)}</h3><p class="from">from ${esc(ctx.name(e.by))}</p></div></a>`;

// One friend's rating and note. `entry` is passed on screens where the card needs to say what it is about.
export function verdictCard(v, ctx, { entry, past = 'made it', change = false } = {}) {
  const who = `<a href="#/p/${v.by}"><b>${esc(ctx.name(v.by))}</b></a>`;
  const what = entry
    ? `${who} ${KINDS[entry.kind].did} <a class="link" href="#/e/${entry.id}">${esc(entry.title)}</a>`
    : `${who} ${past}`;
  return `<div class="verdict"><p class="what">${what}</p>${score(v.rating)}${v.note ? `<q>${esc(v.note)}</q>` : ''}
  <p class="when">${cap(day(v.at))}${change ? ` <a class="mine" href="#/made/${v.entryId}">Change yours</a>` : ''}</p></div>`;
}

// "2 tbsp kosher salt" -> ["2 tbsp", "kosher salt"]; lines with no leading amount stay whole.
const QTY = /^((?:about\s+)?[\d¼½¾⅓⅔⅛.,\/–-]+(?:\s+(?:to|or)\s+[\d¼½¾⅓⅔⅛.\/]+)?(?:\s*(?:tbsp|tsp|cups?|oz|lbs?|g|kg|ml|l|quarts?|pints?|pinch(?:es)?|cloves?|cans?|sticks?|slices?|bunch(?:es)?|dash(?:es)?)\b\.?)?)\s+(.+)$/i;
export const splitQty = line => { const m = String(line).trim().match(QTY); return m ? [m[1], m[2]] : [null, String(line).trim()]; };

// Clean plain text for pasting into notes, a message, or a recipe manager.
export function toText(e, ctx) {
  const L = [e.title.toUpperCase()];
  if (e.aka) L.push(e.aka);
  L.push(`${kindWord(e)} from ${ctx.name(e.by)}, The Smoke Ring`, '');
  const fact = (k, v) => v && L.push(`${k}: ${v}`);
  fact('City', [e.area, e.city].filter(Boolean).join(', ')); fact('Order', e.order);
  fact('Maker', e.maker); fact('Price', e.price); fact('Where to buy', e.where);
  fact('Good on', e.goodOn); fact('Serves', e.serves);
  fact('Cut', e.cut); fact('Heat', e.heat); fact('Time', e.time); fact('Wood', e.wood); fact('Pull at', e.pullAt);
  fact('Link', e.link);
  if (L.at(-1) !== '') L.push('');
  if (e.note) L.push(`“${e.note}”`, '');
  if (e.ingredients?.length) L.push('INGREDIENTS', ...e.ingredients.map(i => '- ' + i), '');
  if (e.steps?.length) L.push(e.kind === 'method' ? 'STEPS' : 'METHOD', ...e.steps.map((s, i) => `${i + 1}. ${s}`), '');
  return L.join('\n').trim() + '\n';
}
