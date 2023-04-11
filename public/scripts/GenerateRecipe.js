let baseUrl = window.location.href;
let inputArr = [];

// get fridgeContents attribute, and have the inputted form communicate with backend
$("#fridgeContents").submit(async (e) => {
    // prevent default behavior (the loading of a new page)
    e.preventDefault();
    let input = document.getElementById("user-input").value;
    let url = baseUrl;
    console.log(input)

    fetch(url+'submit-data', {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ "input": input })
    }).then(
        function (res) {
            console.log(res)
            return res.json()
        }
    ).then(
        function (data) {
            console.log("Success! " + data)
        }
    )
})

function getArr() {
    return inputArr;
}