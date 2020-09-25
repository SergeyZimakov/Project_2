///////////////////////////////////////////////////////////////////////
///Descriptions of some functions is above of function declarations///
/////////////////////////////////////////////////////////////////////



//////state////////
const itemsToCopyToState = 20;
let state = {
    coins: [],
    favoritesList: [],
    forReplace: {
        indexToReplace: '',
        coinToAdd: '',
        coinToRemove: ''
    }
}

function start() {
    requestForCoins();
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

function cloneItemsFromArrayToState(arr, numberOfItems) {
    for (let i = 0; i < numberOfItems; i ++) {
        state.coins[i] = arr[i];
    }
}


function requestForCoins() {
    $('#data').empty();
    $.ajax({
        type: 'GET',
        url: 'https://api.coingecko.com/api/v3/coins/list',
        ////display loader until response is ready////////
        beforeSend: function() {
            $('#data').html(loader());
        },
        success: function(response) {
            // state.coins = [...response];
            cloneItemsFromArrayToState(response, itemsToCopyToState);
            $('#data').html(createCards());
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

function createCards() {
    console.log(state.coins);
    $('#data').empty();
    let innerHtml = '';
    state.coins.forEach((coin, index) => innerHtml += createSingleCard(coin, index));
    return innerHtml;
}

function createSingleCard(coin, index) {
    return (
    `<div id="${coin.symbol}" class="singleCard col-8 col-md-6 col-lg-4 col-xl-3">
        <div class="card">
            <input type="checkbox" id="toggle-button${index}" class="toggle-button" onclick="updateFavoritesList(event, ${index})">
            <div class="card-body">
                <h5 class="card-title">${coin.symbol}</h5>
                <p class="card-text">${coin.id}</p>
                <div class="collapseMoreInfo" id="collapseMoreInfo">
                    Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
                </div>
                <button class="btn btn-primary" onclick="collapseMoreInfo(${index})">More info</button>
            </div>
        </div>
    </div>`);
    }


function updateFavoritesList(e, index) {
    const toggleBtn = e.target;
    if (toggleBtn.checked === true) { ///add to Favorites
        if (state.favoritesList.length < 5) {
            state.favoritesList.push(state.coins[index].name);
        }
        else {
            console.log('openModal');
            state.forReplace.coinToAdd = state.coins[index].name;
            openModalWindow();


        }
    }
    else { ///remove from favorites
        state.favoritesList = state.favoritesList.filter((item, i) => i != index);
        console.log(state.favoritesList);
    }
}

///open modal window and fill it///
function openModalWindow() {
    createModalList();
    $('#modal').show();
}

function selectCoinToReplace(e) {
    state.forReplace.coinToRemove = e.target.id;
    createModalList();
    document.getElementById(state.forReplace.coinToRemove).className = 'modal-list-item toRemove';
}

 function createModalList() {
    $('#modal-list').empty();
    let list = '';
    state.favoritesList.forEach((item) => list +=  (`<div id="${item}" class="modal-list-item" onclick="selectCoinToReplace(event)">${item}</div>`))
    $('#modal-list').html(list);
 }

 

 function replaceCoinsInFavorites() {
    let indexToRemove = state.favoritesList.indexOf(state.forReplace.coinToRemove);
    state.favoritesList[indexToRemove] = state.forReplace.coinToAdd;
    $('#modal').hide();
    // document.getElementById(stateForReplace.itemToAdd).firstElementChild.checked = true;
    // document.getElementById(stateForReplace.itemToRemove).firstElementChild.checked = false;
    
 }

 ///hiding a modal if no changes were made(pressed Cancel)
 function hideModal() {
    $('#modal').hide();
    document.getElementById(stateForReplace.itemToAdd).firstElementChild.checked = false;
 }

 function updateSearchItem() {
     let searchItem = $('#searchItem').val();
     if (searchItem === '') {///show again all cards after search if input field is empty
        let cards = $('#data').children().children();
        for (item of cards) {
            item.style.display = 'block';
        }
     }
 }

 function search() {
    home();
    let searchItem = $('#searchItem').val();
    if (searchItem === '') {
        alert('Enter a code of crypto currency please.');
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
        alert('This Crypto Currenny did not found!\nMaybe it does not exist in your favorits list or code is incorrect.\nTry again please.');
        //getting here if the item was not found
    }
 }


 function collapseMoreInfo(event) {
     let btn = $(event.target);
     btn.prev().toggle();
     
     
 }

 