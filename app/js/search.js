// search.js — Search page: reads ?q= from the URL and lists Open Library results.
import { searchBooks } from "./api/openLibrary.js";
import { initResults } from "./results.js";
import { getParams, renderMessage } from "./utils.js";

export function initSearch() {
  const query = (getParams().get("q") || "").trim();
  document.querySelector("#search-form").elements.q.value = query;

  if (!query) {
    renderMessage(document.querySelector("#results-message"), {
      title: "Search for a book",
      text: "Type a title, author, or keyword above to see results.",
    });
    return;
  }

  initResults({
    fetchPage: (page) => searchBooks(query, { page }),
    resultsFor: ` for "${query}"`,
    emptyTitle: `No books found for "${query}"`,
    serviceName: "Open Library",
  });
}
