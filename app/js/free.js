// free.js — Free books page: searches Gutendex (Project Gutenberg).
// With no search words it lists the most downloaded free books.
import { searchFreeBooks } from "./api/gutendex.js";
import { initResults } from "./results.js";
import { getParams } from "./utils.js";

export function initFree() {
  const params = getParams();
  const query = (params.get("q") || "").trim();
  const language = params.get("lang") || "en";

  const form = document.querySelector("#free-form");
  form.elements.q.value = query;
  form.elements.lang.value = language;

  // Changing the language reloads the list right away, with no extra click.
  form.elements.lang.addEventListener("change", () => form.requestSubmit());

  initResults({
    fetchPage: (page) => searchFreeBooks(query, { page, language }),
    resultsFor: query ? ` for "${query}"` : " (most popular first)",
    emptyTitle: query ? `No free books found for "${query}"` : "No free books found",
    serviceName: "Gutendex",
  });
}
