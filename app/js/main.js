// main.js — starts the app and connects each page to its module.
import { initNavigation } from "./navigation.js";
import { initFavorites } from "./favorites.js";
import { initSearch } from "./search.js";
import { initFree } from "./free.js";
import { initDetails } from "./details.js";
import { initHome } from "./home.js";
import { initDiscover } from "./discover.js";
import { createEl, renderMessage } from "./utils.js";

initNavigation();
initFavorites(); // Save buttons work on every page that shows book cards

// Each page's <body data-page="..."> says which module to start.
const pages = {
  home: () => {
    initHome();
    initDiscover();
  },
  search: initSearch,
  free: initFree,
  details: initDetails,
};

const init = pages[document.body.dataset.page];
try {
  if (init) init();
} catch (error) {
  // Never leave a blank page: log the problem and tell the reader.
  console.error(error);
  const box = createEl("div", { className: "container" });
  renderMessage(box, {
    title: "Something went wrong",
    text: "This page could not start. Reload the page, or go back to the home page.",
  });
  document.querySelector("#main").append(box);
}
