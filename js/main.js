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
        console.log(createSingleCard(item));
    }
    return data;
}

function createSingleCard(obj) {
    console.log(obj);
    let singleCard = $('<div class="singleCard col-8 col-md-6 col-lg-4 col-xl-3"></div>');
    singleCard.append(
        `
            <div class="card">
                <div class="custom-control custom-switch">
                    <input type="checkbox" class="custom-control-input" id="customSwitch1">
                    <label class="custom-control-label" for="customSwitch1"></label>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${obj.symbol}</h5>
                    <p class="card-text">${obj.id}</p>
                    <a href="#" class="btn btn-primary">Go somewhere</a>
                </div>
            </div>
        `
    );
    return singleCard;
}