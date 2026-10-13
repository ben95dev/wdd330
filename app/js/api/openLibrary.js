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

/** Open Library descriptions are either a string or { value: "..." }. */
function readDescription(description) {
  if (!description) return "";
  return typeof description === "string" ? description : description.value || "";
}

/** Look up author names for the first few author keys (a failed lookup is skipped). */
async function getAuthorNames(authorEntries = []) {
  const keys = authorEntries.map((entry) => entry.author?.key).filter(Boolean).slice(0, 3);
  const results = await Promise.allSettled(
    keys.map(async (key) => {
      const response = await fetch(`${BASE_URL}${key}.json`);
      if (!response.ok) throw new Error(`Author lookup failed with status ${response.status}`);
      return (await response.json()).name;
    })
  );
  return results.filter((result) => result.status === "fulfilled" && result.value).map((result) => result.value);
}

/**
 * Load one work for the details page.
 * @param {string} id  Open Library work id, e.g. "OL45804W"
 * @returns {Promise<object>} the common book shape plus description and link
 */
export async function getWork(id) {
  const response = await fetch(`${BASE_URL}/works/${encodeURIComponent(id)}.json`);
  if (!response.ok) {
    throw new Error(`Open Library responded with status ${response.status}`);
  }
  const work = await response.json();

  const authors = await getAuthorNames(work.authors);
  const coverId = (work.covers || []).find((cover) => cover > 0);
  const year = String(work.first_publish_date || "").match(/\d{4}/);

  return {
    id,
    source: "openlibrary",
    title: work.title || "Untitled",
    author: authors[0] || "Unknown author",
    authors,
    year: year ? Number(year[0]) : null,
    coverUrl: coverId ? `${COVERS_URL}/b/id/${coverId}-L.jpg?default=false` : null,
    subjects: (work.subjects || []).slice(0, 10),
    description: readDescription(work.description),
    infoUrl: `${BASE_URL}/works/${id}`,
  };
}
