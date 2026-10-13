// datasets.js — W05 datasets activity: read data-* attributes with element.dataset
// Log every item's dataset values
const items = document.querySelectorAll('#items li');
items.forEach(item => {
  console.log('Name:', item.dataset.name);
  console.log('Category:', item.dataset.category);
  console.log('Color:', item.dataset.color);
});

// Show details on click (or Enter/Space for keyboard users)
const details = document.querySelector('#details');
function showItem(item) {
  details.innerHTML = `
    <h2>Item Details</h2>
    <p>Name: ${item.dataset.name}</p>
    <p>Category: ${item.dataset.category}</p>
    <p>Color: ${item.dataset.color}</p>`;
}
items.forEach(item => {
  item.addEventListener('click', () => showItem(item));
  item.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showItem(item); }
  });
});

// Book example: read data-id, data-source and data-status, and change status via dataset
const bookDetails = document.querySelector('#bookDetails');
document.querySelectorAll('#books li').forEach(book => {
  const show = () => {
    bookDetails.textContent = `ID: ${book.dataset.id} | Source: ${book.dataset.source} | Status: ${book.dataset.status}`;
  };
  book.addEventListener('click', show);
  book.addEventListener('keydown', e => { if (e.key === 'Enter') show(); });
});
