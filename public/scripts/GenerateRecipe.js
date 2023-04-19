let baseUrl = window.location.href;

// get fridgeContents attribute, and have the inputted form communicate with backend
$("#fridgeContents").submit(async (e) => {
    // prevent default behavior (the loading of a new page)
    e.preventDefault();
    let input = document.getElementById("user-input").value;
    console.log("input:", input)
    let url = baseUrl;

    fetch(url + '/generate-data', {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ "input": input })
    }).then(
        function (res) {
            console.log('first fetch', res)
            return res.json()
        }
    ).then(
        function (data) {
            console.log("Success! ", data.fromServer)
            let inputObj = parseData(data.fromServer)
            writeToDataBase(inputObj, url)
            writeToPage(inputObj)
        }
    )
})

function parseData(data) {
    let dataArr = data.split("\n")
    let recipeName = dataArr[0]
    let ingredientsArr = []
    let instructionsArr = []
    let counter = 2;

    for (let i = 3; i < dataArr.length; i++) {
        let obj = dataArr[i]
        counter += 1
        if (obj == 'Instructions' || obj == 'Instructions:' || obj == 'Directions:') {
            break
        }
        if(obj != "") {
            ingredientsArr.push(obj)
        }
    }

    for (let i = counter + 1; i < dataArr.length-1; i++) {
        let obj = dataArr[i]
        if (obj != "") {
            instructionsArr.push(obj)
        }
    }

    return inputObj = {
        recipeName: recipeName,
        ingredients: ingredientsArr,
        instructions: instructionsArr
    }
}

function writeToPage(inputObj) {
    let template = `<h2>{{recipeName}}</h2>
    <div class="row">
        <div class="offset-1 col-3">
            <h4>Ingredients</h4>
            <ul class="ingredients">
                {{#each ingredients}}
                    <p> {{this}} </p>
                {{/each}}
            </ul>
        </div>
        <div class="col-7">
            <h4>Instructions</h4>
            <ul class="instructions">
                {{#each instructions}}
                    <p> {{this}} </p>
                {{/each}}
            </ul>
        </div>
    </div>`
    let templateFunction = Handlebars.compile(template);
    let html = templateFunction(inputObj);
    console.log(html);

    document.querySelector("#response").innerHTML = html;
}

function writeToDataBase(inputObj, url) {
    fetch(url + '/db', {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ "inputObj": inputObj })
    }).then(
        function (res) {
            console.log('second fetch', res)
            return res.json()
        }
    ).then(
        function (data) {
            console.log("Success!")
        }
    )
}
