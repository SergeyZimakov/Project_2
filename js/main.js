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
    let row = $('<div class="row"></div>');
    for(let i = 0; i < 10; i ++) {
        let item = responseArray[i];
        row.append(createSingleCard(item));
        console.log(createSingleCard(item));
    }
    return row;
}

function createSingleCard(obj) {
    console.log(obj);
    let card = $('<div></div>');
    card.append(
        `<div class="col-6">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${obj.symbol}</h5>
                    <p class="card-text">${obj.id}</p>
                    <a href="#" class="btn btn-primary">Go somewhere</a>
                </div>
            </div>
        </div>`
    );
    return card;
}