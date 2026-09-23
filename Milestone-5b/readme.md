# Milestone 5B - Font size

This milestone adds simple reading font-size controls.

Controls:

    A−    A    A+

A− makes the Bible text smaller.
A resets it to the default size.
A+ makes it larger.

The selected size is saved in browser localStorage, so it survives a
page refresh.

No SQLite code, translation loading, or Bible navigation was changed.

## Test

Run:

    py -m http.server 8080

Open:

    http://localhost:8080/

Use Microsoft Edge.

Test:

1. AFR53 loads.
2. Bible text displays.
3. A− makes text smaller.
4. A+ makes text larger.
5. A returns to normal.
6. Refresh keeps the selected size.
7. Book navigation still works.
8. Chapter navigation still works.
9. Verse navigation still works.
10. Previous/Next still works.

If all tests pass, Milestone 5B is complete.

Next milestone: 5C — remember the last translation/book/chapter/verse.
