// Comments: public, by name, no rating; collapsed on the entry until opened.
// Run: node tests/comments.cjs
(async () => {
const { ORIGIN, p, log, text, settle, has, open, pickMe, shot, done } = await require('./harness.cjs').start('comments');
// The app remembers an opened thread for the rest of the visit, so only click when it is shut.
const openThread = async () => { if (!(await p.locator('details.talk').evaluate(d => d.open))) await p.click('details.talk summary'); await settle(); };
await p.goto(ORIGIN + '/index.html'); await p.waitForSelector('.who'); await p.click('.who button:has-text("John")'); await p.waitForSelector('.board');

// Home mixes recent ratings and comments under "Lately"
log((await has('>Lately<')) && await p.locator('.verdict.cm').count() >= 1 && await p.locator('.verdict .score').count() >= 1, 'Home shows "Lately": ratings and comments together');
log((await text('.verdict.cm .what')).includes('commented on'), 'a comment on Home names who said it and what it is about');
await shot('home');

// On the entry the thread is one closed row
await open('/e/r-chuck', '.card h1');
const closed = await p.locator('details.talk').evaluate(d => !d.open);
log(closed && (await text('details.talk summary small')) === '2 comments', 'on the recipe, Comments is one closed row showing "2 comments"');
log(!(await p.locator('.cmt').first().isVisible()), 'the comments themselves are hidden until it is opened');
await shot('closed');
await p.click('details.talk summary'); await settle();
log(await p.locator('.cmt').count() === 2 && (await text('.cmt b')) === 'Lena' && (await p.locator('.cmt b').nth(1).innerText()) === 'Marcus', 'opening it shows the thread in order, each comment under its writer’s name');

// Post without a rating
await p.click('details.talk button[type=submit]'); await settle(); log((await text('#toast')).includes('Write a comment first'), 'an empty comment is not posted');
await p.fill('details.talk textarea', 'Did the foil version tonight. Unwrapping for the last half hour was the right call.');
const before = await p.locator('.verdict:not(.cm)').count();
await p.click('details.talk button[type=submit]'); await settle(); await p.waitForTimeout(300);
log((await text('#toast')).includes('Comment posted') && await p.locator('.cmt').count() === 3 && (await p.locator('.cmt b').nth(2).innerText()) === 'John', 'comment posted under John’s name, no rating asked for');
log(await p.locator('details.talk').evaluate(d => d.open) && await p.locator('.verdict:not(.cm)').count() === before, 'the thread stays open after posting, and no verdict was created');
log(await p.evaluate(() => scrollY) > 400, 'the page keeps its place after posting');
await shot('open');
await p.click('.stack .btn.pri'); await p.waitForSelector('form[data-form=made]'); log((await text('.title')).toUpperCase() === 'I MADE THIS', 'John still has no verdict on it: the button still says "I made this"');

// Delete your own, with undo; not someone else's
await open('/e/r-chuck', '.card h1'); await openThread();
log(await p.locator('.cmt [data-action=delete-comment]').count() === 1, 'only your own comment has a Delete');
await p.click('.cmt [data-action=delete-comment]'); await settle(); await p.waitForTimeout(300);
log(await p.locator('.cmt').count() === 2 && (await text('#toast')).includes('Comment deleted'), 'Delete removes it');
await p.click('#toast button'); await settle(); await p.waitForTimeout(300);
log(await p.locator('.cmt').count() === 3, 'Undo brings it back');

// Other places
await open('/', '.board'); log((await text('.verdict.cm .what')).startsWith('John commented on'), 'the new comment leads "Lately" on Home');
await open('/e/x-john-ribs', '.card h1'); log(await p.locator('details.talk').count() === 0, 'a private entry has no comments');
await open('/e/s-mustard', '.card h1'); log((await text('details.talk summary small')) === 'Ask or add one', 'with no comments the row reads "Ask or add one"');
await pickMe('Lena'); await open('/e/r-chuck', '.card h1'); await openThread();
log(await p.locator('.cmt').count() === 3 && await p.locator('.cmt [data-action=delete-comment]').count() === 1, 'as Lena: she sees all three and can delete only her own');
await done();
})();
