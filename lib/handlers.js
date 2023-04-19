const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, '../.env')})
const express = require('express')
const router = express.Router()
const openAi = require('openai');

const configuration = new openAi.Configuration({
    // organization: process.env.OPENAI_ORGANIZATION,
    apiKey: process.env.OPENAI_API_KEY,
})

const openAIClient = new openAi.OpenAIApi(configuration);

router.get("/", function(req, res, next){
    res.render('home')
})

router.get("/ricos-lab", function(req, res, next){
    res.render('generate')
})

router.get("/ricos-menu", function(req, res, next){
    res.render('explore')
})

router.post("/submit-data", async function(req, res){
    
    // console.log("hello", typeof(req.body.input))
    const completion = await openAIClient.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content:"silly recipe with " + req.body.input}],
        n: 1,
        // "stop": "\n"
      });

    // const response = await openAIClient.createCompletion({
    //     model: "text-davinci-003",
    //     prompt: req.body.input,
    //     max_tokens: 2048,
    //     temperature: 0,
    //     n: 1,
    //   });

    //   console.log("response", response.data.choices[0]);
      console.log("response1", completion.data.choices[0].message.content);

      res.status(200).json({"fromServer": completion.data.choices[0].message.content})
})

router.get("404", function(req, res){
    res.render('home')
})
router.get("500", function(req, res){
    res.render('home')
})


module.exports = router