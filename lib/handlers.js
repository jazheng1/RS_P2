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

router.get("/ricos-menu", function(req, res, next){
    res.render('explore')
})

router.post("/ricos-lab/generate-data", async function(req, res){
    
    const completion = await openAIClient.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content:"silly recipe with " + req.body.input}],
        n: 1,
        // "stop": "\n"
    });

    console.log("response1", completion.data.choices[0].message.content);

    res.status(200).json({"fromServer": completion.data.choices[0].message.content})
})

router.post("/ricos-lab/db", async function(req, res){
    //connect to database
    await dbClient.connect();
    const menu = dbClient.db("ricos_menu")
    // Send a ping to confirm a successful connection
    await dbClient.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    // Add to database
    console.log(req.body.inputObj)
    await menu.collection('recipes').insertOne({ 
        name: req.body.inputObj.recpeName, 
        ingredients: req.body.inputObj.ingredientsArr, 
        instructions: req.body.inputObj.instructionsArr 
    })
    res.status(200).json({"fromServer": "Send!"})
})

router.get("404", function(req, res){
    res.render('home')
})
router.get("500", function(req, res){
    res.render('home')
})


module.exports = router