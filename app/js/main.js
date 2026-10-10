// main.js — starts the app and connects each page to its module.
import { initNavigation } from "./navigation.js";
import { initFavorites } from "./favorites.js";
import { initSearch } from "./search.js";
import { initHome } from "./home.js";
import { initDiscover } from "./discover.js";

initNavigation();
initFavorites(); // Save buttons work on every page that shows book cards

const pages = {
  home: () => {
    initHome();
    initDiscover();
  },
  search: initSearch,
};

const init = pages[document.body.dataset.page];
if (init) init();
