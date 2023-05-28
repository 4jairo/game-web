//minesweeper
(function(){
    let inputs = document.querySelectorAll('.rowColInputCont input')
    let inputValueElement = document.querySelectorAll('.rowColInputCont .inputValue')

    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        const inputValueEl = inputValueElement[i]

        inputValueEl.innerHTML = input.value
        input.addEventListener('input', () => {
            inputValueEl.innerHTML = input.value
        })
    }
})()

let colCount
let rowCount
let allTableBoxes
function createTable(){
    colCount = columns.value
    rowCount = rows.value

    let content = '<table id="table">'
    for (let r = 0; r < rowCount; r++) {
        content += '<tr>'
        for (let c = 0; c < colCount; c++) {
            content += `<td column="${c}" row="${r}"></td>`  
        }
        content += '</tr>'
    }
    content += '</table>'
    tableCont.innerHTML = content
    allTableBoxes = document.querySelectorAll('#table tr td')
}

let allMines = []
let difficulty
function createMines(){
    difficulty = Math.ceil(colCount * rowCount * diff.value / 100)
    minesLeft.innerHTML = difficulty
    
    while (allMines.length < difficulty) {
        let r = Math.floor(Math.random() * allTableBoxes.length)

        if(!allMines.includes(allTableBoxes[r])){
            allTableBoxes[r].setAttribute('mine','')
            allMines.push(allTableBoxes[r])
        }
    }
}

let allNoMines
function aroundMinesNumber(){
    allNoMines = document.querySelectorAll('#table tr td:not([mine])')
    for (let i = 0; i < allNoMines.length; i++) {
        const currentBoxCol = parseInt(allNoMines[i].getAttribute('column'))
        const currentBoxRow = parseInt(allNoMines[i].getAttribute('row'))
        let minesAround = 0
        for (let r = -1; r <= 1; r++) {
            for (let c = -1; c <= 1; c++) {
                const aroundBox = document.querySelector(`#table td[column="${currentBoxCol + c}"][row="${currentBoxRow + r}"]`)
                if(aroundBox && aroundBox.getAttribute('mine') !== null){
                    //console.log(aroundBox.getAttribute('mine'))
                    minesAround++
                }
            }
        }
        allNoMines[i].setAttribute('minesaround', minesAround)  
    }
}

let isLMClicked = false
let isRMClicked = false
function doClickeableBoxes(){
    startGame.innerHTML = 'Restart'
    table.addEventListener('contextmenu', (e) => e.preventDefault())
    table.addEventListener('mousedown', (e) => {
        e.button === 0 ? isLMClicked = true : isRMClicked = true
    })
    table.addEventListener('mouseup', (e) => {
        const clickedBox = e.target
        if(clickedBox.tagName === 'TD'){
            switch (`${isLMClicked}-${isRMClicked}`) {
                /*-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-|left|-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-*/
                case 'true-false':
                    if(clickedBox.getAttribute('mine') !== null && clickedBox.getAttribute('flag') === null){ // mine without flag
                        looseGame()
                    } else if(clickedBox.getAttribute('flag') === null){ // no flag
                        clickedBox.getAttribute('minesaround') > 0 ? discoverBox(clickedBox) : checkMinesAround(clickedBox)
                    }
                break;
                /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|left & right|~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
                case 'true-true': 
                    if(clickedBox.getAttribute('mine') !== null){ 
                    // if is mine
                        looseGame()
                    } else if(clickedBox.getAttribute('discovered') !== null && clickedBox.getAttribute('minesaround') > 0){
                    //if (is not mine) and (is discovered and has mines around)
                        checkMinesAround(clickedBox)
                        isLMClicked = false
                        isRMClicked = false
                    }
                break;
                /*======================================|right|========================================*/
                case 'false-true': 
                    if(clickedBox.innerHTML === ''){ //no flag
                        clickedBox.innerHTML = '🚩'
                        clickedBox.setAttribute('flag','')
                        minesLeft.innerHTML = --minesLeft.innerHTML

                    } else if(clickedBox.innerHTML === '🚩'){ // has flag
                        clickedBox.innerHTML = ''
                        clickedBox.removeAttribute('flag')
                        minesLeft.innerHTML = ++minesLeft.innerHTML
                    }
                break
            }
        }
        checkGameStatus()
        e.button === 0 ? isLMClicked = false : isRMClicked = false
    })
}

let discoveredElements = []
function discoverBox(box){
    box.getAttribute('minesaround') > 0 ? box.innerHTML = box.getAttribute('minesaround') : null
    box.setAttribute('discovered','')
    box.style.backgroundColor = 'rgba(200, 200, 200, .4)'
}

function checkMinesAround(box){
    let mine = false
    let flag = 0
    let currentAround = []
    
    const currentBoxCol = parseInt(box.getAttribute('column'))
    const currentBoxRow = parseInt(box.getAttribute('row'))

    for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
            const aroundBox = document.querySelector(`#table td[column="${currentBoxCol + c}"][row="${currentBoxRow + r}"]`)
            if(aroundBox){
                //number of flags
                if(aroundBox.getAttribute('flag') !== null ) flag++

                //mine with no flag (loose)
                if(aroundBox.getAttribute('flag') === null && aroundBox.getAttribute('mine') !== null) mine = true

                //not mine and not flag {minesaround == 0}
                if(aroundBox.getAttribute('flag') === null && aroundBox.getAttribute('mine') === null) currentAround.push(aroundBox)
            }
        }
    }

    if(flag == box.getAttribute('minesaround')){
        if(mine) looseGame()

        for (const item of currentAround) {
            if(!discoveredElements.includes(item)){
                discoveredElements.push(item)
                discoverBox(item)

                if(item.getAttribute('minesaround') == '0' && item !== box) checkMinesAround(item)
            }
        }
    }
}

function checkGameStatus(){ // win
    if(discoveredElements.length === allNoMines.length){
        annoucement.style.display = 'flex'
        annoucementContent.innerHTML = 'you win'
    }
}

function looseGame(){
    annoucement.style.display = 'flex'
    annoucementContent.innerHTML = 'you loose'

    for (const mine of allMines) {
        mine.innerHTML = '💣'
        mine.style.backgroundColor = 'rgba(255, 0, 0, .5)'
    }
}

function restartGame(){
    annoucement.style.display = 'none'
    discoveredElements = []
    allMines = []
}

//start game btn & onload
startGame.addEventListener('click', () => {
    restartGame()
    createTable()
    createMines()
    aroundMinesNumber()
    doClickeableBoxes()
})