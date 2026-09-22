const defaultBooks = [
  {
    id: 1,
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    category: "Computer Science",
    isbn: "9780262033848",
    issued: false
  },
  {
    id: 2,
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Programming",
    isbn: "9780132350884",
    issued: true
  },
  {
    id: 3,
    title: "The Alchemist",
    author: "Paulo Coelho",
    category: "Fiction",
    isbn: "9780061122415",
    issued: false
  }
];

let books = JSON.parse(localStorage.getItem("libraryBooks")) || defaultBooks;

const bookForm = document.getElementById("bookForm");
const bookTable = document.getElementById("bookTable");
const searchInput = document.getElementById("search");

function saveBooks() {
  localStorage.setItem("libraryBooks", JSON.stringify(books));
}

function updateStats() {
  document.getElementById("totalBooks").textContent = books.length;
  document.getElementById("availableBooks").textContent =
    books.filter(book => !book.issued).length;
  document.getElementById("issuedBooks").textContent =
    books.filter(book => book.issued).length;
}

function displayBooks(searchText = "") {
  bookTable.innerHTML = "";

  const filteredBooks = books.filter(book => {
    const text = (
      book.title + " " +
      book.author + " " +
      book.category + " " +
      book.isbn
    ).toLowerCase();

    return text.includes(searchText.toLowerCase());
  });

  document.getElementById("emptyMessage").style.display =
    filteredBooks.length === 0 ? "block" : "none";

  filteredBooks.forEach(book => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${escapeHTML(book.title)}</td>
      <td>${escapeHTML(book.author)}</td>
      <td>${escapeHTML(book.category)}</td>
      <td>${escapeHTML(book.isbn)}</td>
      <td class="status ${book.issued ? "issued" : "available"}">
        ${book.issued ? "Issued" : "Available"}
      </td>
      <td>
        <button class="action-btn" onclick="toggleBook(${book.id})">
          ${book.issued ? "Return" : "Issue"}
        </button>
        <button class="action-btn delete" onclick="deleteBook(${book.id})">
          Delete
        </button>
      </td>
    `;

    bookTable.appendChild(row);
  });

  updateStats();
}

function escapeHTML(value) {
  return value.replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

bookForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const title = document.getElementById("title").value.trim();
  const author = document.getElementById("author").value.trim();
  const category = document.getElementById("category").value.trim();
  const isbn = document.getElementById("isbn").value.trim();

  const newBook = {
    id: Date.now(),
    title,
    author,
    category,
    isbn,
    issued: false
  };

  books.push(newBook);
  saveBooks();
  displayBooks(searchInput.value);
  bookForm.reset();

  alert("Book added successfully.");
});

function toggleBook(id) {
  const book = books.find(book => book.id === id);

  if (!book) return;

  book.issued = !book.issued;
  saveBooks();
  displayBooks(searchInput.value);
}

function deleteBook(id) {
  const book = books.find(book => book.id === id);

  if (!book) return;

  if (confirm(`Delete "${book.title}"?`)) {
    books = books.filter(book => book.id !== id);
    saveBooks();
    displayBooks(searchInput.value);
  }
}

searchInput.addEventListener("input", function() {
  displayBooks(this.value);
});

displayBooks();
