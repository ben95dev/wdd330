// bookCard.js — builds one book card from a normalized book object.
// The book's data is also stored on the card in data-* attributes
// (data-id, data-source, data-title, ...) so one click handler can read it
// with element.dataset instead of searching the page.
import { createEl } from "./utils.js";
import { isFavorite } from "./storage.js";

function createCover(book) {
  const wrap = createEl("div", { className: "book-card__cover" });

  const placeholder = () =>
    createEl("div", {
      className: "cover-placeholder",
      text: book.title,
      attrs: { "aria-hidden": "true" },
    });

  if (!book.coverUrl) {
    wrap.append(placeholder());
    return wrap;
  }

  const img = createEl("img", {
    attrs: {
      src: book.coverUrl,
      alt: `Cover of ${book.title}`,
      loading: "lazy",
      width: "200",
      height: "300",
    },
  });
  // If the cover fails to load, swap in the title placeholder.
  img.addEventListener("error", () => wrap.replaceChildren(placeholder()), { once: true });
  wrap.append(img);
  return wrap;
}

/** Update the Save button's label for the saved / not-saved state. */
export function setFavoriteButton(button, saved, title) {
  button.replaceChildren(
    document.createTextNode(saved ? "Saved ✓" : "Save"),
    createEl("span", {
      className: "visually-hidden",
      text: saved ? ` – remove ${title} from saved books` : ` ${title} for later`,
    })
  );
  button.classList.toggle("is-saved", saved);
}

/** Build one <li> holding a book card for any book in the common shape. */
export function createBookCard(book) {
  // The link also carries the title, author and cover, so the details page can
  // still show something useful if its own request to the API fails.
  const query = new URLSearchParams({ id: book.id, source: book.source, title: book.title, author: book.author });
  if (book.coverUrl) query.set("cover", book.coverUrl);
  const detailsUrl = `details.html?${query}`;

  const link = createEl("a", { className: "book-card__link", attrs: { href: detailsUrl } }, [
    createCover(book),
    createEl("div", { className: "book-card__body" }, [
      createEl("h3", { className: "book-card__title", text: book.title }),
      createEl("p", { className: "book-card__author", text: book.author }),
      ...(book.year ? [createEl("p", { className: "book-card__year", text: String(book.year) })] : []),
      ...(book.source === "gutendex" ? [createEl("p", { className: "badge", text: "Free to read" })] : []),
    ]),
  ]);

  const saved = isFavorite(book.id, book.source);
  const button = createEl("button", { className: "btn btn-outline fav-btn", attrs: { type: "button" } });
  setFavoriteButton(button, saved, book.title);

  const card = createEl("article", { className: "book-card" }, [
    link,
    createEl("div", { className: "book-card__actions" }, [button]),
  ]);

  // Book data lives on the card as data-* attributes (see favorites.js).
  Object.assign(card.dataset, {
    id: book.id,
    source: book.source,
    title: book.title,
    author: book.author,
    year: book.year ?? "",
    coverUrl: book.coverUrl ?? "",
    saved: String(saved),
  });

  return createEl("li", {}, [card]);
}
