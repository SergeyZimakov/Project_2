
const favoritesList = [];
const stateForReplace = {
    indexToRemove: '',
    itemToAdd: ''
};

function start() {
    refresh();
}



function refresh() {
    $('#data').empty();
    $.ajax({
        type: 'GET',
        url: 'https://api.coingecko.com/api/v3/coins/list',
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

function loader() {
    return `<div class="d-flex justify-content-center">
    <div class="spinner-border" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>`
}

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

function updateFavorites(e) {
    //add to favirites
    if (e.target.checked === true) {
        if (favoritesList.length < 5) {
            favoritesList.push(e.target.parentElement.id);
            console.log(favoritesList);
        }
        else {
            stateForReplace.itemToAdd = e.target.parentElement.id;
            letUserRemoveItem();
        }
    }
    //remove from favorites
    else {
        removeElementFromArray(favoritesList, favoritesList.indexOf(e.target.parentElement.id));
        console.log(favoritesList);
    }
    
}

function letUserRemoveItem() {
    createModalList();
    $('#modal').show();
}

function markItem(e) {
    stateForReplace.indexToRemove = e.target.id;
    createModalList();
    document.getElementById(stateForReplace.indexToRemove).className = 'modal-list-item toRemove';
}


 function createModalList() {
    $('#modal-list').empty();
    for (let i = 0; i < favoritesList.length; i++) {
                $('#modal-list').append(
                    `<div id="${i}" class="modal-list-item" onclick="markItem(event)">${favoritesList[i]}</div>`
                );
    }
 }

 function removeElementFromArray(arr, indexToRemove) {
    for (let i = indexToRemove; i < (arr.length - 1); i ++) {
        arr[i] = arr[i + 1];
    }
    arr.pop();
 }

 function replaceItems() {
    favoritesList[stateForReplace.indexToRemove] = stateForReplace.itemToAdd;
    $('#modal').hide();
    document.getElementById(stateForReplace.itemToAdd).firstElementChild.checked = true;
    document.getElementById(stateForReplace.itemToRemove).firstElementChild.checked = false;
    
 }