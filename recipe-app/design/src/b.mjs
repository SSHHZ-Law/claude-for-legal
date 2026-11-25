// Direction B: Butcher Paper. The smokehouse counter: peach paper, wood type, order tickets, a menu board.
import { icon, ph, page, recipe } from './shared.mjs';

const css = `
:root{--paper:#E9BC99;--deli:#FFF7E9;--ink:#1E1410;--ink2:#5B4336;--red:#BE2A1B;--mustard:#EBAA1C;
--wood:'Big Shoulders','Arial Narrow',sans-serif;--sans:'Archivo',system-ui,sans-serif}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--paper);color:var(--ink);font:400 16px/1.500 var(--sans);-webkit-font-smoothing:antialiased;padding-bottom:110px}
a{color:inherit;text-decoration:none}
img{display:block;width:100%;object-fit:cover}
.top{display:flex;align-items:center;justify-content:space-between;padding:16px 16px 12px}
.mark{font:900 38px/.900 var(--wood);text-transform:uppercase;letter-spacing:.005em;color:var(--red);display:flex;align-items:center;gap:8px}
.avatar{display:inline-grid;place-items:center;width:42px;height:42px;border-radius:50%;background:var(--ink);color:var(--deli);font:800 20px/1 var(--wood);flex:none}
.avatar.s{width:28px;height:28px;font-size:15px}
.avatar.m{background:#8E2317}.avatar.p{background:#9A6A00}.avatar.d{background:#3F5E2A}.avatar.t{background:#4C3A66}.avatar.l{background:#1F5A63}

/* an order ticket: deli paper with a torn bottom edge */
.ticket{display:block;background:var(--deli);position:relative;margin:0 16px}
.ticket::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:8px;background:radial-gradient(circle at 50% 100%,var(--paper) 5.500px,transparent 6px) 0 0/15px 8px repeat-x}
.ticket img{aspect-ratio:4/3.400}
.ticket .in{padding:18px 16px 24px;position:relative}
.stamp{display:inline-block;font:800 16px/1 var(--wood);text-transform:uppercase;letter-spacing:.05em;color:var(--red);border:2.500px solid var(--red);border-radius:4px;padding:5px 9px 4px;transform:rotate(-4deg);background:var(--deli)}
.ticket .stamp{position:absolute;right:14px;top:-17px}
.ticket h2{font:900 50px/.900 var(--wood);text-transform:uppercase;letter-spacing:-.005em;text-wrap:balance}
.ticket .aka{font:italic 500 17px/1.300 var(--sans);color:var(--ink2);margin-top:8px}
.by{display:flex;gap:9px;align-items:center;margin-top:14px;font-size:15px;line-height:1.300}
.by b{font-weight:700}
.strip{display:grid;grid-template-columns:repeat(3,auto);justify-content:space-between;margin-top:16px;padding-top:12px;border-top:2px solid var(--ink)}
.strip span{font:800 22px/1 var(--wood);text-transform:uppercase;display:flex;align-items:center;gap:6px}
.strip svg{color:var(--red)}

.head{font:900 30px/1 var(--wood);text-transform:uppercase;margin:34px 16px 12px;display:flex;align-items:baseline;justify-content:space-between}
.head small{font:500 14px/1 var(--sans);text-transform:none;color:var(--ink2)}

.pair{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:0 16px}
.slip{background:var(--deli);display:block}
.slip img,.slip .poster{aspect-ratio:1/.860}
.slip .in{padding:10px 12px 14px}
.slip .k{font:600 12.500px/1 var(--sans);color:var(--red)}
.slip h4{font:800 23px/.960 var(--wood);text-transform:uppercase;margin-top:6px}
.slip .from{font-size:13px;color:var(--ink2);margin-top:6px}
/* no photo: a hand-set type poster */
.poster{display:grid;align-content:center;padding:12px;background:var(--ink);color:var(--mustard);font:900 37px/.860 var(--wood);text-transform:uppercase}
.poster.red{background:var(--red);color:var(--deli)}

/* the menu board: the five kinds as places */
.board{background:var(--ink);color:var(--deli);margin-top:34px;padding:26px 16px 20px}
.board h3{font:900 30px/1 var(--wood);text-transform:uppercase;color:var(--mustard);margin-bottom:8px}
.line{display:grid;grid-template-columns:auto 1fr auto;align-items:baseline;gap:8px;min-height:58px;padding-top:10px;border-bottom:1px solid #4a3a31}
.line:last-child{border-bottom:0}
.line b{font:900 40px/1 var(--wood);text-transform:uppercase}
.line i{border-bottom:3px dotted #7a6657;transform:translateY(-7px)}
.line em{font:900 40px/1 var(--wood);font-style:normal;color:var(--mustard)}
.line p{grid-column:1/-1;font-size:13.500px;color:#cdb9a6;margin:-2px 0 12px}

.verdict{background:var(--deli);margin:0 16px 10px;padding:14px;display:grid;grid-template-columns:1fr 56px;gap:4px 12px;border-left:5px solid var(--red)}
.verdict .what{font-size:15px;line-height:1.350}
.verdict .what b{font-weight:800}
.verdict q{font:500 17px/1.400 var(--sans);quotes:"“" "”";display:block;margin-top:4px}
.verdict .when{font-size:13px;color:var(--ink2);margin-top:4px}
.score{grid-row:1/4;grid-column:2;align-self:start;width:56px;height:56px;border-radius:50%;border:2.500px solid var(--red);color:var(--red);display:grid;place-content:center;justify-items:center;transform:rotate(6deg)}
.score b{font:900 28px/.800 var(--wood)}
.score small{font:700 10.500px/1 var(--sans);margin-top:2px}

.tabs{position:fixed;left:0;right:0;bottom:0;display:grid;grid-template-columns:repeat(5,1fr);align-items:end;background:var(--ink);padding:8px 8px 22px}
.tab{display:grid;justify-items:center;gap:3px;font:600 11px/1 var(--sans);color:#cdb9a6;min-height:48px;align-content:center}
.tab.on{color:var(--mustard)}
.tab.add{color:var(--deli)}
.tab.add b{display:grid;place-items:center;width:64px;height:64px;border-radius:50%;background:var(--red);color:var(--deli);margin-top:-34px;border:4px solid var(--paper)}

/* detail */
.photo{position:relative}
.photo img{aspect-ratio:4/3.700}
.photo .ib{position:absolute;top:12px;display:grid;place-items:center;width:44px;height:44px;border-radius:50%;background:var(--deli);color:var(--ink)}
.photo .ib.l{left:12px}.photo .ib.r{right:12px}
.card{margin-top:-44px}
.card h1{font:900 62px/.860 var(--wood);text-transform:uppercase;letter-spacing:-.005em}
.pit{display:grid;grid-template-columns:1fr 1fr;border:2px solid var(--ink);margin-top:20px}
.pit div{padding:9px 12px 10px}
.pit div:nth-child(odd){border-right:2px solid var(--ink)}
.pit div:nth-child(-n+2){border-bottom:2px solid var(--ink)}
.pit dt{font:600 12.500px/1.200 var(--sans);color:var(--ink2)}
.pit dd{font:800 27px/1 var(--wood);text-transform:uppercase;margin-top:3px}
.headnote{font:500 18px/1.450 var(--sans);margin-top:20px}
.headnote cite{display:block;font:400 14px/1 var(--sans);color:var(--ink2);margin-top:8px;font-style:normal}
.btn{display:flex;align-items:center;justify-content:center;gap:8px;min-height:58px;font:900 26px/1 var(--wood);text-transform:uppercase;letter-spacing:.02em;border:2.500px solid var(--ink);color:var(--ink);background:transparent;margin:10px 16px 0}
.btn.pri{background:var(--red);border-color:var(--red);color:var(--deli);margin-top:26px}
.sheet{background:var(--deli);margin:0 16px;padding:18px 16px 22px}
.sheet + .sheet{margin-top:12px}
.sheet h2{font:900 34px/1 var(--wood);text-transform:uppercase;display:flex;justify-content:space-between;align-items:baseline;padding-bottom:8px;border-bottom:2px solid var(--ink)}
.sheet h2 small{font:500 14px/1 var(--sans);text-transform:none;color:var(--ink2)}
.ing{list-style:none}
.ing li{display:grid;grid-template-columns:auto 1fr auto;gap:8px;align-items:baseline;padding:11px 0 2px;font-size:17px}
.ing i{border-bottom:2px dotted #b9a48f;transform:translateY(-4px)}
.ing b{font-weight:800}
.steps{list-style:none;counter-reset:s;margin-top:6px}
.steps li{counter-increment:s;display:grid;grid-template-columns:34px 1fr;gap:10px;font-size:17px;line-height:1.500;padding:12px 0;border-bottom:1px solid #e6d6c2}
.steps li:last-child{border-bottom:0;padding-bottom:0}
.steps li::before{content:counter(s);font:900 42px/.900 var(--wood);color:var(--red)}
`;

const tabs = on => `<nav class="tabs" aria-label="Main">
<a class="tab ${on==='home'?'on':''}" href="home.html">${icon('home')}Home</a>
<a class="tab" href="#">${icon('search')}Search</a>
<a class="tab add" href="#"><b>${icon('plus',32,2.600)}</b>Add</a>
<a class="tab" href="#">${icon('friends')}Friends</a>
<a class="tab" href="#">${icon('user')}You</a></nav>`;

const mark = `<a class="mark" href="home.html"><svg width="30" height="30" viewBox="0 0 30 30"><circle cx="15" cy="15" r="12.500" fill="none" stroke="#1E1410" stroke-width="4"/><circle cx="15" cy="15" r="6.500" fill="none" stroke="#BE2A1B" stroke-width="4"/></svg>Smoke Ring</a>`;
const line = (name, n, sub) => `<a class="line" href="#"><b>${name}</b><i></i><em>${n}</em><p>${sub}</p></a>`;
const verdict = (k, who, what, n, note, when) => `<div class="verdict"><p class="what"><b>${who}</b> ${what}</p><span class="score" role="img" aria-label="${n} out of 5"><b>${n}</b><small>of 5</small></span><q>${note}</q><p class="when">${when}</p></div>`;

const home = page('Butcher Paper: Home', css, `
<header class="top">${mark}<a class="avatar" href="#" aria-label="Your profile">J</a></header>

<a class="ticket" href="detail.html">
  <img src="${ph('chuck')}" alt="">
  <div class="in">
    <span class="stamp">New recipe</span>
    <h2>Smoked chuck roast</h2>
    <p class="aka">The poor man’s brisket</p>
    <p class="by"><span class="avatar s m">M</span><span><b>Marcus</b> put this up Sunday. Priya and Dana have made it.</span></p>
    <p class="strip"><span>${icon('temp',20,2.200)}250°F</span><span>${icon('clock',20,2.200)}6–7 hr</span><span>${icon('log',20,2.200)}Post oak</span></p>
  </div>
</a>

<h3 class="head">Also fresh <small>4 more this week</small></h3>
<div class="pair">
  <a class="slip" href="#"><img src="${ph('sardines')}" alt=""><div class="in"><p class="k">Find</p><h4>Smoked sardines in olive oil</h4><p class="from">from Lena</p></div></a>
  <a class="slip" href="#"><div class="poster">Coffee-<br>ancho<br>rub</div><div class="in"><p class="k">Rub</p><h4>Coffee-ancho rub</h4><p class="from">from Teo</p></div></a>
</div>

<section class="board">
  <h3>The board</h3>
  ${line('Recipes', 14, 'Newest: Marcus’s smoked chuck roast')}
  ${line('Rubs &amp; sauces', 9, 'Newest: Teo’s coffee-ancho rub')}
  ${line('Methods', 7, 'Cut, heat, time and wood')}
  ${line('Finds', 11, 'Things worth buying')}
  ${line('Restaurants', 16, 'Los Angeles, Austin, Kansas City, Oakland, Lockhart')}
</section>

<h3 class="head">Verdicts</h3>
${verdict('p','Priya','made Marcus’s smoked chuck roast',5,'Wrapped at 165 and it pulled like brisket. Making it again Sunday.','Yesterday')}
${verdict('t','Teo','went to Okra &amp; Ash',4,'Get the beef rib. Skip the sides.','Monday')}
${verdict('l','Lena','tried Dana’s Alabama white sauce',4,'Halved the horseradish. It still bites.','Sunday')}
${tabs('home')}`);

const r = recipe;
const detail = page('Butcher Paper: Recipe', css, `
<div class="photo"><img src="${ph('chuck')}" alt="">
  <a class="ib l" href="home.html" aria-label="Back">${icon('back')}</a>
  <a class="ib r" href="#" aria-label="More">${icon('more')}</a></div>
<article class="ticket card">
  <div class="in">
    <span class="stamp">Recipe</span>
    <h1>${r.title}</h1>
    <p class="aka">${r.sub}</p>
    <p class="by"><span class="avatar s m">M</span><span><b>Marcus</b> put this up Sunday</span></p>
    <dl class="pit">${r.facts.map(([k,v])=>`<div><dt>${k}</dt><dd>${v.replace('hours','hr')}</dd></div>`).join('')}</dl>
    <p class="headnote">“${r.headnote}”<cite>Marcus</cite></p>
  </div>
</article>
<a class="btn pri" href="#">I made this</a>
<a class="btn" href="#">${icon('copy',22,2.200)}Copy as text</a>

<section class="sheet" style="margin-top:28px">
  <h2>Ingredients <small>${r.serves}</small></h2>
  <ul class="ing">${r.ingredients.map(([q,t])=>`<li><span>${t[0].toUpperCase()+t.slice(1)}</span><i></i><b>${q}</b></li>`).join('')}</ul>
</section>
<section class="sheet">
  <h2>Method</h2>
  <ol class="steps">${r.steps.map(s=>`<li><span>${s}</span></li>`).join('')}</ol>
</section>

<h3 class="head">Verdicts <small>2 friends made it</small></h3>
${r.made.map(m=>verdict(m.k,m.who,'made it',m.n,m.note,m.when)).join('')}
<a class="btn pri" href="#">I made this</a>
${tabs()}`);

export default { dir: 'b-butcher-paper', home, detail };
