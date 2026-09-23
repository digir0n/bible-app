# Milestone 5D - light/dark theme

Adds a persistent light/dark reading theme.

Controls:
- ☾ = switch to dark theme
- ☀ = switch back to light theme

The selected theme is stored in localStorage.

This milestone does not change:
- SQLite
- translation loading
- book navigation
- chapter navigation
- verse navigation
- saved reading position
- font-size controls

## Test

Run:

    py -m http.server 8080

Open:

    http://localhost:8080/

Use Microsoft Edge.

Checklist:
1. AFR53 loads.
2. Bible text displays.
3. Click the ☾ button.
4. Background and reader change to dark.
5. Click ☀.
6. Light theme returns.
7. Refresh and confirm the selected theme remains.
8. Confirm A− / A / A+ still works.
9. Confirm saved book/chapter/verse still works.
10. Confirm normal navigation still works.
11. Resize to mobile width and test the theme button.

Next milestone: 6A — Bible search.
