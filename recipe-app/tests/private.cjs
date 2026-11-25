// The private page: private recipes and recs, the notebook, sharing with the group, and privacy between people.
// Run: node tests/private.cjs
(async () => {
const { ROOT, ORIGIN, OUT, fs, path, p, log, text, settle, has, open, pickMe, shot, done } = await require('./harness.cjs').start('private', { scale: 2 });
await p.goto(ORIGIN+'/index.html'); await p.waitForSelector('.who'); await p.click('.who button:has-text("John")'); await p.waitForSelector('.board');

// ---- what the group can and cannot see
log(!(await has('Braised short ribs')) && !(await has('House steak salt')), 'private entries are not on Home');
log((await text('.board .line em')) === '6', 'the board still counts 6 group recipes (private ones are not counted)');
await open('/k/recipes', '.title'); log(!(await has('Braised short ribs')), 'not in the Recipes list');
await open('/p/john', '.hero'); log(!(await has('Braised short ribs')) && (await text('.hero .tally')).startsWith('5 things'), 'not on John’s public page, and not in his tally');
log(await p.locator('.slip .from .avatar').count() > 0, 'cards show who put each thing up, with their initial');
await open('/you', '.settings'); log((await has('2 recipes and recs and 3 notes')), 'Your page summarises the private page: "2 recipes and recs and 3 notes"');
await shot('you');
await p.click('a:has-text("Open your private page")'); await p.waitForSelector('.pnote'); await settle();
log(await p.locator('.slip').count() === 2 && await p.locator('.pnote').count() === 3, 'the private page lists 2 private entries and 3 notes');
log(!(await has('Competition brisket injection')) && !(await has('Brisket, second try')), 'none of Marcus’s private things are on John’s private page');
await shot('private');
await open('/e/x-marcus-inject', '.empty'); log(true, 'Marcus’s private recipe cannot be opened by its address');
await open('/search', '[data-input=search]'); await p.fill('[data-input=search]', 'injection'); await settle();
log(await p.locator('.rowitem').count() === 0, 'search does not find Marcus’s private recipe');
await p.fill('[data-input=search]', 'short ribs'); await settle();
log(await p.locator('.rowitem').count() === 1 && (await text('.rowitem small')).startsWith('Private recipe'), 'search finds John’s own private recipe and labels it private');

// ---- a private entry's page
await open('/e/x-john-ribs', '.card h1'); await shot('private-detail');
log((await text('.lockbar')).includes('Only you see this') && (await text('.stack .btn.pri')).toUpperCase() === 'SHARE WITH THE GROUP', 'private entry shows the lock bar and "Share with the group"');
log(!(await has('Verdicts')) && await p.locator('[data-action=trash]').count() === 0 && await p.locator('[data-action=delete-private]').count() === 1, 'no verdicts and no shared trash on a private entry; Delete instead');

// ---- add something privately
await open('/private', '.title'); await p.click('a:has-text("Add privately")'); await p.waitForSelector('.choose'); await p.click('.choose a:has(b:text-is("Restaurant"))'); await p.waitForSelector('form[data-form=entry]'); await settle();
log(await p.isChecked('input[name=audience][value=private]'), 'adding from the private page starts on "Just me"');
await p.fill('[name=title]', 'Place to try downtown'); await p.fill('[name=city]', 'Los Angeles'); await shot('private-form');
await p.click('.savebar button'); await p.waitForSelector('.card h1'); await settle();
log((await text('#toast')).includes('just for you') && await p.locator('.lockbar').count() === 1, 'saved privately, toast says "just for you"');
await open('/k/restaurants', '.title'); log(!(await has('Place to try downtown')), 'the private restaurant is not in the group’s list');
// the normal Add tab defaults to the group
await open('/add/recipe', 'form[data-form=entry]'); log(await p.isChecked('input[name=audience][value=group]'), 'the normal Add form starts on "For the group"');
await open('/edit/r-tritip', 'form[data-form=entry]'); log(await p.locator('input[name=audience]').count() === 0, 'an entry already with the group has no "Just me" switch');

// ---- move a private entry to the group, undo, and move it again
await open('/e/x-john-ribs', '.card h1'); await p.click('[data-action=share-entry]'); await settle(); await p.waitForTimeout(300);
log((await text('#toast')).includes('Shared with the group') && await p.locator('.lockbar').count() === 0 && (await text('.stack .btn.pri')).toUpperCase() === 'I MADE THIS', 'Share moves it to the group: lock bar gone, "I made this" appears');
await p.click('#toast button'); await settle(); await p.waitForTimeout(300);
log(await p.locator('.lockbar').count() === 1, 'Undo makes it private again');
await p.click('[data-action=share-entry]'); await settle(); await p.waitForTimeout(300);
await open('/', '.board');
log((await text('.ticket h2')).toUpperCase().startsWith('BRAISED SHORT RIBS') && (await text('.ticket .stamp')).toUpperCase() === 'NEW RECIPE', 'once shared it leads Home as the newest recipe');
log((await text('.ticket .by')).includes('John put this up today'), 'and it says who put it up: "John put this up today"');
await shot('home-after-share');
await open('/private', '.title'); log(!(await has('Braised short ribs')) && await p.locator('.slip').count() === 2, 'it has left the private page (moved, not copied)');

// ---- delete a private entry, with undo
await open('/e/x-john-salt', '.card h1'); await p.click('[data-action=delete-private]'); await p.waitForSelector('.title'); await settle();
log(p.url().endsWith('#/private') && !(await has('House steak salt')), 'Delete removes a private entry and returns to the private page');
await open('/trash', '.title'); log(!(await has('House steak salt')), 'it did not go to the shared trash');
await open('/e/x-john-salt', '.empty');
// ---- notebook: write, share, delete
await open('/private', '.title'); await p.click('a:has-text("Write a note")'); await p.waitForSelector('form[data-form=note]');
await p.fill('[name=title]', 'Sunday ribs'); await p.fill('[name=text]', 'Spritz once an hour, not every 30 minutes.'); await p.fill('[name=heat]', '275°F');
await p.click('.savebar button'); await p.waitForSelector('.pnote'); await settle();
log(p.url().endsWith('#/private') && await p.locator('.pnote').count() === 4, 'a new note lands on the private page');
await p.click('.pnote:has-text("Sunday ribs")'); await p.waitForSelector('form[data-form=note]'); await p.click('button[value=share]'); await p.waitForSelector('.choose');
await p.click('.choose a:has(b:text-is("Method"))'); await p.waitForSelector('form[data-form=entry]'); await settle();
log(await p.inputValue('[name=title]') === 'Sunday ribs' && await p.inputValue('[name=heat]') === '275°F' && await p.isChecked('input[name=audience][value=group]'), 'sharing a note prefills the group form');
await p.click('.savebar button'); await p.waitForSelector('.card h1'); await settle();
log((await text('#toast')).includes('Shared with the group'), 'note shared with the group');
await open('/private', '.pnote'); log((await text('.pnote .k')).includes('shared with the group'), 'the note stays in the notebook, marked as shared');
await p.click('.pnote:has-text("Sunday ribs")'); await p.waitForSelector('form[data-form=note]'); await p.click('[data-action=delete-note]'); await p.waitForSelector('.title'); await settle();
log(await p.locator('.pnote').count() === 3, 'deleting a note works'); await p.click('#toast button'); await settle(); await p.waitForTimeout(300);
log(await p.locator('.pnote').count() === 4, 'and Undo restores it');

// ---- someone else on the same phone
await pickMe('Marcus'); await open('/private', '.title');
log((await has('Competition brisket injection')) && !(await has('Place to try downtown')) && !(await has('Tri-tip for six')), 'as Marcus: his own private things, none of John’s');
await open('/e/x-john-ribs', '.card h1'); log(await p.locator('[data-action=share-entry]').count() === 0 && (await text('.stack .btn.pri')).toUpperCase() === 'I MADE THIS', 'Marcus can open and rate the recipe John shared');
await done();
})();
