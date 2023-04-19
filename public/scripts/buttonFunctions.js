totalItems = 1

function add() {
    totalItems += 1
    var new_input = "<input type='text' class='form-control' placeholder='2 eggs' id='user-input-" + totalItems + "' aria-label='default input example'>";
    
    $('#items').append(new_input);
}

function remove() {
    if (totalItems > 1) {
        $('#user-input-' + totalItems).remove();

        totalItems -= 1
    }
}