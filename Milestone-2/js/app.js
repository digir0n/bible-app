import { BibleDatabase } from "./database.js";
import { BibleReader } from "./reader.js";

const elements = {
    status: document.getElementById("status"),
    translationName: document.getElementById("translationName"),
    chapterTitle: document.getElementById("chapterTitle"),
    verseContainer: document.getElementById("verseContainer"),
    translationSelect: document.getElementById("translationSelect"),
    bookSelect: document.getElementById("bookSelect"),
    chapterSelect: document.getElementById("chapterSelect"),
    verseSelect: document.getElementById("verseSelect"),
    previousButton: document.getElementById("previousButton"),
    nextButton: document.getElementById("nextButton")
};

const reader = new BibleReader(elements);

const state = {
    database: null,
    metadata: {},
    books: [],
    chapters: [],
    verses: [],
    book: null,
    chapter: 1
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

        renderBookSelector();
        renderChapterSelector();

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
    const rows = state.database.metadata();

    for (const row of rows) {
        state.metadata[row.name] = row.value;
    }

    const displayName =
        state.metadata.name ||
        state.metadata.title ||
        "Afrikaanse Bybel 1933/1953";

    elements.translationSelect.replaceChildren(
        new Option(displayName, "afr53")
    );
}

function loadBooks() {
    state.books = state.database.books();

    if (!state.books.length) {
        throw new Error("Geen boeke in die databasis gevind nie.");
    }
}

function renderBookSelector() {
    elements.bookSelect.replaceChildren();

    for (const book of state.books) {
        elements.bookSelect.append(
            new Option(book.human, book.osis)
        );
    }

    elements.bookSelect.value = state.book.osis;
}

function renderChapterSelector() {
    elements.chapterSelect.replaceChildren();

    for (let chapter = 1; chapter <= state.book.chapters; chapter++) {
        elements.chapterSelect.append(
            new Option(String(chapter), String(chapter))
        );
    }

    elements.chapterSelect.value = String(state.chapter);
}

async function loadChapter(bookOsis, chapter) {
    state.book = state.books.find(book => book.osis === bookOsis);

    if (!state.book) {
        throw new Error(`Boek ${bookOsis} nie gevind nie.`);
    }

    state.chapter = Number(chapter);

    elements.bookSelect.value = state.book.osis;

    renderChapterSelector();

    state.verses = state.database.verses(
        state.book.osis,
        state.chapter
    );

    if (!state.verses.length) {
        throw new Error(
            `Geen verse gevind vir ${state.book.osis} ${state.chapter}.`
        );
    }

    reader.render(
        state.metadata.name || "AFR53",
        state.book,
        state.chapter,
        state.verses
    );

    renderVerseSelector();
    updateChapterButtons();
}

function renderVerseSelector() {
    elements.verseSelect.replaceChildren();

    for (const verse of state.verses) {
        elements.verseSelect.append(
            new Option(
                String(verse.verseNumber),
                String(verse.verseNumber)
            )
        );
    }
}

function updateChapterButtons() {
    elements.previousButton.disabled =
        state.chapter <= 1;

    elements.nextButton.disabled =
        state.chapter >= state.book.chapters;
}

elements.bookSelect.addEventListener("change", async event => {
    try {
        setStatus("Laai hoofstuk...");
        await loadChapter(event.target.value, 1);
        setStatus("Gereed");
    } catch (error) {
        console.error(error);
        setStatus(`Fout: ${error.message}`);
    }
});

elements.chapterSelect.addEventListener("change", async event => {
    try {
        setStatus("Laai hoofstuk...");
        await loadChapter(state.book.osis, Number(event.target.value));
        setStatus("Gereed");
    } catch (error) {
        console.error(error);
        setStatus(`Fout: ${error.message}`);
    }
});

elements.verseSelect.addEventListener("change", event => {
    reader.scrollToVerse(Number(event.target.value));
});

elements.previousButton.addEventListener("click", async () => {
    if (state.chapter > 1) {
        await loadChapter(state.book.osis, state.chapter - 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
});

elements.nextButton.addEventListener("click", async () => {
    if (state.chapter < state.book.chapters) {
        await loadChapter(state.book.osis, state.chapter + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
});

start();
