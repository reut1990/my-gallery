'use strict;'


var gCurrLang = 'en';

var gTrans = {
    title: {
        en: 'Welcome to my shop',
        he: 'ברוכים הבאים לחנות שלי'
    },
    'new-book': {
        en: 'Create New Book',
        he: 'צור ספר חדש',
    },
    'filter-en': {
        en: 'English',
        he: 'אנגלית',
    },
    'filter-he': {
        en: 'Hebrew',
        he: 'עברית'
    },
    'id': {
        en: 'ID',
        he: 'מ.זיהוי',
    },
    'book-name': {
        en: 'Name',
        he: 'שם'
    },
    price: {
        en: 'Price',
        he: 'מחיר',
    },
    actions: {
        en: 'actions',
        he: 'פעולות',
    },
    sure: {
        en: 'Are you sure you want to delet?',
        he: 'אתה בטוח שברצונך למחוק?'
    },
    'new-name': {
        en: 'What is the name of the new book?',
        he: 'מה שמו של הספר החדש?',
    },
    'new-price': {
        en: 'What is the price of the new book?',
        he: 'מה מחירו של הספר החדש?'
    },
    'updat-price': {
        en: 'What is the new price of the book?',
        he: 'מה מחירו המעודכן של הספר?'
    },
    'read': {
        en: 'Read',
        he: 'קרא',
    },
    'update': {
        en: 'Update',
        he: 'עדכן',
    },
    'delete': {
        en: 'Delete',
        he: 'מחק',
    }

}

function doTrans() {
    var els = document.querySelectorAll('[data-trans]');
    for (var i = 0; i < els.length; i++) {
        var el = els[i];
        var transKey = el.getAttribute('data-trans');
        var txt = getTrans(transKey);
        // Translating is actually complex and needs a library
        if (el.nodeName === 'INPUT') {
            el.setAttribute('placeholder', txt);
        } else {
            el.innerText = txt;
        }
    }
    formatPrice();
}

function formatPrice() {
    var elsPrice = document.querySelectorAll('[data-format]');
    for (var i = 0; i < elsPrice.length; i++) {
        var elPrice = elsPrice[i];
        var numPrice = elPrice.getAttribute('data-format');
        // var price = elPrice.innerText;
        var pricePormated = formatNum(numPrice);
        // console.log(pricePormated.slice(4));
        elPrice.innerText = pricePormated;
    }
}

function getTrans(transKey) {
    var keyTrans = gTrans[transKey];
    if (!keyTrans) return 'UNKNOWN';

    var txt = keyTrans[gCurrLang];

    // If not found - use english
    if (!txt) txt = keyTrans['en'];

    return txt;
}


function formatNum(num) {
    console.log(num);
    
    if (gCurrLang === 'he') return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(num);
    else return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'USD' }).format(num);
    // return new Intl.NumberFormat().format(num);
}

function setLang(lang) {
    gCurrLang = lang;
    if (gCurrLang === 'he') {
        document.body.classList.add('rtl')
    } else {
        document.body.classList.remove('rtl')
    }
    doTrans();
}