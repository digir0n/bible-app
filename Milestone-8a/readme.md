# Milestone 8A - Personal Notes

Built from Milestone 7B.

Added:
- Personal note button for the current verse
- Add note
- Edit note
- Save note
- Delete note
- Cancel/close note editor
- Note persistence using browser localStorage
- Notes remain separate from the supplied SQLite translation databases
- Translation + book + chapter + verse identify a note

Storage key:

    bible.notes

Each note contains:
- translation
- book
- bookHuman
- chapter
- verse
- text
- createdAt
- updatedAt

## Test

Run:

    py -m http.server 8080

Open:

    http://localhost:8080/

Use Ctrl+F5 after replacing an older build.

Test:
1. Open a verse.
2. Click 📝.
3. Enter a note.
4. Click Stoor.
5. Confirm the note button indicates a saved note.
6. Open the same verse again.
7. Confirm the note text is still present.
8. Edit the note.
9. Save it.
10. Delete the note.
11. Confirm the note is removed.
12. Refresh the browser.
13. Confirm saved notes persist.
14. Navigate to another verse and confirm its note is independent.
15. Test dark mode.
16. Test mobile width.

Important:
The supplied AFR53 SQLite database is not modified.

Next milestone:
8B — Notes Manager.
