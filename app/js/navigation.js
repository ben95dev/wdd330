// navigation.js — builds the header + footer and handles the mobile menu.
// To add a page to the menu, add one entry to NAV_LINKS.
import { createEl } from "./utils.js";

const NAV_LINKS = [
  { href: "index.html", label: "Home", page: "home" },
  { href: "search.html", label: "Search", page: "search" },
  { href: "free.html", label: "Free books", page: "free" },
  { href: "../index.html", label: "Project portal", page: "portal" },
];

const MENU_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';

export function initNavigation() {
  const currentPage = document.body.dataset.page;
  const header = document.querySelector("#site-header");
  const footer = document.querySelector("#site-footer");

  const brand = createEl("a", { className: "brand", attrs: { href: "index.html" } }, [
    createEl("img", { attrs: { src: "images/icon.svg", alt: "", width: "32", height: "32" } }),
    createEl("span", { text: "ReadSpace" }),
  ]);

  const toggle = createEl("button", {
    className: "nav-toggle",
    attrs: { type: "button", "aria-expanded": "false", "aria-controls": "site-nav", "aria-label": "Menu" },
  });
  toggle.innerHTML = MENU_ICON; // static markup only, no user or API data

  const list = createEl(
    "ul",
    {},
    NAV_LINKS.map((link) => {
      const anchor = createEl("a", { text: link.label, attrs: { href: link.href } });
      if (link.page === currentPage) anchor.setAttribute("aria-current", "page");
      return createEl("li", {}, [anchor]);
    })
  );
  const nav = createEl("nav", { className: "site-nav", attrs: { id: "site-nav", "aria-label": "Main" } }, [list]);

  header.replaceChildren(createEl("div", { className: "container header-inner" }, [brand, toggle, nav]));

  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  }

  toggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      setMenu(false);
      toggle.focus();
    }
  });

  const link = (label, href) => createEl("a", { text: label, attrs: { href } });
  const dot = () => document.createTextNode(" \u00b7 ");

  footer.replaceChildren(
    createEl("div", { className: "container" }, [
      createEl("p", { text: `\u00a9 ${new Date().getFullYear()} Benjamin Iriganje` }),
      createEl("p", { text: "ReadSpace \u00b7 a WDD 330 project" }),
      createEl("p", {}, [
        link("Project portal", "../index.html"), dot(), link("Site plan", "../siteplan.html"), dot(), link("Open the app", "index.html"),
      ]),
      createEl("p", {}, [
        document.createTextNode("Book data from "), link("Open Library", "https://openlibrary.org"),
        document.createTextNode(". Free books from "), link("Project Gutenberg", "https://www.gutenberg.org"),
        document.createTextNode(", through "), link("Gutendex", "https://gutendex.com"), document.createTextNode("."),
      ]),
    ])
  );
}
