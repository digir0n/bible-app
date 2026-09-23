export class BibleReader {
    constructor(elements) {
        this.elements = elements;
    }

    render(translationName, book, chapter, verses) {
        this.elements.translationName.textContent = translationName;
        this.elements.chapterTitle.textContent =
            `${book.human} ${chapter}`;

        this.elements.verseContainer.replaceChildren();

        for (const verse of verses) {
            const paragraph = document.createElement("p");
            paragraph.className = "verse";
            paragraph.id = `verse-${verse.verseNumber}`;

            const number = document.createElement("span");
            number.className = "verse-number";
            number.textContent = verse.verseNumber;

            const text = document.createTextNode(verse.unformatted);

            paragraph.append(number, text);
            this.elements.verseContainer.appendChild(paragraph);
        }
    }

    scrollToVerse(verseNumber) {
        document.getElementById(`verse-${verseNumber}`)
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
}
