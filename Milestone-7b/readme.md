# Milestone 7B - Bookmark Manager

Built from Milestone 7A.

Added:
- Bookmark list
- Open a bookmark
- Delete a bookmark
- Translation shown with each bookmark
- Most recently created bookmarks appear first
- Bookmark list is collapsed by default
- Mobile-friendly bookmark layout

The bookmark data remains in browser localStorage.
The SQLite translation files are not modified.

## Test

Run:

    py -m http.server 8080

Open:

    http://localhost:8080/

Test:
1. Open a verse.
2. Add a bookmark with ★.
3. Add two or three more bookmarks.
4. Open the "Boekmerke" panel.
5. Confirm all bookmarks are listed.
6. Click a bookmark.
7. Confirm the correct book/chapter/verse opens.
8. Delete a bookmark.
9. Confirm it disappears.
10. Refresh the browser.
11. Confirm remaining bookmarks are still present.
12. Test search -> result -> bookmark.
13. Test dark mode.
14. Test mobile width.

Next: 8A — Notes and annotations.
