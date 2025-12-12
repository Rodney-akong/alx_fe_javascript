/* ====== Load quotes from localStorage OR use defaults ====== */
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Success is a journey, not a destination.", category: "motivation" },
  { text: "Stay hungry. Stay foolish.", category: "inspiration" },
  { text: "Code is like humor — when you have to explain it, it’s bad.", category: "programming" }
];

/* ====== DOM selectors ====== */
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");

let addQuoteBtn = document.getElementById("addQuoteBtn");
let newQuoteTextInput = document.getElementById("newQuoteText");
let newQuoteCategoryInput = document.getElementById("newQuoteCategory");

const exportJsonBtn = document.getElementById("exportJsonBtn");
const importFileInput = document.getElementById("importFile");

/* ====== Helper: escape HTML ====== */
function escapeHtml(str) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/* ====== Save quotes to localStorage ====== */
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

/* ====== Populate category dropdown dynamically ====== */
function populateCategories() {
  // Collect unique categories
  const categories = [...new Set(quotes.map(q => q.category.toLowerCase()))];
  
  // Clear dropdown except 'all'
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categoryFilter.appendChild(option);
  });

  // Restore last selected category from localStorage
  const lastSelected = localStorage.getItem("lastCategoryFilter") || "all";
  categoryFilter.value = lastSelected;
}

/* ====== Show a random quote (filtered) ====== */
function showRandomQuote() {
  if (!quoteDisplay) return;

  let filteredQuotes = quotes;
  const selectedCategory = categoryFilter.value;

  if (selectedCategory && selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const chosenQuote = filteredQuotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p><strong>Quote:</strong> ${escapeHtml(chosenQuote.text)}</p>
    <p><strong>Category:</strong> ${escapeHtml(chosenQuote.category)}</p>
  `;

  // Save last viewed quote to sessionStorage
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(chosenQuote));
}

/* ====== Filter quotes when category changes ====== */
function filterQuotes() {
  localStorage.setItem("lastCategoryFilter", categoryFilter.value);
  showRandomQuote();
}

/* ====== Add a new quote manually ====== */
function addQuote() {
  if (!newQuoteTextInput || !newQuoteCategoryInput) {
    alert("Add-quote form missing. Creating...");
    createAddQuoteForm();
    return;
  }

  const text = newQuoteTextInput.value.trim();
  const category = newQuoteCategoryInput.value.trim().toLowerCase();

  if (!text || !category) {
    alert("Please fill out both fields!");
    return;
  }

  quotes.push({ text, category });

  saveQuotes();
  newQuoteTextInput.value = "";
  newQuoteCategoryInput.value = "";

  populateCategories(); // Update dropdown with new category if added

  quoteDisplay.innerHTML = `<p>Added: "${escapeHtml(text)}" — ${escapeHtml(category)}</p>`;
}

/* ====== Create add-quote form dynamically ====== */
function createAddQuoteForm() {
  if (newQuoteTextInput && newQuoteCategoryInput && addQuoteBtn) {
    addQuoteBtn.removeEventListener("click", addQuote);
    addQuoteBtn.addEventListener("click", addQuote);
    return;
  }

  const container = document.createElement("div");
  container.style.marginTop = "1rem";

  const title = document.createElement("h3");
  title.textContent = "Add a New Quote";
  container.appendChild(title);

  const textInput = document.createElement("input");
  textInput.id = "newQuoteText";
  textInput.placeholder = "Enter a new quote";
  textInput.style.marginRight = "0.5rem";
  container.appendChild(textInput);

  const catInput = document.createElement("input");
  catInput.id = "newQuoteCategory";
  catInput.placeholder = "Enter quote category";
  catInput.style.marginRight = "0.5rem";
  container.appendChild(catInput);

  const btn = document.createElement("button");
  btn.id = "addQuoteBtn";
  btn.textContent = "Add Quote";
  container.appendChild(btn);

  document.body.appendChild(container);

  newQuoteTextInput = document.getElementById("newQuoteText");
  newQuoteCategoryInput = document.getElementById("newQuoteCategory");
  addQuoteBtn = document.getElementById("addQuoteBtn");

  addQuoteBtn.addEventListener("click", addQuote);
}

/* ====== Export quotes as JSON ====== */
function exportQuotesAsJson() {
  const data = JSON.stringify(quotes, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

/* ====== Import JSON ====== */
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);

      if (!Array.isArray(importedQuotes)) {
        alert("Invalid JSON format");
        return;
      }

      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();

      alert("Quotes imported!");
      showRandomQuote();
    } catch (err) {
      alert("Error reading JSON file");
    }
  };

  reader.readAsText(file);
}

/* ====== EVENT LISTENERS ====== */
if (newQuoteBtn) newQuoteBtn.addEventListener("click", showRandomQuote);
if (addQuoteBtn) addQuoteBtn.addEventListener("click", addQuote);
if (exportJsonBtn) exportJsonBtn.addEventListener("click", exportQuotesAsJson);
if (importFileInput) importFileInput.addEventListener("change", importFromJsonFile);
if (categoryFilter) categoryFilter.addEventListener("change", filterQuotes);

/* ====== Initialize ====== */
createAddQuoteForm();
populateCategories();
showRandomQuote();
