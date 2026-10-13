// api/gutendex.js — Gutendex requests (free Project Gutenberg books) + data clean-up.
// Gutendex is the app's second third-party API. Like openLibrary.js, every
// function returns the app's common "book" shape, so cards and pages do not
// need to know what the raw Gutendex JSON looks like.

const BASE_URL = "https://gutendex.com/books";

/** "Austen, Jane" -> "Jane Austen". Names without a comma are returned as they are. */
export function formatAuthorName(name) {
  if (!name) return "Unknown author";
  const [last, first] = name.split(",").map((part) => part.trim());
  return first ? `${first} ${last}` : last;
}

/** Find the first format whose MIME type starts with `prefix` (e.g. "text/html"). */
function findFormat(formats = {}, prefix) {
  const key = Object.keys(formats).find((type) => type.startsWith(prefix));
  return key ? formats[key] : null;
}

/**
 * Common book shape:
 * { id, source, title, author, authors, year, coverUrl, subjects, readUrl, epubUrl, downloads }
 */
export function normalizeBook(item) {
  const authors = (item.authors || []).map((person) => formatAuthorName(person.name));
  return {
    id: String(item.id),
    source: "gutendex",
    title: item.title || "Untitled",
    author: authors[0] || "Unknown author",
    authors,
    year: null, // Gutendex does not give a first-publication year
    coverUrl: findFormat(item.formats, "image/jpeg"),
    subjects: (item.subjects || []).slice(0, 6),
    readUrl: findFormat(item.formats, "text/html"),
    epubUrl: findFormat(item.formats, "application/epub+zip"),
    downloads: item.download_count || 0,
  };
}

/** Ask Gutendex for one page of results and check that the request worked. */
async function request(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Gutendex responded with status ${response.status}`);
  }
  return response.json();
}

/**
 * Search free books. An empty query returns the most downloaded books.
 * @param {string} query  title or author words (may be empty)
 * @param {{page?: number, language?: string}} options
 * @returns {Promise<{books: object[], total: number, page: number}>}
 */
export async function searchFreeBooks(query = "", { page = 1, language = "en" } = {}) {
  const url = new URL(BASE_URL);
  if (query) url.searchParams.set("search", query);
  if (language) url.searchParams.set("languages", language);
  url.searchParams.set("page", String(page));

  const data = await request(url);
  return {
    books: (data.results || []).map(normalizeBook),
    total: data.count || 0,
    page,
  };
}

/** Load one free book by its Project Gutenberg id. */
export async function getFreeBook(id) {
  const data = await request(`${BASE_URL}/${encodeURIComponent(id)}`);
  return normalizeBook(data);
}
