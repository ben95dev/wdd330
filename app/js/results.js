// results.js — shared "results list" used by the Search and Free books pages.
// It loads one page at a time, shows loading / empty / error states, and
// handles the "Show more books" button. Each page only supplies fetchPage().
import { createBookCard } from "./bookCard.js";
import { friendlyError, renderMessage, clearMessage } from "./utils.js";

/**
 * @param {object} options
 * @param {(page: number) => Promise<{books: object[], total: number}>} options.fetchPage
 * @param {string} options.resultsFor  text for the status line, e.g. `for "dune"`
 * @param {string} options.emptyTitle  heading shown when nothing matches
 * @param {string} options.serviceName API name used in error messages
 */
export function initResults({ fetchPage, resultsFor, emptyTitle, serviceName }) {
  const grid = document.querySelector("#results-grid");
  const status = document.querySelector("#results-status");
  const messageBox = document.querySelector("#results-message");
  const moreWrap = document.querySelector("#load-more-wrap");
  const moreButton = document.querySelector("#load-more");

  let page = 1;
  let shown = 0;

  async function loadPage() {
    moreButton.disabled = true;
    status.textContent = "Searching…";
    grid.setAttribute("aria-busy", "true");
    clearMessage(messageBox);

    try {
      const { books, total } = await fetchPage(page);

      if (page === 1 && books.length === 0) {
        status.textContent = "";
        moreWrap.hidden = true;
        renderMessage(messageBox, {
          title: emptyTitle,
          text: "Check the spelling or try a shorter search, like just the author's last name.",
        });
        return;
      }

      books.forEach((book) => grid.append(createBookCard(book)));
      shown += books.length;
      status.textContent = `Showing ${shown} of ${total.toLocaleString()} results${resultsFor}`;
      moreWrap.hidden = shown >= total;
    } catch (error) {
      status.textContent = "";
      if (page === 1) {
        renderMessage(messageBox, {
          title: "Search didn't load",
          text: friendlyError(error, serviceName),
          actionLabel: "Try again",
          onAction: loadPage,
        });
      } else {
        // Keep the results already on screen; let the reader retry the next page.
        page -= 1;
        status.textContent = friendlyError(error, serviceName);
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
