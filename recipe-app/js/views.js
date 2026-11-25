// Every screen. Each function takes the shared context ({ me, people, person(id), name(id) })
// and returns { html, title, tab, bare }. `bare` screens hide the tab bar (forms, the name picker).
import { data } from './data.js';
import { esc, cap, plural, list as listNames, icon, ring, day, onDay, avatar, cover, poster, photoTag, strip, ticket, slip,
  verdictCard, splitQty, KINDS, KIND_ORDER, kindByPath, kindWord, noteCard, today } from './ui.js';

const backBar = (label = 'Back', right = '') => `<header class="bar"><button class="ib" data-action="back" aria-label="${label}">${icon('back')}</button><div>${right}</div></header>`;
const pair = (entries, ctx, label) => entries.length ? `<div class="pair">${entries.map(e => slip(e, ctx, { label: label?.(e) })).join('')}</div>` : '';
const empty = (title, text, href, cta) => `<div class="empty"><b>${title}</b>${text}${href ? `<a class="btn pri" href="${href}">${cta}</a>` : ''}</div>`;

// ---------------------------------------------------------------- home
export async function home(ctx) {
  const [all, verdicts] = await Promise.all([data.entries(), data.verdicts()]);
  const byId = Object.fromEntries(all.map(e => [e.id, e]));
  const [first, ...rest] = all;
  const weekAgo = new Date(Date.now() - 7 * 864e5).toISOString();
  const fresh = rest.filter(e => e.at > weekAgo).length;

  const lines = KIND_ORDER.map(k => {
    const of = all.filter(e => e.kind === k), K = KINDS[k];
    let sub = K.hint;
    if (k === 'place' && of.length) {
      const count = {}; of.forEach(e => count[e.city || 'Elsewhere'] = (count[e.city || 'Elsewhere'] || 0) + 1);
      sub = Object.keys(count).sort((a, b) => count[b] - count[a]).join(', ');
    } else if (of[0]) sub = `Newest: ${of[0].title}, from ${ctx.name(of[0].by)}`;
    return `<a class="line" href="#/k/${K.path}"><b>${esc(K.label)}</b><i></i><em>${of.length}</em><p>${esc(sub)}</p></a>`;
  }).join('');

  const html = `
<header class="top"><h1 class="mark">${ring()}The Smoke Ring</h1><a href="#/you" aria-label="Your page">${avatar(ctx.me)}</a></header>
${first ? ticket(first, ctx, { stamp: 'New ' + kindWord(first).toLowerCase(), verdicts }) : empty('Nothing here yet', 'Add the first recipe, rub, method, find or restaurant.', '#/add', 'Add something')}
${rest.length ? `<h2 class="head">Also fresh ${fresh > 4 ? `<small>${fresh} more this week</small>` : ''}</h2>${pair(rest.slice(0, 4), ctx)}` : ''}
<nav class="board" aria-label="Kinds"><h2>The board</h2>${lines}</nav>
${verdicts.length ? `<h2 class="head">Verdicts</h2>${verdicts.slice(0, 4).map(v => verdictCard(v, ctx, { entry: byId[v.entryId] })).join('')}` : ''}`;
  return { html, title: 'The Smoke Ring', tab: 'home' };
}

// ---------------------------------------------------------------- list, one per kind
const pitrow = (e, ctx) => `<a class="pitrow" href="#/e/${e.id}">${cover(e, ctx, { room: 1.25 })}<div class="in"><h3>${esc(e.title)}</h3><p class="from">from ${esc(ctx.name(e.by))}</p>${strip(e)}</div></a>`;
const placerow = (e, ctx) => `<a class="pitrow" href="#/e/${e.id}">${cover(e, ctx, { room: 1.25 })}<div class="in">${e.area ? `<p class="k">${esc(e.area)}</p>` : ''}<h3>${esc(e.title)}</h3><p class="from">from ${esc(ctx.name(e.by))}</p>${e.order ? `<p class="order">${esc(e.order)}</p>` : ''}</div></a>`;
const groups = (entries, key, order) => {
  const g = {}; entries.forEach(e => (g[key(e)] ||= []).push(e));
  return Object.keys(g).sort(order ? (a, b) => order.indexOf(a) - order.indexOf(b) : (a, b) => g[b].length - g[a].length || a.localeCompare(b)).map(k => [k, g[k]]);
};

export async function list(ctx, path) {
  const kind = kindByPath(path);
  if (!kind) return missing();
  const K = KINDS[kind], entries = await data.entries({ kind });
  const friends = new Set(entries.map(e => e.by)).size;
  let body;
  if (!entries.length) body = empty(`No ${K.many} yet`, `Add the first one. It takes about a minute.`, `#/add/${kind}`, `Add a ${K.one}`);
  else if (kind === 'method') body = entries.map(e => pitrow(e, ctx)).join('');
  else if (kind === 'place') body = groups(entries, e => e.city || 'Elsewhere').map(([city, es]) =>
    `<h2 class="city">${esc(city)} <small>${plural(es.length, 'place', 'places')}</small></h2>${es.map(e => placerow(e, ctx)).join('')}`).join('');
  else if (kind === 'sauce') body = groups(entries, e => e.type || 'Rub', ['Rub', 'Sauce']).map(([type, es]) =>
    `<h2 class="city">${esc(type)}s <small>${es.length}</small></h2>${pair(es, ctx, e => e.goodOn ? 'For ' + e.goodOn[0].toLowerCase() + e.goodOn.slice(1) : e.type)}`).join('');
  else body = ticket(entries[0], ctx) + (entries.length > 1 ? `<div style="height:12px"></div>` + pair(entries.slice(1), ctx) : '');

  const html = `${backBar('Back')}
<h1 class="title">${esc(K.label)}</h1>
<p class="lede">${entries.length ? `${plural(entries.length, K.one, K.many)} from ${plural(friends, 'friend', 'friends')}` : esc(K.hint)}</p>
${body}`;
  return { html, title: K.label };
}

// ---------------------------------------------------------------- detail
export async function detail(ctx, id) {
  const e = await data.entry(id);
  if (!e) return missing();
  const verdicts = await data.verdicts({ entryId: id });
  const K = KINDS[e.kind], mine = verdicts.find(v => v.by === ctx.me.id), owner = e.by === ctx.me.id;
  const author = ctx.person(e.by);

  const pit = [['Cut', e.cut], ['Heat', e.heat], ['Time', e.time], ['Wood', e.wood], ['Pull at', e.pullAt]].filter(f => f[1]);
  const facts = [['Serves', e.ingredients?.length ? '' : e.serves], ['Good on', e.goodOn], ['Maker', e.maker], ['Price', e.price], ['Where to buy', e.where],
    ['City', e.city], ['Neighborhood', e.area], ['What to order', e.order]].filter(f => f[1]);
  const extra = (e.photos || []).slice(1);
  const addPhoto = `<input class="vh" type="file" accept="image/*" data-change="add-photo" data-id="${e.id}">`;

  const html = `
${e.trashedAt ? `<div class="banner"><p>This is in the trash. ${esc(ctx.name(e.trashedBy))} moved it there ${onDay(e.trashedAt)}. Anyone can restore it.</p><button class="btn" data-action="restore" data-id="${e.id}">Restore</button></div>` : ''}
<div class="photo">${e.photos?.[0]
    ? `<div class="cover shot"><img src="${esc(data.photoUrl(e.photos[0].src))}" alt="">${photoTag(e.photos[0], ctx)}</div>`
    : poster(e, { room: 0.7 })}
  <button class="ib l" data-action="back" aria-label="Back">${icon('back')}</button>
  <button class="ib r" data-action="copy" data-id="${e.id}" aria-label="Copy as text">${icon('copy')}</button></div>
<article class="ticket card"><div class="in">
  <span class="stamp">${esc(kindWord(e))}</span>
  <h1 class="${e.title.length > 24 ? 'long' : ''}">${esc(e.title)}</h1>
  ${e.aka ? `<p class="aka">${esc(e.aka)}</p>` : ''}
  <p class="by"><a href="#/p/${e.by}">${avatar(author, 's')}</a><span><a href="#/p/${e.by}"><b>${esc(ctx.name(e.by))}</b></a> put this up ${onDay(e.at)}</span></p>
  ${pit.length ? `<dl class="pit">${pit.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` : ''}
  ${facts.length ? `<dl class="facts">${facts.map(([k, v]) => `<div class="${String(v).length > 20 ? 'long' : ''}"><dt>${k}</dt><i></i><dd>${esc(v)}</dd></div>`).join('')}</dl>` : ''}
  ${e.note ? `<p class="headnote">“${esc(e.note)}”<cite>${esc(ctx.name(e.by))}</cite></p>` : ''}
  ${e.link ? `<p style="margin-top:16px"><a class="link" href="${esc(e.link)}" target="_blank" rel="noopener">${e.kind === 'place' ? 'Open their website' : 'Open the link'}</a></p>` : ''}
</div></article>

${e.trashedAt ? '' : `<div class="stack">
  <a class="btn pri" href="#/made/${e.id}">${mine ? 'Change my verdict' : K.verb}</a>
  <div class="half"><button class="btn" data-action="copy" data-id="${e.id}">${icon('copy', 20, 2.2)}Copy as text</button>
  <label class="btn">${addPhoto}${icon('camera', 20, 2.2)}Add a photo</label></div>
</div>`}

${extra.length ? `<h2 class="head">More photos</h2><div class="more">${extra.map(ph => `<div class="shot"><img src="${esc(data.photoUrl(ph.src))}" alt="" loading="lazy">${photoTag(ph, ctx)}</div>`).join('')}
</div>` : ''}

${e.ingredients?.length ? `<section class="sheet" style="margin-top:28px"><h2>Ingredients ${e.serves ? `<small>Serves ${esc(e.serves)}</small>` : ''}</h2>
  <ul class="ing">${e.ingredients.map(line => { const [q, t] = splitQty(line); return q ? `<li><span>${esc(cap(t))}</span><i></i><b>${esc(q)}</b></li>` : `<li class="plain">${esc(cap(t))}</li>`; }).join('')}</ul></section>` : ''}
${e.steps?.length ? `<section class="sheet" ${e.ingredients?.length ? '' : 'style="margin-top:28px"'}><h2>${e.kind === 'method' ? 'Steps' : 'Method'}</h2>
  <ol class="steps">${e.steps.map(s => `<li><span>${esc(s)}</span></li>`).join('')}</ol></section>` : ''}

<h2 class="head">Verdicts ${verdicts.length ? `<small>${plural(verdicts.length, 'friend', 'friends')} ${K.have === 'been' ? (verdicts.length > 1 ? 'have been' : 'has been') : K.past}</small>` : ''}</h2>
${verdicts.length ? verdicts.map(v => verdictCard(v, ctx, { past: K.past, change: v.by === ctx.me.id })).join('')
    : `<p class="lede" style="margin-top:0">Nobody has weighed in yet. Ratings show up here under each friend’s name.</p>`}

${owner && !e.trashedAt ? `<div class="owner"><a class="btn small" href="#/edit/${e.id}">Edit</a><button class="btn small" data-action="trash" data-id="${e.id}">Move to trash</button></div>` : ''}`;
  return { html, title: e.title };
}

// ---------------------------------------------------------------- add and edit
export async function addPick(ctx) {
  const from = ctx.query.from ? await data.note(ctx.query.from, ctx.me.id) : null;
  const q = from ? `?from=${from.id}` : '';
  const say = { recipe: 'Ingredients and a method', sauce: 'Goes on before or after the fire', method: 'Cut, heat, time and wood', find: 'Something worth buying, with a link', place: 'Somewhere worth going' };
  const html = `${backBar('Back')}
<h1 class="title">${from ? 'Share with the group' : 'Add something'}</h1>
<p class="lede" style="margin-bottom:0">${from ? `What should “${esc(from.title || 'this note')}” become? You can tidy it up before anyone sees it.` : 'What is it?'}</p>
<nav class="choose" aria-label="Kinds">${KIND_ORDER.map(k => `<a href="#/add/${k}${q}"><span><b>${esc(cap(KINDS[k].one))}</b><small>${say[k]}</small></span>${icon('go', 28, 2.4)}</a>`).join('')}</nav>
${from ? '' : `<div class="stack"><a class="btn" href="#/note/new">${icon('lock', 22, 2.2)}A private note</a></div>
<p class="lede" style="margin-top:10px">A private note goes in your notebook. Only you see it, and you can share it with the group later.</p>`}`;
  return { html, title: from ? 'Share with the group' : 'Add something', tab: from ? 'you' : 'add' };
}

const f = (name, label, v, { ph = '', hint = '', area = false, big = false, type = 'text', req = false, mode = '' } = {}) =>
  `<label class="field${big ? ' big' : ''}"><span>${label}${hint ? ` <i>${hint}</i>` : ''}</span>${area
    ? `<textarea name="${name}" placeholder="${esc(ph)}">${esc(v ?? '')}</textarea>`
    : `<input name="${name}" type="${type}" value="${esc(v ?? '')}" placeholder="${esc(ph)}" ${req ? 'required' : ''} ${mode ? `inputmode="${mode}"` : ''} autocomplete="off" ${big ? 'autocapitalize="sentences"' : ''}>`}</label>`;
const lines = v => (v || []).join('\n');
const pitFields = e => `<div class="two">${f('cut', 'Cut', e.cut, { ph: 'Chuck, 3–4 lb' })}${f('heat', 'Heat', e.heat, { ph: '250°F' })}${f('time', 'Time', e.time, { ph: '6–7 hr' })}${f('wood', 'Wood', e.wood, { ph: 'Post oak' })}</div>`;

function fields(e) {
  switch (e.kind) {
    case 'recipe': return f('aka', 'In a few words', e.aka, { ph: 'The poor man’s brisket', hint: 'Optional' })
      + f('ingredients', 'Ingredients', lines(e.ingredients), { area: true, hint: 'One per line', ph: '2 tbsp kosher salt\n1 chuck roast' })
      + f('steps', 'Method', lines(e.steps), { area: true, hint: 'One step per line', ph: 'Salt the roast the night before.' })
      + pitFields(e) + f('serves', 'Serves', e.serves, { ph: '6', mode: 'numeric' })
      + f('note', 'Your note', e.note, { area: true, hint: 'Shown under your name', ph: 'What makes it work?' });
    case 'sauce': return `<div class="seg" role="radiogroup" aria-label="Rub or sauce">${['Rub', 'Sauce'].map(t => `<label><input type="radio" name="type" value="${t}" ${(e.type || 'Rub') === t ? 'checked' : ''}><span>${t}</span></label>`).join('')}</div>`
      + f('goodOn', 'Good on', e.goodOn, { ph: 'Brisket, chuck, beef ribs' })
      + f('ingredients', 'Ingredients', lines(e.ingredients), { area: true, hint: 'One per line', ph: '2 tbsp kosher salt' })
      + f('steps', 'Method', lines(e.steps), { area: true, hint: 'One step per line', ph: 'Mix everything and keep it in a jar.' })
      + f('note', 'Your note', e.note, { area: true, hint: 'Shown under your name', ph: 'Anything to watch for?' });
    case 'method': return pitFields(e) + f('pullAt', 'Pull at', e.pullAt, { ph: '203°F, or when it probes like butter' })
      + f('steps', 'Steps', lines(e.steps), { area: true, hint: 'One per line', ph: 'Fat side up at 250°F.' })
      + f('note', 'Your note', e.note, { area: true, hint: 'Shown under your name', ph: 'Why this way?' });
    case 'find': return f('link', 'Link', e.link, { type: 'url', ph: 'https://', mode: 'url' })
      + f('maker', 'Who makes it', e.maker, { ph: 'Brand or maker' })
      + `<div class="two">${f('price', 'Price', e.price, { ph: '$9 a tin' })}${f('where', 'Where to buy', e.where, { ph: 'Online' })}</div>`
      + f('note', 'Why it’s worth buying', e.note, { area: true, ph: 'What do you do with it?' });
    case 'place': return `<div class="two">${f('city', 'City', e.city, { ph: 'Austin', req: true })}${f('area', 'Neighborhood', e.area, { ph: 'East side' })}</div>`
      + f('order', 'What to order', e.order, { ph: 'Beef rib, jalapeño sausage' })
      + f('link', 'Link', e.link, { type: 'url', ph: 'https://', mode: 'url' })
      + f('note', 'What to know before going', e.note, { area: true, ph: 'Lines, hours, cash only?' });
  }
}

function formView(e, isNew, fromNote) {
  const K = KINDS[e.kind], ph = e.photos?.[0];
  const html = `${backBar('Cancel')}
<h1 class="title" style="font-size:50px">${fromNote ? 'Share a ' + esc(K.one) : isNew ? 'Add a ' + esc(K.one) : 'Edit ' + esc(K.one)}</h1>
<p class="lede">${fromNote ? 'Started from your notebook. The group sees what you save here; your note stays private.' : 'Only the name is required. Fill in the rest now or come back to it.'}</p>
<form data-form="entry" data-kind="${e.kind}" ${isNew ? '' : `data-id="${e.id}"`} ${fromNote ? `data-from="${fromNote}"` : ''} novalidate>
  ${f('title', 'Name', e.title, { big: true, req: true, ph: e.kind === 'place' ? 'Name of the place' : 'What is it called?' })}
  <label class="pick${ph ? ' has' : ''}"><input type="file" name="photo" accept="image/*" data-change="preview">${ph
    ? `<img src="${esc(data.photoUrl(ph.src))}" alt=""><b>Change photo</b>`
    : `${icon('camera', 30, 2)}<span>Add a photo<small>Your name goes on it</small></span>`}</label>
  ${fields(e)}
  <div class="savebar"><button class="btn pri" type="submit">${fromNote ? 'Share' : 'Save'} ${esc(K.one)}</button></div>
</form>`;
  return { html, title: isNew ? 'Add a ' + K.one : 'Edit', bare: true };
}
export async function form(ctx, kind) {
  if (!KINDS[kind]) return missing();
  const n = ctx.query.from ? await data.note(ctx.query.from, ctx.me.id) : null;
  if (!n) return formView({ kind, photos: [] }, true);
  return formView({ kind, title: n.title, note: n.text, cut: n.cut, heat: n.heat, time: n.time, wood: n.wood, photos: n.photo ? [n.photo] : [] }, true, n.id);
}
export async function edit(ctx, id) {
  const e = await data.entry(id);
  if (!e || e.by !== ctx.me.id) return missing('Only the person who added this can edit it.');
  return formView(e, false);
}

// ---------------------------------------------------------------- "I made this / tried this / went here"
export const WORDS = ['', 'Not for me', 'Just okay', 'Good', 'Really good', 'Outstanding'];
export async function made(ctx, id) {
  const e = await data.entry(id);
  if (!e) return missing();
  const K = KINDS[e.kind];
  const mine = (await data.verdicts({ entryId: id, by: ctx.me.id }))[0];
  const html = `${backBar('Cancel')}
<h1 class="title">${esc(K.verb)}</h1>
<div class="about">${cover(e, ctx, { mini: true, room: 1 })}<div><b>${esc(e.title)}</b><small>${esc(kindWord(e))} from ${esc(ctx.name(e.by))}</small></div></div>
<form data-form="made" data-id="${e.id}" novalidate>
  <div class="block"><p class="legend" id="rl"><span>How was it?</span><i>Shown under your name</i></p>
    <fieldset class="rate" aria-labelledby="rl">${[1, 2, 3, 4, 5].map(n => `<label><input type="radio" name="rating" value="${n}" data-change="rate" aria-label="${n} out of 5, ${WORDS[n]}" ${mine?.rating === n ? 'checked' : ''}><span>${n}</span></label>`).join('')}</fieldset>
    <p class="rate-word" id="rate-word" aria-live="polite">${mine ? WORDS[mine.rating] : ''}</p></div>
  ${f('note', 'Your note', mine?.note, { area: true, hint: 'Optional', ph: e.kind === 'place' ? 'What should we order?' : 'What would you change next time?' })}
  <label class="pick"><input type="file" name="photo" accept="image/*" data-change="preview">${icon('camera', 30, 2)}<span>Add your photo<small>Optional. Your name goes on it.</small></span></label>
  <div class="savebar"><button class="btn pri" type="submit">Save my verdict</button></div>
</form>`;
  return { html, title: K.verb, bare: true };
}

// ---------------------------------------------------------------- people
const tally = (added, verdicts) => [added ? `${plural(added, 'thing', 'things')} added` : '', verdicts ? plural(verdicts, 'verdict', 'verdicts') : ''].filter(Boolean).join(', ') || 'Nothing added yet';

export async function friends(ctx) {
  const [entries, verdicts] = await Promise.all([data.entries(), data.verdicts()]);
  const cards = ctx.people.map(p => `<a class="pcard" href="${p.id === ctx.me.id ? '#/you' : '#/p/' + p.id}">${avatar(p, 'l')}<span><b>${esc(p.name)}${p.id === ctx.me.id ? ' (you)' : ''}</b><small>${esc(p.about)}</small><small class="tally">${tally(entries.filter(e => e.by === p.id).length, verdicts.filter(v => v.by === p.id).length)}</small></span></a>`).join('');
  return { html: `${backBar()}<h1 class="title">Friends</h1><p class="lede">${plural(ctx.people.length, 'person', 'people')} around the fire</p>${cards}`, title: 'Friends', tab: 'friends' };
}

async function personBody(ctx, p, extra = '') {
  const [entries, verdicts, all] = await Promise.all([data.entries({ by: p.id }), data.verdicts({ by: p.id }), data.entries()]);
  const byId = Object.fromEntries(all.map(e => [e.id, e]));
  const you = p.id === ctx.me.id;
  return `<div class="hero">${avatar(p, 'l')}<h1 class="title">${esc(p.name)}</h1><p>${esc(p.about)}</p><p class="tally">${tally(entries.length, verdicts.length)}</p></div>
${extra}
<h2 class="head">${you ? 'You added' : 'Added by ' + esc(p.name)}</h2>
${entries.length ? pair(entries, ctx) : `<p class="lede">${you ? 'Nothing yet. The red button adds your first.' : 'Nothing yet.'}</p>`}
<h2 class="head">${you ? 'Your verdicts' : esc(p.name) + '’s verdicts'}</h2>
${verdicts.length ? verdicts.map(v => verdictCard(v, ctx, { entry: byId[v.entryId] })).join('') : `<p class="lede">None yet.</p>`}`;
}
export async function profile(ctx, id) {
  const p = ctx.person(id);
  if (!p) return missing();
  return { html: backBar() + await personBody(ctx, p), title: p.name, tab: 'friends' };
}
export async function you(ctx) {
  const [theme, trashed, notes] = await Promise.all([data.theme(), data.trashed(), data.notes(ctx.me.id)]);
  const book = `<h2 class="head">Your notebook <small class="only">${icon('lock', 16, 2)}Only you see this</small></h2>
${notes.length ? notes.slice(0, 2).map(noteCard).join('') : `<p class="lede" style="margin-bottom:0">Log a cook, or jot down something to remember. It stays private unless you share it.</p>`}
<div class="row"><a class="btn small" href="#/note/new">Write a note</a>${notes.length > 2 ? `<a class="link" href="#/notebook">All ${notes.length} notes</a>` : notes.length ? `<a class="link" href="#/notebook">Open notebook</a>` : ''}</div>`;
  const label = { auto: 'Match this phone', light: 'Light', dark: 'Dark' }[theme];
  const html = `${backBar()}${await personBody(ctx, ctx.me, book)}
<h2 class="head">This phone</h2>
<div class="settings">
  <a href="#/who"><span>Not ${esc(ctx.me.name)}?</span><em>Switch person</em></a>
  <button data-action="theme"><span>Light or dark</span><em>${label}</em></button>
  <a href="#/trash"><span>Trash</span><em>${trashed.length ? plural(trashed.length, 'entry', 'entries') : 'Empty'}</em></a>
</div>`;
  return { html, title: 'You', tab: 'you' };
}
export async function who(ctx) {
  const html = `<header class="top"><span class="mark">${ring()}The Smoke Ring</span></header>
<h1 class="title">Who’s cooking?</h1>
<p class="lede" style="margin-bottom:0">Pick your name. This phone will remember it.</p>
<div class="who">${ctx.people.map(p => `<button data-action="pick-me" data-id="${p.id}">${avatar(p)}<b>${esc(p.name)}</b></button>`).join('')}</div>`;
  return { html, title: 'Who’s cooking?', bare: true };
}

// ---------------------------------------------------------------- private notebook
export async function notebook(ctx) {
  const notes = await data.notes(ctx.me.id);
  const html = `${backBar()}<h1 class="title">Notebook</h1>
<p class="lede only">${icon('lock', 18, 2)}<span>Only you see these. Share one with the group when it’s ready.</span></p>
<div class="stack" style="margin-top:0;margin-bottom:24px"><a class="btn pri" href="#/note/new">Write a note</a></div>
${notes.length ? notes.map(noteCard).join('') : empty('Nothing here yet', 'Log a cook, or jot down something to remember.')}`;
  return { html, title: 'Notebook', tab: 'you' };
}
export async function noteForm(ctx, id) {
  const isNew = id === 'new';
  const n = isNew ? { date: today() } : await data.note(id, ctx.me.id);
  if (!n) return missing('That note isn’t in your notebook.');
  const shared = n.sharedId ? await data.entry(n.sharedId) : null;
  const html = `${backBar('Cancel')}
<h1 class="title" style="font-size:50px">${isNew ? 'New note' : 'Your note'}</h1>
<p class="lede only">${icon('lock', 18, 2)}<span>Only you see this.</span></p>
<form data-form="note" ${isNew ? '' : `data-id="${n.id}"`} novalidate>
  ${f('title', 'What is it?', n.title, { big: true, ph: 'Tri-tip for six, kettle vents, things to try' })}
  ${f('text', 'Notes', n.text, { area: true, ph: 'What you did, what happened, what to change next time.' })}
  ${f('date', 'When', n.date, { type: 'date' })}
  <p class="legend" style="margin:0 16px 10px"><span>The cook</span><i>Optional</i></p>
  ${pitFields(n)}
  <label class="pick${n.photo ? ' has' : ''}"><input type="file" name="photo" accept="image/*" data-change="preview">${n.photo
    ? `<img src="${esc(data.photoUrl(n.photo.src))}" alt=""><b>Change photo</b>`
    : `${icon('camera', 30, 2)}<span>Add a photo<small>Optional</small></span>`}</label>
  ${isNew ? '' : `<div class="stack" style="margin-top:8px">
    ${shared && !shared.trashedAt ? `<p style="font:var(--t-body)">Shared with the group as <a class="link" href="#/e/${shared.id}">${esc(shared.title)}</a>.</p>` : `<button class="btn" type="submit" name="then" value="share">Share with the group</button>`}
    <div><button class="link" type="button" data-action="delete-note" data-id="${n.id}" style="min-height:48px">Delete note</button></div></div>`}
  <div class="savebar"><button class="btn pri" type="submit">Save note</button></div>
</form>`;
  return { html, title: isNew ? 'New note' : n.title || 'Your note', bare: true };
}

// ---------------------------------------------------------------- trash
export async function trash(ctx) {
  const es = await data.trashed();
  const rows = es.map(e => `<div class="rowitem"><a href="#/e/${e.id}">${cover(e, ctx, { mini: true, room: 1 })}<span class="t"><b>${esc(e.title)}</b><small>${esc(ctx.name(e.trashedBy))} trashed this ${onDay(e.trashedAt)}</small></span></a><button class="btn small" data-action="restore" data-id="${e.id}">Restore</button></div>`).join('');
  const html = `${backBar()}<h1 class="title">Trash</h1>
<p class="lede">Only the person who added an entry can move it here. Anyone can restore it.</p>
${es.length ? `<div class="rows">${rows}</div>` : empty('The trash is empty', 'Trashed entries wait here until someone restores them.')}`;
  return { html, title: 'Trash', tab: 'you' };
}

// ---------------------------------------------------------------- search
export async function searchResults(ctx, q) {
  if (!q.trim()) return `<p class="lede">Try a cut, a wood, a city, or a friend’s name.</p>`;
  const es = await data.search(q);
  if (!es.length) return `<p class="lede">Nothing matches “${esc(q)}”.</p>`;
  return `<div class="rows">${es.map(e => `<div class="rowitem"><a href="#/e/${e.id}">${cover(e, ctx, { mini: true, room: 1 })}<span class="t"><b>${esc(e.title)}</b><small>${esc(kindWord(e))}${e.city ? ', ' + esc(e.city) : ''}, from ${esc(ctx.name(e.by))}</small></span></a><span></span></div>`).join('')}</div>`;
}
export async function search(ctx) {
  const html = `${backBar()}<h1 class="title">Search</h1>
<label class="field" style="margin-top:16px"><span class="vh">Search everything</span><input type="search" data-input="search" placeholder="Brisket, post oak, Austin…" autocomplete="off" enterkeyhint="search"></label>
<div id="results">${await searchResults(ctx, '')}</div>`;
  return { html, title: 'Search', tab: 'search' };
}

export function missing(text = 'It may have been removed, or the link is wrong.') {
  return { html: `${backBar()}${empty('Nothing here', esc(text), '#/', 'Go home')}`, title: 'Not found' };
}
