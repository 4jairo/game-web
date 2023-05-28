const fs = require('fs').promises
const path = require('path')



const gamesFolder = path.join(__dirname, 'public', 'games')
async function getGames(){
    const gamesReady = []
    try {
        const modalities = await fs.readdir(gamesFolder)
        for (const modality of modalities) {
            const modalityDirectory = path.join(gamesFolder, modality)
            const games = await fs.readdir(modalityDirectory)

            for (const game of games) {
                const gameDirectory = path.join(modalityDirectory, game)
                const gameFiles = await fs.readdir(gameDirectory)

                const HTMLFiles = gameFiles.filter(file => file.split('.').pop() == 'html')

                const imgExtensions = ['png','jpg','jpeg','svg']                
                const gameImgs = gameFiles.filter(file => imgExtensions.includes(file.split('.').pop()))
                const indexImg = gameImgs.filter(file => file.split('.').shift() == 'index')
                
                gamesReady.push({
                    ready: HTMLFiles.length ? true : false,
                    main: HTMLFiles.includes('index.html') ? 'index.html' : HTMLFiles[0],
                    imgLogo: indexImg.length ? indexImg[0] : gameImgs[0],
                    modality,
                    game
                })
                
            }
        }
        return gamesReady
    } catch (err) {
        console.log(err)
    }
} 

module.exports = {getGames}
