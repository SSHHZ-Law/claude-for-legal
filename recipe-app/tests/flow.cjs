// Core flows: first run, add with a photo, copy as text, verdicts, trash and restore, theme, search, focus, tap targets.
// Run: node tests/flow.cjs
(async () => {
const { ROOT, ORIGIN, OUT, fs, path, p, log, text, settle, has, open, pickMe, shot, done } = await require('./harness.cjs').start('flow', { scale: 1 });
await p.goto(ORIGIN+'/index.html'); await p.waitForSelector('.who'); 
log(p.url().endsWith('#/who') && await p.locator('#tabs').isHidden(), 'first run shows the name picker with no tab bar');
await p.click('.who button:has-text("John")'); await p.waitForSelector('.board'); log(true, 'picking a name lands on Home');

// 2. add a recipe with a photo, from the Add tab
const t0 = Date.now();
await p.click('.tab.add'); await p.waitForSelector('.choose'); await p.click('.choose a:has-text("Recipe")'); await p.waitForSelector('form[data-form=entry]');
log(await p.locator('#tabs').isHidden() && await p.locator('.savebar').isVisible(), 'form hides tabs and shows the save bar');
await p.click('button[type=submit]'); await settle(); log((await text('#toast')).includes('name'), 'saving with no name asks for a name: "' + (await text('#toast')).trim() + '"');
await p.fill('[name=title]', 'Beer can chicken'); await p.setInputFiles('[name=photo]', ROOT + '/assets/icons/icon-512.png'); await settle();
log(await p.locator('.pick.has img').count() === 1, 'chosen photo previews in the form');
await p.screenshot({ path: path.join(OUT, 'form-filled.png') });
await p.fill('[name=ingredients]', '1 whole chicken, 4 lb\n- 2 tbsp four-four-one rub\n1 can of beer'); await p.fill('[name=steps]', '1. Rub the bird.\n2. Stand it on the half-full can.'); await p.fill('[name=heat]', '350°F');
await p.click('button[type=submit]'); await p.waitForSelector('.card h1'); await settle();
log((await text('.card h1')).toUpperCase() === 'BEER CAN CHICKEN' && (await text('#toast')).includes('Recipe saved'), 'saved and landed on the new entry, toast "Recipe saved"');
log((await text('.photo .phototag')) === 'Photo: John', 'uploaded photo is tagged "Photo: John"');
log(await p.locator('.photo img').evaluate(i => i.naturalWidth > 0), 'uploaded photo actually renders');
log((await p.locator('.ing li').count()) === 3 && (await text('.ing li:nth-child(2) b')) === '2 tbsp', 'ingredients split into lines, bullets stripped, amounts pulled out');
log(await p.locator('.owner').isVisible(), 'the adder sees Edit and Move to trash');
const newUrl = p.url();

// 3. copy as text
await p.click('.half [data-action=copy]'); await settle();
const clip = await p.evaluate(() => window.__clip || '');
log(clip.startsWith('BEER CAN CHICKEN') && clip.includes('INGREDIENTS') && clip.includes('1. Rub the bird.'), 'copy as text puts clean text on the clipboard');
fs.writeFileSync(path.join(OUT, 'copied.txt'), clip);

// 4. reload: the entry and its photo survive
await p.reload(); await p.waitForSelector('.card h1'); await settle();
log(await p.locator('.photo img').evaluate(i => i.naturalWidth > 0), 'after reload the entry and uploaded photo are still there');

// 5. verdict on someone else's entry, then change it
await p.goto(ORIGIN+'/index.html#/e/r-cabbage'); await p.waitForSelector('.card h1');
log(await p.locator('.owner').count() === 0, 'no Edit or Move to trash on a friend’s entry');
await p.click('.stack .btn.pri'); await p.waitForSelector('form[data-form=made]');
await p.click('button[type=submit]'); await settle(); log((await text('#toast')).includes('rating'), 'saving with no rating asks for one');
await p.check('input[name=rating][value="5"]', {force:true}); await p.fill('[name=note]', 'Made it twice this week.'); await p.setInputFiles('[name=photo]', ROOT + '/assets/icons/icon-192.png');
await p.click('button[type=submit]'); await p.waitForSelector('.card h1'); await settle();
log((await text('#toast')).includes('Verdict saved') && (await p.locator('.verdict:has-text("John")').count()) === 1, 'verdict saved and listed under John’s name');
log((await p.locator('.more .shot').count()) === 1 && (await text('.more .phototag')) === 'Photo: John', 'the verdict photo joined the entry, tagged with John');
log((await text('.stack .btn.pri')).toUpperCase() === 'CHANGE MY VERDICT', 'button now reads "Change my verdict"');
await p.screenshot({ path: path.join(OUT, 'detail-after-verdict.png'), fullPage: true });

// 6. trash, undo, trash again, restore from the trash screen
await p.goto(newUrl); await p.waitForSelector('.owner'); await p.click('[data-action=trash]'); await p.waitForSelector('.board'); await settle();
log((await text('#toast')).includes('Moved to trash'), 'trashing goes Home with a "Moved to trash" toast');
log(await p.locator('.slip:has-text("Beer can chicken"), .ticket:has-text("Beer can chicken")').count() === 0, 'trashed entry is gone from Home');
await p.click('#toast button'); await settle(); await p.waitForTimeout(300);
log(await p.locator('.ticket:has-text("Beer can chicken")').count() === 1, 'Undo brings it back');
await p.goto(newUrl); await p.waitForSelector('.owner'); await p.click('[data-action=trash]'); await p.waitForSelector('.board');
await p.goto(ORIGIN+'/index.html#/trash'); await p.waitForSelector('.rows'); 
log(await p.locator('.rowitem').count() === 2, 'trash lists both trashed entries');
await p.click('.rowitem:has-text("Lemon pepper") [data-action=restore]'); await settle();
log(await p.locator('.rowitem').count() === 1, 'anyone can restore: John restored Teo’s entry');
await p.goto(ORIGIN+'/index.html#/edit/r-chuck'); await p.waitForSelector('.empty'); log(true, 'editing a friend’s entry is refused');

// 7. theme and identity
await p.goto(ORIGIN+'/index.html#/you'); await p.waitForSelector('.settings'); await p.click('[data-action=theme]'); await settle(); await p.click('[data-action=theme]'); await settle();
log(await p.evaluate(() => document.documentElement.dataset.theme) === 'dark', 'theme setting cycles to Dark');
await p.reload(); await p.waitForSelector('.settings'); log(await p.evaluate(() => document.documentElement.dataset.theme) === 'dark', 'Dark is remembered after reload');
await p.click('[data-action=theme]'); await settle();
// 8. search
await p.goto(ORIGIN+'/index.html#/search'); await p.fill('[data-input=search]', 'austin'); await settle();
log(await p.locator('.rowitem').count() === 2, 'search "austin" finds the two Austin restaurants');
// 9. keyboard focus is visible
await p.goto(ORIGIN+'/index.html#/'); await p.waitForSelector('.board'); await p.keyboard.press('Tab'); await p.keyboard.press('Tab');
const outline = await p.evaluate(() => getComputedStyle(document.activeElement).outlineStyle + ' ' + getComputedStyle(document.activeElement).outlineWidth);
log(outline.startsWith('solid 3'), 'keyboard focus shows a 3px outline (' + outline + ')');
// 10. tap targets
await p.goto(ORIGIN+'/index.html#/e/r-chuck'); await p.waitForSelector('.card h1');
const small = await p.evaluate(() => [...document.querySelectorAll('a,button,label.btn,input:not(.vh)')].filter(el => { const r = el.getBoundingClientRect(); return r.width && (r.height < 44 || r.width < 44) && !el.closest('.by,.what,.verdict,.headnote,.cmt'); }).map(el => el.outerHTML.slice(0, 80) + ' ' + Math.round(el.getBoundingClientRect().width) + 'x' + Math.round(el.getBoundingClientRect().height)));
log(small.length === 0, 'detail screen: buttons and controls are at least 44px (inline name links excepted)' + (small.length ? '\n      ' + small.join('\n      ') : ''));
await done();
})();
