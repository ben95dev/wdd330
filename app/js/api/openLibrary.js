// api/openLibrary.js — Open Library requests + data clean-up.
// Every function returns the app's common "book" shape, so the rest of the
// app never needs to know what Open Library's raw data looks like.

const BASE_URL = "https://openlibrary.org";
const COVERS_URL = "https://covers.openlibrary.org";
const FIELDS = "key,title,author_name,first_publish_year,cover_i,subject";

/**
 * Common book shape:
 * { id, source, title, author, authors, year, coverUrl, subjects }
 */
export function normalizeBook(doc) {
  return {
    id: doc.key ? doc.key.replace("/works/", "") : "",
    source: "openlibrary",
    title: doc.title || "Untitled",
    author: doc.author_name?.[0] || "Unknown author",
    authors: doc.author_name || [],
    year: doc.first_publish_year || null,
    coverUrl: doc.cover_i
      ? `${COVERS_URL}/b/id/${doc.cover_i}-M.jpg?default=false`
      : null,
    subjects: (doc.subject || []).slice(0, 6),
  };
}

/**
 * Search Open Library.
 * @param {string} query  title, author, keyword, or e.g. subject:fantasy
 * @param {{page?: number, limit?: number, sort?: string}} options
 * @returns {Promise<{books: object[], total: number, page: number}>}
 */
export async function searchBooks(query, { page = 1, limit = 24, sort } = {}) {
  const url = new URL(`${BASE_URL}/search.json`);
  url.searchParams.set("q", query);
  url.searchParams.set("fields", FIELDS);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("page", String(page));
  if (sort) url.searchParams.set("sort", sort);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Open Library responded with status ${response.status}`);
  }

  const data = await response.json();
  return {
    books: (data.docs || []).map(normalizeBook),
    total: data.numFound || 0,
    page,
  };
}
