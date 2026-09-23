# Milestone 6B - Improved Bible Search

Built from Milestone 6A.

Added:

- Phrase search
- All-words search
- Whole Bible scope
- Current-book scope
- Search-result highlighting
- Click result -> book/chapter/verse
- Existing saved reading position remains active
- Existing font-size and theme remain active

### Phrase

Search:

    God is liefde

The complete phrase must occur in the verse.

### Alle woorde

Search:

    God liefde

The words can occur separately in the same verse.

### Scope

Whole Bible:

    Hele Bybel

Current book:

    Huidige boek

### Test

Run:

    py -m http.server 8080

Open:

    http://localhost:8080/

Test:
1. Search for a common word.
2. Verify results.
3. Select Phrase.
4. Search for a phrase.
5. Select Alle woorde.
6. Search for two words.
7. Select Huidige boek.
8. Search again and confirm results are limited to the current book.
9. Click a result and confirm the correct verse loads.
10. Confirm the matching words are highlighted.
11. Test dark mode.
12. Test mobile width.

Next: 6C — better reference formatting and search result navigation/history.
