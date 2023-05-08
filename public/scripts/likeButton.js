
$(".like-button").on('click', function() {

    let id = $(this).data('item')
    let url = baseUrl;

    fetch(url + '/add-like', {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ "id": id })
    }).then(
        function (res) {
            console.log('likeButton fetch', res)
            return res.json()
        }
    ).then(
        function (data) {
            console.log("Success!", data.fromServer)
            $(`.num-likes-${id}`).text(data.fromServer)
        }
    )
})
