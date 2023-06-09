const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, '../.env')})
const express = require('express')
const router = express.Router()

// DATABASE
const mongodb = require('mongodb')
const uri = process.env.MONGODB_URI;
const dbClient = new mongodb.MongoClient(uri, {
    serverApi: {
        version: mongodb.ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// ChatGPT API
const openAi = require('openai');
const configuration = new openAi.Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})
const openAIClient = new openAi.OpenAIApi(configuration);

// ROUTES
router.get("/", function(req, res, next){
    console.log("home rendered")
    res.render('home')
})

router.get("/ricos-lab", function(req, res, next){
    res.render('generate')
})

router.get('/ricos-menu/recipe/:id/:recipeName', async function(req, res, next) {

    await dbClient.connect();
    const menu = dbClient.db("ricos_menu")
    // Send a ping to confirm a successful connection
    await dbClient.db("admin").command({ ping: 1 })
    console.log("Pinged your deployment. You successfully connected to MongoDB!")
    ObjectId = mongodb.ObjectId
    let recipeID = await new ObjectId(req.params.id)
    console.log(recipeID)
    const cursor = menu.collection('recipes').find({"_id": recipeID})
    const allValues = await cursor.toArray();
    let recipes = []
    for (let i in allValues) {
        console.log(allValues[i].likes)
        recipes.push({
            id: allValues[i]._id.toString(),
            name: allValues[i].name,
            ingredients: allValues[i].ingredients,
            likes: allValues[i].likes,
            instructions: allValues[i].instructions
        })
    }
    await cursor.close()

    res.render('recipe', {recipes: recipes})
})

router.get("/ricos-menu", async function(req, res, next){

    await dbClient.connect();
    const menu = dbClient.db("ricos_menu")
    // Send a ping to confirm a successful connection
    await dbClient.db("admin").command({ ping: 1 })
    console.log("Pinged your deployment. You successfully connected to MongoDB!")
    
    // grabs the term that the user inputted and look for it in database
    let searchTerm = req.query.search;
    let cursor;
    if(searchTerm === undefined || searchTerm == "") {
        cursor = menu.collection('recipes').find({})
    } else {
        cursor = menu.collection('recipes').find({
            "name" : new RegExp(searchTerm, 'i')
        })
    }

    // clean up the info grabbed from database to be used in handlebars
    const allValues = await cursor.toArray();
    let recipes = []
    for (let i in allValues) {
        recipes.push({
            id: allValues[i]._id.toString(),
            name: allValues[i].name,
            likes: allValues[i].likes,
            slug: allValues[i].name.toLowerCase().replaceAll(' ', '-')
        })
    }
    await cursor.close()
    
    res.render('explore', {recipes: recipes, searchTerm: searchTerm})
})

router.post("/ricos-lab/generate-data", async function(req, res){
   
    // connects to chatgpt api and generates a recipe based on what the user inputted
    const completion = await openAIClient.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content:"silly recipe with " + req.body.input}],
        n: 1,
    });

    res.status(200).json({"fromServer": completion.data.choices[0].message.content})
})

router.post(["/ricos-menu", "/ricos-menu/add-like", "/ricos-menu/recipe/:id/:recipeName/add-like"], async function(req, res){

    await dbClient.connect();
    const menu = dbClient.db("ricos_menu")
    // Send a ping to confirm a successful connection
    await dbClient.db("admin").command({ ping: 1 })
    console.log("Pinged your deployment. You successfully connected to MongoDB!")
    ObjectId = mongodb.ObjectId
    let recipeID = await new ObjectId(req.body.id)
    cursor = menu.collection('recipes').find({
        "_id" : recipeID
    })
    const allValues = await cursor.toArray();
    let likes = allValues[0].likes + 1

    // update likes in recipes collection
    const query = { "_id": recipeID };
        const update = {
        "$set": {
            "likes": likes,
        }
        };
    const options = { "upsert": false };

    menu.collection('recipes').updateOne(query, update, options)
    .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
        console.log(`Successfully updated the item.`)
        }
    })
    .catch(err => console.error(`Failed to update the item: ${err}`))

    await cursor.close()

    res.status(200).json({"fromServer": likes})
})

router.post("/ricos-lab/db", async function(req, res){
    //connect to database
    await dbClient.connect();
    const menu = dbClient.db("ricos_menu")

    cursor = menu.collection('recipes').find({
            "name" : req.body.inputObj.recipeName
        })
    const allValues = await cursor.toArray();

    // Add to database if it is new recipe
    if(allValues.length == 0 || allValues === undefined) {
        await menu.collection('recipes').insertOne({
            name: req.body.inputObj.recipeName,
            ingredients: req.body.inputObj.ingredients,
            instructions: req.body.inputObj.instructions,
            likes: 0
        })
    } else {
        console.log("it already exists!")
    }
})

// will we ever get here?
router.get("404", function(req, res){
    res.render('404')
})
router.get("500", function(req, res){
    res.render('500')
})

module.exports = router