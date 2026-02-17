const STORAGE_KEY = "jw-library-books";

const modal = document.querySelector(".modal");
const openModalBtn = document.getElementById("add-book");
const closeModalBtn = document.querySelector(".close");
const bookForm = document.getElementById("book-form");
const libraryContainer = document.getElementById("library");

let myLibrary = loadLibrary();

if (myLibrary.length === 0) {
  myLibrary = seedBooks();
  saveLibrary();
}

renderLibrary();

openModalBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

bookForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = document.getElementById("title").value.trim();
  const author = document.getElementById("author").value.trim();
  const pages = Number(document.getElementById("pages").value);
  const read = document.getElementById("read").checked;

  if (!title || !author || !Number.isFinite(pages) || pages <= 0) {
    return;
  }

  addBookToLibrary(new Book(title, author, pages, read));
  bookForm.reset();
  closeModal();
});

function openModal() {
  modal.style.display = "flex";
}

function closeModal() {
  modal.style.display = "none";
}

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.id = crypto.randomUUID();
}

function addBookToLibrary(book) {
  myLibrary.push(book);
  saveLibrary();
  renderLibrary();
}

function removeBook(id) {
  myLibrary = myLibrary.filter((book) => book.id !== id);
  saveLibrary();
  renderLibrary();
}

function toggleRead(id) {
  const selectedBook = myLibrary.find((book) => book.id === id);
  if (!selectedBook) return;

  selectedBook.read = !selectedBook.read;
  saveLibrary();
  renderLibrary();
}

function renderLibrary() {
  libraryContainer.innerHTML = "";

  if (myLibrary.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = "No books yet. Click + to add your first book.";
    libraryContainer.appendChild(emptyState);
    return;
  }

  myLibrary.forEach((book) => {
    const card = document.createElement("article");
    card.className = "book";

    card.appendChild(makeBookField("Title", book.title));
    card.appendChild(makeBookField("Author", book.author));
    card.appendChild(makeBookField("Pages", String(book.pages)));
    card.appendChild(makeBookField("Read", book.read ? "Yes" : "No"));

    const actions = document.createElement("div");
    actions.className = "book-actions";

    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = "toggle-read-btn";
    toggleBtn.textContent = book.read ? "Mark Unread" : "Mark Read";
    toggleBtn.addEventListener("click", () => toggleRead(book.id));

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "remove-book-btn";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => removeBook(book.id));

    actions.appendChild(toggleBtn);
    actions.appendChild(removeBtn);
    card.appendChild(actions);

    libraryContainer.appendChild(card);
  });
}

function makeBookField(label, value) {
  const wrapper = document.createElement("div");

  const heading = document.createElement("h4");
  heading.textContent = label.toUpperCase();

  const detail = document.createElement("span");
  detail.textContent = value;

  wrapper.appendChild(heading);
  wrapper.appendChild(detail);
  return wrapper;
}

function saveLibrary() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(myLibrary));
}

function loadLibrary() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function seedBooks() {
  return [
    new Book("The Hobbit", "J.R.R. Tolkien", 310, true),
    new Book("Atomic Habits", "James Clear", 320, false),
  ];
}
