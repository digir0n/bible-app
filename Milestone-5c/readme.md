# Milestone 5C - Remember last reading position

The app now remembers the last place read using browser `localStorage`.

It saves:

- Translation
- Book
- Chapter
- Verse

The static SQLite translation database is not modified.

### How it works

When a chapter is loaded, the current position is saved as JSON under:

    bible.readingPosition

When AFR53 starts, the app checks the saved translation. If it matches,
it restores the saved book, chapter and verse. If it is missing or invalid,
it safely starts at the first book and chapter 1.

### Test

Run:

    py -m http.server 8080

Open in Microsoft Edge:

    http://localhost:8080/

Test in this order:

1. Open the app.
2. Go to Genesis chapter 3.
3. Select verse 12.
4. Refresh the page.
5. Confirm Genesis 3:12 returns.
6. Go to another book/chapter/verse.
7. Refresh again and confirm the new position returns.
8. Test A−, A and A+.
9. Test book, chapter and verse navigation.
10. Test Previous/Next.

If all tests pass, Milestone 5C is complete.

## Important

This milestone deliberately uses `localStorage` instead of adding tables
to the Bible SQLite file. Later, when we build the full application,
reading position can move into the application's separate SQLite database.

Next milestone: 5D — theme and reading preferences.
