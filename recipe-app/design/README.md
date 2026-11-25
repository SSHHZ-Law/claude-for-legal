# Design directions (step 1)

Static mock screens for three visual directions. Not app code.

- `directions/a-enamel`, `b-butcher-paper`, `c-picnic`: `home.html` and `detail.html`, viewable by opening the file.
- `src/` + `build.mjs`: the templates that generate them (`node build.mjs`).
- `standins/`: blurred SVG stand-ins used where photos will go (`node standins/gen.mjs`). They are not photographs.
- `fonts/`: Besley, Hanken Grotesk, Big Shoulders, Archivo, Bricolage Grotesque (latin subsets from Google Fonts, SIL Open Font License).
