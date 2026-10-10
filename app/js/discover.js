// discover.js — "Discover a book": one button picks a random book.
// The subjects come from the data-subject attributes on the home page chips,
// so adding a chip in the HTML also adds it here.
import { searchBooks } from "./api/openLibrary.js";
import { createBookCard } from "./bookCard.js";
import { friendlyError } from "./utils.js";

const MAX_PAGE = 50; // pick from the top 50 results of a subject

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export function initDiscover() {
  const button = document.querySelector("#discover-btn");
  const status = document.querySelector("#discover-status");
  const result = document.querySelector("#discover-result");
  if (!button) return;

  const subjects = [...document.querySelectorAll("[data-subject]")].map((el) => el.dataset.subject);
  if (!subjects.length) {
    button.hidden = true;
    return;
  }

  button.addEventListener("click", async () => {
    const subject = subjects[randomInt(0, subjects.length - 1)];
    const query = `subject:"${subject}"`;
    button.disabled = true;
    status.textContent = `Finding a ${subject} book…`;
    result.setAttribute("aria-busy", "true");

    try {
      let { books } = await searchBooks(query, { limit: 1, page: randomInt(1, MAX_PAGE), sort: "rating" });
      if (!books.length) ({ books } = await searchBooks(query, { limit: 1, page: 1, sort: "rating" }));

      if (!books.length) {
        status.textContent = "No book found this time. Try again.";
        return;
      }
      result.replaceChildren(createBookCard(books[0]));
      status.textContent = `Try this ${subject} book:`;
      button.textContent = "Pick another book";
    } catch (error) {
      status.textContent = friendlyError(error);
    } finally {
      result.removeAttribute("aria-busy");
      button.disabled = false;
    }
  });
}
