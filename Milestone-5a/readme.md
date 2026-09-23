# Milestone 5A - Reading experience

This milestone improves only the Bible reading presentation.

It does NOT intentionally change:

- SQLite database access
- Translation loading
- Book navigation
- Chapter navigation
- Verse navigation

### Changes

- Comfortable maximum reading width.
- Improved chapter heading.
- Larger, more readable verse typography.
- Improved line height and verse spacing.
- Clearer verse numbers.
- Selected verse highlighting.
- Better mobile spacing.
- Better desktop spacing.
- Reading controls remain unchanged.

## Test

Run:

```text
py -m http.server 8080
```

Open:

```text
http://localhost:8080/
```

Test in Microsoft Edge.

### Test checklist

1. AFR53 loads.
2. Genesis 1 displays.
3. Verse text is comfortable to read.
4. Verse numbers are clearly visible.
5. Selecting a verse still highlights it.
6. Selecting a verse still scrolls it into view.
7. Book navigation still works.
8. Chapter navigation still works.
9. Previous/Next still works.
10. Resize the browser to phone width and confirm the text remains readable.

If all ten tests pass, Milestone 5A is complete.

## Next

Milestone 5B will add reading controls such as font-size adjustment.
