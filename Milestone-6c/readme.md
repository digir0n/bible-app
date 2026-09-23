# Milestone 6C - Search user experience

Built from Milestone 6B.

Added:
- Clear search button
- Search history
- Last 10 searches remembered in localStorage
- Selecting a previous search runs it again
- Escape clears the search
- Search history survives a refresh
- Mobile-friendly search controls

Existing features remain:
- Phrase search
- All-words search
- Whole Bible/current book scope
- Highlighted search terms
- Click result -> correct book/chapter/verse
- Theme
- Font size
- Reading-position persistence

## Test

Run:

    py -m http.server 8080

Open:

    http://localhost:8080/

Test:
1. Search for `die`.
2. Search for `God`.
3. Search for `liefde`.
4. Refresh the page.
5. Open "Onlangse soektogte".
6. Select an earlier search.
7. Confirm it runs again.
8. Click ✕ and confirm the results disappear.
9. Type a search and press Escape.
10. Confirm the search is cleared.
11. Test phrase/all-words.
12. Test current-book scope.
13. Click a result and verify the correct verse.
14. Test dark mode and mobile width.

Next milestone: 7A — Bookmarks and reading history.
