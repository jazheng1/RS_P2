require('dotenv').config
const express = require('express')
const expressHandlebars = require('express-handlebars')
const handlers = require('./lib/handlers.js')

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
// app.use(express.static('public'))

// landing page
app.use('/', handlers)
// generate page
app.use('/ricos-lab', handlers)
// explore page
app.use('/ricos-menu', handlers)
//recipe pages
app.use('/ricos-menu/recipe', handlers)
// calls chaptGPT to generate recipe
app.post('/generate-data', handlers)
// sends recipe to database
app.post('/db', handlers)
// custom 404 page
app.use('404', handlers)
// custom 500 page
app.use('500', handlers)

app.listen(port, () => {
    console.log(`Express started on http://localhost:${port}` +
        '; press Ctrl-C to terminate.')
})

module.exports = app