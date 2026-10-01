// utils.js — small shared helpers

/** Build a DOM element without using innerHTML (keeps API text safe). */
export function createEl(tag, { className, text, attrs = {} } = {}, children = []) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value);
  el.append(...children);
  return el;
}

export function getParams() {
  return new URLSearchParams(window.location.search);
}

/** Turn a thrown error into a message a reader can act on. */
export function friendlyError(error) {
  if (error instanceof TypeError) {
    return "We couldn't reach Open Library. Check your connection and try again.";
  }
  return "Open Library had a problem loading these books. Try again in a moment.";
}

/**
 * Fill a container with a message card (empty states, errors).
 * Pass actionLabel + onAction to add a button such as "Try again".
 */
export function renderMessage(container, { title, text, actionLabel, onAction }) {
  const box = createEl("div", { className: "message" }, [
    createEl("h2", { text: title }),
    createEl("p", { text }),
  ]);

  if (actionLabel && onAction) {
    const button = createEl("button", {
      className: "btn btn-primary",
      text: actionLabel,
      attrs: { type: "button" },
    });
    button.addEventListener("click", onAction);
    box.append(button);
  }

  container.replaceChildren(box);
}

export function clearMessage(container) {
  container.replaceChildren();
}
