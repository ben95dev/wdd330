# ReadSpace — WDD 330 Final Project

Book discovery and reading tracker by Benjamin Iriganje.

```
index.html          Project portal (links to the app and the site plan)
siteplan.html       Site plan document
css/site.css        Styles for the portal and site plan
images/             Icon and the four wireframes
app/                The ReadSpace app
  index.html  search.html  details.html (placeholder until Week 6)
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
Next (Week 6): `storage.js`, `details.js`, `filters.js`, `library.js`, favorites and status buttons.
