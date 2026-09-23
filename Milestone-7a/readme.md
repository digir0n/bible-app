# Milestone 7A - Bookmarks

Built from Milestone 6C.

The current verse can now be bookmarked using the star button:

    ☆

A bookmarked verse shows:

    ★

Bookmarks are stored in browser localStorage and are independent of the
supplied SQLite translation files.

Each bookmark stores:
- translation
- book OSIS
- book display name
- chapter
- verse
- creation timestamp

The bookmark identity includes translation + book + chapter + verse, so
the same reference in different translations can be bookmarked separately.

This milestone intentionally provides the bookmark mechanism first.
The bookmark list/manager comes in the next step.

## Test

Run:

    py -m http.server 8080

Open:

    http://localhost:8080/

Test:
1. Open a known verse.
2. Click ☆.
3. Confirm it changes to ★.
4. Navigate to another verse.
5. Confirm its button is ☆.
6. Return to the bookmarked verse.
7. Confirm it is ★.
8. Click ★.
9. Confirm it becomes ☆.
10. Refresh the browser.
11. Return to the bookmarked verse and confirm the bookmark remains.
12. Test dark mode.
13. Test font size.
14. Test search and clicking a search result.

Next: 7B — Bookmark list and navigation.
