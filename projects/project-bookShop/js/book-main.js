'use strict';

var gCurrBook; //ok to put here global?- do without it call func in the relevent places that get element by id.
function init() {
    createBooks();
    renderBooks();
}

function renderBooks() {
    var books = getBooks();
    console.log(books);
    var str = '<div class=" table table-responsive"> <table class="table table-striped"border="1"><tbody><th  class="id" data-trans="id">ID</th><th data-trans="book-name">Name</th><th data-trans="price">Price</th><th data-trans="actions">Actions</th>';
    var strHTML = books.map(function (book) {
        // $( "#tooltip-pic" ).tooltip({ content: "<img src='/img/${book.imgUrl}'/>" });
        return `<tr>
                    <td class="id">${book.id}</td>
                    <td class="tooltip-pic"> ${book.name}</td>
                    <td data-format="${book.price}">${book.price}</td>
                    <td>
                    <div id="actions">
                    <button class="btn-warning" id="read" data-toggle="modal" data-target="#exampleModalCenter" onclick="updateModal('${book.id}')" data-trans="read">Read</button>
                    <button class="btn-info" id="update" onclick="readAndUpdateBook('${book.id}')" data-trans="update">Update</button>
                    <button class="btn-danger" id="delete" onclick="onDeleteBook('${book.id}',event)" data-trans="delete">Delete</button>
                    </div>
                    </td>
                </tr>`
    })
    str += strHTML.join('') + '</tbody></table></div>';
    document.querySelector('.books-container').innerHTML = str;
    $('.tooltip-pic').each(function (i) {
        $(this).tooltip({ title: `<img class="tooltip-pic-img" src='../img/${books[i].imgUrl}'/>`, html: true })
        // $(this).tooltip({ content: `<img class="tooltip-pic-img" src='/img/${books[i].imgUrl}'/>`})
    })
    formatPrice();
}

// $('#tooltip-pic').tooltip({
//     animated: 'fade',
//     placement: 'bottom',
//     html: true
// });

function onSetLang(lang) {
    setLang(lang);
    // render();
}

function onDeleteBook(bookId, ev) {
    console.log(bookId, ev);
    // Stop the propegation of the click event so the LI onclick will not trigger
    ev.stopPropagation();
    var confirmDelete = confirm(getTrans('sure'));
    if (confirmDelete) {
        deleteBook(bookId);
        renderBooks();
    } else {
        return;
    }
}

function readAndAddNewBook() {
    var name = prompt(getTrans('new-name'));
    var price = +prompt(getTrans('new-price'));
    console.log(price, name);
    if (name === null || name === '' || price === 0) return; // NEED TO MAKE SURE ITS A NUM
    var newBook = createBook(name, price);
    addBook(newBook);
    renderBooks();
    doTrans();
}

function readAndUpdateBook(bookId) {
    var price = prompt(getTrans('updat-price'));
    updateBook(bookId, price);
    renderBooks();

}



function updateModal(bookId) {
    gCurrBook = getBookById(bookId);// seem like not needed but this var help in  few functions
    document.querySelector('.modal-title').innerText = gCurrBook.name;
    document.querySelector('.summery').innerText = gCurrBook.summery;
    document.querySelector('.img').innerHTML = `<img src="/img/${gCurrBook.imgUrl}" alt="Dont have picture yet">`;
    $('#curr-rate').text('Rate:' + getFromStorage(gCurrBook.name));
}

function decreaseRate() {
    if (gCurrBook.rate === 0) return;
    gCurrBook.rate = gCurrBook.rate - 1;
    saveToStorage(gCurrBook.name, gCurrBook.rate);
    updateModal(gCurrBook.id);
}
function increaseRate() {
    if (gCurrBook.rate === 10) return;
    gCurrBook.rate = gCurrBook.rate + 1;
    saveToStorage(gCurrBook.name, gCurrBook.rate);
    updateModal(gCurrBook.id);
}



// function onNextPage() {
//     goNextPage()
//     renderCars();
// }
