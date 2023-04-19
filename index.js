require('dotenv').config
const express = require('express')
const expressHandlebars = require('express-handlebars')
const handlers = require('./lib/handlers')

// const openAi = require('openai')

// const configuration = new openAi.Configuration({
//     organization: process.env.OPENAI_ORGANIZATION,
//     apiKey: process.env.OPENAI_API_KEY,
// })

// const openAIClient = new openAi.OpenAIApi(configuration);

const app = express()
app.use(express.json())

const port = process.env.PORT || 3000

// configure Handlebar's viwe engine
app.engine('handlebars', expressHandlebars.engine({
    defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

// static middleware
app.use(express.static(__dirname + '/public'))

// landing page
app.use('/', handlers)
// generate page
app.use('/ricos-lab', handlers)
// explore page
app.use('/ricos-menu', handlers)
// calls chaptGPT to generate recipe
app.post('/generate-data', handlers)
// sends recipe to database
app.post('/db', handlers)

// custom 404 page
app.use('404', handlers)

// custom 500 page
app.use('500', handlers)

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Express started on http://localhost:${port}` +
            '; press Ctrl-C to terminate.')
    })
} else {
    module.exports = app
}