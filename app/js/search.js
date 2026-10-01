// search.js — search page: reads ?q=, loads results, handles states.
import { searchBooks } from "./api/openLibrary.js";
import { createBookCard } from "./bookCard.js";
import { getParams, friendlyError, renderMessage, clearMessage } from "./utils.js";

export function initSearch() {
  const query = (getParams().get("q") || "").trim();

  const form = document.querySelector("#search-form");
  const grid = document.querySelector("#results-grid");
  const status = document.querySelector("#results-status");
  const messageBox = document.querySelector("#results-message");
  const moreWrap = document.querySelector("#load-more-wrap");
  const moreButton = document.querySelector("#load-more");

  form.elements.q.value = query;

  if (!query) {
    renderMessage(messageBox, {
      title: "Search for a book",
      text: "Type a title, author, or keyword above to see results.",
    });
    return;
  }

  let page = 1;
  let shown = 0;

  async function loadPage() {
    moreButton.disabled = true;
    status.textContent = "Searching…";
    grid.setAttribute("aria-busy", "true");
    clearMessage(messageBox);

    try {
      const { books, total } = await searchBooks(query, { page });

      if (page === 1 && books.length === 0) {
        status.textContent = "";
        moreWrap.hidden = true;
        renderMessage(messageBox, {
          title: `No books found for "${query}"`,
          text: "Check the spelling or try a shorter search, like just the author's last name.",
        });
        return;
      }

      books.forEach((book) => grid.append(createBookCard(book)));
      shown += books.length;
      status.textContent = `Showing ${shown} of ${total.toLocaleString()} results for "${query}"`;
      moreWrap.hidden = shown >= total;
    } catch (error) {
      status.textContent = "";
      if (page === 1) {
        renderMessage(messageBox, {
          title: "Search didn't load",
          text: friendlyError(error),
          actionLabel: "Try again",
          onAction: loadPage,
        });
      } else {
        // Keep the results already on screen; let the reader retry the next page.
        page -= 1;
        status.textContent = friendlyError(error);
      }
    } finally {
      grid.removeAttribute("aria-busy");
      moreButton.disabled = false;
    }
  }

  moreButton.addEventListener("click", () => {
    page += 1;
    loadPage();
  });

  loadPage();
}
