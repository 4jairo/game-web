require('dotenv').config()
//const path = require('path')

const express = require('express')
const cors = require('cors')

const commentsRouter = require('./routes/comments')
const usersRouter = require('./routes/users')
const gamesRouter = require('./routes/games')

const notFound = require('./middleware/notFound.js')
const handleErrors = require('./middleware/handleErrors.js')

const app = express()

app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use(express.json())


//website
app.use('/', express.static('public/website'))


//games
app.use('/games', express.static('./public/games'), gamesRouter)


//users (login - signin)
app.use('/', usersRouter)


//comments
app.use('/comments', commentsRouter)


//middleware
app.use(notFound)
app.use(handleErrors)


//sv
app.listen(3000, null, () => {
    console.log('ready on http://localhost:3000/home')
})

