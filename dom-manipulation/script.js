// 1) Data structure: an array of quote objects
const quotes = [
{ text: "The only limit to our realization of tomorrow is our doubts of today.", category: "inspiration" },
{ text: "Simplicity is the soul of efficiency.", category: "productivity" },
{ text: "Code is like humor. When you have to explain it, it’s bad.", category: "coding" },
{ text: "Small steps every day.", category: "productivity" },
{ text: "You miss 100% of the shots you don’t take.", category: "inspiration" }
]


// 2) DOM references
const categorySelect = document.getElementById('categorySelect')
const newQuoteBtn = document.getElementById('newQuote')
const quoteTextEl = document.getElementById('quoteText')
const quoteCategoryEl = document.getElementById('quoteCategory')
const formContainer = document.getElementById('formContainer')


// Utility: Return unique categories from the quotes array
function getUniqueCategories() {
const set = new Set(quotes.map(q => q.category.toLowerCase()))
return Array.from(set)
}


// Render the category dropdown options dynamically
function renderCategoryOptions() {
const cats = getUniqueCategories()
// add an option for "all"
categorySelect.innerHTML = ''
const allOpt = document.createElement('option')
allOpt.value = 'all'
allOpt.textContent = 'All'
categorySelect.appendChild(allOpt)


cats.forEach(cat => {
const opt = document.createElement('option')
opt.value = cat
opt.textContent = cat[0].toUpperCase() + cat.slice(1)
categorySelect.appendChild(opt)
})
}
// showRandomQuote: display a random quote, optionally filtered by category
function createAddQuoteForm() {
// clear existing container
formContainer.innerHTML = ''


const wrapper = document.createElement('div')
wrapper.className = 'add-form'


const inputText = document.createElement('input')
inputText.id = 'newQuoteText'
inputText.type = 'text'
inputText.placeholder = 'Enter a new quote'


const inputCat = document.createElement('input')
inputCat.id = 'newQuoteCategory'
inputCat.type = 'text'
inputCat.placeholder = 'Enter quote category'


const addBtn = document.createElement('button')
addBtn.type = 'button'
addBtn.textContent = 'Add Quote'


// When clicked, run addQuote
addBtn.addEventListener('click', function () {
addQuote(inputText.value.trim(), inputCat.value.trim())
inputText.value = ''
inputCat.value = ''
})


wrapper.appendChild(inputText)
wrapper.appendChild(inputCat)
wrapper.appendChild(addBtn)
formContainer.appendChild(wrapper)
}


// addQuote: validate and add a new quote to the array, update UI
function addQuote(text, category) {
if (!text) return alert('Please enter a quote text')
if (!category) category = 'uncategorized'


// push to data
quotes.push({ text, category })


// update category list and optionally show the new quote immediately
renderCategoryOptions()


// Select the category that was just added (normalized)
categorySelect.value = category.toLowerCase()
showRandomQuote()
}


// Setup: wire events and render initial UI
function init() {
renderCategoryOptions()
newQuoteBtn.addEventListener('click', showRandomQuote)
createAddQuoteForm()
}


init()