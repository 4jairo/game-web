const mongoose = require('mongoose')

const CommentScheema = new mongoose.Schema({
    content: {
        required: true,
        type: String,
    },
    ownerId: {
        required: true,
        type: String,
    },
    date: {
        required: true,
        type: Date,
    }
})

CommentScheema.set('toJSON', {
    transform: (document, returnDocuemnt) => {
        returnDocuemnt.id = returnDocuemnt._id
        delete returnDocuemnt._id
        delete returnDocuemnt.__v
    }
})

//const NoteModel = mongoose.model('Note', NoteScheema)

module.exports = CommentScheema 