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
const { all } = require('..')
const { type } = require('os')
const configuration = new openAi.Configuration({
    // organization: process.env.OPENAI_ORGANIZATION,
    apiKey: process.env.OPENAI_API_KEY,
})
const openAIClient = new openAi.OpenAIApi(configuration);

// ROUTES
router.get("/", function(req, res, next){
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
        recipes.push({
            name: allValues[i].name,
            ingredients: allValues[i].ingredients,
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

    let searchTerm = req.query.search;
    let cursor;
    if(searchTerm === undefined || searchTerm == "") {
        cursor = menu.collection('recipes').find({})
    } else {
        cursor = menu.collection('recipes').find({
            "name" : new RegExp(searchTerm, 'i')
        })
    }
    const allValues = await cursor.toArray();
    // // console.log(allValues)
    let recipes = []
    for (let i in allValues) {
        recipes.push({
            id: allValues[i]._id.toString(),
            name: allValues[i].name,
            slug: allValues[i].name.toLowerCase().replaceAll(' ', '-')
        })
    }
    await cursor.close()
    
    res.render('explore', {recipes: recipes, searchTerm: searchTerm})
})

router.post("/ricos-lab/generate-data", async function(req, res){
   
    const completion = await openAIClient.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content:"silly recipe with " + req.body.input}],
        n: 1,
        // "stop": "\n"
    });

    res.status(200).json({"fromServer": completion.data.choices[0].message.content})
})

router.post("/ricos-lab/db", async function(req, res){
    //connect to database
    await dbClient.connect();
    const menu = dbClient.db("ricos_menu")

    // Add to database
    await menu.collection('recipes').insertOne({
        name: req.body.inputObj.recipeName,
        ingredients: req.body.inputObj.ingredients,
        instructions: req.body.inputObj.instructions
    })
})

// will we ever get here?
router.get("404", function(req, res){
    res.render('404')
})
router.get("500", function(req, res){
    res.render('500')
})

module.exports = router