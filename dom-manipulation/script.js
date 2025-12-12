// script.js - updated: includes addQuote() and createAddQuoteForm()

/* ====== sample quotes array ====== */
let quotes = [
  { text: "Success is a journey, not a destination.", category: "motivation" },
  { text: "Stay hungry. Stay foolish.", category: "inspiration" },
  { text: "Code is like humor — when you have to explain it, it’s bad.", category: "programming" }
]

/* ====== DOM selectors (may be undefined if HTML doesn't include them) ====== */
const quoteDisplay = document.getElementById("quoteDisplay")
const newQuoteBtn = document.getElementById("newQuote")

// Try to grab form inputs/buttons if they exist in the HTML
let addQuoteBtn = document.getElementById("addQuoteBtn")
let newQuoteTextInput = document.getElementById("newQuoteText")
let newQuoteCategoryInput = document.getElementById("newQuoteCategory")

/* ====== showRandomQuote: displays a random quote ====== */
function showRandomQuote() {
  if (!quoteDisplay) return console.warn("No #quoteDisplay element found.")

  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available."
    return
  }

  const randomIndex = Math.floor(Math.random() * quotes.length)
  const chosenQuote = quotes[randomIndex]

  quoteDisplay.innerHTML = `
    <p><strong>Quote:</strong> ${escapeHtml(chosenQuote.text)}</p>
    <p><strong>Category:</strong> ${escapeHtml(chosenQuote.category)}</p>
  `
}

/* ====== addQuote: validates input, pushes to array, clears inputs ====== */
function addQuote() {
  // ensure inputs exist
  if (!newQuoteTextInput || !newQuoteCategoryInput) {
    alert("Add-quote form is missing. Creating one now.")
    createAddQuoteForm()
    return
  }

  const text = newQuoteTextInput.value.trim()
  const category = newQuoteCategoryInput.value.trim().toLowerCase()

  if (text === "" || category === "") {
    alert("Please fill out both fields!")
    return
  }

  // Add safely to array
  quotes.push({ text, category })

  // Clear inputs
  newQuoteTextInput.value = ""
  newQuoteCategoryInput.value = ""

  // Optionally show the just-added quote
  quoteDisplay && (quoteDisplay.innerHTML = `<p>Added: "${escapeHtml(text)}" — ${escapeHtml(category)}</p>`)

  // If you want to immediately show a random quote (including the new one), uncomment:
  // showRandomQuote()
}

/* ====== createAddQuoteForm: dynamically builds the add-quote form if missing ====== */
function createAddQuoteForm() {
  // If inputs already exist, just wire the button
  if (newQuoteTextInput && newQuoteCategoryInput && addQuoteBtn) {
    addQuoteBtn.removeEventListener("click", addQuote) // avoid duplicates
    addQuoteBtn.addEventListener("click", addQuote)
    return
  }

  // Create container
  const container = document.createElement("div")
  container.id = "addQuoteArea"
  container.style.marginTop = "1rem"

  const heading = document.createElement("h3")
  heading.textContent = "Add a New Quote"
  container.appendChild(heading)

  // Create text input
  const textInput = document.createElement("input")
  textInput.type = "text"
  textInput.id = "newQuoteText"
  textInput.placeholder = "Enter a new quote"
  textInput.style.marginRight = "0.5rem"
  container.appendChild(textInput)

  // Create category input
  const categoryInput = document.createElement("input")
  categoryInput.type = "text"
  categoryInput.id = "newQuoteCategory"
  categoryInput.placeholder = "Enter quote category"
  categoryInput.style.marginRight = "0.5rem"
  container.appendChild(categoryInput)

  // Create add button
  const button = document.createElement("button")
  button.id = "addQuoteBtn"
  button.type = "button"
  button.textContent = "Add Quote"
  container.appendChild(button)

  // Append to body (or place before the script tag if you prefer)
  // If there's a main container element, prefer that
  const preferredParent = document.getElementById("main") || document.body
  preferredParent.appendChild(container)

  // Update references to the newly-created elements so other functions can use them
  newQuoteTextInput = document.getElementById("newQuoteText")
  newQuoteCategoryInput = document.getElementById("newQuoteCategory")
  addQuoteBtn = document.getElementById("addQuoteBtn")

  // Wire the event listener
  addQuoteBtn.addEventListener("click", addQuote)
}

/* ====== small helper to avoid HTML injection when showing text ====== */
function escapeHtml(str) {
  if (!str) return ""
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

/* ====== Attach event listeners for "Show New Quote" button ====== */
if (newQuoteBtn) {
  newQuoteBtn.addEventListener("click", showRandomQuote)
} else {
  console.warn("No #newQuote button found.")
}

/* ====== Ensure the add-quote form exists and is wired ====== */
createAddQuoteForm()

/* ====== Optionally show an initial quote on load ====== */
if (quoteDisplay && quotes.length) {
  showRandomQuote()
}
