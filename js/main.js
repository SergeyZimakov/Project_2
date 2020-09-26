///////////////////////////////////////////////////////////////////////
///Description of some functions is above of function declarations///
/////////////////////////////////////////////////////////////////////



//////state////////
///-setting global variables takes up place in memory, but allows easy access if needed-///
const firstIndexToCopyToState = 0;
const lastIndexToCopyToState = 50;
const limitOfFavorites = 5;
const timeToRefreshMoreInfo = 120000; // 120000 ms = 2 min
let state = {
    coins: [],
    favoritesList: [],
    indexOfSelectedCoin: ''
}

let cache = {};

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

function cloneItemsFromArrayToState(arr, firstIndex, lastIndex) {
    for (let i = firstIndex; i < lastIndex; i ++) {
        if(arr[i].id === arr[i].symbol) {
            arr[i].symbol += '_';
        }
        else if (arr[i].id === arr[i].name) {
            arr[i].name += '__';
        }
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
            $(`#data`).html(loader());
        },
        success: function(response) {
            state.coins = [...response];
            // cloneItemsFromArrayToState(response, firstIndexToCopyToState, lastIndexToCopyToState);//using for facilitating
            $('#data').html(createCards());
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
                <div class="collapseMoreInfo" id="${coin.id}"></div>
                <button class="btn btn-warning" onclick="collapseMoreInfo(event, ${index})">More info</button>
            </div>
        </div>
    </div>`);
    }


function updateFavoritesList(e, index) {
    const toggleBtn = e.target;
    if (toggleBtn.checked === true) { ///add to Favorites
        state.favoritesList.push({
            coin: state.coins[index].symbol,
            toggleButtonId: toggleBtn.id
        });
    }
    else { ///remove from favorites
        state.favoritesList = state.favoritesList.filter((item, i) => item.coin != state.coins[index].symbol);
    } 
    if (state.favoritesList.length > limitOfFavorites) { ///out of limit
        openModalWindow();
    }
}

///open and fill the modal window///
function openModalWindow() {
    createModalList();
    $('#modal').show();
}

 function createModalList() {
    $('#modal-list').empty();
    let list = '';
    state.favoritesList.forEach(
        function(item, index) {
            if (index < limitOfFavorites) {///last member of array is going to be added(maybe), but still not in list
                list +=  (`<div id="${index}" class="modal-list-item" onclick="selectCoinToReplace(event)">${item.coin}</div>`);
            }
    });
    $('#modal-list').html(list);
 }

 function selectCoinToReplace(e) {
    state.indexOfSelectedCoin = e.target.id;
    createModalList();
    document.getElementById(e.target.id).className = 'modal-list-item toRemove';//add line-throw
} 

///this func runs when user clicks "Save" in modal
 function removeSelectedCoinFromFavorites() {
    if (!state.indexOfSelectedCoin) { //if user did not mark any coin to remove
        alert('Choose coin to replace or press Cancel please.');
    }
    let toggleBtnToSwitchOf = document.getElementById(state.favoritesList[state.indexOfSelectedCoin].toggleButtonId);
    toggleBtnToSwitchOf.checked = false;
    state.favoritesList = state.favoritesList.filter((item, index) => index != state.indexOfSelectedCoin)
    $('#modal').hide();
    state.indexOfSelectedCoin = '';
 }

 ///hiding a modal if no changes were made(Cancel button)
 function abortChangesInFavorites() {
     let toggleBtnToSwitchOf = document.getElementById(state.favoritesList[limitOfFavorites].toggleButtonId);
     toggleBtnToSwitchOf.checked = false;
     state.favoritesList.pop();
     $('#modal').hide();
 }

 function updateSearchItem() {
     if ($('#searchItem').val() === '') {///show again all cards after search if input field is empty
        for (card of $('#data').children()) {
            card.style.display = 'block';
        }
     }
 }

 function search() {
    home();
    let searchItem = $('#searchItem').val();
    searchItem = searchItem.toLowerCase();
    if (searchItem === '') {
        alert('Enter a code of crypto currency please.');
    }
    else {
        for (let i = 0; i < state.coins.length; i ++) {
            if (state.coins[i].symbol === searchItem) {
                for (card of $('#data').children()) {///hiding all cards
                    card.style.display = 'none';
                    }
                document.getElementById(searchItem).style.display = 'block';///show search result
                return;///stop the func if we found the item
            }
        }
        alert('This Crypto Currenny did not found!\nMaybe it does not appear in your favorits list or code is incorrect.\nTry again please.');
        //getting here if the item was not found
    }
 }

///show or hide more information about coin
 function collapseMoreInfo(event, index) {
     let moreInfoDiv = document.getElementById(state.coins[index].id);
     let btn = event.target;
     btn.innerHTML = btn.innerHTML === 'More info' ? 'Hide': 'More info';
     moreInfoDiv.style.display = moreInfoDiv.style.display === 'block' ? 'none' : 'block';
     if (moreInfoDiv.style.display === 'block') {
        createMoreInfoInnerHtml(state.coins[index].id);
    }   
 }

 function createMoreInfoInnerHtml(id) {
     let html = '';
     if (!cache[id] || InfoIsOutOfTime(cache[id])) {//if no info in cache or info is outdated
        $.ajax({
            type: 'GET',
            url: `https://api.coingecko.com/api/v3/coins/${id}`,
            // display loader until response is ready////////
            beforeSend: function() {
                document.getElementById(id).innerHTML = loader();
            },
            success: function(response) {
                cache[id] = {
                    usd: response.market_data.current_price.usd ? `$ ${response.market_data.current_price.usd}` : 'no information',
                    eur: response.market_data.current_price.eur ? `€ ${response.market_data.current_price.eur}` : 'no information', 
                    ils: response.market_data.current_price.ils ? `₪ ${response.market_data.current_price.ils}` : 'no information',
                    lastRequest: new Date,
                    img: response.image.small
                }
                document.getElementById(id).innerHTML = moreInfoToHtml(cache[id]);
            },
            error: function() {
                console.log('error');
            }
        });
        }
        else {
            document.getElementById(id).innerHTML = moreInfoToHtml(cache[id]);
            
     }
 }



 function moreInfoToHtml(obj) {
     return (
        `<img src="${obj.img}">
         <table>
         <tr>
             <td>USD:</td>
             <td>${obj.usd}</td>
         </tr>
         <tr>
             <td>EURO:</td>
             <td>${obj.eur}</td>
         </tr>
         <tr>
             <td>ILS:</td>
             <td>${obj.ils}</td>
         </tr>
     </table>`
     )
 }

 function InfoIsOutOfTime(obj) {
     let newRequest = new Date;
     let passedTime = newRequest - obj.lastRequest;
     return passedTime > timeToRefreshMoreInfo;
 }
