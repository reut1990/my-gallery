'use strict';


// CRUDL - Create, Read, Update, Delete, List
const PAGE_SIZE = 5;
var gBooks;
var gCurrPageNo = 0;

function createBooks() {
    
    gBooks = [
        createBook('Harry Potter', 50, 'cat.jpg'),
        createBook('kuki', 40, 'cat2.jpg'),
        createBook('muki', 40, 'cat3.jpg'),
        createBook('susuki', 26, 'cat4.jpg'),
        createBook('birds', 30, 'cat5.jpg')
    ]
}


function createBook(name, price, img) {
    
    return {
        id: makeId(),
        name: name,
        price: price,
        imgUrl: img,
        summery:'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Praesentium ipsum quasi autem, debitis quia temporibus labore aliquid ab odio ratione!',
        rate:0
    }
}


function getBooks() {//-represent in pages
    // var fromBookIdx = gCurrPageNo * PAGE_SIZE;
    // return gBooks.slice(fromCarIdx, fromCarIdx + PAGE_SIZE);
    return gBooks;
}

function getBookById(bookId) {
    return gBooks.find(function (book) {
        return book.id === bookId;
    })
}

function deleteBook(bookId) {
    var bookIdx = gBooks.findIndex(function (book) {
        return book.id === bookId;
    })
    gBooks.splice(bookIdx, 1)

}

function addBook(book) {
    gBooks.push(book);
}

function updateBook(bookId, bookPrice) {
    var bookIdx = gBooks.findIndex(function (book) {
        return book.id === bookId;
    })
    gBooks[bookIdx].price = bookPrice;
}







function goNextPage() {
    gCurrPageNo++;
}




