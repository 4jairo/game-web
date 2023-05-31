function gameUtils(){
    //filter games
    const searchGameInput = searchGameContainer.querySelector('input')
    const allGames = flexjuegos.querySelectorAll('.item')
    searchGameInput.addEventListener('keyup', (e) => {
        for (const gameElement of allGames) {
            const gameName = gameElement.getAttribute('data-game').toLowerCase()
            if(gameName.includes(searchGameInput.value)) {
                gameElement.style.display = 'block'
            } else {
                gameElement.style.display = 'none'
            }
        }
    })

    //game menu
    for (const gameElement of allGames) {
        gameElement.addEventListener('click', () => {
            const gameName = gameElement.querySelector('.gameName').innerHTML
            const gameModality = gameElement.closest('.modality').getAttribute('data-modality')
            const gameImg = gameElement.querySelector('.gameImg').src
            let alertContent = ''
            if(!localStorage.getItem('token')) alertContent = `
            <div id="gameMenuContent-errorMessage">
                <img src="logos/alert.png">
                <p>regístrate antes de enviar comentarios</p>
            </div>`

            gameMenuContent.innerHTML = `
            <div><h1>${gameName}</h1></div>
            <div class="gameMenuContent-img"><img src="${gameImg}"></div>
            <div class="gameMenuContent-btn"><button id="playGameBtn">Jugar</button></div>
            <div class="commentArea-header">
                <div>
                    <h3>Comentarios</h3>
                    <input id="commentInput" type="text" placeholder="inserta un comentairo">
                    <input id="refreshBtn" type="button" value="Actualizar conversación"> 
                </div>
                ${alertContent}
            </div>
            <div id="commentArea"></div>`

            getAllComments(gameName, commentArea)
            commentsUtils(gameName, gameModality, commentArea)
            gameMenuContainer.style.display = 'flex'

            document.onclick = (e) => {
                if(e.target === gameMenuContainer) {
                    gameMenuContainer.style.display = 'none'
                    document.onclick = null
                }
            }
        })
    }
}   
function refreshConversation(gameName, container){
    dbRequest(`/comments/${gameName}`, 'GET').then(response => {
        let content = ''
        for (let i = commentArea.childElementCount; i < response.length; i++) {
            const {content: commentContent, ownerId, date} = response[i]
            content += commentShape(commentContent, ownerId.name, date)
        }
        container.innerHTML += content
    })
}

function getAllComments(gameName, container){
    dbRequest(`/comments/${gameName}`, 'GET').then(response => {
        let content = ''
        for (const comment of response) {
            const {content: messageContent, ownerId, date} = comment
            content += commentShape(messageContent, ownerId.name, date)
        }
        container.innerHTML += content
    })
}

function commentsUtils(gameName, gameModality, container){
    //input
    commentInput.addEventListener('keyup', (e) => {
        if(e.key === 'Enter') {
            sendMessage(commentInput.value, gameName, container)
            commentInput.value = ''
        }
    })

    //play btn
    playGameBtn.addEventListener('click', () => {
        window.open(`../games/${gameModality}/${gameName}`)
    })

    //refresh
    refreshBtn.addEventListener('click', () => {
        refreshConversation(gameName, commentArea)
    })
}

function sendMessage(value, gameName, container){
    const token = localStorage.getItem('token')
    if(!token) return
    if(value === '' || !value) return

    dbRequest(`/comments/${gameName}`, 'POST', {content: value}, token).then(response => {
        console.log(response)
        if(response.error){}
        else {
            const {content, ownerId , date} = response
            container.innerHTML += commentShape(content, ownerId.name, date)
        }
    })
}

function commentShape(content, name, date){
    const d = new Date(date)
    const dateString = `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`
    const hour = `${d.getHours()}:${d.getMinutes()}`

    return `<div><div><b>${name} &rarr;</b> ${content}</div> <span>${dateString} - ${hour}</span></div>`
}

function getGames(){
    dbRequest(`/games`, 'GET', {}).then(games => {
        
        //games
        for (const g of games) {
            const {ready, gameImgs, modality, game} = g
            if(!ready) continue
            
            if(!flexjuegos.querySelector(`[data-modality="${modality}"]`)) flexjuegos.innerHTML += `
            <div class="modality" data-modality="${modality}">
                <h1>${modality}</h1>
                <div></div>
            </div>`
            const modalityContainer = flexjuegos.querySelector(`[data-modality="${modality}"] div`)

            const mainImg = gameImgs.find(image => image.split('.').shift() == 'index') || gameImgs[0]
            const mainImgRoute = mainImg ? `../games/${modality}/${game}/${mainImg}` : `logos/notGameImg.png`

            modalityContainer.innerHTML += `
            <div class="item" data-game="${game}">
                <div><img class="gameImg" src="${mainImgRoute}"/></div>
                <p class="gameName">${game}</p>
            </div>`   
        }

        //search games & game menu
        gameUtils()
    })
}



async function dbRequest(url, method, body, token){
    const options = {
        headers:  {
            'Accept': 'aplication.json',
            'Content-Type': 'application/json',
        },
        method
    }
    if(token) options.headers.Authorization = `Bearer ${token}`
    if(method !== 'GET' && body !== null) options.body = JSON.stringify(body)

    try{
        const response = await fetch(url, options)
        return response.json()
    } catch (err) {
        console.error(err)
    }  
}

function getLogin(){
    const token = localStorage.getItem('token')
    if(!token) return

    dbRequest(`/login`, 'POST', null, token).then(response => {
        const mainMenuLoginBtn = mainMenu.querySelector('#mainMenu-signin')
        mainMenuLoginBtn.innerHTML = `Cerrar Sesión &rarr; ${response.name}` 
    })
}

function mainMenuUtils(){
    const mainMenuLoginBtn = mainMenu.querySelector('#mainMenu-signin')
    mainMenuLoginBtn.addEventListener('click', () => {

        if(mainMenuLoginBtn.innerHTML !== 'Iniciar Sesión') {
            localStorage.clear()

            mainMenuLoginBtn.innerHTML = 'Iniciar Sesión'
        } else {
            window.open('/iniciosesion/sesion.html')
        }
    })

}



window.addEventListener('load', () => {
    mainMenuUtils()
    getLogin()
    getGames()
})