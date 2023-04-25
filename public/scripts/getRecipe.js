// let baseUrl = window.location.href;

// get fridgeContents attribute, and have the inputted form communicate with backend
$("#getRecipe").click(async (e) => {
    // prevent default behavior (the loading of a new page)
    e.preventDefault();
    let input = document.getElementById("recipe-name").innerHTML;
    console.log("input:", input)
    let url = baseUrl;
    // let queryUrl = encodeURIComponent(input)

    fetch(url + '/recipe',)
    .then(
        function (res) {
            console.log('getRecipe fetch', res)
            return res.json()
        }
    ).then(
        function (data) {
            console.log("we here!")
            // console.log("Success Getting from ChatGPT!")
            // let inputObj = parseData(data.fromServer)
            // writeToDataBase(inputObj, url)
            // writeToPage(inputObj)
        }
    )
})