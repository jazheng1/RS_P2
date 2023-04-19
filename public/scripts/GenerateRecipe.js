let baseUrl = window.location.href;

// get fridgeContents attribute, and have the inputted form communicate with backend
$("#fridgeContents").submit(async (e) => {
    // prevent default behavior (the loading of a new page)
    e.preventDefault();
    let input = document.getElementById("user-input").value;
    let url = baseUrl;
    console.log("input:", input, url)

    fetch(url + '/submit-data', {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ "input": input })
    }).then(
        function (res) {
            console.log('first then', res)
            return res.json()
        }
    ).then(
        function (data) {
            console.log("Success! ", data)
            writeToPage(data.fromServer)
        }
    )
})

function writeToPage(data) {
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

    let inputArr = {
        recipeName: recipeName,
        ingredients: ingredientsArr,
        instructions: instructionsArr
    }

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
    let html = templateFunction(inputArr);
    console.log(html);

    document.querySelector("#response").innerHTML = html;
}

let test = '"Cheeky Monkey" Eggs:\n' +
    '\n' +
    'Ingredients:\n' +
    '- 2 eggs\n' +
    '- 1 banana\n' +
    '- 1 tablespoon of peanut butter\n' +
    '- 1 teaspoon honey\n' +
    '- A pinch of salt\n' +
    '- 1 tablespoon butter\n' +
    '\n' +
    'Instructions:\n' +
    "1. Peel the banana and mash it with a fork in a small bowl until it's mostly smooth.\n" +
    '2. Mix in the peanut butter and honey until everything is well combined.\n' +
    "3. Crack the eggs into the banana mixture and stir until the yolks and whites are fully mixed in (don't worry if it looks a bit lumpy!).\n" +
    '4. Heat the butter in a non-stick skillet over medium heat until melted and hot.\n' +
    '5. Pour the egg mixture into the pan and spread it out into an even layer.\n' +
    '6. Cook for 3-4 minutes until the bottom is golden brown and the eggs are set on top.\n' +
    '7. Carefully flip the eggs over using a spatula and cook for an additional 2-3 minutes until the other side is golden brown as well.\n' +
    '8. Slide the eggs onto a plate and sprinkle with a pinch of salt.\n' +
    '9. Serve hot and enjoy your cheeky monkey eggs!'

    // writeToPage(test)