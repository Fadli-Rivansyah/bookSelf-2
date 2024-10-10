const title = document.querySelector("#bookFormTitle");
const author = document.querySelector("#bookFormAuthor");
const year = document.querySelector("#bookFormYear");
const check = document.querySelector("#bookFormIsComplete");
const searchInput = document.querySelector("#searchBookTitle");
let books = JSON.parse(localStorage.getItem("books")) || [];
let isEditing = false;
let currentEditBookId = null;
const RENDER_EVENT = "render_book";

document.addEventListener("DOMContentLoaded", () => {
    const searchBook = document.querySelector("#searchBook");
    const submitForm = document.querySelector("#bookForm");
    submitForm.addEventListener("submit" , (event) => {
        event.preventDefault();
        const newBookData = {
            id: new Date().getTime(), 
            title: title.value,
            author: author.value,
            year: parseInt(year.value),
            isComplete: check.checked,
        };
        if(check.checked == true){
            newBookData.isComplete = true;
        }
        addBook(newBookData);
        displayResult();  
        title.value ="";
        author.value ="";
        year.value ="";
    });
    searchBook.addEventListener("submit", (event) => {
        event.preventDefault();
        console.log(searchResult());
        displayResult();
    });
});

function addBook(book){
    if(isEditing){
        const editBook = books.findIndex(element => element.id === currentEditBookId);
        if(editBook !== -1){
            books[editBook].id = book.id,
            books[editBook].title = book.title,
            books[editBook].author = book.author,
            books[editBook].year = book.year,
            books[editBook].isComplete = book.isComplete;
        }
        isEditing = false;
        currentEditBookId = null;
    } else {
        let book = {
            id: new Date().getTime(),
            title: title.value,
            author: author.value,
            year: parseInt(year.value),
            isComplete: false
        }

        if(check.checked == true){
            book.isComplete = true;
        }
        books.push(book);
    }
    localStorage.setItem("books", JSON.stringify(books));
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function searchResult(){
    const search = searchInput.value.toLowerCase();
    const result = books.filter(book => book.title.toLowerCase().includes(search));
    return result;
}

function displayResult(){
    const listBookComplete = document.querySelector("#completeBookList");
    listBookComplete.innerHTML="";

    const listBookIncomplete = document.querySelector("#incompleteBookList");
    listBookIncomplete.innerHTML="";

    const data = searchResult()
    data.forEach(book => {
        const listElement = listBook(book);
        if (!book.isComplete) {
            listBookIncomplete.append(listElement);
        }else{
            listBookComplete.append(listElement);
        }
    });
}

function listBook(book){
    const textTitle = document.createElement("h3");
    textTitle.innerText = book.title;
    textTitle.setAttribute("data-testid","bookItemTitle");

    const textAuthor = document.createElement("p");
    textAuthor.innerText = "Penulis: " + book.author;
    textAuthor.setAttribute("data-testid","bookItemAuthor");

    const textYear = document.createElement("p");
    textYear.innerText = "Tahun: " + book.year;
    textYear.setAttribute("data-testid","bookItemYear");

    const btn_action = document.createElement("div");
    btn_action.classList.add("action");
    const btnComplete = document.createElement("button");
    btnComplete.setAttribute("data-testid","bookItemIsCompleteButton")
    btnComplete.innerText = book.isComplete ? "Belum Selesai Dibaca" : "Selesai Dibaca";

    const btnDelete = document.createElement("button");
    btnDelete.setAttribute("data-testid","bookItemDeleteButton")
    btnDelete.innerHTML ="Hapus Buku";

    const btnEdit = document.createElement("button");
    btnEdit.setAttribute("data-testid","bookItemEditButton")
    btnEdit.innerHTML ="Edit Buku";

    btn_action.append(btnComplete,btnDelete,btnEdit);

    const container = document.createElement('div');
    container.setAttribute('data-bookid', book.id);
    container.setAttribute('data-testid', "bookItem");

    container.append(textTitle,textAuthor,textYear,btn_action);

    if(btnComplete.textContent === "Selesai Dibaca"){
        btnComplete.addEventListener('click', () => {
            addIncomplete(book.id);
        });
    } else if (btnComplete.textContent === "Belum Selesai Dibaca"){
        btnComplete.addEventListener('click', () => {
            addReadComplete(book.id);
        });
    }

    btnDelete.addEventListener("click", () => {
        removeBook(book.id);
    });

    btnEdit.addEventListener("click", (e) => {
        editBook(book);
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    return container;
}

function addReadComplete(idBook){
    const targetBook = books.find(book => book.id === idBook) || null;
    targetBook.isComplete = false;
    localStorage.setItem("books", JSON.stringify(books));
    displayResult();
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function addIncomplete(idBook){
    const targetBook = books.find(book => book.id === idBook) || null;
    targetBook.isComplete = true;
    localStorage.setItem("books", JSON.stringify(books));
    displayResult();
    document.dispatchEvent(new Event(RENDER_EVENT));
}


function removeBook(id){
    books.splice(books.findIndex(book => book.id === id), 1)
    document.dispatchEvent(new Event(RENDER_EVENT));
    displayResult();
    localStorage.setItem("books", JSON.stringify(books));
}

function editBook(book){
    title.value = book.title;
    author.value = book.author;
    year.value = book.year;
    check.value = book.isComplete;

    isEditing = true;
    currentEditBookId = book.id;
}

displayResult();    
