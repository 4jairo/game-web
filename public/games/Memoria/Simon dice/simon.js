 
let flexcontainer = document.getElementById("flex");
let sequence = [];
let playerSequence = [];
let level = 0;
const colors = ["rojo", "azul", "verde", "amarillo"];

function go() {
  flexcontainer.style.display = "flex";
}

function generateSequence() {
  sequence.push(colors[Math.floor(Math.random() * colors.length)]);
}

function playSequence() {
  let i = 0;
  let interval = setInterval(function () {
    flashButton(sequence[i]);
    i++;
    if (i >= sequence.length) {
      clearInterval(interval);
    }
  }, 1000);
}

function flashButton(color) {
  let button = document.getElementsByClassName(color)[0];
  button.style.opacity = 1;
  setTimeout(function () {
    button.style.opacity = 0.2;
  }, 500);
}

function polsador(button) {
  playerSequence.push(button.classList[0]);
  flashButton(button.classList[0]);
  if (playerSequence.length === sequence.length) {
    checkSequence();
  }
}

function checkSequence() {
  for (let i = 0; i < sequence.length; i++) {
    if (sequence[i] !== playerSequence[i]) {
      gameOver();
      return;
    }
  }

  playerSequence = [];
  level++;
  generateSequence();
  playSequence();
}

function gogame1() {
  level = 1;
  generateSequence();
  playSequence();
}

function gameOver() {
  alert("Ohhh vaya, a la proxima crack :)");
  sequence = [];
  playerSequence = [];
  level = 0;
}
