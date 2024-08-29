let _random, r;

const buttonFixed = document.querySelector('.button.catch.fixed');
const field = document.querySelector('.field');
const winDrop = document.querySelector('.winBefore');
const win = winDrop.nextElementSibling;
const score = document.querySelector('.score');
const scorePoint = document.querySelector('.score .points');


let currentDeleted = 0;
let over = false;
let timeoutPool = [];
const time = {
  start: 5000,
  end: 100000,
  includeRand: false
}
time.diff = time.end - time.start;
time.scale = () => time.includeRand ? random() : 1;


const _button = {
  x: buttonFixed.offsetWidth,
  y: buttonFixed.offsetHeight,
  say: 'Click me',
  number: 4
}
let body = {
  x: field.offsetWidth,
  y: field.offsetHeight,
}
body.maxX = body.x - _button.x;
body.maxY = body.y - _button.y;

window.onresize = (e) => {
  body.x = field.offsetWidth;
  body.y = field.offsetHeight;
  body.maxX = body.x - _button.x;
  body.maxY = body.y - _button.y;
};

console.log(body)

function randomizeButtonPosition(button) {
  _random = {
    x: Math.floor(random() * body.maxX),
    y: Math.floor(random() * body.maxY)
  }

  button.style.left = _random.x + 'px';
  button.style.top = _random.y + 'px';
}
function random(depth) {
  r = [Math.random(), Math.random(), Math.random(), Math.random()];
  r = r[Math.floor(Math.random() * 4)];

  if (arguments.length === 0) return random(3);
  else if (depth === 0) return r;
  else return random(depth - 1);
}


function createButtons() {
  changeScore();

  const element = document.createElement('button');
  element.className = 'button catch';

  const hitSpanCount = getComputedStyle(field).getPropertyValue('--hit-span-count');

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

  for (let i = 0; i < _button.number; i++) {
    buttonFunction(element.cloneNode(true));
  }
}

function restartButtons() {
  timeoutPool.forEach(id => clearTimeout(id));
  timeoutPool = [];
  over = false;
  currentDeleted = 0;
  changeScore();

  [...field.children].forEach(button => {
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
  changeScore();

  makeButtonDisAppear(button);

  scheduleReappear(button);
}
function scheduleReappear(button) {
  if (currentDeleted === _button.number) {
    over = true;
    winButtons();
  }
  else {
    let t = time.start + time.diff * (currentDeleted / _button.number) * time.scale();
    console.log(t);
    timeoutPool.push(setTimeout(() => {
      if (!over) {
        currentDeleted--;
        changeScore();
        randomizeButtonPosition(button);

        makeButtonAppear(button); 
      }
    }, t));
  }
}

function buttonFunction(button) {
  randomizeButtonPosition(button);

  button.onmousedown = (e) => {
    e.preventDefault();
    onButtonPress(e, button);    
  };

  field.appendChild(button);
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

function changeScore() {
  score.style.setProperty('--score-percentage', 100 * currentDeleted / _button.number + '%');

  scorePoint.innerHTML = currentDeleted + ' / ' + _button.number;
}

createButtons();

