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

let dataArr =test.split('\n')
console.log(dataArr)

let name1 = dataArr[0]
let ingredientsArr = []
let instructionsArr = []
let counter = 2;

for (let i = 3; i < dataArr.length; i++) {
    let obj = dataArr[i]
    console.log(obj, obj != 'Instructions' && obj != 'Instructions:' && obj != "")
    if (obj != 'Instructions' && obj != 'Instructions:' && obj != "") {
        // console.log("hi")
        ingredientsArr.push(obj)
    }
    counter += 1
    if (obj == 'Instructions' || obj == 'Instructions:' ) {
        break
    }
}

for (let i = counter + 1; i < dataArr.length; i++) {
    let obj = dataArr[i]
    if (obj != "") {
        instructionsArr.push(obj)
    }
}

let inputArr = {
    ingredients: ingredientsArr,
    instructions: instructionsArr
}