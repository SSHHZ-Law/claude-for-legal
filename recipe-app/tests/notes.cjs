// Notes on a recipe: the public note on a verdict and private notes pinned to an entry.
// Run: node tests/notes.cjs
(async () => {
const { ROOT, ORIGIN, OUT, fs, path, p, log, text, settle, has, open, pickMe, shot, done } = await require('./harness.cjs').start('notes', { scale: 2 });
await p.goto(ORIGIN+'/index.html'); await p.waitForSelector('.who'); await p.click('.who button:has-text("John")'); await p.waitForSelector('.board');
// a friend's recipe: no private notes yet
await open('/e/r-chuck', '.card h1');
log((await has('Your notes')) && await p.locator('.pnote').count() === 0 && await p.locator('a:has-text("Add a private note")').count() === 1, 'a recipe page has a "Your notes" section with "Add a private note"');
await p.click('a:has-text("Add a private note")'); await p.waitForSelector('form[data-form=note]'); await settle();
log((await text('.lede.only')).includes('pinned to Smoked chuck roast'), 'the note form says it is pinned to Smoked chuck roast');
await p.fill('[name=text]', 'Use the 4 lb roast from the usual butcher. Start by 9 am to eat at 6.'); await p.fill('[name=wood]', 'Red oak'); await shot('note-form');
await p.click('.savebar button'); await p.waitForSelector('.card h1'); await settle();
log(p.url().endsWith('#/e/r-chuck') && (await text('#toast')).includes('Note saved') && await p.locator('.pnote').count() === 1, 'saving returns to the recipe, where the note now shows');
// public note too
await p.click('.stack .btn.pri'); await p.waitForSelector('form[data-form=made]'); await p.check('input[name=rating][value="5"]', {force:true}); await p.fill('[name=note]', 'Best thing I have smoked this year.'); await p.click('.savebar button'); await p.waitForSelector('.card h1'); await settle();
log(await p.locator('.verdict:has-text("Best thing I have smoked")').count() === 1 && await p.locator('.pnote').count() === 1, 'the same page now carries John’s public note (with his rating) and his private note');
await shot('recipe-with-notes');
await p.click('.half [data-action=copy]'); await settle(); const clip = await p.evaluate(() => window.__clip || '');
log(clip.includes('SMOKED CHUCK ROAST') && !clip.includes('usual butcher'), 'Copy as text leaves the private note out');
// second private note on the same recipe
await p.click('a:has-text("Add a private note")'); await p.waitForSelector('form[data-form=note]'); await p.fill('[name=title]', 'Second cook'); await p.fill('[name=text]', 'Wrapped at 170 this time. Better bark.'); await p.click('.savebar button'); await p.waitForSelector('.card h1'); await settle();
log(await p.locator('.pnote').count() === 2, 'a second private note stacks under the first (as many as you like)');
// private page shows them, labelled
await open('/private', '.pnote');
log(await p.locator('.pnote').count() === 5 && await p.locator('.pnote .about-line:has-text("About Smoked chuck roast")').count() === 2 && await p.locator('.pnote .about-line:has-text("About Santa Maria tri-tip")').count() === 1, 'the private page lists them too, each labelled with its recipe');
await shot('private');
// own recipe, sample pinned note
await open('/e/r-tritip', '.card h1'); log(await p.locator('.pnote:has-text("Tri-tip for six")').count() === 1, 'John’s own recipe shows his pinned sample note');
// a private recipe can carry notes as well
await open('/e/x-john-ribs', '.card h1'); log(await p.locator('a:has-text("Add a private note")').count() === 1, 'a private recipe can carry private notes too');
// nobody else sees them
await pickMe('Marcus'); await open('/e/r-chuck', '.card h1');
log(await p.locator('.pnote').count() === 0 && !(await has('usual butcher')) && !(await has('Second cook')), 'as Marcus, the recipe shows none of John’s private notes');
log(await p.locator('.verdict:has-text("Best thing I have smoked")').count() === 1, 'but Marcus does see John’s public note and rating');
await open('/search', '[data-input=search]'); await p.fill('[data-input=search]', 'butcher'); await settle();
log(!(await has('usual butcher')), 'and search does not surface John’s note text');
await done();
})();
