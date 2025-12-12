/* ====== Load quotes from localStorage OR default ====== */
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Success is a journey, not a destination.", category: "motivation" },
  { text: "Stay hungry. Stay foolish.", category: "inspiration" },
  { text: "Code is like humor — when you have to explain it, it’s bad.", category: "programming" }
];

/* ====== DOM Elements ====== */
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");

let addQuoteBtn = document.getElementById("addQuoteBtn");
let newQuoteTextInput = document.getElementById("newQuoteText");
let newQuoteCategoryInput = document.getElementById("newQuoteCategory");

const exportJsonBtn = document.getElementById("exportJsonBtn");
const importFileInput = document.getElementById("importFile");

const syncNotification = document.getElementById("syncNotification");
const syncMessage = document.getElementById("syncMessage");
const acceptServerBtn = document.getElementById("acceptServerBtn");
const keepLocalBtn = document.getElementById("keepLocalBtn");

/* ====== Helper: escape HTML ====== */
function escapeHtml(str) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/* ====== Save/Load Local Storage ====== */
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

/* ====== Populate categories dynamically ====== */
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category.toLowerCase()))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categoryFilter.appendChild(opt);
  });
  const last = localStorage.getItem("lastCategoryFilter") || "all";
  categoryFilter.value = last;
}

/* ====== Show Random Quote ====== */
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

  sessionStorage.setItem("lastViewedQuote", JSON.stringify(chosenQuote));
}

/* ====== Filter Quotes ====== */
function filterQuotes() {
  localStorage.setItem("lastCategoryFilter", categoryFilter.value);
  showRandomQuote();
}

/* ====== Server Config ====== */
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

/* ====== Add Quote ====== */
async function addQuote() {
  if (!newQuoteTextInput || !newQuoteCategoryInput) return;

  const text = newQuoteTextInput.value.trim();
  const category = newQuoteCategoryInput.value.trim().toLowerCase();
  if (!text || !category) {
    alert("Please fill out both fields!");
    return;
  }

  // Add locally
  const newQuoteObj = { text, category };
  quotes.push(newQuoteObj);
  saveQuotes();

  // Reset inputs
  newQuoteTextInput.value = "";
  newQuoteCategoryInput.value = "";

  // Update categories & display
  populateCategories();
  showRandomQuote();

  // POST new quote to server (mock)
  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newQuoteObj)
    });
    const data = await response.json();
    console.log("Posted to server:", data);
  } catch (err) {
    console.warn("Error posting to server:", err);
  }
}

/* ====== Create Add Quote Form dynamically ====== */
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

/* ====== Export JSON ====== */
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
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) return alert("Invalid JSON format");
      quotes.push(...imported);
      saveQuotes();
      populateCategories();
      showRandomQuote();
      alert("Quotes imported!");
    } catch (err) {
      alert("Error reading JSON file");
    }
  };
  reader.readAsText(file);
}

/* ====== Sync Quotes with Server ====== */
async function syncQuotes() {
  try {
    const response = await fetch(SERVER_URL);
    const serverData = await response.json();

    // Map to quotes format (simulate)
    const serverQuotes = serverData.slice(0, 5).map(item => ({
      text: item.title,
      category: "server"
    }));

    // Detect conflict
    const conflict = JSON.stringify(serverQuotes) !== JSON.stringify(quotes);
    if (conflict) {
      syncNotification.style.display = "block";
      syncMessage.textContent = "Server data is different from local data. Choose which to keep.";
      acceptServerBtn.onclick = () => {
        quotes = serverQuotes;
        saveQuotes();
        populateCategories();
        showRandomQuote();
        syncNotification.style.display = "none";
      };
      keepLocalBtn.onclick = () => {
        saveQuotes();
        syncNotification.style.display = "none";
      };
    }
  } catch (err) {
    console.warn("Error syncing quotes with server:", err);
  }
}

// Periodic sync every 15 seconds
setInterval(syncQuotes, 15000);

/* ====== Event Listeners ====== */
if (newQuoteBtn) newQuoteBtn.addEventListener("click", showRandomQuote);
if (addQuoteBtn) addQuoteBtn.addEventListener("click", addQuote);
if (exportJsonBtn) exportJsonBtn.addEventListener("click", exportQuotesAsJson);
if (importFileInput) importFileInput.addEventListener("change", importFromJsonFile);
if (categoryFilter) categoryFilter.addEventListener("change", filterQuotes);

/* ====== Initialize ====== */
createAddQuoteForm();
populateCategories();
showRandomQuote();
