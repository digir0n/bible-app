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
    navigationPanel: document.getElementById("navigationPanel")
};

const reader = new BibleReader(elements);

const state = {
    database: null,
    metadata: {},
    books: [],
    book: null,
    chapter: 1,
    verses: [],
    selectedVerse: 1
};

async function start() {
    try {
        setStatus("Laai AFR53...");
        state.database = await BibleDatabase.open(
            "database/translations/afr53.sqlite3"
        );

        loadMetadata();
        loadBooks();

        state.book = state.books[0];
        renderBooks();
        await loadChapter(state.book.osis, 1);

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
    for (const row of state.database.metadata()) {
        state.metadata[row.name] = row.value;
    }

    const name = state.metadata.name ||
        state.metadata.title ||
        "Afrikaanse Bybel 1933/1953";

    elements.translationSelect.replaceChildren(
        new Option(name, "afr53")
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
        `AFR53 · ${state.book.human} ${state.chapter}:${state.selectedVerse}`;
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

start();
