# Milestone 6A = Bible Search

This milestone adds basic full-Bible search against the currently loaded
SQLite translation.

Features:
- Search a word or phrase
- Case-insensitive SQLite LIKE search
- Up to 100 results
- Shows book, chapter and verse
- Shows the matching verse
- Click a result to jump directly to that verse
- Works on desktop and mobile
- Does not modify the supplied SQLite database

Example:

    Search: liefde

Results:

    Genesis 1:1
    ...

The search uses the existing `verses` table and `unformatted` column.

## Test

Run:

    py -m http.server 8080

Open:

    http://localhost:8080/

Use Edge.

Test:
1. Confirm AFR53 loads.
2. Enter a common word such as `die`.
3. Click Soek.
4. Results should appear.
5. Click a result.
6. The app should jump to the correct book/chapter/verse.
7. Search for a phrase.
8. Search for something that does not exist.
9. Confirm no results message.
10. Test search on mobile-width layout.
11. Confirm the existing reading position, font-size and theme still work.

Next: 6B — improve search matching and filtering.
