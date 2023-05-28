const idSelector = id => document.getElementById(id)
const mainUrl = 'http://192.168.1.50'
const urlGames = `${mainUrl}:3001/games/`


function interactiveMenus(){
    //main menu
    const mainMenuOptions = mainMenu.querySelectorAll('span')
    for (const option of mainMenuOptions) {
        option.addEventListener('click', () => {
            switch (option.id) {
                case 'mainMenu-signin':
                    
                break;
                case 'mainMenu-Home':

                break;
            }
        })
    }

    //games Menu container
    const gamesMenuContainer = idSelector('gamesMenu-container')
    gamesMenuBtn.addEventListener('click', () => {
        if(gamesMenuContainer.offsetWidth > 0) gamesMenuContainer.style.width = 0
        else gamesMenuContainer.style.width = 'var(--gamesMenuWidth)'
    })
}

function getGames(){
    getDbData(urlGames).then(games => {       
        for (const game of games) {
            //gamesContainer
            const gameImgSrc = game.icon ? `games/${game.modality}/${game.game}/${game.icon}` : 'imgs/icons/close.svg'
            
            gamesContainer.innerHTML += `
            <div class="game" data-gameName="${game.game}" data-gameModality="${game.modality}">
                <p>${game.game}</p>
                <p>${game.modality}</p>
                <img src="${gameImgSrc}">
            </div>`

            //gamesMenuContainer
            const modality = gamesMenuContent.querySelector(`div[data-modality=${game.modality}]`)
            if(!modality) gamesMenuContent.innerHTML += `<div data-modality="${game.modality}">${game.modality}</div>`   
        }
        goToGame()
    })
}

let allGames
function goToGame(){
    allGames = gamesContainer.querySelectorAll('.game')
    for (const game of allGames) {
        game.addEventListener('click', () => {
            const gameName = game.getAttribute('data-gameName')
            const gameModality = game.getAttribute('data-gameModality')

            window.open(`${mainUrl}:5500/games/${gameModality}/${gameName}`)
        })
    }
}

function searchGames(){
    searchGameInput.addEventListener('input', () => {        
        for (const game of allGames) {
            const gameName = game.getAttribute('data-gameName')
            //const gameModality = game.getAttribute('data-gameModality')

            if(gameName.toLowerCase().includes(searchGameInput.value)) game.style.display = 'block'
            else game.style.display = 'none'
        }
    })
}

async function getDbData(url, id){
    let fetchUrl
    if(id) fetchUrl = `${url}/${id}`
    else fetchUrl = url

    const response = await fetch(fetchUrl)
    const data = await response.json()

    return data
}

window.addEventListener('load', () => {
    getGames()
    interactiveMenus()
    searchGames()
})