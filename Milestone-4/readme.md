# Milestone 4 - Add translation manifest

The app now uses `database/translations.json` as a translation manifest.

AFR53 is the default. Future SQLite translations are added by placing the
database in `database/translations/` and adding an entry to the manifest.

Test with:

```text
py -m http.server 8080
```

Then open `http://localhost:8080/`.

Milestone 4 goal: make translation selection independent of the reader code.
