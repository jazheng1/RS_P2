let baseUrl = window.location.href;

// get fridgeContents attribute, and have the inputted form communicate with backend
$("#fridgeContents").submit(async (e) => {
    // prevent default behavior (the loading of a new page)
    e.preventDefault();
    let input = document.getElementById("user-input").value;
    let btn = document.getElementById("GenerateRecipe");
    btn.innerHTML = `<div class="spinner-border text-light" role="status">
                    <span class="sr-only"></span>
                    </div>`
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
            console.log('generateRecipe fetch', res)
            return res.json()
        }
    ).then(
        function (data) {
            console.log("Success Getting from ChatGPT!")
            let inputObj = parseData(data.fromServer)
            writeToDataBase(inputObj, url)
            btn.innerHTML = `Create`
            writeToPage(inputObj)
            document.getElementById("response").style.visibility = "visible"
        }
    )
})

function parseData(data) {
    let dataArr = data.split("\n")
    let recipeName = dataArr[0]
    recipeName.replaceAll(":", "");
    recipeName.replaceAll("&", "and")
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
        <div class="col-sm-12 col-md-3">
            <h4>Ingredients</h4>
            <ul class="ingredients">
                {{#each ingredients}}
                    <p> {{this}} </p>
                {{/each}}
            </ul>
        </div>
        <div class="col-sm-12 col-md-7">
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
    // console.log(html);

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
            console.log('sent to database fetch', res)
            return res.json()
        }
    ).then(
        function (data) {
            console.log("Success Sending to Database")
        }
    )
}
