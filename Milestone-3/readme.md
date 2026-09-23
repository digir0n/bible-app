# Milestone 3 — Navigation redesign

Improved UI before adding more functionality.

Changed the current selectors into a more deliberate Bible navigation system:

1. Old Testament / New Testament grouping
2. Book names and abbreviations
3. Chapter grid instead of a long dropdown
4. Verse grid
5. Better mobile layout
6. Previous/Next navigation
7. Clear current-location display, e.g. AFR53 • Gen 1:10
8. Preserve the selected verse when navigating
9. Make the interface suitable for both mouse and touch

## Run

### Python

```bash
py -m http.server 8080
```

Then open:

http://localhost:8080/

## What's changed

1. The top of the application now has a much cleaner location indicator:

Bible        AFR53 · GÉNESIS 1:1        ☰

Click ☰ to open the navigation.

2. Translation

Currently:

AFR53

The structure is ready for us to add more SQLite translations later.

3. Books

Books are now separated into:

OU TESTAMENT

GÉNESIS
EXODUS
LEVÍTIKUS
...

and:

NUWE TESTAMENT

MATTEUS
MARKUS
LUKAS
...

The books are still read directly from your SQLite books table — nothing is hard-coded.

4. Chapters

Instead of a dropdown containing 50 items, you'll get a chapter grid:

1  2  3  4  5  6  7  8  9  10
11 12 13 14 15 16 17 18 19 20
...
5. Verses

The current chapter's verses are also available as a grid:

1  2  3  4  5  6  7  8  9  10
11 12 13 14 15 16 17 18 19 20
...

Selecting verse 10 will:

Close the navigation panel.
Scroll to verse 10.
Highlight the selected verse.
Change the location to:
AFR53 · GÉNESIS 1:10
Mobile

The same navigation adapts to a phone, with the book buttons and number grids becoming narrower.

One architectural improvement

I've also changed the application state to explicitly maintain:

{
    translation: "AFR53",
    book: "Gen",
    chapter: 1,
    verse: 10
}
