'use strict';

var gQuestsTree;
var gCurrQuest;
var gPrevQuest = null;
var gLastRes = null;

$(document).ready(init);

function init() {
    // gQuestsTree = createQuest('Male?','Super Hero?','Animal?' );
    gQuestsTree = createQuest('Male?');
    gQuestsTree.yes = createQuest('Shlomi');
    gQuestsTree.no = createQuest('Rita');
    // saveToStorage('questionsTree', gQuestsTree);
    $('.new-game').hide();
    // console.log(getFromStorage('questionsTree'));
    // addQuestions();
    // gCurrQuest = gQuestsTree;
}

// function addQuestions() {
//     gQuestsTree.yes = createQuest('SUPER HERO?');
//     gQuestsTree.no = createQuest('Animal?');
//     var questionToyes = gQuestsTree.yes;
//     questionToyes.yes = createQuest('flash');
//     questionToyes.no = createQuest('dad');
//     var qeustionToNo = gQuestsTree.no;
//     qeustionToNo.yes = createQuest('cat');
//     qeustionToNo.no = createQuest('dog');
// }

function startGuessing() {
    //hide the gameStart section
    $('.gameStart').hide();

    //show the gameQuest section
    $('.gameQuest').show();
    if (getFromStorage('questionsTree')) gCurrQuest = getFromStorage('questionsTree');
    else gCurrQuest = gQuestsTree;
    renderQuest();

}

function renderQuest() {
    //select the <h2> inside gameQuest and update its text by the currQuest text
    $('.gameQuest h2').html(gCurrQuest.txt);
}

function userResponse(res) {
    // If this node has no children
    if (isChildless(gCurrQuest)) {
        if (res === 'yes') {
            $('.gameStart').hide();
            $('.gameQuest').hide();
            $('.new-game').show();

            // TODO: improve UX
        } else {
            alert('I dont know...teach me!')
            //hide and show gameNewQuest section
            $('.gameQuest').hide();
            $('.gameNewQuest').show();

        }
    } else {
        //update the prev, curr and res global vars
        gPrevQuest = gCurrQuest;
        gCurrQuest = gCurrQuest[res];
        gLastRes = res;
        renderQuest();
    }
}

function addGuess() {
    //  create 2 new Quests based on the inputs' values
    //  connect the 2 Quests to the quetsions tree
    var newYesGuess = $('#newGuess').val();
    var newQuest = $('#newQuest').val();
    var newNo = gCurrQuest.txt;
    gCurrQuest= createQuest(newQuest);
    console.log('gCurrQuest', gCurrQuest, 'gPrevQuest', gPrevQuest)
    gCurrQuest.yes = createQuest(newYesGuess);
    gCurrQuest.no = createQuest(newNo);

    gPrevQuest.no=gCurrQuest;
    saveToStorage('questionsTree',gPrevQuest);///....
    var newT=getFromStorage('questionsTree');
    console.log(newT);
    // console.log(getFromStorage('questionsTree'));
    restartGame();
}

function createQuest(txt) {
    return {
        txt: txt,
        yes: null,
        no: null
    }
}

function restartGame() {
    $('.gameNewQuest').hide();
    $('.gameStart').show();
    $('.new-game').hide();
    gCurrQuest = getFromStorage('questionsTree');
    gPrevQuest = null;
    gLastRes = null;
}

function isChildless(node) {
    return (node.yes === null && node.no === null)
}

function getFromStorage(key) {
    var val = localStorage.getItem(key);
    return JSON.parse(val)
}

function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
}