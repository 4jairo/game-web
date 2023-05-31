const  express = require('express')
const gamesRouter = express.Router()


const {getGames} = require('../getGames')

//single game
gamesRouter.get('/:game', async (req, res, next) => {
    try {
        const { game } = req.params;
        const allGames = await getGames();
        const currentGameData = allGames.find(g => g.game === game);

        if (!currentGameData || !currentGameData.ready) {
            res.json({ error: `${game} is not ready or does not exist` });
        } else {
            res.sendStatus(200)
        }
 
    } catch (err) {
        console.log('get single game', err.name)
        next(err)
    }
})

//get all games
gamesRouter.get('/', async (req, res, next) => {
    try {
        res.json( await getGames() ) 
    } catch (err) {
        console.log('all games', err.name)
        next(err)
    }
})

module.exports = gamesRouter