///////////////////////////////////////////////////////////////////////
///Descriptions of some functions is above of function declarations///
/////////////////////////////////////////////////////////////////////



//////state////////
const favoritesList = [];
const stateForReplace = {
    indexToRemove: '',
    itemToAdd: '',
    itemToRemove: ''
};
let searchItem = '';
///////////////////

function start() {
    refresh();
}

function home() {
    $('#home').show();
    $('#liveReports').hide();
    $('#about').hide();
}
function liveReports() {
    $('#home').hide();
    $('#liveReports').show();
    $('#about').hide();
}
function about() {
    $('#home').hide();
    $('#liveReports').hide();
    $('#about').show();
}



function refresh() {
    $('#data').empty();
    $.ajax({
        type: 'GET',
        url: 'https://api.coingecko.com/api/v3/coins/list',
        ////display loader until response is ready////////
        beforeSend: function() {
            $('#data').html(loader());
        },
        success: function(response) {
            $('#data').html(createCards(response));
            console.log(response);
        },
        error: function() {
            console.log('error');
        }
    });
}

////animation of loading///////
function loader() {
    return `<div class="d-flex justify-content-center">
    <div class="spinner-border" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>`
}
//////////////////////////////

//////////this func returns big div with all cards///////
function createCards(responseArray) {
    console.log(responseArray);
    let data = $('<div class="d-flex flex-wrap"></div>');
    for(let i = 0; i < 10; i ++) {
        let item = responseArray[i];
        data.append(createSingleCard(item));
    }
    return data;
}

function createSingleCard(obj) {
    console.log(obj);
    let singleCard = $(`<div class="singleCard col-8 col-md-6 col-lg-4 col-xl-3"></div>`);
    singleCard.append(
        `
            <div  id="${obj.id}" class="card">
                <input type="checkbox" id="toggle-button" class="toggle-button" onchange="updateFavorites(event)">
                <div class="card-body">
                    <h5 class="card-title">${obj.symbol}</h5>
                    <p class="card-text">${obj.id}</p>
                    <a href="#" class="btn btn-primary">More info</a>
                </div>
            </div>
        `
    );
    return singleCard;
}

///this func updates an array with favorites items, turns on/off switch button
///and opens a window to choose an item to replace if its already 5 items in a list
function updateFavorites(e) {
    //add to favirites
    if (e.target.checked === true) {
        if (favoritesList.length < 5) {
            favoritesList.push(e.target.parentElement.id);///parent element of a button is a div(card)
            console.log(favoritesList);
        }
        else {
            stateForReplace.itemToAdd = e.target.parentElement.id;
            letUserRemoveItem();//open modal window
        }
    }
    //remove from favorites
    else {
        removeElementFromArray(favoritesList, favoritesList.indexOf(e.target.parentElement.id));
        console.log(favoritesList);
    }
    
}

///open modal window and fill it///
function letUserRemoveItem() {
    createModalList();
    $('#modal').show();
}

///this func marks an item(line throw) by adding a class and saving users choose///
function markItem(e) {
    stateForReplace.indexToRemove = e.target.id;
    stateForReplace.itemToRemove = favoritesList[stateForReplace.indexToRemove];
    createModalList();
    document.getElementById(stateForReplace.indexToRemove).className = 'modal-list-item toRemove';
}

///mapping favorites list///
 function createModalList() {
    $('#modal-list').empty();
    for (let i = 0; i < favoritesList.length; i++) {
                $('#modal-list').append(
                    `<div id="${i}" class="modal-list-item" onclick="markItem(event)">${favoritesList[i]}</div>`
                );
    }
 }

 ///this func gets a pointer on array and index of cell and removes a value with this index from array///  
 function removeElementFromArray(arr, indexToRemove) {
    for (let i = indexToRemove; i < (arr.length - 1); i ++) {
        arr[i] = arr[i + 1];
    }
    arr.pop();
 }

 ///this function add a new item into favorites list instead of selected item by user in the modal///
 function replaceItems() {
    favoritesList[stateForReplace.indexToRemove] = stateForReplace.itemToAdd;
    $('#modal').hide();
    document.getElementById(stateForReplace.itemToAdd).firstElementChild.checked = true;
    document.getElementById(stateForReplace.itemToRemove).firstElementChild.checked = false;
    
 }

 ///hiding a modal if no changes were made(pressed Cancel)
 function hideModal() {
    $('#modal').hide();
    document.getElementById(stateForReplace.itemToAdd).firstElementChild.checked = false;
 }

 function updateSearchItem() {
     searchItem = $('#searchItem').val();
     if (searchItem === '') {///show again all cards after search if input field is empty
        let cards = $('#data').children().children();
        for (item of cards) {
            item.style.display = 'block';
        }
     }
 }

 function search() {
    if (searchItem === '') {
        alert('Enter an id of crypto currency please.');
    }
    else {
        let cards = $('#data').children().children();
        for (let i = 0; i < favoritesList.length; i ++) {
            if (searchItem === favoritesList[i]) {
                for (item of cards) {///hiding all cards
                    item.style.display = 'none';
                    }
                document.getElementById(searchItem).parentElement.style.display = 'block';///showing search result
                return;///stop the func if we found the item
            }
        }
        alert('This Crypto Currenny did not found!\nMaybe it does not exist in your favorits list or id is incorrect.\nTry again please.');
        //getting here if the item was not found
    }
 }