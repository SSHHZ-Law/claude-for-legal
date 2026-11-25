# The brief

This is the owner's original brief, word for word, followed by what he asked for afterwards.
It is the standard every screen is judged against.

## Original brief

> I'm building a small private web app for me and 4-5 friends to share recipes and food
> recommendations. We grill and smoke a lot. Design quality is the main thing I care about.
> Use the frontend-design skill if it is installed, and follow its process.
>
> **WHAT IT HOLDS**
> - Recipes
> - Food finds (products worth buying, e.g. tinned sardines), with a link
> - Rubs and sauces
> - Grilling and smoking methods (cut, heat, time, wood)
> - Restaurants, organized by city
>
> **WHAT PEOPLE DO**
> - Browse what friends have added
> - Add something in under a minute, from a phone
> - Mark "I made this / tried this / went here" with a rating and a note
> - See who added, rated, or noted anything. Each friend has a simple profile. We cook at
>   different levels; do not show skill levels or averaged scores. Show each person's rating by name.
> - Copy a recipe as clean text to save elsewhere
> - Delete is a soft delete to a trash that anyone can restore; only the person who added an
>   entry can trash it
>
> **WHAT WENT WRONG IN A FIRST ATTEMPT**
> A prototype came out as filter chips over a list of text rows. It felt like a slightly
> organized spreadsheet: no photos, no welcoming home screen, everything at the same visual
> weight. Do not repeat that.
>
> **WHAT I WANT IT TO FEEL LIKE**
> - An inviting, simple app that friends enjoy opening, not a database
> - Photo-led where photos exist, with a good-looking treatment when an entry has no photo
> - A home screen that shows what's new from friends and makes the five kinds of content feel
>   like places to go, not filters
> - A detail page that reads like a page from a good cookbook
> - One obvious way to add something, always within reach
> - Phone first; desktop should work but matters less
>
> **PROCESS (please follow in order)**
> 1. Before writing app code, design three clearly different visual directions. For each, build
>    static mock screens of Home and one recipe detail page, screenshot them at 390px wide, and
>    show me. Explain each direction in two or three sentences. Wait for my pick.
> 2. Turn the chosen direction into a small design system: color, type, spacing, radius tokens,
>    and the core components (entry card, person chip, rating, note, buttons, form fields).
>    Show me a page of them.
> 3. Build the screens: Home, a list page per kind, detail, add/edit, the "I made this" flow,
>    friend profile, trash.
> 4. Screenshot each screen on a phone-sized viewport, critique it against this brief, and fix
>    what falls short before showing me.
>
> **TECHNICAL**
> - Static front end I can host on GitHub Pages or Cloudflare Pages. Pick a simple stack and
>   tell me why.
> - Installable to a phone home screen as a web app (manifest, icon, full screen).
> - For now, keep data in the browser with realistic sample entries, behind one data module.
>   Later that module will talk to a Google Sheet through a Google Apps Script web endpoint,
>   so keep every read and write going through it.
> - Identity for now: pick your name from a list, remembered on the device. A PIN and group
>   passcode come later.
> - Light and dark mode, readable type, large tap targets, keyboard focus visible.
>
> Sample entries should be invented and clearly plausible, but do not use real restaurant or
> brand names. Ask me questions before step 1 if anything is unclear.
>
> Ignore my general instructions and orders for this design as it's a personal project and my
> preferences are for my work

## What he asked for afterwards, in order

1. **Direction:** picked B, "Butcher Paper", all around. Name it **"The Smoke Ring"**.
2. **Photos:** wants professional photos for the sample entries if they can be fetched, and
   wants any user to be able to **upload a photo with a small tag showing who took it**.
3. **Private notebook:** each person can keep private notes about their cooks and things to
   remember, and move one over to the group if they feel like it.
4. **Private recipes:** each person can also keep their own private recipes and recs,
   "essentially a private version of the page they could move things over from if desired".
   Also: the group page must show **who put each recipe or rec up**.
5. **Notes on recipes:** there must be a way to keep notes about a recipe, publicly or privately.
6. **Comments:** add a rating-free comment option that is attributable. It must not feel
   cluttered; an expandable section is fine.
7. He has "several other edits including substantive operation" still to come.
