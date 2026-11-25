# The Smoke Ring: notes for whoever picks this up

A small private web app for one owner and 4-5 friends to share recipes, rubs and sauces,
grilling and smoking methods, food finds and restaurants. Design quality is what the owner
cares about most.

**Read these first:** `BRIEF.md` (his brief and every later request), then `README.md`
(how to run it, where things are). This file is the working state. **Update the "Where things
stand" section at the end of every session, then commit and push**, so nothing is lost when
the container is thrown away.

## Ground rules

- **Where the work lives:** `recipe-app/` on branch `claude/recipe-sharing-app-68sjhj` of
  `SSHHZ-Law/claude-for-legal`. Everything outside `recipe-app/` is the firm's unrelated
  legal-plugin repo: do not touch it. Commit and push to that branch after every change the
  owner asks for; the owner has said to keep working there. Do not open a pull request unless asked.
- **This is a personal project.** The owner said his standing work instructions (legal research
  tools, citation rules, rules-compliance checks, and so on) do not apply here. Plain, direct
  answers; no legal framing.
- **Follow his process:** build, screenshot at 390px wide, critique against `BRIEF.md`, fix what
  falls short, and only then show him. Send him the screenshots.
- **Say what was and was not tested.** He wants that stated plainly every time.

## How to check your work

    node tests/run.cjs            # all browser tests (flow, private, notes, comments); must all pass
    node tests/screens.cjs        # every screen at 390px into design/screens/light (add "dark" for dark)

The tests drive headless Chromium with Playwright and serve the app from disk through request
interception, so **no local web server is needed** (starting a background server was refused by
the permission checker in an earlier session). Add checks to the matching test file when you add
behaviour, especially anything touching privacy.

## Design system: Butcher Paper

Source of truth is the token block at the top of `css/app.css`; `design/system.html` shows it.

- **Idea:** a smokehouse counter. Peach butcher paper, deli-paper cards, heavy wood type,
  order tickets with a torn edge, a black menu board, rubber stamps.
- **Colour roles:** paper = page; deli paper = cards and fields; char = text and rules;
  sauce red = the one main action on a screen, stamps, ratings; mustard = on the black board
  and tab bar only. Dark mode swaps the tokens; check both.
- **Type:** Big Shoulders (uppercase, 800-900) for titles and anything stamped; Archivo for
  everything you read. Nothing below 12.5px. Small labels are sentence case, never all caps.
- **Shape:** paper is cut square. Only stamps, rating scores and people are round.
- **One red button per screen.** Everything else is outlined or underlined. Tap targets 48px.
- **Cards:** `ticket` (big, photo-led, torn edge) for the newest thing and the head of a list;
  `slip` (small) for the rest; `pitrow` for methods and restaurants. With no photo the card
  becomes a type poster (`poster()` in `js/ui.js` fits the words with the real font).
- **Edges mean something:** red left edge = a public verdict by name; grey edge = a public
  comment; dark edge plus a lock = private, only its owner sees it.
- **Avoid:** filter chips over text rows (the failed first prototype), averaged scores, skill
  levels, decorative numbering, gradient washes, middle-dot strings, arrows on buttons.
- **Words:** plain verbs, sentence case in running text, a button and its toast use the same
  word ("Save note" then "Note saved"). Errors say what to do next.

## Rules the code must keep

- **Every read and write goes through `js/data.js`.** It is async and returns plain objects so it
  can later call a Google Apps Script endpoint. Do not touch localStorage or IndexedDB elsewhere
  (one line in `index.html` reads the saved theme before first paint).
- **Ratings are shown per person, by name.** Never average, rank or total them.
- **Attribution everywhere:** every entry, verdict, comment and photo shows who it came from.
- **Private stays private.** Private entries (`private: true`) and notes are only returned to
  their owner. They must never appear in group lists, counts, public profiles, other people's
  search, copy-as-text, or the shared trash. They are deleted outright (with Undo), not trashed.
- **Trash:** only the adder can trash a group entry; anyone can restore it.
- **Sample data is invented.** No real restaurant or brand names. The current names were
  checked by web search; check any new ones the same way.
- No build step and no dependencies. Relative paths and hash routing, so it can be served from
  any folder on GitHub Pages or Cloudflare Pages.

## Where things stand

Built and passing tests (90 checks):
- Name picker; Home (newest ticket, "Also fresh", the board of five kinds, "Lately" feed of
  verdicts and comments); a list page per kind (restaurants by city); detail; add and edit;
  "I made this / tried this / went here" with a rating and note; friends and profiles; trash; search.
- Photo upload on add, on an entry, and with a verdict, each tagged "Photo: Name".
- Copy as text. Light and dark mode. Manifest, icons and a network-first service worker.
- Private page per person: private recipes and recs ("Just me" switch on the add form) and a
  notebook. "Share with the group" moves a private entry over (with Undo); sharing a note
  copies it into a new entry. A note can be pinned to one entry and then shows on that
  entry's page, to its writer only.
- Comments: public, by name, no rating, any number per person, collapsed to one row on the
  entry until opened. The writer can delete their own.

Not done, or waiting on the owner:
- **Photos are blurred stand-in illustrations** (`assets/photos/*.svg`), not photographs.
  Photo sites were blocked by the environment's network policy. If the network is now open,
  fetch licensed photos (Unsplash was the plan), save them into `assets/photos/`, credit the
  photographer in each photo's `credit` field in `js/seed.js`, and replace the stand-ins.
- **Never run on a real phone.** Install-to-home-screen and offline have not been exercised;
  they need an https host. The clipboard was checked through a recorder, not the real one.
- **Hosting:** this sits in the firm's repo. It needs its own repository (or Cloudflare Pages
  pointed at this folder) before it can be installed on a phone. Owner has not decided.
- **Friends' real first names** for the name picker. Still the invented five plus John.
- **Later, per the brief:** a PIN and group passcode; the Google Sheet through Apps Script.
  Before syncing, decide whether private entries and notes sync at all, since the Sheet's owner
  can read every row, and without a PIN anyone holding the phone can switch names.
- Choices made on the owner's behalf that he may want changed: sharing a private recipe moves
  it, sharing a note copies it; there is no "make private again" once something is with the
  group (only the Undo); one verdict per person per entry, where changing it replaces the note.
- The owner has said more edits are coming, some of them substantial. None are specified yet.
