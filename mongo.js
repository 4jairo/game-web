const mongoose = require('mongoose')

async function getAllCollections() {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }) 
        
        const collections = await mongoose.connection.db.listCollections().toArray()
        return collections.map((collection) => collection.name.split('-').shift());

    } catch (er) {
        console.log('mongo: ',er.name)
    }
}

module.exports = {getAllCollections}