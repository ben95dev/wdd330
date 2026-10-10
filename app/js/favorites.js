// favorites.js — one click handler for every Save button on every page.
// It reads the book from the card's data-* attributes (card.dataset).
import { createEl } from "./utils.js";
import { toggleFavorite } from "./storage.js";
import { setFavoriteButton } from "./bookCard.js";

export function initFavorites() {
  // Screen-reader announcement: "Saved Title" / "Removed Title"
  const announcer = createEl("p", {
    className: "visually-hidden",
    attrs: { role: "status", "aria-live": "polite" },
  });
  document.body.append(announcer);

  document.addEventListener("click", (event) => {
    const button = event.target.closest(".fav-btn");
    if (!button) return;

    const { id, source, title, author, year, coverUrl } = button.closest(".book-card").dataset;
    const saved = toggleFavorite({
      id,
      source,
      title,
      author,
      year: year ? Number(year) : null,
      coverUrl: coverUrl || null,
    });

    if (saved === null) {
      announcer.textContent = "Saving is not available in this browser.";
      return;
    }

    // The same book can appear twice on a page (popular + saved), so sync every copy.
    document.querySelectorAll(".book-card").forEach((card) => {
      if (card.dataset.id === id && card.dataset.source === source) {
        card.dataset.saved = String(saved);
        setFavoriteButton(card.querySelector(".fav-btn"), saved, card.dataset.title);
      }
    });

    announcer.textContent = `${saved ? "Saved" : "Removed"} ${title}`;
    document.dispatchEvent(new CustomEvent("readspace:favorites-changed"));
  });
}
