const express = require('express')
const mongoose = require('mongoose')
const {getAllCollections} = require('../mongo')
const CommentScheema = require('../models/comment')

const commentsRouter = express.Router()

const jwt = require('jsonwebtoken')

//!getting all Collections (once)
getAllCollections().then(collections => {
    for (const col of collections) {
        if(col === 'users') continue

        mongoose.model(col, CommentScheema)
    }
})

//!get all game comments
commentsRouter.get('/:game', async (req, res, next) => {
    try {
        const game = req.params.game.replace(/\s/g,'-')

        //if any comment yet
        const modelName = `${game}-comments`.toLowerCase()
        if(!mongoose.models[modelName]) {
            mongoose.model(modelName, CommentScheema)
            res.json([])

        } else {
            const CommentModel = mongoose.model(modelName)
            const allGameComments = await CommentModel.find({})//.sort({date: -1})
            .populate('ownerId', {name: 1, _id: 0}) 
            res.json(allGameComments)
        }
    
    } catch (error) {
        console.log('get all comment', error.name)
        next(error)
    }
})








//!token verification (!get all commets)
commentsRouter.use('/', (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const payload = jwt.verify(token, process.env.SECRET)
        const timeDifference = (new Date - new Date(payload.expiration)) / 60000
        if(timeDifference < 120) {
            res.payload = payload
            next()
        } else res.json({error: 'token expired'})

    } catch (err) {
        console.log('token verification', err.name)
        next(err)
    }
})

//!new comment
commentsRouter.post('/:game', async (req, res, next) => {
    try {
        const { content } = req.body
        const game = req.params.game.replace(/\s/g,'-')
        const { userId: ownerId } = res.payload

        //if no collection created
        const modelName = `${game}-comments`.toLowerCase()
        if(!mongoose.models[modelName]) mongoose.model(modelName, CommentScheema)

        //creating new comment
        const CommentModel = mongoose.model(modelName)

        const newComment = CommentModel({
            content,
            ownerId: new mongoose.Types.ObjectId(ownerId),
            date: new Date
        })

        await newComment.save()

        const responseComment = await newComment.populate('ownerId', {name: 1, _id: 0})
        res.json(responseComment)

    } catch (err) {
        console.log('post comment', err.name)
        next(err)
    }
})

/*


//!edit comment
commentsRouter.patch('/:game/:id', async (req, res, next) => {
    try {
        const { game: notParsedGame, id: commentId } = req.params
        const game = notParsedGame.replace(/\s/g,'-')
        const modelName = `${game}-comments`.toLowerCase()
        const CommentModel = mongoose.model(modelName)

        const newNoteContent = {
            content: req.body.content,
            date: new Date
        }

        const updatedNote = await CommentModel.findByIdAndUpdate(commentId, newNoteContent, {new: true})
        res.json(updatedNote)

    } catch (err) {
      console.log('patch comment', err.name)  
      next(err)
    }
})

//!delete comment
commentsRouter.delete('/:game/:id', async (req, res, next) => {
    try {
        const { game: notParsedGame, id: commentId } = req.params
        const game = notParsedGame.replace(/\s/g,'-')

        const modelName = `${game}-comments`.toLowerCase()
        const CommentModel = mongoose.model(modelName)
    
        const deletedComment = await CommentModel.findByIdAndDelete(commentId)
        res.json(deletedComment)
        
    } catch (err) {
        console.log('delete comment', err.name)
        next(err)
    }
})

*/

module.exports = commentsRouter
