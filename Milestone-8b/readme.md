# Milestone 8B - Notes Manager

Built from Milestone 8A.

Added:
- Notes Manager
- Wys / Versteek
- Search notes
- Clear search
- Open note
- Edit note
- Delete note
- Jump to verse
- Persistent notes
- Mobile layout

Notes remain in browser localStorage under `bible.notes`.

The supplied AFR53 SQLite database remains read-only.

## Test

Run:

    py -m http.server 8080

Open:

    http://localhost:8080/

Use Ctrl+F5.

Test:
1. Create several notes on different verses.
2. Open Notes and click Wys.
3. Confirm notes appear.
4. Click Versteek and confirm they disappear.
5. Search by book name.
6. Search by note text.
7. Clear search.
8. Click Maak oop.
9. Confirm the Bible navigates to the verse.
10. Click Wysig and change the note.
11. Delete a note.
12. Refresh and confirm remaining notes persist.
13. Test mobile width and dark mode.

Next milestone: 9 — Multiple Translations.
