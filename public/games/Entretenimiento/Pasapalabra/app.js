let alfabet = [
    /*---------------
    0.- letter
    1.- question
    2,3,4.- response
    ----------------*/
    ['a','A qué llegan el contratador y empleado al firmar el contrato?','acuerdo'],
    ['b','Incentivo monetario por rendimiento','bono','bonificación'],
    ['c','Princial norma a nivel interno, por debajo de la normativa de la UE','constitución española', 'constitución'],
    ['d','pausa en el trabajo para recuperar fuerzas','descanso'],
    ['e','Reunión profesional para obtener empleo','entrevista'],
    ['f','Liquidación de un contrato','finiquito'],
    ['g','certificado que acredita los conocimientos al acabar un curso','graduado','graduación'],
    ['h','Distribución de las horas destinadas a una actividad de trabajo','horario'],
    ['i','Pago por despido injusto','indemnización'],
    ['j','Cantidad de dinero que gana un trabajador','jornal'],
    ['l','Conjunto de leyes que regula algo','legislación'],
    ['m','(contiene la m) Manera para que los mayores de 16 hagan legalmente papel de adulto antes de cumplir 18','emancipación','emancipar'],
    ['n','Discusión de los términos y condiciones a la hora de contrato','negociación','negociar'],
    ['o','Deberes del trabajador','obligaciones','obligación'],
    ['p','(contiene la p) Tipo de trabajo para la obtención de experiencia','prácticas','práctica'],
    ['q','pago de salario cada 15 días','quincena'],
    ['r','sinónimo de sueldo, retribución, premio','remuneración'],
    ['s','entrega de bienes sin la obligación de un reembolso','subvención'],
    ['t','trabajo a discancia','teletrabajo'],
    ['u','(contiene la u, + de 1 palabra) persona representate de un menor de edad en los actos que no pueda realizar por sí misma','tutor legal'],
    ['v','tiempo libre remunerado','vacaciones','vacación'],
    ['w','trabajo en inglés, xd','work'],
    ['x','(contiene la x) qué se realiza al ampliar el tiempo de un contrato','extensión'],
    ['y','(contiene la y)acción de manera desinteresada para evitar situaciones de riesgo','ayuda','ayudas'],
    ['z','(3 palabras) área destinada para realzar varias tareas','zona de trabajo'],
]


let rotation = 0
let delay = 0
alfabet.forEach(letter => {
    delay += 20
    setTimeout(() => {
        container.innerHTML += `
        <div class="letter" style="transform: translateX(-50%) rotate(${rotation}deg)">
            <p style="transform: rotate(-${rotation}deg)">${letter[0]}</p>
        </div>`
        rotation += 360 / alfabet.length
    }, delay)
});

let currentLetter = 0
let compare = false
let correct = 0
let falso = 0
let letterElement

//comprobar y comenzar
start.addEventListener('click', comparar)

respuesta.addEventListener('keypress', (e) => {
    if(e.key == 'Enter') comparar() 
})

function comparar(){
    letterElement = document.querySelectorAll('.letter')
    start.innerHTML = 'comprovar'
    
    function nextLetter(){
        letterElement[currentLetter].classList.add('noResponse') 
        question.innerHTML = alfabet[currentLetter][1]

        if(alfabet[currentLetter][2] !== undefined){
            respuesta.placeholder = `pista: ${alfabet[currentLetter][2].length} letra/s`
        }

        compare = !compare
        marcador.innerHTML = `✔️:${correct}  ❌:${falso}`
    }

    if(compare){
        //console.log(respuesta.value, alfabet[currentLetter][2], alfabet[currentLetter][3], alfabet[currentLetter][4])
        if(
            respuesta.value == alfabet[currentLetter][2] ||
            respuesta.value == alfabet[currentLetter][3] ||
            respuesta.value == alfabet[currentLetter][4]
        ){
            letterElement[currentLetter].classList.replace('noResponse', 'correct')
            correct++
        } else {
            letterElement[currentLetter].classList.replace('noResponse', 'error')
            falso++

            errorResponse.innerHTML = `respuesta correcta: ${alfabet[currentLetter][2]}`

            setTimeout(() => {
                errorResponse.innerHTML = ''
            },3500)
        }
        nextLetter()
        respuesta.value = ""
        currentLetter++
    }
    nextLetter()
}

restart.addEventListener('click', () => {
    start.innerHTML = 'comenzar'
    
    letterElement.forEach(letter => {
        letter.classList.remove('error','noResponse','correct')
    })
    currentLetter = 0
    compare = false
    correct = 0
    falso = 0
    marcador.innerHTML = `✔️:${correct}  ❌:${falso}`
    question.innerHTML = ""
})