// Shared bits for the three static direction mocks.
const paths = {
  home: '<path d="M3.5 11 12 4l8.5 7v8.5a1 1 0 0 1-1 1h-5v-6h-5v6h-5a1 1 0 0 1-1-1z"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 5 5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  friends: '<circle cx="9" cy="9" r="3.2"/><path d="M3 19c.6-3.200 3-5 6-5s5.400 1.800 6 5"/><circle cx="17" cy="8" r="2.600"/><path d="M16.500 13.200c2.600.2 4.200 1.800 4.700 4.800"/>',
  user: '<circle cx="12" cy="8.500" r="3.500"/><path d="M5 20c.8-3.800 3.600-5.500 7-5.500s6.200 1.700 7 5.500"/>',
  back: '<path d="m15 5-7 7 7 7"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  more: '<circle cx="5" cy="12" r="1.200" fill="currentColor"/><circle cx="12" cy="12" r="1.200" fill="currentColor"/><circle cx="19" cy="12" r="1.200" fill="currentColor"/>',
  flame: '<path d="M12 21c-3.600 0-6-2.500-6-5.800 0-2.300 1.200-3.900 2.500-5.400.3 1.300.9 2.100 1.900 2.600-.3-3.300.9-6.300 3.100-8.400.5 3.400 4.500 5.700 4.500 10.900 0 3.500-2.400 6.100-6 6.100z"/>',
  clock: '<circle cx="12" cy="12" r="8.500"/><path d="M12 7.500V12l3 2"/>',
  temp: '<path d="M10 14.500V5a2 2 0 1 1 4 0v9.500a4 4 0 1 1-4 0z"/><path d="M12 9v7"/>',
  pin: '<path d="M12 21s-6.500-6-6.500-11a6.500 6.500 0 0 1 13 0c0 5-6.500 11-6.500 11z"/><circle cx="12" cy="10" r="2.300"/>',
  jar: '<rect x="6.500" y="8" width="11" height="13" rx="3"/><rect x="8" y="4" width="8" height="4" rx="1"/><path d="M9.500 13h5"/>',
  tin: '<rect x="3" y="7.500" width="18" height="10" rx="5"/><path d="M7 12.500c2-2.300 5-2.300 7.500 0-2.500 2.300-5.500 2.300-7.500 0zM14.500 12.500l2.500-2v4z"/>',
  book: '<path d="M5 4.500h9.500a3 3 0 0 1 3 3V20H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h9.500"/>',
  plate: '<circle cx="12" cy="12" r="8.500"/><circle cx="12" cy="12" r="4.500"/>',
  log: '<ellipse cx="6.500" cy="12" rx="2.500" ry="4.500"/><path d="M6.500 7.500h10c1.700 0 3 2 3 4.500s-1.300 4.500-3 4.500h-10"/><path d="M11 10.500h4M12 13.500h3"/>',
  cut: '<path d="M4 8c0-2 2-3.500 5-3.500h6c3 0 5 2.500 5 5.500 0 5-4 9-9 9-4 0-7-3-7-6.500z"/><circle cx="14.500" cy="10" r="1.800"/>',
  people: '<circle cx="12" cy="8.500" r="3.500"/><path d="M5 20c.8-3.800 3.600-5.500 7-5.500s6.200 1.700 7 5.500"/>',
  check: '<path d="m5 12.500 4.500 4.500L19 7.500"/>',
};
export const icon = (n, size = 24, sw = 1.8) =>
  `<svg class="i" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[n]}</svg>`;
const starPath = 'M12 3.200l2.700 5.600 6.100.8-4.500 4.300 1.100 6.100L12 17.100 6.600 20l1.100-6.100L3.200 9.600l6.100-.8z';
export const stars = (n, size = 16) =>
  `<span class="stars" role="img" aria-label="${n} out of 5">${[1,2,3,4,5].map(i => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" class="${i<=n?'on':'off'}"><path d="${starPath}"/></svg>`).join('')}</span>`;
export const ph = n => `../../standins/${n}.svg`;
export const page = (title, css, body) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title><link rel="stylesheet" href="../../fonts/fonts.css"><style>${css}</style></head>
<body>${body}</body></html>
`;
// The recipe both detail mocks use.
export const recipe = {
  title: 'Smoked chuck roast', sub: 'The poor man’s brisket',
  headnote: 'Half the price of brisket and done by dinner. Don’t trim much. The fat is the point.',
  facts: [['Cut','Chuck, 3–4 lb'],['Heat','250°F'],['Time','6–7 hours'],['Wood','Post oak']],
  serves: 'Serves 6',
  ingredients: [['1','chuck roast, 3 to 4 lb'],['2 tbsp','kosher salt'],['2 tbsp','coarse black pepper'],['1 tsp','granulated garlic'],['2 tbsp','yellow mustard, to bind'],['½ cup','beef stock, for the wrap']],
  steps: [
    'Salt the roast the night before and leave it uncovered in the fridge.',
    'Bring the smoker to 250°F with post oak. Slather the roast with mustard, then coat it with the pepper and garlic.',
    'Smoke fat side up until the bark sets and the middle reads 165°F, about 4 hours.',
    'Wrap it tight in butcher paper with the stock. Put it back on until a probe slides in like soft butter, around 203°F.',
    'Rest it in a dry cooler for an hour. Slice against the grain, or pull it.',
  ],
  made: [
    { who:'Priya', k:'p', n:5, when:'Yesterday', note:'Wrapped at 165 and it pulled like brisket. Making it again Sunday.' },
    { who:'Dana', k:'d', n:4, when:'Today', note:'Mine stalled at 160 for two hours. Start earlier than you think.' },
  ],
};
