# The Smoke Ring

A small private web app for a handful of friends to share recipes, rubs and sauces,
grilling and smoking methods, food finds, and restaurants.

## Run it

It is plain HTML, CSS and JavaScript modules. There is no build step and nothing to install.
Browsers will not load JavaScript modules from a `file://` page, so serve the folder:

    cd recipe-app
    python3 -m http.server 8000      # then open http://localhost:8000

## Host it

Publish this folder as-is on GitHub Pages or Cloudflare Pages (no build command, output
directory = this folder). All paths are relative and routing uses the URL hash, so it works
from a subpath such as `https://you.github.io/smoke-ring/` with no server rewrites.

On a phone, open the site and use Share, then Add to Home Screen. It opens full screen and
keeps working offline (`sw.js` is network-first with a cache fallback, and only registers over https).

## Where things are

| Path | What it is |
| --- | --- |
| `index.html` | The one page |
| `css/app.css` | Design tokens (colour, type, spacing, radius), then components, then screens |
| `js/data.js` | **The one data module.** Every read and write goes through it |
| `js/seed.js` | Invented sample people, entries and verdicts |
| `js/ui.js` | Shared pieces: cards, person chips, rating stamps, posters, copy-as-text |
| `js/views.js` | Every screen |
| `js/app.js` | Routing, taps, forms |
| `manifest.webmanifest`, `sw.js`, `assets/icons/` | Install-to-home-screen and offline |
| `tests/` | Browser tests and a screenshot script (`node tests/run.cjs`) |
| `BRIEF.md`, `CLAUDE.md` | The owner's brief, and the working notes for continuing the project |
| `design/` | The three direction mocks from step 1 and `system.html`, the design-system page |

## Data, now and later

Today, entries and verdicts are stored in the browser's localStorage and uploaded photos in
IndexedDB, so each phone has its own copy. `js/data.js` is written so that its function
bodies can be replaced with `fetch()` calls to a Google Apps Script web endpoint backed by a
Sheet: every function is already async and returns plain JSON-shaped objects. Photos will
need somewhere to live at that point (for example a Drive folder the script writes to);
`addPhoto()` is the single place that changes.

Each person also has a private page (`#/private`): private recipes and recs (any entry saved as
"Just me") and a notebook of free-form notes. Private things are only returned to the person who
owns them and never appear in the group's lists, other people's search, or the trash. "Share with
the group" moves a private entry over; sharing a note copies it into a new entry. A note can be
pinned to one entry (`aboutId`), in which case it also shows on that entry's page, to its writer only. Before syncing to a Sheet, decide
whether notes sync at all: the Sheet's owner can read every row, and without a PIN anyone holding
the phone can switch names.

Identity is "pick your name", remembered on the device. A PIN and group passcode are not built.

To wipe a phone back to the sample data, clear the site's storage in the browser settings.

## Sample content

People, restaurants and brands in `js/seed.js` are invented, and the product links point at
`example.com`. The pictures in `assets/photos/` are blurred stand-in illustrations, not
photographs; replace them and point the `photos` entries in `seed.js` at the new files.

Fonts: Big Shoulders and Archivo, latin subsets, SIL Open Font License.
