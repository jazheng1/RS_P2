require('dotenv').config
const express = require('express')
const router = express.Router()
const openAi = require('openai');

const configuration = new openAi.Configuration({
    organization: process.env.OPENAI_ORGANIZATION,
    apiKey: process.env.OPENAI_API_KEY,
})

const openAIClient = new openAi.OpenAIApi(configuration);

router.get("/", function(req, res, next){
    res.render('home')
})

router.post("/submit-data", function(req, res){
    const params = {
        "prompt": req.body.input, 
        "max_tokens": 10
    }
    console.log(req.body.input)
    openAIClient.POST('https://api.openai.com/v1/chat/completions', params)
    .then(result => {
        console.log("result: ", result.data)
        res.json({
            "fromServerInput": req.body.input,
        });
    }).catch(err => {
        console.log(err)
    })
})

router.get("404", function(req, res){
    res.render('home')
})
router.get("500", function(req, res){
    res.render('home')
})

exports.homePost = 
exports.notFound = (req, res) => res.render('404')
exports.serverError = (err, req, res, next) => res.render('500')


module.exports = router