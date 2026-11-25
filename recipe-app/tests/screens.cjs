// Screenshots every screen at phone width into design/screens/ (not committed).
// Run: node tests/screens.cjs [light|dark]
(async () => {
const theme = process.argv[2] === 'dark' ? 'dark' : 'light';
const h = await require('./harness.cjs').start('screens', { theme });
const dir = h.path.join(h.ROOT, 'design', 'screens', theme); h.fs.mkdirSync(dir, { recursive: true });
await h.p.goto(h.ORIGIN + '/index.html'); await h.p.waitForSelector('.who'); await h.shot('who', dir);
await h.p.click('.who button:has-text("John")'); await h.p.waitForSelector('.board');
const screens = { home: '/', recipes: '/k/recipes', 'rubs-and-sauces': '/k/rubs-and-sauces', methods: '/k/methods', finds: '/k/finds', restaurants: '/k/restaurants',
  'detail-recipe': '/e/r-chuck', 'detail-method': '/e/m-butt', 'detail-find': '/e/f-sardines', 'detail-restaurant': '/e/p-okra', 'detail-no-photo': '/e/s-coffee', 'detail-private': '/e/x-john-ribs',
  add: '/add', 'add-recipe': '/add/recipe', 'made-this': '/made/r-cabbage', friends: '/friends', profile: '/p/marcus', you: '/you', private: '/private', note: '/note/n-john-1', trash: '/trash', search: '/search' };
for (const [name, route] of Object.entries(screens)) { await h.open(route, '#view > *'); await h.shot(name, dir); }
console.log('wrote', Object.keys(screens).length + 1, 'screens to', dir);
await h.done();
})();
