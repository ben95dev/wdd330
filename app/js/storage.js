// storage.js — read and write saved books in localStorage.
// Keys come from the site plan. Every call is wrapped in try/catch because
// storage can be blocked (private mode, full disk) or hold bad data.
const FAVORITES_KEY = "readspace_favorites";

function read(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function write(key, list) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
}

/** All saved books, oldest first. Each is { id, source, title, author, year, coverUrl, added }. */
export function getFavorites() {
  return read(FAVORITES_KEY);
}

export function isFavorite(id, source) {
  return getFavorites().some((book) => book.id === id && book.source === source);
}

/**
 * Save the book if it is not saved, remove it if it is.
 * @returns {boolean|null} true = now saved, false = now removed, null = storage failed
 */
export function toggleFavorite(book) {
  const list = getFavorites();
  const index = list.findIndex((item) => item.id === book.id && item.source === book.source);
  if (index >= 0) list.splice(index, 1);
  else list.push({ ...book, added: new Date().toISOString() });
  return write(FAVORITES_KEY, list) ? index < 0 : null;
}
