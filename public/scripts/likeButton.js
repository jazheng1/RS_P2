let numLikes = document.getElementById("num-likes")
// prevent default behavior (the loading of a new page)
console.log('here')

$("#like-form").submit(async (e) => {
    e.preventDefault();
    let parent = document.getElementById("like-form")
    console.log(document.getElementById("like-item").value)
    let name = parent.firstElementChild.value
    console.log("name:", name)
    let url = baseUrl;

    if(name === undefined || name == "" || name === null) {
        console.log("NAME IS EMPTY")
    } else {
        console.log('INHERE')
        fetch(url + '/add-like', {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "name": name })
        }).then(
            function (res) {
                console.log('likeButton fetch', res)
                return res.json()
            }
        ).then(
            function (data) {
                console.log("Success!", data.fromServer)
    
                numLikes.innerHTML = data.fromServer
                
            }
        )
    }
})
