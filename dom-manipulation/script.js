/* ====== Load quotes from localStorage OR use defaults ====== */
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Success is a journey, not a destination.", category: "motivation" },
  { text: "Stay hungry. Stay foolish.", category: "inspiration" },
  { text: "Code is like humor — when you have to explain it, it’s bad.", category: "programming" }
];

/* ====== DOM selectors ====== */
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

let addQuoteBtn = document.getElementById("addQuoteBtn");
let newQuoteTextInput = document.getElementById("newQuoteText");
let newQuoteCategoryInput = document.getElementById("newQuoteCategory");

const exportJsonBtn = document.getElementById("exportJsonBtn");
const importFileInput = document.getElementById("importFile");

/* ====== Save Quotes to LocalStorage ====== */
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

/* ====== Show a random quote ====== */
function showRandomQuote() {
  if (!quoteDisplay) return;

  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const chosenQuote = quotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p><strong>Quote:</strong> ${escapeHtml(chosenQuote.text)}</p>
    <p><strong>Category:</strong> ${escapeHtml(chosenQuote.category)}</p>
  `;

  // Save last viewed quote to sessionStorage
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(chosenQuote));
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

  // Save to storage
  saveQuotes();

  newQuoteTextInput.value = "";
  newQuoteCategoryInput.value = "";

  quoteDisplay.innerHTML = `<p>Added: "${escapeHtml(text)}" — ${escapeHtml(category)}</p>`;
}

/* ====== Create add-quote form dynamically (if missing) ====== */
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

/* ====== Escape HTML to prevent injection ====== */
function escapeHtml(str) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
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

      alert("Quotes imported!");
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

/* ====== Show initial quote ====== */
createAddQuoteForm();
showRandomQuote();
