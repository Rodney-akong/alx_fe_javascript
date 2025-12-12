// 1. Our quotes array (each quote is an object)
let quotes = [
  { text: "Success is a journey, not a destination.", category: "motivation" },
  { text: "Stay hungry. Stay foolish.", category: "inspiration" },
  { text: "Code is like humor — when you have to explain it, it’s bad.", category: "programming" }
]

// 2. Selecting DOM elements
const quoteDisplay = document.getElementById("quoteDisplay")
const newQuoteBtn = document.getElementById("newQuote")
const addQuoteBtn = document.getElementById("addQuoteBtn")
const newQuoteTextInput = document.getElementById("newQuoteText")
const newQuoteCategoryInput = document.getElementById("newQuoteCategory")

// 3. Function to show a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available."
    return
  }

  const randomIndex = Math.floor(Math.random() * quotes.length)
  const chosenQuote = quotes[randomIndex]

  quoteDisplay.innerHTML = `
    <p><strong>Quote:</strong> ${chosenQuote.text}</p>
    <p><strong>Category:</strong> ${chosenQuote.category}</p>
  `
}

// 4. Function to add a new quote dynamically
function addQuote() {
  const text = newQuoteTextInput.value.trim()
  const category = newQuoteCategoryInput.value.trim().toLowerCase()

  if (text === "" || category === "") {
    alert("Please fill out both fields!")
    return
  }

  // Add new quote to array
  quotes.push({ text, category })

  // Clear input fields
  newQuoteTextInput.value = ""
  newQuoteCategoryInput.value = ""

  alert("Quote added successfully!")
}

// 5. Add event listeners
newQuoteBtn.addEventListener("click", showRandomQuote)
addQuoteBtn.addEventListener("click", addQuote)
