const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const MOVED_EVENT = "moved-book";
const DELETED_EVENT = "deleted-book";
const STORAGE_KEY = "BOOKSHELF_APPS";
const books = [];

const isStorageExist = () => {
  if (typeof Storage === undefined) {
    alert("Your browser does not support web storage!");
    return false;
  }
  return true;
};

document.addEventListener(RENDER_EVENT, () => {
  const unfinishedBook = document.getElementById("belumDibaca");
  unfinishedBook.innerHTML = "";

  const finishedBook = document.getElementById("sudahDibaca");
  finishedBook.innerHTML = "";

  let hasUnfinishedBook = false;
  let hasFinishedBook = false;

  for (const bookItem of books) {
    const bookElement = makeBookElement(bookItem);
    if (!bookItem.isComplete) {
      unfinishedBook.append(bookElement);
      hasUnfinishedBook = true;
    } else {
      finishedBook.append(bookElement);
      hasFinishedBook = true;
    }
  }

  if (!hasUnfinishedBook) {
    const emptyMessage = document.createElement("p");
    emptyMessage.innerText = "You still do not have a reading list.";
    unfinishedBook.append(emptyMessage);
  }

  if (!hasFinishedBook) {
    const emptyMessage = document.createElement("p");
    emptyMessage.innerText = "You have not finished reading that book.";
    finishedBook.append(emptyMessage);
  }
});

document.addEventListener(SAVED_EVENT, () => {
  const elementCustomAlert = document.createElement("div");
  elementCustomAlert.classList.add("alert");
  elementCustomAlert.innerText = "Saved Successfully!";

  document.body.insertBefore(elementCustomAlert, document.body.children[0]);
  setTimeout(() => {
    elementCustomAlert.remove();
  }, 2000);
});

document.addEventListener(MOVED_EVENT, () => {
  const elementCustomAlert = document.createElement("div");
  elementCustomAlert.classList.add("alert");
  elementCustomAlert.innerText = "Successfully Moved!";

  document.body.insertBefore(elementCustomAlert, document.body.children[0]);
  setTimeout(() => {
    elementCustomAlert.remove();
  }, 2000);
});

document.addEventListener(DELETED_EVENT, () => {
  const elementCustomAlert = document.createElement("div");
  elementCustomAlert.classList.add("alert");
  elementCustomAlert.innerText = "Deleted Successfully!";

  document.body.insertBefore(elementCustomAlert, document.body.children[0]);
  setTimeout(() => {
    elementCustomAlert.remove();
  }, 2000);
});

const loadDataFromStorage = () => {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if (data !== null) {
    for (const item of data) {
      books.push(item);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
};

const saveData = () => {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
};

const moveData = () => {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(MOVED_EVENT));
  }
};

const deleteData = () => {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(DELETED_EVENT));
  }
};

const addBook = () => {
  const bookTitle = document.getElementById("judul").value.trim();
  const bookAuthor = document.getElementById("penulis").value.trim();
  const bookYear = document.getElementById("tahun").value.trim();
  const bookPublisher = document.getElementById("penerbit").value.trim();
  const bookHasFinished = document.getElementById("isRead").checked;
  
  // Validasi input
  if (bookTitle === "" || bookAuthor === "" || bookYear === "" || bookPublisher === "") {
    alert("All fields are required!");
    return;
  }

  books.push({
    id: +new Date(),
    title: bookTitle,
    author: bookAuthor,
    year: Number(bookYear),
    publisher: bookPublisher, // Menambahkan publisher
    isComplete: bookHasFinished,
  });

  document.getElementById("judul").value = "";
  document.getElementById("penulis").value = "";
  document.getElementById("tahun").value = "";
  document.getElementById("penerbit").value = ""; // Menambahkan reset input publisher
  document.getElementById("isRead").checked = false;

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const makeBookElement = (bookObject) => {
  const elementBookTitle = document.createElement("p");
  elementBookTitle.classList.add("item-title");
  elementBookTitle.innerHTML = `${bookObject.title} <span>(${bookObject.year})</span>`;

  const elementBookAuthor = document.createElement("p");
  elementBookAuthor.classList.add("item-writer");
  elementBookAuthor.innerText = bookObject.author;

  const elementBookPublisher = document.createElement("p");
  elementBookPublisher.classList.add("item-publisher");
  elementBookPublisher.innerText = bookObject.publisher; // Menambahkan elemen penerbit

  const descContainer = document.createElement("div");
  descContainer.classList.add("item-desc");
  descContainer.append(elementBookTitle, elementBookAuthor, elementBookPublisher);

  const actionContainer = document.createElement("div");
  actionContainer.classList.add("item-action");

  const container = document.createElement("div");
  container.classList.add("item");
  container.append(descContainer);
  container.setAttribute("id", `book-${bookObject.id}`);

  if (bookObject.isComplete) {
    const returnBtn = document.createElement("button");
    returnBtn.classList.add("return-btn");
    returnBtn.innerHTML = `<i class='bx bx-x'></i>`;

    returnBtn.addEventListener("click", () => {
      returnBookFromFinished(bookObject.id);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = `<i class='bx bx-trash'></i>`;

    deleteBtn.addEventListener("click", () => {
      deleteBook(bookObject.id);
    });

    actionContainer.append(returnBtn, deleteBtn);
    container.append(actionContainer);
  } else {
    const finishBtn = document.createElement("button");
    finishBtn.classList.add("complete-btn");
    finishBtn.innerHTML = `<i class='bx bx-check'></i>`;

    finishBtn.addEventListener("click", () => {
      addBookToFinished(bookObject.id);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = `<i class='bx bx-trash'></i>`;

    deleteBtn.addEventListener("click", () => {
      deleteBook(bookObject.id);
    });

    actionContainer.append(finishBtn, deleteBtn);
    container.append(actionContainer);
  }

  return container;
};

const addBookToFinished = (bookId) => {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  moveData();
};

const returnBookFromFinished = (bookId) => {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  moveData();
};

const deleteBook = (bookId) => {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  deleteData();
};

const findBook = (bookId) => {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }

  return null;
};

const findBookIndex = (bookId) => {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
};

document.addEventListener("DOMContentLoaded", () => {
  if (isStorageExist()) {
    loadDataFromStorage();
  }

  const simpanForm = document.getElementById("formDataBuku");
  simpanForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addBook();
  });

  const searchForm = document.getElementById("formSearch");
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    searchBook();
  });

  const resetBtn = document.querySelector(".reset-btn");
  resetBtn.addEventListener("click", () => {
    document.getElementById("pencarian").value = "";
    searchBook();
  });
});

const searchBook = () => {
  const searchInput = document.getElementById("pencarian").value.toLowerCase();
  const bookItems = document.getElementsByClassName("item");
  const searchResults = document.getElementById("searchResults");

  searchResults.innerHTML = ""; // Clear previous results

  for (let i = 0; i < bookItems.length; i++) {
    const itemTitle = bookItems[i].querySelector(".item-title");
    if (itemTitle.textContent.toLowerCase().includes(searchInput)) {
      searchResults.appendChild(bookItems[i].cloneNode(true));
    }
  }
};
