// details.js — Book details page: details.html?id=...&source=openlibrary|gutendex
// Loads one book from the matching API and shows a larger cover, description,
// subjects, links to read it, and a Save button.
import { getWork } from "./api/openLibrary.js";
import { getFreeBook } from "./api/gutendex.js";
import { isFavorite } from "./storage.js";
import { setFavoriteButton } from "./bookCard.js";
import { createEl, getParams, friendlyError, renderMessage, clearMessage } from "./utils.js";

const SOURCES = {
  openlibrary: { load: getWork, serviceName: "Open Library" },
  gutendex: { load: getFreeBook, serviceName: "Gutendex" },
};

function createLink(label, href) {
  return createEl("a", {
    className: "btn btn-outline",
    text: label,
    attrs: { href, target: "_blank", rel: "noopener noreferrer" },
  });
}

/** Build the details article. It carries the same data-* attributes as a card, so favorites.js works here too. */
function renderBook(book) {
  const saved = isFavorite(book.id, book.source);
  const button = createEl("button", { className: "btn btn-outline fav-btn", attrs: { type: "button" } });
  setFavoriteButton(button, saved, book.title);

  const links = [];
  if (book.readUrl) links.push(createLink("Read free online", book.readUrl));
  if (book.epubUrl) links.push(createLink("Download EPUB", book.epubUrl));
  if (book.infoUrl) links.push(createLink("View on Open Library", book.infoUrl));

  const cover = book.coverUrl
    ? createEl("img", {
        attrs: { src: book.coverUrl, alt: `Cover of ${book.title}`, width: "300", height: "450" },
      })
    : createEl("div", { className: "cover-placeholder", text: book.title, attrs: { "aria-hidden": "true" } });
  // A cover that fails to load is replaced by the title placeholder.
  cover.addEventListener(
    "error",
    () => cover.replaceWith(createEl("div", { className: "cover-placeholder", text: book.title })),
    { once: true }
  );

  const info = createEl("div", { className: "book-detail__info" }, [
    createEl("h1", { text: book.title }),
    createEl("p", { className: "book-detail__author", text: `by ${book.authors.join(", ") || book.author}` }),
  ]);
  if (book.year) info.append(createEl("p", { className: "book-card__year", text: `First published ${book.year}` }));
  if (book.source === "gutendex") {
    info.append(createEl("p", { className: "badge", text: "Free to read · public domain" }));
  }
  if (book.description) {
    info.append(createEl("h2", { text: "About this book" }), createEl("p", { text: book.description }));
  }
  if (book.subjects.length) {
    info.append(
      createEl("h2", { text: "Subjects" }),
      createEl("ul", { className: "chip-list" }, book.subjects.map((subject) => createEl("li", { className: "chip", text: subject })))
    );
  }
  info.append(createEl("div", { className: "book-detail__actions" }, [button, ...links]));

  const article = createEl("article", { className: "book-detail" }, [
    createEl("div", { className: "book-detail__cover" }, [cover]),
    info,
  ]);

  Object.assign(article.dataset, {
    id: book.id,
    source: book.source,
    title: book.title,
    author: book.author,
    year: book.year ?? "",
    coverUrl: book.coverUrl ?? "",
    saved: String(saved),
  });
  return article;
}

/** Basic book built from the page address, used when the API request fails. */
function fallbackBook(params, id, sourceName) {
  const title = params.get("title");
  if (!title) return null;
  const author = params.get("author") || "Unknown author";
  const isFree = sourceName === "gutendex";
  return {
    id,
    source: sourceName,
    title,
    author,
    authors: [author],
    year: null,
    coverUrl: params.get("cover"),
    subjects: [],
    // Link to the book's page on the original site
    readUrl: isFree ? `https://www.gutenberg.org/ebooks/${encodeURIComponent(id)}` : null,
    infoUrl: isFree ? null : `https://openlibrary.org/works/${encodeURIComponent(id)}`,
  };
}

export async function initDetails() {
  const params = getParams();
  const id = params.get("id");
  const source = SOURCES[params.get("source")];
  const content = document.querySelector("#details-content");
  const messageBox = document.querySelector("#details-message");

  if (!id || !source) {
    renderMessage(messageBox, {
      title: "We couldn't find that book",
      text: "The link is missing a book. Go back to search and choose one.",
      actionLabel: "Back to search",
      onAction: () => window.location.assign("search.html"),
    });
    return;
  }

  async function load() {
    clearMessage(messageBox);
    content.setAttribute("aria-busy", "true");
    try {
      const book = await source.load(id);
      document.title = `${book.title} | ReadSpace`;
      content.replaceChildren(renderBook(book));
    } catch (error) {
      // Show what we already know about the book, plus a message with Try again.
      const basic = fallbackBook(params, id, params.get("source"));
      content.replaceChildren(...(basic ? [renderBook(basic)] : []));
      renderMessage(messageBox, {
        title: "Full details didn't load",
        text: friendlyError(error, source.serviceName),
        actionLabel: "Try again",
        onAction: load,
      });
    } finally {
      content.removeAttribute("aria-busy");
    }
  }

  load();
}
