//----players
function Player(forward, backward, left, right, shoot, position, health){
    this.keyb = {
        forward: forward,
        backward: backward, 
        left: left, 
        right: right,
        shoot: shoot,
    }
    this.position = position
    this.health = health
}
let p1 = new Player('KeyW','KeyS','KeyA','KeyD','Space',[100, 100], 100)
let p2 = new Player('ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyP',[50, 100], 100)
let gameStatus = false

//----hud & settings menu

// modal container
window.addEventListener('click', (e) => {
    if(e.target == modalContainer){
        modalContainer.style.display = 'none'
    }
})

//----keybinds
settings.addEventListener('click', () => {
    modalContainer.style.display = 'block'
    keyBinds(p1)
    keyBinds(p2)
})

//change keys
let inUseKeys = []
let lastChangeKey
function keyBinds(player){
    let element = p1keybinds
    let p = 'p1'
    if(player.keyb.forward == p2.keyb.forward){
        p = 'p2'
        element = p2keybinds
    }
    element.innerHTML = ""

    Object.entries(player.keyb).forEach(key => {
        if(!inUseKeys.includes(key[1])){
            inUseKeys.push(key[1])
        }
        element.innerHTML += `
        <div>
            <p id="${p}_${key[0]}">${key[0]} &rarr; ${key[1]}</p>
            <button onclick="changeKey('${p}', '${key[0]}')">change</button>
        </div>`
    })
}

function changeKey(player, action){
    // select the element above the clicked btn
    let keyElement = document.getElementById(`${player}_${action}`)
    keyElement.style.backgroundColor = 'green'

    // if player does not type any key => ignore
    if(lastChangeKey !== undefined && lastChangeKey !== keyElement && lastChangeKey.style.backgroundColor == 'green'){
        lastChangeKey.style.backgroundColor = 'white'
    }
    lastChangeKey = keyElement

    // asign new key
    if(player == 'p1'){
        player = p1
    } else {
        player = p2
    }
    document.onkeydown = (e) => {
        if(inUseKeys.includes(e.code)){
            alert('This key is in use!')
        } else {
            inUseKeys = inUseKeys.filter((element) => {
                return element !== player.keyb[action]
            })
            inUseKeys.push(e.code)
            player.keyb[action] = e.code
        }
        keyElement.style.backgroundColor = 'white'
        keyBinds(player)
        document.onkeydown = null        
    }
}

//----maps
let choosenMap
let mapOptions = document.querySelectorAll('.maps')
mapOptions.forEach(mapOpt => {
    mapOpt.addEventListener('click', () => {
        choosenMap = mapOpt.id
        maps(choosenMap)
        modalContainer.style.display = 'none'
    })
})

function maps(mapId){
    switch(mapId){
        case 'map1':
            p1.position = [map.offsetHeight - 100 , 100]
            p2.position = [map.offsetHeight - 100, map.offsetWidth - 100]
            break
        case 'map2':
            p1.position = [map.offsetHeight - 350, 100]
            p2.position = [map.offsetHeight - 350, map.offsetWidth - 100]
            break
    }
    player1.style.display = 'block'
    player2.style.display = 'block'
    updatePlayerPos()
}

//time
let seconds = 60
let minutes = 1
let time
let timeout = false // if(timeout) => player with most health wins
play.addEventListener('click', () => {
    console.log("click")
    if(!choosenMap){
        choosenMap = 'map1'
    }

    restartValues()
    play.style.display = 'none'
    play.innerHTML = 'play again'
    time = setInterval(() => {
        seconds--
        if(seconds === -1){
            seconds = 59
            minutes--
        }
        timeDisplay.innerHTML = `time &rarr; ${minutes}:${seconds}`
        if(seconds == 0 && minutes == 0){
            timeout = true
            updateHealth(p1, "")
            clearInterval(time)
        }
    }, 1000)
})

//----movement
const damage = 10 //health: 100
const playerSpeed = 1
const bulletSpeed = 3
const bulletRatio = 200 // max time (in ms) between bullets

document.addEventListener('keydown', (e) => {
    console.log(e.key)
    updateDirection(p1, e.code, 'down')
    updateDirection(p2, e.code, 'down')
})
        
document.addEventListener('keyup', (e) => {
    updateDirection(p1, e.code, 'up')
    updateDirection(p2, e.code, 'up')
})
    
let pressed = [] /*-> for pressed keys*/
function updateDirection(player, key, keystatus){
    Object.values(player.keyb).forEach(val => {
        if(key === val){
            if(keystatus == 'down'){
                if(!pressed.includes(val)) pressed.push(val)
            } else {
                pressed.splice(pressed.indexOf(val), 1)
            } 
        }
    })
}

//delay & burst bullets p1 & p2 on bulletDelay() fn
let lastBulletp1 = 0
let bulletBurstp1 = 0
let lastBulletp2 = 0
let bulletBurstp2 = 0

function bulletDelay(player){
    let time = new Date().getTime()
    if(player.keyb.shoot == p1.keyb.shoot){
        if(time - lastBulletp1 >= bulletRatio){
            bulletBurstp1++
            shoot(player)

            if(bulletBurstp1 == 7){
                lastBulletp1 = time + 1000
                bulletBurstp1 = 0
            } else {
                lastBulletp1 = time
            }
        }
    } else {
        if(time - lastBulletp2 >= bulletRatio){
            bulletBurstp2++
            shoot(player)

            if(bulletBurstp2 == 7){
                lastBulletp2 = time + 1000
                bulletBurstp2 = 0
            } else {
                lastBulletp2 = time
            }
        }
    }
}

function updateKeys(player){
    pressed.forEach(keys => {
        switch(keys){
            case player.keyb.forward: 
            if(player.position[0] - playerSpeed >= 0){
                    player.position[0] -= playerSpeed
                }
                break
            case player.keyb.backward:
                if(player.position[0] + playerSpeed <= map.offsetHeight - player1.offsetHeight){ 
                    player.position[0] += playerSpeed
                }
                break
            case player.keyb.left:
                if(player.position[1] - playerSpeed >= 0){ 
                    player.position[1] -= playerSpeed
                }
                break
            case player.keyb.right:
                if(player.position[1] + playerSpeed <= map.offsetWidth - player1.offsetWidth){
                    player.position[1] += playerSpeed
                }
                break
            case player.keyb.shoot:
                bulletDelay(player)
                break
        }
    })
}

//summon bullets
let bulletsOnboard = []
let bulletsHitted = []
let bulletCount = 0

function shoot(player){
    let shootPosition = p1.position[1] + player1.offsetWidth - 20
    let direction = 'left'
    if(player.keyb.forward == p2.keyb.forward){
        shootPosition = p2.position[1]
        direction = 'right'
    }

    let newBullet = `<div id="bullet${bulletCount}" class="bullet ${player.keyb.shoot}" top="${player.position[0]}" left="${shootPosition}" direction="${direction}" style="top:${player.position[0]}px; left=${shootPosition}px"></div>`

    bulletCount++
    map.innerHTML += newBullet
    
    bulletsOnboard = Array.from(document.querySelectorAll('.bullet'))
}

function updatePlayerPos(){
    player1.style.top = `${p1.position[0]}px`
    player1.style.left = `${p1.position[1]}px`

    player2.style.top = `${p2.position[0]}px`
    player2.style.left = `${p2.position[1]}px`
}

//bullets position, count and elimination
function bullets(){
    bulletsOnboard.forEach(b => {
        let pos = parseInt(b.getAttribute('left'))
        let direction = b.getAttribute('direction')
        let player
    
        if(direction == 'left'){
            b.setAttribute('left', pos + bulletSpeed)
            player = p1
        } else {
            b.setAttribute('left', pos - bulletSpeed)
            player = p2
        }

        b.style.left = `${b.getAttribute('left')}px`

        if(direction == 'left'){
            if(hitbox(p2, player2)){
                hit()
            }
            if(b.getAttribute('left') > map.offsetWidth){
                removeBullet()
            }
        } else {
            if(hitbox(p1, player1)){
                hit()
            }
            if(b.getAttribute('left') < 0){
                removeBullet()
            }
        }

        function hitbox(pl, plEl){
            return b.getAttribute('left') <= pl.position[1] + plEl.offsetWidth &&
            b.getAttribute('left') >= pl.position[1] &&
            b.getAttribute('top') <= pl.position[0] + plEl.offsetHeight && 
            b.getAttribute('top') >= pl.position[0]
        }
        function hit(){
            if(!bulletsHitted.includes(b)){
                bulletsHitted.push(b)
                console.log("hit")
                removeBullet()
                updateHealth(player, b)
            }
        }
        function removeBullet(){
            b.remove()
            bulletsOnboard = bulletsOnboard.filter(function(element){
                return element !== b
            })
        }
    })
}

// update players health and check for timeout
function updateHealth(player, hit){
    let OtherPlHealth = p2health
    let OtherPl = p2
    let OtherPlElement = player1Container
    let playerName = 'Player 1'

    if(player.keyb.shoot == p2.keyb.shoot){
        OtherPlHealth = p1health
        OtherPl = p1
        OtherPlElement = player2Container
        playerName = 'Player 2'
    }

    // timeout
    if(timeout){
        if(player.health < OtherPl.health){
            alerts.innerHTML = `Time is out, ${playerName} won!`
        } else if(player.health == OtherPl.health){
            alerts.innerHTML = `Time is out, there's a empat!` 
        } else {
            alerts.innerHTML = `Time is out, ${playerName} won!`
        }
        play.style.display = 'block'
        gameStatus = false
        return ""
    }
    
    //player with 0 health
    if(player.keyb.shoot == hit.classList[1]){
        console.log(`damage to: ${OtherPlHealth.id}`)
        OtherPl.health -= damage
        if(OtherPl.health <= 0){
            clearInterval(time)
            OtherPlElement.style.backgroundColor = 'yellow'
            alerts.innerHTML = `${playerName} wins`
            play.style.display = 'block'
            gameStatus = false
        }
        OtherPlHealth.style.width = `${OtherPl.health}%`
        OtherPlHealth.innerHTML = `${OtherPl.health}%`
    }
}

function restartValues(){
    maps(choosenMap)
    bulletsOnboard = []
    
    p1.health = 100
    p2.health = 100
    
    alerts.innerHTML = ""
    
    timeDisplay.innerHTML = 'time &rarr; 2:00'
    seconds = 60
    minutes = 1
    timeout = false
    
    lastBulletp1 = 0
    bulletBurstp1 = 0
    lastBulletp2 = 0
    bulletBurstp2 = 0

    gameStatus = true
}

function update(){
    if(gameStatus === true){
        updateKeys(p1)
        updateKeys(p2)
        updatePlayerPos()
        bullets()
    }
    requestAnimationFrame(update)
} update()
