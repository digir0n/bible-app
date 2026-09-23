# Milestone 2 - Bible reader

Prototype Bible reader using:

- HTML5
- CSS3
- JavaScript ES modules
- SQLite via sql.js / WebAssembly
- AFR53 SQLite database

### Sqlite

```bash
winget install SQLite.SQLite
```

## Run

Do not open `index.html` directly with `file://`.

From the project directory, run a local HTTP server.

### Python

```bash
py -m http.server 8080
```

Then open:

http://localhost:8080/

## Current features

- Loads `afr53.sqlite3`
- Reads translation metadata
- Reads all 66 books from SQLite
- Selects a book
- Selects a chapter
- Displays the chapter's verses
- Selects a verse and scrolls to it
- Previous/Next chapter
- Responsive layout for desktop and mobile browser widths
