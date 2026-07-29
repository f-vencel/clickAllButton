
const buttonFixed = document.querySelector('.button.catch.fixed');
const btnField = document.querySelector('.field');
const winDrop = document.querySelector('.winBefore');
const win = winDrop.nextElementSibling;
const score = document.querySelector('.score');
const scorePoint = document.querySelector('.score .points');

const numOfBtns = document.getElementById('numOfBtns');
const minTime = document.getElementById('minTime');
const maxTime = document.getElementById('maxTime');
const includeRand = document.getElementById('includeRand');


let currentDeleted = 0;
let over = false;
let timeoutPool = [];

const time = {
  start: undefined,
  end: undefined,
  includeRand: undefined
}


const _button = {
  x: buttonFixed.offsetWidth,
  y: buttonFixed.offsetHeight,
  say: 'Click me',
  number: 4
}
let body = {
  x: undefined,
  y: undefined,
  maxX: undefined,
  maxY: undefined,
}


const btnElement = (() => {
  const element = document.createElement('button');
  element.className = 'button catch';

  const hitSpanCount = getComputedStyle(btnField).getPropertyValue('--hit-span-count');
  
  for (let i = 0; i < hitSpanCount; i++) {
    const span = document.createElement('span');
    span.className = 'hit-span';
    span.style.setProperty('--i', i);
  
    const inner = document.createElement('span');
    inner.className = 'inner';
    span.appendChild(inner);
  
    element.appendChild(span);
  }
  element.appendChild(document.createTextNode(_button.say));

  return element;
})();




// event listeners
function setNumOfBtns() {
  const prev = _button.number;
  _button.number = Number(numOfBtns.value);
  const diff = Math.max(0, numOfBtns.value - prev);
  updateScore();

  for (let i = 0; i < diff; i++) {
    placeButton(btnElement.cloneNode(true));
  }
  if (diff < 0) {
    for (let i = 0; i < -diff; i++) {
      btnField.removeChild(btnField.lastChild);
    }
  }
}
function calcTime() {
  time.start = Number(minTime.value) * 1000;
  time.end = Number(maxTime.value) * 1000;
  time.diff = Math.max(200, time.end - time.start);
  console.log('diff', time.diff);
}
function incRnd() {
  time.includeRand = includeRand.checked;
  console.log('rnd', time.includeRand ? "on" : "off");
  time.scale = () => time.includeRand ? random() : 1;
}
function onResize() {
  body.x = btnField.offsetWidth;
  body.y = btnField.offsetHeight;
  body.maxX = body.x - _button.x;
  body.maxY = body.y - _button.y;
}

// set up
window.addEventListener("onresize", onResize);

numOfBtns.addEventListener("change", setNumOfBtns);
minTime.addEventListener("change", calcTime);
maxTime.addEventListener("change", calcTime);
includeRand.addEventListener("change", incRnd);

onResize();
setNumOfBtns();
calcTime();
incRnd();


function randomizeButtonPosition(button) {
  const _random = {
    x: Math.floor(random() * body.maxX),
    y: Math.floor(random() * body.maxY)
  }

  button.style.left = _random.x + 'px';
  button.style.top = _random.y + 'px';
}
function random() {
  let r = [Math.random(), Math.random(), Math.random(), Math.random()];
  return r[Math.floor(Math.random() * 4)];
}


function createButtons() {
  updateScore();

  btnField.textContent = '';

  for (let i = 0; i < _button.number; i++) {
    placeButton(btnElement.cloneNode(true));
  }
}

function restartButtons() {
  timeoutPool.forEach(id => clearTimeout(id));
  timeoutPool = [];
  over = false;
  currentDeleted = 0;
  updateScore();

  [...btnField.children].forEach(button => {
    randomizeButtonPosition(button);

    makeButtonAppear(button);
  });
}

function makeButtonDisAppear(button) {
  button.classList.toggle('hit-effect');
}
function makeButtonAppear(button) {
  button.classList.toggle('hit-effect');
}

function onButtonPress(e, button) {
  currentDeleted++;
  updateScore();
  makeButtonDisAppear(button);
  scheduleReappear(button);
}
function scheduleReappear(button) {
  console.log(currentDeleted, _button.number);

  if (currentDeleted === _button.number) {
    over = true;
    winButtons();
  }
  else {
    let t = time.start + time.diff * (currentDeleted / _button.number) * time.scale();
    console.log('time', t);
    timeoutPool.push(setTimeout(() => {
      if (!over) {
        currentDeleted--;
        updateScore();
        randomizeButtonPosition(button);

        makeButtonAppear(button); 
      }
    }, t));
  }
}

function placeButton(button) {
  randomizeButtonPosition(button);

  button.onmousedown = (e) => {
    e.preventDefault();
    onButtonPress(e, button);    
  };

  btnField.appendChild(button);
}

function winButtons() {
  console.log('win');
  winDrop.style.display = 'block';
  win.style.display = 'flex';

  winDrop.onclick = () => {
    if (confirm('restart ?')) {
      winDrop.style.display = 'none';
      win.style.display = 'none';

      restartButtons();
    }
  }
}

function updateScore() {
  score.style.setProperty('--score-percentage', 100 * currentDeleted / _button.number + '%');
  scorePoint.innerHTML = currentDeleted + ' / ' + _button.number;
}

createButtons();

