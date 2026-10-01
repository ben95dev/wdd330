// main.js — starts the app and connects each page to its module.
import { initNavigation } from "./navigation.js";
import { initSearch } from "./search.js";
import { initHome } from "./home.js";

initNavigation();

const pages = {
  home: initHome,
  search: initSearch,
};

const init = pages[document.body.dataset.page];
if (init) init();
