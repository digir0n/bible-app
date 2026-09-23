import { BibleDatabase } from "./database.js";
import { BibleReader } from "./reader.js";

const elements = {
    status: document.getElementById("status"),
    locationText: document.getElementById("locationText"),
    translationName: document.getElementById("translationName"),
    chapterTitle: document.getElementById("chapterTitle"),
    verseContainer: document.getElementById("verseContainer"),
    translationSelect: document.getElementById("translationSelect"),
    oldTestamentBooks: document.getElementById("oldTestamentBooks"),
    newTestamentBooks: document.getElementById("newTestamentBooks"),
    chapterGrid: document.getElementById("chapterGrid"),
    verseGrid: document.getElementById("verseGrid"),
    previousButton: document.getElementById("previousButton"),
    nextButton: document.getElementById("nextButton"),
    menuButton: document.getElementById("menuButton"),
    navigationPanel: document.getElementById("navigationPanel"),
    searchForm: document.getElementById("searchForm"),
    searchInput: document.getElementById("searchInput"),
    searchButton: document.getElementById("searchButton"),
    searchStatus: document.getElementById("searchStatus"),
    searchResults: document.getElementById("searchResults"),
    searchMode: document.getElementById("searchMode"),
    searchScope: document.getElementById("searchScope")
};

const reader = new BibleReader(elements);

const state = {
    database: null,
    manifest: null,
    translation: null,
    metadata: {},
    books: [],
    book: null,
    chapter: 1,
    verses: [],
    selectedVerse: 1
};


/* =========================================================
   Milestone 5B — Font size
   ========================================================= */

const FONT_DEFAULT = 1;
const FONT_MIN = 0.85;
const FONT_MAX = 1.30;
const FONT_STEP = 0.05;

function getSavedFontScale() {
    const value = Number.parseFloat(
        localStorage.getItem("bible.fontScale")
    );

    if (!Number.isFinite(value)) {
        return FONT_DEFAULT;
    }

    return Math.min(FONT_MAX, Math.max(FONT_MIN, value));
}

function setFontScale(scale) {
    const value = Math.min(
        FONT_MAX,
        Math.max(FONT_MIN, scale)
    );

    document.documentElement.style.setProperty(
        "--bible-font-scale",
        String(value)
    );

    localStorage.setItem(
        "bible.fontScale",
        String(value)
    );
}

function initReadingControls() {
    const down = document.getElementById("fontDown");
    const reset = document.getElementById("fontReset");
    const up = document.getElementById("fontUp");

    setFontScale(getSavedFontScale());

    down.addEventListener("click", () => {
        setFontScale(getSavedFontScale() - FONT_STEP);
    });

    reset.addEventListener("click", () => {
        setFontScale(FONT_DEFAULT);
    });

    up.addEventListener("click", () => {
        setFontScale(getSavedFontScale() + FONT_STEP);
    });
}

/* =========================================================
   Milestone 5C — Remember last reading position
   ========================================================= */

const READING_POSITION_KEY = "bible.readingPosition";

function saveReadingPosition() {
    if (!state.translation || !state.book || !state.chapter) {
        return;
    }

    const position = {
        translation: state.translation.id,
        book: state.book.osis,
        chapter: Number(state.chapter),
        verse: Number(state.selectedVerse) || 1
    };

    localStorage.setItem(READING_POSITION_KEY, JSON.stringify(position));
}

function getSavedReadingPosition() {
    try {
        const value = localStorage.getItem(READING_POSITION_KEY);
        if (!value) return null;

        const position = JSON.parse(value);
        if (!position || typeof position !== "object") return null;

        return position;
    } catch (error) {
        console.warn("Could not read saved reading position:", error);
        return null;
    }
}

function getInitialPosition() {
    const fallback = { book: state.books[0], chapter: 1, verse: 1 };
    const saved = getSavedReadingPosition();

    if (!saved) return fallback;

    const currentTranslation = String(state.translation.id || "");
    if (String(saved.translation || "") !== currentTranslation) {
        return fallback;
    }

    const book = state.books.find(item => item.osis === saved.book);
    if (!book) return fallback;

    const chapter = Number(saved.chapter);
    const verse = Number(saved.verse);

    return {
        book,
        chapter: Number.isInteger(chapter) && chapter >= 1
            ? Math.min(chapter, Number(book.chapters))
            : 1,
        verse: Number.isFinite(verse) && verse > 0 ? verse : 1
    };
}


/* =========================================================
   Milestone 6A — Bible search
   ========================================================= */

const SEARCH_LIMIT = 100;

function clearSearchResults() {
    elements.searchResults.replaceChildren();
    elements.searchStatus.textContent = "";
}

function formatSearchReference(row) {
    const value = Number(row.verse);
    const chapter = Math.floor(value);
    const verseNumber = Math.round(
        (value - chapter) * 1000
    );

    const book = state.books.find(item => item.osis === row.book);

    return {
        book,
        chapter,
        verse: verseNumber
    };
}

function appendHighlightedText(container, text, term, mode) {
    const source = String(text || "");
    const query = String(term || "").trim();

    if (!query) {
        container.textContent = source;
        return;
    }

    const terms = mode === "allWords"
        ? query.split(/\s+/).filter(Boolean)
        : [query];

    const escaped = terms
        .sort((a, b) => b.length - a.length)
        .map(term =>
            term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        );

    if (!escaped.length) {
        container.textContent = source;
        return;
    }

    const regex = new RegExp(`(${escaped.join("|")})`, "gi");
    const parts = source.split(regex);

    for (const part of parts) {
        if (!part) continue;

        if (terms.some(term =>
            part.localeCompare(term, undefined, {
                sensitivity: "accent"
            }) === 0
        )) {
            const mark = document.createElement("mark");
            mark.textContent = part;
            container.appendChild(mark);
        } else {
            container.appendChild(
                document.createTextNode(part)
            );
        }
    }
}

function renderSearchResults(rows, term, mode) {
    elements.searchResults.replaceChildren();

    if (!rows.length) {
        elements.searchStatus.textContent =
            "Geen resultate gevind nie.";
        return;
    }

    elements.searchStatus.textContent =
        rows.length === SEARCH_LIMIT
            ? `Eerste ${SEARCH_LIMIT} resultate`
            : `${rows.length} resultaat${rows.length === 1 ? "" : "e"}`;

    const fragment = document.createDocumentFragment();

    for (const row of rows) {
        const reference = formatSearchReference(row);

        if (!reference.book || !reference.verse) {
            continue;
        }

        const button = document.createElement("button");
        button.type = "button";
        button.className = "search-result";

        const heading = document.createElement("span");
        heading.className = "search-result-reference";
        heading.textContent =
            `${reference.book.human} ${reference.chapter}:${reference.verse}`;

        const text = document.createElement("span");
        text.className = "search-result-text";

        appendHighlightedText(
            text,
            row.unformatted,
            term,
            mode
        );

        button.append(heading, text);

        button.addEventListener("click", async () => {
            try {
                elements.searchStatus.textContent = "Laai vers...";

                await loadChapter(
                    reference.book.osis,
                    reference.chapter,
                    reference.verse
                );

                closeNavigation();

                reader.scrollToVerse(
                    reference.verse
                );

                elements.searchStatus.textContent =
                    `${reference.book.human} ${reference.chapter}:${reference.verse}`;

                elements.searchInput.focus();
            } catch (error) {
                console.error(error);
                elements.searchStatus.textContent =
                    `Fout: ${error.message}`;
            }
        });

        fragment.appendChild(button);
    }

    elements.searchResults.appendChild(fragment);
}

async function performSearch() {
    const term = elements.searchInput.value.trim();

    if (!term) {
        clearSearchResults();
        elements.searchStatus.textContent =
            "Tik 'n woord of frase om te soek.";
        return;
    }

    if (!state.database) {
        elements.searchStatus.textContent =
            "Die Bybel is nog besig om te laai.";
        return;
    }

    const mode = elements.searchMode.value;
    const scope = elements.searchScope.value;

    const options = {
        mode,
        book: scope === "currentBook"
            ? state.book?.osis || ""
            : ""
    };

    elements.searchButton.disabled = true;
    elements.searchStatus.textContent = "Soek...";
    elements.searchResults.replaceChildren();

    try {
        const rows = state.database.searchVerses(
            term,
            SEARCH_LIMIT,
            options
        );

        renderSearchResults(rows, term, mode);
    } catch (error) {
        console.error(error);
        elements.searchStatus.textContent =
            `Soekfout: ${error.message}`;
    } finally {
        elements.searchButton.disabled = false;
    }
}

elements.searchForm.addEventListener("submit", event => {
    event.preventDefault();
    performSearch();
});

async function start() {
    try {
        setStatus("Laai vertalingslys...");

        const response = await fetch("database/translations.json");

        if (!response.ok) {
            throw new Error(
                `Kan translations.json nie laai nie: ${response.status}`
            );
        }

        state.manifest = await response.json();

        const defaultId = state.manifest.default || "AFR53";
        const translation = state.manifest.translations.find(
            item => item.id === defaultId
        );

        if (!translation) {
            throw new Error("Die verstekvertaling is nie in translations.json nie.");
        }

        await selectTranslation(translation.id);

        setStatus("Gereed");
    } catch (error) {
        console.error(error);
        setStatus(`Fout: ${error.message}`);
    }
}

function setStatus(message) {
    elements.status.textContent = message;
}

function loadMetadata() {
    state.metadata = {};

    for (const row of state.database.metadata()) {
        state.metadata[row.name] = row.value;
    }

    elements.translationSelect.replaceChildren();

    for (const translation of state.manifest.translations) {
        elements.translationSelect.append(
            new Option(translation.name, translation.id)
        );
    }

    elements.translationSelect.value = state.translation.id;
}

async function selectTranslation(translationId) {
    const translation = state.manifest.translations.find(
        item => item.id === translationId
    );

    if (!translation) {
        throw new Error(`Vertaling ${translationId} is nie gevind nie.`);
    }

    state.translation = translation;

    setStatus(`Laai ${translation.name}...`);

    state.database = await BibleDatabase.open(
        `database/translations/${translation.file}`
    );

    loadMetadata();
    loadBooks();

    const initial = getInitialPosition();
    state.book = initial.book;
    state.chapter = initial.chapter;

    renderBooks();
    await loadChapter(
        state.book.osis,
        state.chapter,
        initial.verse
    );
}

function loadBooks() {
    state.books = state.database.books();

    if (!state.books.length) {
        throw new Error("Geen boeke in die databasis gevind nie.");
    }
}

function renderBooks() {
    elements.oldTestamentBooks.replaceChildren();
    elements.newTestamentBooks.replaceChildren();

    state.books.forEach((book, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "book-button";
        button.dataset.osis = book.osis;
        button.textContent = book.human;
        button.title = book.human;

        if (book.osis === state.book.osis) {
            button.classList.add("active");
        }

        button.addEventListener("click", async () => {
            closeNavigation();
            await loadChapter(book.osis, 1);
        });

        // Bible books 1–39 are Old Testament, 40–66 New Testament.
        const target = index < 39
            ? elements.oldTestamentBooks
            : elements.newTestamentBooks;

        target.appendChild(button);
    });
}

function renderChapterGrid() {
    elements.chapterGrid.replaceChildren();

    for (let chapter = 1; chapter <= state.book.chapters; chapter++) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "number-button";
        button.textContent = chapter;

        if (chapter === state.chapter) {
            button.classList.add("active");
        }

        button.addEventListener("click", async () => {
            closeNavigation();
            await loadChapter(state.book.osis, chapter);
        });

        elements.chapterGrid.appendChild(button);
    }
}

function renderVerseGrid() {
    elements.verseGrid.replaceChildren();

    for (const verse of state.verses) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "number-button";
        button.textContent = verse.verseNumber;

        if (verse.verseNumber === state.selectedVerse) {
            button.classList.add("active");
        }

        button.addEventListener("click", () => {
            state.selectedVerse = verse.verseNumber;
            highlightSelectedVerse();
            updateLocation();
            saveReadingPosition();
            closeNavigation();
            reader.scrollToVerse(verse.verseNumber);
        });

        elements.verseGrid.appendChild(button);
    }
}

async function loadChapter(bookOsis, chapter, verse = 1) {
    setStatus("Laai hoofstuk...");

    state.book = state.books.find(book => book.osis === bookOsis);

    if (!state.book) {
        throw new Error(`Boek ${bookOsis} nie gevind nie.`);
    }

    state.chapter = Number(chapter);
    state.verses = state.database.verses(
        state.book.osis,
        state.chapter
    );

    if (!state.verses.length) {
        throw new Error(
            `Geen verse gevind vir ${state.book.osis} ${state.chapter}.`
        );
    }

    state.selectedVerse =
        state.verses.some(v => v.verseNumber === Number(verse))
            ? Number(verse)
            : state.verses[0].verseNumber;

    reader.render(
        state.metadata.name || "AFR53",
        state.book,
        state.chapter,
        state.verses
    );

    renderBooks();
    renderChapterGrid();
    renderVerseGrid();
    updateLocation();
    updateChapterButtons();
    highlightSelectedVerse();
    saveReadingPosition();

    setStatus("Gereed");
}

function highlightSelectedVerse() {
    document.querySelectorAll(".verse.selected")
        .forEach(element => element.classList.remove("selected"));

    const element =
        document.getElementById(`verse-${state.selectedVerse}`);

    if (element) {
        element.classList.add("selected");
    }
}

function updateLocation() {
    elements.locationText.textContent =
        `${state.translation.id} · ${state.book.human} ${state.chapter}:${state.selectedVerse}`;
}

function updateChapterButtons() {
    elements.previousButton.disabled = state.chapter <= 1;
    elements.nextButton.disabled =
        state.chapter >= state.book.chapters;
}

function closeNavigation() {
    elements.navigationPanel.classList.remove("open");
    elements.menuButton.setAttribute("aria-expanded", "false");
}

elements.translationSelect.addEventListener("change", async event => {
    try {
        closeNavigation();
        await selectTranslation(event.target.value);
    } catch (error) {
        console.error(error);
        setStatus(`Fout: ${error.message}`);
    }
});

elements.menuButton.addEventListener("click", () => {
    const open = elements.navigationPanel.classList.toggle("open");
    elements.menuButton.setAttribute("aria-expanded", String(open));
});

elements.previousButton.addEventListener("click", async () => {
    if (state.chapter > 1) {
        await loadChapter(
            state.book.osis,
            state.chapter - 1,
            1
        );
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
});

elements.nextButton.addEventListener("click", async () => {
    if (state.chapter < state.book.chapters) {
        await loadChapter(
            state.book.osis,
            state.chapter + 1,
            1
        );
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
});

window.addEventListener("beforeunload", saveReadingPosition);

start();


initReadingControls();


/* =========================================================
   Milestone 5D FINAL — Light/Dark theme
   ========================================================= */

const THEME_KEY = "bible.theme";

function applyTheme(theme) {
    const value = theme === "dark" ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", value);
    localStorage.setItem(THEME_KEY, value);

    const button = document.getElementById("themeToggle");

    if (button) {
        button.textContent = value === "dark" ? "☀" : "☾";
        button.title = value === "dark"
            ? "Ligte tema"
            : "Donker tema";
        button.setAttribute(
            "aria-label",
            value === "dark"
                ? "Skakel na ligte tema"
                : "Skakel na donker tema"
        );
    }
}

function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    applyTheme(saved === "dark" ? "dark" : "light");

    const button = document.getElementById("themeToggle");

    if (!button) {
        console.error("Bible App: themeToggle button was not found.");
        return;
    }

    button.addEventListener("click", () => {
        const current =
            document.documentElement.getAttribute("data-theme") || "light";

        applyTheme(current === "dark" ? "light" : "dark");
    });
}

initTheme();

