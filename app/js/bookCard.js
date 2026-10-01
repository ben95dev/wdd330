// bookCard.js — builds one book card from a normalized book object.
import { createEl } from "./utils.js";

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

export function createBookCard(book) {
  const detailsUrl = `details.html?id=${encodeURIComponent(book.id)}&source=${book.source}`;

  const link = createEl("a", { className: "book-card__link", attrs: { href: detailsUrl } }, [
    createCover(book),
    createEl("div", { className: "book-card__body" }, [
      createEl("h3", { className: "book-card__title", text: book.title }),
      createEl("p", { className: "book-card__author", text: book.author }),
      ...(book.year ? [createEl("p", { className: "book-card__year", text: String(book.year) })] : []),
    ]),
  ]);

  // The <article> wrapper leaves room for favorite/status buttons in Week 6.
  return createEl("li", {}, [createEl("article", { className: "book-card" }, [link])]);
}
