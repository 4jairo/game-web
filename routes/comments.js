const express = require('express')
const mongoose = require('mongoose')
const {getAllCollections} = require('../mongo')
const CommentScheema = require('../models/comment')

const commentsRouter = express.Router()

const jwt = require('jsonwebtoken')

//!getting all Collections (once)
getAllCollections().then(collections => {
    for (const game of collections) {
        mongoose.model(`${game}-comment`, CommentScheema)
        gamesConversations[game] = `${game}-comment` 
    }
})
const gamesConversations = {}


//!token verification
commentsRouter.use('/', (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const payload = jwt.verify(token, process.env.SECRET)
        const timeDifference = (new Date - new Date(payload.expiration)) / 60000
        
        if(timeDifference < 0) {
            //res.payload = payload
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
        const {content, ownerId} = req.body
        const game = req.params.game
        //if any comment in the comments game
        if(!gamesConversations[game]) {
            mongoose.model(`${game}-comment`, CommentScheema)
            gamesConversations[game] = `${game}-comment`
        }

        //creating new model and 
        const CommentModel = mongoose.model(gamesConversations[game])

        const newComment = CommentModel({
            content,
            ownerId,
            date: new Date
        })
        const savedComment = await newComment.save()
        res.json(savedComment)

    } catch (err) {
        console.log('post comment', err.name)
        next(err)
    }
})


//!delete comment
commentsRouter.delete('/:game/:id', async (req, res, next) => {
    try {
        const { game, id: commentId } = req.params
        const CommentModel = mongoose.model(gamesConversations[game])
    
        const deletedComment = await CommentModel.findByIdAndDelete(commentId)
        res.json(deletedComment)
        
    } catch (err) {
        console.log('delete comment', err.name)
        next(err)
    }
})


//!get all game comments
commentsRouter.get('/:game', async (req, res, next) => {
    try {
        const game = req.params.game    
        const CommentModel = mongoose.model(gamesConversations[game])

        const allGameComments = await CommentModel.find({})
        res.json(allGameComments)

    } catch (error) {
        console.log('get comment', error.name)
        next(error)
    }
})


//!edit comment
commentsRouter.patch('/:game/:id', async (req, res, next) => {
    try {
        const { game, id: commentId } = req.params
        const CommentModel = mongoose.model(gamesConversations[game])

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

module.exports = commentsRouter
