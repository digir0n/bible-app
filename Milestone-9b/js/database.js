export class BibleDatabase {
    constructor(sqlDb) {
        this.db = sqlDb;
    }

    static async open(filePath) {
        // sql-asm.js does not require a separate .wasm file.
        // This avoids WebAssembly validation/MIME problems during the prototype.
        const SQL = await initSqlJs();

        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Kan databasis nie laai nie: ${response.status}`);
        }

        const bytes = new Uint8Array(await response.arrayBuffer());
        const sqlDb = new SQL.Database(bytes);

        return new BibleDatabase(sqlDb);
    }

    query(sql, params = {}) {
        const result = this.db.exec(sql, params);

        if (!result.length) {
            return [];
        }

        const { columns, values } = result[0];

        return values.map(row =>
            Object.fromEntries(columns.map((column, index) => [column, row[index]]))
        );
    }

    metadata() {
        return this.query(`
            SELECT name, value
            FROM metadata
            ORDER BY id
        `);
    }

    books() {
        return this.query(`
            SELECT number, osis, human, chapters
            FROM books
            ORDER BY number
        `);
    }

    chapters(bookOsis) {
        return this.query(`
            SELECT
                id,
                reference_osis,
                reference_human,
                previous_reference_osis,
                next_reference_osis
            FROM chapters
            WHERE reference_osis LIKE $prefix
            ORDER BY id
        `, {
            $prefix: `${bookOsis}.%`
        });
    }

    verses(bookOsis, chapter) {
        /*
         * The supplied database uses REAL for verse references:
         *
         *   1.001, 1.002 ... 1.010
         *
         * SQLite may display 1.010 as 1.01. Therefore we use a
         * numeric range for the chapter and derive the displayed
         * verse number from the fractional part.
         */
        const rows = this.query(`
            SELECT id, book, verse, unformatted
            FROM verses
            WHERE book = $book
              AND verse >= $start
              AND verse < $end
            ORDER BY verse, id
        `, {
            $book: bookOsis,
            $start: chapter,
            $end: chapter + 0.999
        });

        return rows.map(row => ({
            ...row,
            verseNumber: Math.round((Number(row.verse) - Math.floor(Number(row.verse))) * 1000)
        }));
    }

    searchVerses(term, options = {}) {
        const text = String(term || "").trim();

        if (!text) {
            return [];
        }

        const mode = options.mode === "allWords"
            ? "allWords"
            : "phrase";

        const book = options.book || "";

        const escapeLike = value =>
            String(value)
                .replace(/\\/g, "\\\\")
                .replace(/%/g, "\\%")
                .replace(/_/g, "\\_");

        const params = {};

        let where = [];
        let likeParts = [];

        if (mode === "allWords") {
            const words = text
                .split(/\s+/)
                .map(word => word.trim())
                .filter(Boolean);

            words.forEach((word, index) => {
                const key = `$word${index}`;
                params[key] = `%${escapeLike(word)}%`;
                likeParts.push(
                    `unformatted LIKE ${key} ESCAPE '\\'`
                );
            });

            where.push(`(${likeParts.join(" AND ")})`);
        } else {
            params.$pattern = `%${escapeLike(text)}%`;
            where.push(
                `unformatted LIKE $pattern ESCAPE '\\'`
            );
        }

        if (book) {
            params.$book = book;
            where.push(`book = $book`);
        }

        return this.query(`
            SELECT
                id,
                book,
                verse,
                unformatted
            FROM verses
            WHERE ${where.join(" AND ")}
            ORDER BY id
        `, params);
    }

}
