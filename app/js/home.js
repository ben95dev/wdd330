// home.js — "Popular right now" and "Saved for later" rows on the home page.
import { searchBooks } from "./api/openLibrary.js";
import { createBookCard } from "./bookCard.js";
import { getFavorites } from "./storage.js";
import { createEl, friendlyError, renderMessage, clearMessage } from "./utils.js";

const POPULAR_COUNT = 8;
const SAVED_MAX = 8;

function showSkeletons(grid) {
  grid.setAttribute("aria-busy", "true");
  grid.replaceChildren(
    ...Array.from({ length: POPULAR_COUNT }, () =>
      createEl("li", { className: "book-skeleton", attrs: { "aria-hidden": "true" } })
    )
  );
}

function initPopular() {
  const grid = document.querySelector("#popular-grid");
  const messageBox = document.querySelector("#popular-message");

  async function load() {
    clearMessage(messageBox);
    showSkeletons(grid);
    try {
      const { books } = await searchBooks("subject:fiction", { limit: POPULAR_COUNT, sort: "rating" });
      grid.replaceChildren(...books.map(createBookCard));
    } catch (error) {
      grid.replaceChildren();
      renderMessage(messageBox, {
        title: "Popular books didn't load",
        text: friendlyError(error),
        actionLabel: "Try again",
        onAction: load,
      });
    } finally {
      grid.removeAttribute("aria-busy");
    }
  }

  load();
}

function initSaved() {
  const section = document.querySelector("#saved-section");
  const grid = document.querySelector("#saved-grid");
  const count = document.querySelector("#saved-count");

  function render() {
    const saved = getFavorites().reverse(); // newest first
    section.hidden = saved.length === 0;
    count.textContent =
      saved.length > SAVED_MAX ? `Showing ${SAVED_MAX} of ${saved.length}` : `${saved.length} saved`;
    grid.replaceChildren(...saved.slice(0, SAVED_MAX).map(createBookCard));
  }

  render();
  document.addEventListener("readspace:favorites-changed", render);
}

export function initHome() {
  initPopular();
  initSaved();
}
