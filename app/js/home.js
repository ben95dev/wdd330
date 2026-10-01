// home.js — "Popular right now" row on the home page.
import { searchBooks } from "./api/openLibrary.js";
import { createBookCard } from "./bookCard.js";
import { friendlyError, renderMessage, clearMessage } from "./utils.js";

export async function initHome() {
  const grid = document.querySelector("#popular-grid");
  const messageBox = document.querySelector("#popular-message");

  async function load() {
    clearMessage(messageBox);
    try {
      const { books } = await searchBooks("subject:fiction", { limit: 8, sort: "rating" });
      grid.replaceChildren(...books.map(createBookCard));
    } catch (error) {
      renderMessage(messageBox, {
        title: "Popular books didn't load",
        text: friendlyError(error),
        actionLabel: "Try again",
        onAction: load,
      });
    }
  }

  load();
}
