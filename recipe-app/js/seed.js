// Sample entries. All invented: the people, the restaurants and the brands do not exist.
// Dates are written as "days ago" so the sample always looks recent on first run.
const P = 'assets/photos/';

export function seed(nowMs) {
  const ago = d => new Date(nowMs - d * 864e5).toISOString();
  const dayAgo = d => { const t = new Date(nowMs - d * 864e5); return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`; };
  const ph = (file, by) => [{ src: P + file, by }];

  const people = [
    { id: 'john',   name: 'John',   color: '#2B4A7A', about: 'Santa Maria grill and a kettle. Red oak when I can get it.' },
    { id: 'marcus', name: 'Marcus', color: '#8E2317', about: 'Offset smoker, post oak, no shortcuts.' },
    { id: 'priya',  name: 'Priya',  color: '#9A6A00', about: 'Vegetables over coals. Fish when it’s good.' },
    { id: 'dana',   name: 'Dana',   color: '#3F5E2A', about: 'A kettle and a drum smoker. Sauce person.' },
    { id: 'teo',    name: 'Teo',    color: '#4C3A66', about: 'Flat top, pellet grill, too many rubs.' },
    { id: 'lena',   name: 'Lena',   color: '#1F5A63', about: 'Finds the good tins. Grills fish whole.' },
  ];

  const entries = [
    // ---- recipes
    { id: 'r-chuck', kind: 'recipe', by: 'marcus', at: ago(1.4), title: 'Smoked chuck roast', aka: 'The poor man’s brisket',
      photos: ph('chuck.svg', 'marcus'), serves: '6', cut: 'Chuck, 3–4 lb', heat: '250°F', time: '6–7 hr', wood: 'Post oak',
      note: 'Half the price of brisket and done by dinner. Don’t trim much. The fat is the point.',
      ingredients: ['1 chuck roast, 3 to 4 lb', '2 tbsp kosher salt', '2 tbsp coarse black pepper', '1 tsp granulated garlic', '2 tbsp yellow mustard, to bind', '½ cup beef stock, for the wrap'],
      steps: ['Salt the roast the night before and leave it uncovered in the fridge.', 'Bring the smoker to 250°F with post oak. Slather the roast with mustard, then coat it with the pepper and garlic.', 'Smoke fat side up until the bark sets and the middle reads 165°F, about 4 hours.', 'Wrap it tight in butcher paper with the stock. Put it back on until a probe slides in like soft butter, around 203°F.', 'Rest it in a dry cooler for an hour. Slice against the grain, or pull it.'] },
    { id: 'r-cabbage', kind: 'recipe', by: 'priya', at: ago(5), title: 'Charred cabbage with anchovy butter', aka: 'The side that upstages the meat',
      photos: ph('cabbage.svg', 'priya'), serves: '4', heat: 'Direct, hot', time: '25 min',
      note: 'Burn it more than feels right. The black edges are where the flavor is.',
      ingredients: ['1 green cabbage, cut in 6 wedges through the core', '2 tbsp olive oil', '6 tbsp butter', '6 anchovy fillets', '2 cloves garlic, grated', '1 lemon', '1 tsp chili flakes'],
      steps: ['Oil and salt the wedges. Grill over direct heat, turning, until each cut side is deeply charred, about 8 minutes a side.', 'Move them to the cool side, cover, and let them soften for 10 minutes.', 'Melt the butter with the anchovies and garlic until the anchovies dissolve.', 'Spoon the butter over the wedges. Finish with lemon juice and chili flakes.'] },
    { id: 'r-thighs', kind: 'recipe', by: 'dana', at: ago(9), title: 'White sauce chicken thighs', aka: 'Dunked, not brushed',
      photos: ph('thighs.svg', 'dana'), serves: '4', cut: 'Bone-in thighs', heat: '375°F', time: '45 min', wood: 'Cherry',
      note: 'The whole trick is dunking the thighs in the sauce the second they come off.',
      ingredients: ['8 bone-in, skin-on chicken thighs', '1 tbsp kosher salt', '2 tsp black pepper', '1 tsp smoked paprika', '2 cups Alabama white sauce'],
      steps: ['Season the thighs and leave them out for 30 minutes.', 'Cook skin side up over indirect heat at 375°F with a chunk of cherry until they read 175°F.', 'Crisp the skin over direct heat for a minute or two.', 'Dunk each thigh in white sauce and let it drip. Serve more sauce on the side.'] },
    { id: 'r-tritip', kind: 'recipe', by: 'john', at: ago(16), title: 'Santa Maria tri-tip', aka: 'With chimichurri, because I can’t help it',
      photos: ph('tritip.svg', 'john'), serves: '6', cut: 'Tri-tip, 2½ lb', heat: '225°F, then direct', time: '75 min', wood: 'Red oak',
      note: 'The grain changes direction halfway across a tri-tip. Cut it in two where it turns, then slice each half against its own grain.',
      ingredients: ['1 tri-tip, about 2½ lb', '1 tbsp kosher salt', '1 tbsp coarse black pepper', '2 tsp garlic powder', '1 cup parsley, chopped', '3 cloves garlic', '¼ cup red wine vinegar', '½ cup olive oil', '1 tsp chili flakes'],
      steps: ['Rub the tri-tip with the salt, pepper and garlic powder.', 'Cook over indirect heat at 225°F with red oak until it reads 118°F.', 'Sear over the hottest part of the fire, a couple of minutes a side, to 128°F.', 'Stir the parsley, garlic, vinegar, oil and chili flakes together with a pinch of salt.', 'Rest the meat 10 minutes. Slice against the grain and spoon the chimichurri over.'] },
    { id: 'r-burger', kind: 'recipe', by: 'teo', at: ago(22), title: 'Smash burgers on the flat top', aka: '',
      photos: [], serves: '4', heat: 'As hot as it goes', time: '10 min',
      note: 'Smash once, hard, in the first ten seconds. Then leave it alone.',
      ingredients: ['1 lb ground chuck, 80/20', '4 potato buns', '4 slices American cheese', '1 white onion, shaved thin', '2 tbsp butter', 'Pickles and yellow mustard'],
      steps: ['Roll the beef into eight loose 2 oz balls. Do not season yet.', 'Get the flat top smoking hot. Put a ball down, pile onion on top, and smash it flat with a press.', 'Salt it. When the edges are brown and lacy, about 90 seconds, scrape and flip.', 'Cheese on, stack two patties, and toast the buns in butter alongside.'] },
    { id: 'r-peaches', kind: 'recipe', by: 'priya', at: ago(30), title: 'Grilled peaches with burnt honey', aka: '',
      photos: [], serves: '4', heat: 'Medium, direct', time: '8 min',
      note: 'Only worth doing in August.',
      ingredients: ['4 ripe peaches, halved and pitted', '1 tbsp neutral oil', '¼ cup honey', '1 pinch flaky salt', 'Vanilla ice cream'],
      steps: ['Oil the cut sides and grill them face down until marked, about 4 minutes. Flip for 2 more.', 'Cook the honey in a small pan until it darkens and smells like caramel.', 'Pour the honey over the peaches, salt them, and serve with ice cream.'] },

    // ---- rubs and sauces
    { id: 's-coffee', kind: 'sauce', type: 'Rub', by: 'teo', at: ago(3), title: 'Coffee-ancho rub', photos: [], goodOn: 'Brisket, chuck, beef ribs',
      note: 'Use coffee ground for espresso. Coarse grounds stay gritty.',
      ingredients: ['3 tbsp finely ground dark coffee', '2 tbsp ancho chile powder', '2 tbsp kosher salt', '2 tbsp dark brown sugar', '1 tbsp coarse black pepper', '1 tsp ground cumin'],
      steps: ['Mix everything and keep it in a jar. It holds for a month.'] },
    { id: 's-white', kind: 'sauce', type: 'Sauce', by: 'dana', at: ago(9.2), title: 'Alabama white sauce', photos: ph('sauce.svg', 'dana'), goodOn: 'Chicken, smoked turkey',
      note: 'Thin enough to pour. If it coats a spoon like ranch, add vinegar.',
      ingredients: ['1 cup mayonnaise', '¼ cup apple cider vinegar', '1 tbsp prepared horseradish', '1 tbsp lemon juice', '1 tsp coarse black pepper', '1 tsp kosher salt', '½ tsp cayenne'],
      steps: ['Whisk it all together.', 'Rest it in the fridge for at least an hour before using.'] },
    { id: 's-mustard', kind: 'sauce', type: 'Sauce', by: 'marcus', at: ago(26), title: 'Mustard gold', photos: [], goodOn: 'Pulled pork',
      note: 'Carolina style. Sharp first, sweet second.',
      ingredients: ['1 cup yellow mustard', '⅓ cup apple cider vinegar', '¼ cup honey', '2 tbsp brown sugar', '1 tbsp Worcestershire sauce', '1 tsp hot sauce'],
      steps: ['Simmer everything for 10 minutes, stirring.', 'Cool it and bottle it. Better the next day.'] },
    { id: 's-441', kind: 'sauce', type: 'Rub', by: 'john', at: ago(34), title: 'Four-four-one', photos: ph('rub.svg', 'john'), goodOn: 'Anything beef',
      note: 'Four parts pepper, four parts salt, one part garlic. That’s all it is.',
      ingredients: ['4 tbsp coarse black pepper', '4 tbsp kosher salt', '1 tbsp granulated garlic'],
      steps: ['Shake it together in a jar.'] },

    // ---- methods
    { id: 'm-ribs', kind: 'method', by: 'teo', at: ago(7), title: 'St. Louis ribs, no wrap', photos: ph('ribs.svg', 'teo'),
      cut: 'St. Louis spares', heat: '275°F', time: '5 hr', wood: 'Post oak', pullAt: 'When the rack bends and cracks',
      note: 'No foil, no paper. The bark stays crisp and you don’t have to babysit a wrap.',
      steps: ['Pull the membrane. Rub the night before.', 'Bone side down at 275°F. Don’t open the lid for the first 2 hours.', 'Spritz with cider vinegar every 45 minutes after that.', 'Lift the rack from one end with tongs. When it bends and the bark cracks, it’s done.'] },
    { id: 'm-butt', kind: 'method', by: 'marcus', at: ago(12), title: 'Pork butt, overnight', photos: ph('smoker.svg', 'marcus'),
      cut: 'Bone-in butt, 8 lb', heat: '250°F', time: '10–12 hr', wood: 'Hickory and apple', pullAt: '203°F',
      note: 'Put it on at 10 at night and sleep through the stall.',
      steps: ['On at 10 pm, fat cap up, with a full firebox.', 'Check the fire once around 2 am. Leave the meat alone.', 'At 165°F, wrap in butcher paper if you want it sooner. I usually don’t.', 'Pull at 203°F, when the bone wiggles free. Rest for an hour before shredding.'] },
    { id: 'm-tritip', kind: 'method', by: 'john', at: ago(18), title: 'Tri-tip, reverse sear', photos: [],
      cut: 'Tri-tip, 2–3 lb', heat: '225°F, then direct', time: '60–75 min', wood: 'Red oak', pullAt: '128°F',
      note: 'Low first, then the fire. Even pink from edge to edge.',
      steps: ['Indirect at 225°F until the middle reads 118°F.', 'Open the vents and get the coals roaring.', 'Sear a couple of minutes a side until it reads 128°F.', 'Rest 10 minutes.'] },
    { id: 'm-spatch', kind: 'method', by: 'dana', at: ago(24), title: 'Spatchcock chicken, hot and fast', photos: [],
      cut: 'Whole chicken, 4 lb', heat: '375°F', time: '75 min', wood: 'Cherry', pullAt: '165°F in the breast',
      note: 'Low and slow makes rubbery skin. Chicken wants heat.',
      steps: ['Cut out the backbone and press the bird flat.', 'Dry brine overnight, uncovered.', 'Indirect at 375°F, legs toward the fire.', 'Pull when the breast reads 165°F.'] },
    { id: 'm-fish', kind: 'method', by: 'lena', at: ago(38), title: 'Whole fish in a basket', photos: [],
      cut: 'Branzino or snapper', heat: 'Direct, medium-high', time: '12–15 min', wood: 'Lump charcoal, no wood', pullAt: 'When the flesh lifts off the spine',
      note: 'The basket is the whole method. No sticking, one flip.',
      steps: ['Oil the fish and the basket well. Stuff the cavity with lemon and herbs.', 'Six or seven minutes a side over direct heat.', 'Check at the thickest point by the spine.'] },

    // ---- finds
    { id: 'f-sardines', kind: 'find', by: 'lena', at: ago(2), title: 'Smoked sardines in olive oil', photos: ph('sardines.svg', 'lena'),
      maker: 'Lantern Cove', price: '$9 a tin', where: 'Online, or the tinned-fish shelf at a good bottle shop', link: 'https://example.com/lantern-cove-sardines',
      note: 'Lightly smoked and packed in good oil. Eat them on buttered toast with lemon, and save the oil for eggs.' },
    { id: 'f-salt', kind: 'find', by: 'priya', at: ago(11), title: 'Smoked flake salt', photos: [],
      maker: 'Saltmarsh & Daughters', price: '$14 a jar', where: 'Online only', link: 'https://example.com/smoked-flake-salt',
      note: 'For finishing, not cooking. It makes grilled vegetables taste like they spent longer on the fire.' },
    { id: 'f-paper', kind: 'find', by: 'marcus', at: ago(14), title: 'Pink butcher paper, 18-inch roll', photos: [],
      maker: 'Holloway Mill', price: '$28', where: 'Any restaurant supply store', link: 'https://example.com/butcher-paper',
      note: 'Unwaxed and uncoated. One roll lasts about two years of weekends.' },
    { id: 'f-thermo', kind: 'find', by: 'teo', at: ago(20), title: 'Instant-read thermometer', photos: [],
      maker: 'Quillon Tools', price: '$65', where: 'Online', link: 'https://example.com/instant-read',
      note: 'Reads in two seconds. I stopped guessing, and I stopped overcooking chicken.' },
    { id: 'f-oak', kind: 'find', by: 'john', at: ago(28), title: 'Post oak splits, delivered', photos: [],
      maker: 'Cinder Creek Wood Co.', price: '$45 a box', where: 'Ships in a week', link: 'https://example.com/post-oak',
      note: 'Dry, fist-sized, and all actual post oak. A box runs a kettle for about six cooks.' },

    // ---- restaurants
    { id: 'p-okra', kind: 'place', by: 'dana', at: ago(4), title: 'Okra & Ash', photos: ph('restaurant.svg', 'dana'),
      city: 'Austin', area: 'East side', order: 'Beef rib, jalapeño sausage', link: 'https://example.com/okra-and-ash',
      note: 'Trailer with a covered patio. They sell out by 2 on weekends, so go early or go on a weekday.' },
    { id: 'p-marigold', kind: 'place', by: 'john', at: ago(15), title: 'Marigold Pit Room', photos: [],
      city: 'Los Angeles', area: 'Highland Park', order: 'Brisket by the half pound, the pickled okra', link: 'https://example.com/marigold',
      note: 'The only place in town where I don’t miss Texas. Counter service, cash tip jar, good beer list.' },
    { id: 'p-secondfire', kind: 'place', by: 'lena', at: ago(21), title: 'Second Fire', photos: [],
      city: 'Los Angeles', area: 'Sawtelle', order: 'Chicken thigh and scallion, tsukune, grilled rice ball', link: 'https://example.com/second-fire',
      note: 'Yakitori over binchotan. Sit at the counter and watch the fire.' },
    { id: 'p-ojo', kind: 'place', by: 'priya', at: ago(33), title: 'Ojo de Brasa', photos: [],
      city: 'Los Angeles', area: 'Boyle Heights', order: 'Costillas, grilled nopales, the house salsa macha', link: 'https://example.com/ojo-de-brasa',
      note: 'Mesquite grill in the parking lot on weekends. Bring cash.' },
    { id: 'p-gable', kind: 'place', by: 'teo', at: ago(36), title: 'Gable & Tallow', photos: [],
      city: 'Austin', area: 'South Lamar', order: 'Brisket burger, tallow fries', link: 'https://example.com/gable-and-tallow',
      note: 'They grind the trim from the pit into the burgers. It tastes like it.' },
    { id: 'p-fogbank', kind: 'place', by: 'marcus', at: ago(40), title: 'Fogbank Barbecue', photos: [],
      city: 'Oakland', area: 'Temescal', order: 'Hot links, pork ribs, the greens', link: 'https://example.com/fogbank',
      note: 'Proper smoke in the Bay. Saturday only for the beef ribs.' },
    { id: 'p-quindaro', kind: 'place', by: 'dana', at: ago(45), title: 'Quindaro Smoke', photos: [],
      city: 'Kansas City', area: 'Strawberry Hill', order: 'Burnt ends, the cheesy corn', link: 'https://example.com/quindaro-smoke',
      note: 'Order at the window. The burnt ends are worth the flight.' },
    { id: 'p-hackberry', kind: 'place', by: 'marcus', at: ago(50), title: 'Hackberry Street Meats', photos: [],
      city: 'Lockhart', area: 'Off the square', order: 'Fatty brisket, original sausage, no sauce', link: 'https://example.com/hackberry',
      note: 'Meat market first, restaurant second. Butcher paper, white bread, a knife if you ask.' },

    // ---- private: only the person who added these sees them
    { id: 'x-john-ribs', kind: 'recipe', private: true, by: 'john', at: ago(3), title: 'Braised short ribs, still testing', aka: 'Not ready for the group',
      photos: [], serves: '4', cut: 'English-cut short ribs', heat: '300°F', time: '3½ hr',
      note: 'Third attempt. The sauce is close but still too sweet.',
      ingredients: ['4 lb bone-in short ribs', '1 tbsp kosher salt', '1 onion, sliced', '4 cloves garlic', '2 tbsp tomato paste', '2 cups red wine', '2 cups beef stock', '2 dried guajillo chiles'],
      steps: ['Salt the ribs and sear them hard over direct heat.', 'Soften the onion and garlic in a Dutch oven on the grill. Stir in the tomato paste.', 'Add the wine, stock and chiles. Nestle the ribs in.', 'Cover and braise over indirect heat at 300°F until a fork slides in, about 3 hours.'] },
    { id: 'x-john-salt', kind: 'sauce', type: 'Rub', private: true, by: 'john', at: ago(13), title: 'House steak salt', photos: [], goodOn: 'Ribeye, tri-tip',
      note: 'Mine. Not sharing until I stop changing it.',
      ingredients: ['3 tbsp flaky salt', '1 tbsp coarse black pepper', '1 tsp porcini powder', '½ tsp granulated garlic'], steps: ['Grind the pepper fresh. Mix and keep it in a tin.'] },
    { id: 'x-marcus-inject', kind: 'sauce', type: 'Sauce', private: true, by: 'marcus', at: ago(8), title: 'Competition brisket injection', photos: [], goodOn: 'Brisket',
      note: 'Nobody gets this one.', ingredients: ['2 cups beef stock', '2 tbsp Worcestershire sauce'], steps: ['Whisk and inject the flat.'] },

    // ---- already in the trash, so the trash has something to show
    { id: 'r-wings', kind: 'recipe', by: 'teo', at: ago(42), title: 'Lemon pepper wings, first try', photos: [], note: 'Too salty. Trashing this until I fix it.',
      ingredients: ['2 lb wings', '2 tbsp lemon pepper'], steps: ['Grill until crisp.'], trashedAt: ago(6), trashedBy: 'teo' },
  ];

  const mark = (entryId, by, rating, note, d) => ({ id: `k-${entryId}-${by}`, entryId, by, rating, note, at: ago(d) });
  const marks = [
    mark('r-chuck', 'dana', 4, 'Mine stalled at 160 for two hours. Start earlier than you think.', 0.2),
    mark('r-chuck', 'priya', 5, 'Wrapped at 165 and it pulled like brisket. Making it again Sunday.', 0.9),
    mark('f-sardines', 'john', 5, 'On toast with butter and lemon. Bought six more tins.', 1.1),
    mark('p-okra', 'teo', 4, 'Get the beef rib. Skip the sides.', 2),
    mark('s-white', 'lena', 4, 'Halved the horseradish. It still bites.', 3),
    mark('f-sardines', 'marcus', 3, 'Good, not life-changing. The smoke is light.', 1.6),
    mark('r-cabbage', 'teo', 5, 'Didn’t expect cabbage to be the thing people fought over.', 4),
    mark('s-coffee', 'dana', 4, 'Great on chuck. Too bitter on chicken.', 2.5),
    mark('m-ribs', 'priya', 3, 'Good bark, but mine ran dry at 5 hours. More spritz next time.', 6),
    mark('m-butt', 'john', 5, 'Slept through the stall. Best pulled pork I’ve made.', 8),
    mark('r-tritip', 'marcus', 4, 'Red oak makes it. I tried mesquite once and it was too much.', 13),
    mark('p-okra', 'john', 5, 'Went on a Tuesday, no line. The sausage is the sleeper.', 3.5),
    mark('p-marigold', 'marcus', 5, 'Closest thing to Lockhart I’ve had west of El Paso.', 12),
    mark('p-marigold', 'lena', 4, 'Brisket was great. Sides were an afterthought.', 10),
    mark('r-thighs', 'john', 4, 'Dunking is the move. I used pecan instead of cherry.', 7),
    mark('f-paper', 'dana', 5, 'Finally stopped using foil.', 9),
  ];
  // ---- private notebooks. Each person only ever sees their own.
  const notes = [
    { id: 'n-john-1', by: 'john', date: dayAgo(2), at: ago(2), aboutId: 'r-tritip', title: 'Tri-tip for six', cut: 'Tri-tip, 2.6 lb', heat: '225°F, then direct', time: '70 min', wood: 'Red oak',
      text: 'Pulled at 126 and it carried over to 133, a touch past where I want it. Pull at 122 next time.\nChimichurri needed more vinegar.' },
    { id: 'n-john-2', by: 'john', date: dayAgo(9), at: ago(9), title: 'Kettle vents',
      text: 'Bottom vent a pencil-width open, top vent fully open. Holds 250 for about four hours on one chimney. Stop fiddling with it.' },
    { id: 'n-john-3', by: 'john', date: dayAgo(20), at: ago(20), title: 'Things to try',
      text: 'Dana’s white sauce on smoked turkey.\nAsk Marcus where he gets his post oak.\nDry brine the next chicken two days, not one.' },
    { id: 'n-marcus-1', by: 'marcus', date: dayAgo(6), at: ago(6), title: 'Brisket, second try this month', cut: 'Packer, 13 lb', heat: '250°F', time: '13 hr', wood: 'Post oak',
      text: 'Flat came out dry again. Wrap earlier, at 160, and rest longer.' },
  ];
  return { people, entries, marks, notes };
}
