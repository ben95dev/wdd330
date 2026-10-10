# ReadSpace — WDD 330 Final Project

Book discovery and reading tracker by Benjamin Iriganje.

```
index.html          Project portal (app, site plan, Trello board, course work)
datasets.html       W05 Datasets learning activity
siteplan.html       Site plan document
css/site.css        Styles for the portal and site plan
images/             Icon and the four wireframes
app/                The ReadSpace app
  index.html  search.html  details.html (placeholder until Week 6)
  js/storage.js  favorites.js  discover.js (home page features)
  css/  js/  images/
```

## Run locally

The app uses ES modules, which do not load from `file://`. Serve the folder:

- VS Code: install **Live Server**, right-click `index.html` → *Open with Live Server*
- or: `python3 -m http.server 8000` and open http://localhost:8000

## Publish on GitHub Pages

1. Create a repository named `wdd330` under your `ben3box` account.
2. Upload everything in this folder to the repository root (the `index.html` must be at the top level).
3. In the repository, open **Settings → Pages**, choose **Deploy from a branch**, pick `main` and `/ (root)`, and save.
4. After a minute the portal is at `https://ben3box.github.io/wdd330/` and the app at `https://ben3box.github.io/wdd330/app/`.

All links are relative, so a different repository name works too.

## Status

Week 5 done: layout, navigation, home page, Open Library module, search with loading/empty/error states, book cards.
Home page upgrade: data-* attributes on every book card, Save button (localStorage via `storage.js`), Saved for later row,
Discover a book, loading placeholders.
Next (Week 6): `details.js`, `filters.js`, `library.js`, status buttons.
