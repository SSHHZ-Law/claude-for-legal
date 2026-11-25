// Direction A: Enamel. White enamelware with a cobalt rim; a calm, photo-led cookbook.
import { icon, stars, ph, page, recipe } from './shared.mjs';

const css = `
:root{--paper:#F3F5F4;--card:#FFFFFF;--ink:#16202C;--ink2:#4F5D72;--rim:#1B3FA6;--mist:#D7DEE7;--tomato:#D23C28;
--serif:'Besley',Georgia,serif;--sans:'Hanken Grotesk',system-ui,sans-serif}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--paper);color:var(--ink);font:400 16px/1.5 var(--sans);-webkit-font-smoothing:antialiased;padding-bottom:104px}
a{color:inherit;text-decoration:none}
img{display:block;width:100%;object-fit:cover}
.wrap{padding:0 20px}
.top{display:flex;align-items:center;justify-content:space-between;padding:18px 20px 6px}
.mark{display:flex;align-items:center;gap:9px;font:600 21px/1 var(--serif);letter-spacing:-.01em}
.mark svg{flex:none}
.avatar{display:inline-grid;place-items:center;width:40px;height:40px;border-radius:50%;background:var(--card);box-shadow:0 0 0 1.500px var(--rim);color:var(--rim);font:700 15px/1 var(--sans);flex:none}
.avatar.s{width:26px;height:26px;font-size:12px;box-shadow:none;color:#fff}
.avatar.m{background:#B4472F}.avatar.p{background:#B98511}.avatar.d{background:#2E7A55}.avatar.t{background:#6B4A8C}.avatar.l{background:#1E7C8C}.avatar.j{background:var(--rim)}
.since{font:italic 400 17px/1.4 var(--serif);color:var(--ink2);padding:14px 20px 16px}

/* the enamel rim: every picture sits on a white plate with a cobalt edge */
.plate{border:5px solid var(--card);outline:1.500px solid var(--rim);border-radius:7px;background:var(--card)}
.feature{display:block;padding:0 20px}
.feature img{aspect-ratio:4/4.400}
.kind{font:600 13px/1 var(--sans);color:var(--rim);margin-top:16px}
.feature h2{font:600 30px/1.120 var(--serif);letter-spacing:-.015em;margin-top:8px;text-wrap:balance}
.by{display:flex;gap:9px;align-items:flex-start;margin-top:12px;color:var(--ink2);font-size:15px;line-height:1.400}
.by b{color:var(--ink);font-weight:600}
.by .avatar{margin-top:-2px}

.sec{margin-top:36px;padding-top:18px;border-top:1.500px solid var(--rim);margin-left:20px;margin-right:20px}
.sec h3{font:600 21px/1.200 var(--serif);letter-spacing:-.01em}
.sec .hint{color:var(--ink2);font-size:14px;margin-top:2px}

.row{display:flex;gap:16px;overflow:hidden;padding:16px 20px 6px;margin:0 -20px}
.small{flex:none;width:150px}
.small img,.small .blank{aspect-ratio:1;width:150px}
.small .kind{margin-top:11px;font-size:12px}
.small h4{font:600 16px/1.220 var(--serif);margin-top:5px}
.small .from{font-size:13px;color:var(--ink2);margin-top:4px}
/* no photo: an enamel label */
.blank{display:grid;place-items:center;text-align:center;padding:14px;position:relative}
.blank::before{content:"";position:absolute;inset:6px;border:1px solid var(--rim);border-radius:3px}
.blank span{font:italic 500 19px/1.150 var(--serif);color:var(--rim)}
.blank small{display:block;font:600 11px/1 var(--sans);color:var(--ink2);margin-top:9px;font-style:normal}

.chapters{display:grid;grid-template-columns:1fr 1fr;gap:22px 16px;margin-top:16px}
.chapter img{aspect-ratio:4/3}
.chapter.wide{grid-column:1/-1}
.chapter.wide img{aspect-ratio:16/8}
.chapter h4{font:600 19px/1.200 var(--serif);margin-top:11px;display:flex;justify-content:space-between;align-items:baseline}
.chapter h4 i{font:400 15px/1 var(--sans);color:var(--ink2);font-style:normal}
.chapter p{font-size:13.500px;color:var(--ink2);line-height:1.350;margin-top:3px}

.note{display:grid;grid-template-columns:40px 1fr;gap:4px 12px;padding:16px 0;border-bottom:1px solid var(--mist)}
.note:last-child{border-bottom:0}
.note .avatar{grid-row:1/4;box-shadow:none;color:#fff}
.note .what{font-size:15px;line-height:1.350}
.note .what b{font-weight:600}
.note .meta{display:flex;gap:10px;align-items:center;font-size:13px;color:var(--ink2)}
.note q{font:italic 400 16.500px/1.450 var(--serif);quotes:"“" "”";margin-top:4px;display:block}
.stars{display:inline-flex;gap:1.500px;vertical-align:-2px}
.stars .on{fill:var(--tomato)}.stars .off{fill:var(--mist)}

.tabs{position:fixed;left:0;right:0;bottom:0;display:grid;grid-template-columns:repeat(5,1fr);align-items:end;background:var(--card);border-top:1px solid var(--mist);padding:8px 8px 22px}
.tab{display:grid;justify-items:center;gap:3px;font:500 11px/1 var(--sans);color:var(--ink2);min-height:48px;align-content:center}
.tab.on{color:var(--rim);font-weight:700}
.tab.add{color:var(--rim);font-weight:700}
.tab.add b{display:grid;place-items:center;width:58px;height:58px;border-radius:50%;background:var(--rim);color:#fff;margin-top:-30px;border:4px solid var(--card);box-shadow:0 0 0 1.500px var(--rim)}

/* detail */
.bar{display:flex;justify-content:space-between;padding:12px 12px 10px}
.bar div{display:flex;gap:4px}
.ib{display:grid;place-items:center;width:44px;height:44px;border-radius:50%;color:var(--ink)}
.hero{margin:0 20px}
.hero img{aspect-ratio:4/4.300}
.d h1{font:600 34px/1.080 var(--serif);letter-spacing:-.02em;margin-top:8px}
.d .sub{font:italic 400 19px/1.300 var(--serif);color:var(--ink2);margin-top:6px}
.headnote{font:italic 400 19px/1.500 var(--serif);margin-top:22px;padding-left:16px;border-left:1.500px solid var(--rim)}
.facts{display:grid;grid-template-columns:1fr 1fr;margin-top:26px;border-top:1.500px solid var(--rim);border-bottom:1.500px solid var(--rim)}
.facts div{padding:12px 0 11px}
.facts div:nth-child(odd){border-right:1px solid var(--mist);padding-right:14px}
.facts div:nth-child(even){padding-left:14px}
.facts div:nth-child(-n+2){border-bottom:1px solid var(--mist)}
.facts dt{font-size:13px;color:var(--ink2)}
.facts dd{font:600 18px/1.250 var(--serif)}
.actions{display:grid;grid-template-columns:1.300fr 1fr;gap:10px;margin-top:22px}
.btn{display:flex;align-items:center;justify-content:center;gap:8px;min-height:52px;border-radius:26px;font:700 16px/1 var(--sans);border:1.500px solid var(--rim);color:var(--rim);background:var(--card)}
.btn.pri{background:var(--rim);color:#fff}
.d h2{font:600 24px/1.200 var(--serif);letter-spacing:-.01em;margin-top:40px;display:flex;justify-content:space-between;align-items:baseline}
.d h2 small{font:400 14px/1 var(--sans);color:var(--ink2)}
.ing{list-style:none;margin-top:10px}
.ing li{display:grid;grid-template-columns:74px 1fr;gap:14px;padding:11px 0;border-bottom:1px solid var(--mist);font-size:17px;line-height:1.350}
.ing .q{font-weight:700;color:var(--rim);text-align:right;font-variant-numeric:tabular-nums}
.steps{list-style:none;margin-top:14px;counter-reset:s}
.steps li{counter-increment:s;display:grid;grid-template-columns:30px 1fr;gap:14px;font-size:17.500px;line-height:1.550;margin-bottom:20px}
.steps li::before{content:counter(s);font:600 26px/1.100 var(--serif);color:var(--rim)}
.made .note{grid-template-columns:40px 1fr}
.made .note .what{display:flex;justify-content:space-between;align-items:center;font-size:16px}
.made .when{font-size:13px;color:var(--ink2)}
.yours{margin-top:8px;padding:18px;border:1.500px dashed var(--rim);border-radius:7px;text-align:center;color:var(--ink2);font-size:15px}
.yours .btn{margin-top:12px}
`;

const tabs = on => `<nav class="tabs" aria-label="Main">
<a class="tab ${on==='home'?'on':''}" href="home.html">${icon('home')}Home</a>
<a class="tab" href="#">${icon('search')}Search</a>
<a class="tab add" href="#"><b>${icon('plus',28,2.200)}</b>Add</a>
<a class="tab" href="#">${icon('friends')}Friends</a>
<a class="tab" href="#">${icon('user')}You</a></nav>`;

const mark = `<a class="mark" href="home.html"><svg width="26" height="26" viewBox="0 0 26 26"><circle cx="13" cy="13" r="11" fill="#fff" stroke="#1B3FA6" stroke-width="2.500"/><circle cx="13" cy="13" r="6.200" fill="none" stroke="#D23C28" stroke-width="2.500"/></svg>Smoke Ring</a>`;

const home = page('Enamel: Home', css, `
<header class="top">${mark}<a class="avatar" href="#" aria-label="Your profile">J</a></header>
<p class="since">Five new things since Sunday.</p>

<a class="feature" href="detail.html">
  <img class="plate" src="${ph('chuck')}" alt="">
  <p class="kind">Recipe</p>
  <h2>Smoked chuck roast, the poor man’s brisket</h2>
  <p class="by"><span class="avatar s m">M</span><span><b>Marcus</b> added this on Sunday. Priya and Dana have already made it.</span></p>
</a>

<section class="sec">
  <h3>Also new</h3>
  <div class="row">
    <a class="small" href="#"><img class="plate" src="${ph('sardines')}" alt=""><p class="kind">Find</p><h4>Smoked sardines in olive oil</h4><p class="from">from Lena</p></a>
    <a class="small" href="#"><div class="plate blank"><span>Coffee-ancho rub<small>no photo yet</small></span></div><p class="kind">Rub</p><h4>Coffee-ancho rub</h4><p class="from">from Teo</p></a>
    <a class="small" href="#"><img class="plate" src="${ph('restaurant')}" alt=""><p class="kind">Restaurant, Austin</p><h4>Okra &amp; Ash</h4><p class="from">from Dana</p></a>
  </div>
</section>

<section class="sec">
  <h3>The book</h3>
  <div class="chapters">
    <a class="chapter" href="#"><img class="plate" src="${ph('thighs')}" alt=""><h4>Recipes <i>14</i></h4><p>Newest: Marcus’s chuck roast</p></a>
    <a class="chapter" href="#"><img class="plate" src="${ph('rub')}" alt=""><h4>Rubs &amp; sauces <i>9</i></h4><p>Newest: Teo’s coffee-ancho</p></a>
    <a class="chapter" href="#"><img class="plate" src="${ph('smoker')}" alt=""><h4>Methods <i>7</i></h4><p>Cut, heat, time and wood</p></a>
    <a class="chapter" href="#"><img class="plate" src="${ph('sardines')}" alt=""><h4>Finds <i>11</i></h4><p>Things worth buying</p></a>
    <a class="chapter wide" href="#"><img class="plate" src="${ph('restaurant')}" alt=""><h4>Restaurants <i>16</i></h4><p>Los Angeles, Austin, Kansas City, Oakland and Lockhart</p></a>
  </div>
</section>

<section class="sec">
  <h3>From the table</h3>
  <div class="note"><span class="avatar p">P</span><p class="what"><b>Priya</b> made Marcus’s smoked chuck roast</p><p class="meta">${stars(5)} Yesterday</p><q>Wrapped at 165 and it pulled like brisket. Making it again Sunday.</q></div>
  <div class="note"><span class="avatar t">T</span><p class="what"><b>Teo</b> went to Okra &amp; Ash</p><p class="meta">${stars(4)} Monday</p><q>Get the beef rib. Skip the sides.</q></div>
  <div class="note"><span class="avatar l">L</span><p class="what"><b>Lena</b> tried Dana’s Alabama white sauce</p><p class="meta">${stars(4)} Sunday</p><q>Halved the horseradish. It still bites.</q></div>
</section>
${tabs('home')}`);

const r = recipe;
const detail = page('Enamel: Recipe', css, `
<nav class="bar"><a class="ib" href="home.html" aria-label="Back">${icon('back')}</a><div><a class="ib" href="#" aria-label="Copy recipe as text">${icon('copy')}</a><a class="ib" href="#" aria-label="More">${icon('more')}</a></div></nav>
<div class="hero"><img class="plate" src="${ph('chuck')}" alt=""></div>
<article class="wrap d">
  <p class="kind">Recipe</p>
  <h1>${r.title}</h1>
  <p class="sub">${r.sub}</p>
  <p class="by"><span class="avatar s m">M</span><span><b>Marcus</b> added this on Sunday</span></p>
  <p class="headnote">${r.headnote}</p>
  <dl class="facts">${r.facts.map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
  <div class="actions"><a class="btn pri" href="#">${icon('check',20,2.400)}I made this</a><a class="btn" href="#">${icon('copy',20)}Copy recipe</a></div>

  <h2>Ingredients <small>${r.serves}</small></h2>
  <ul class="ing">${r.ingredients.map(([q,t])=>`<li><span class="q">${q}</span><span>${t}</span></li>`).join('')}</ul>

  <h2>Method</h2>
  <ol class="steps">${r.steps.map(s=>`<li><span>${s}</span></li>`).join('')}</ol>

  <h2>Who’s made it</h2>
  <div class="made">
  ${r.made.map(m=>`<div class="note"><span class="avatar ${m.k}">${m.who[0]}</span><p class="what"><b>${m.who}</b>${stars(m.n,17)}</p><q>${m.note}</q><p class="when">${m.when}</p></div>`).join('')}
  </div>
  <div class="yours">Made it too? Add your rating and a note.<a class="btn pri" href="#">${icon('check',20,2.400)}I made this</a></div>
</article>
${tabs()}`);

export default { dir: 'a-enamel', home, detail };
