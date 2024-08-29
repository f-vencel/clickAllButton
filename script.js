let _random, r;

const buttonFixed = document.querySelector('.button.catch.fixed');
const field = document.querySelector('.field');
const winDrop = document.querySelector('.winBefore');
const win = winDrop.nextElementSibling;
const score = document.querySelector('.score .load');


let currentDeleted = 0;
let over = false;
let timeoutPool = [];
const time = {
  start: 5000,
  end: 20000,
  includeRand: true
}
time.diff = time.end - time.start;
time.scale = () => time.includeRand ? random() : 1;


const _button = {
  x: buttonFixed.offsetWidth,
  y: buttonFixed.offsetHeight,
  say: 'Click me',
  number: 20
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

function randomize(button) {
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
  const element = document.createElement('button');
  element.className = 'button catch';
  element.innerHTML = _button.say;

  for (let i = 0; i < _button.number; i++) {
    buttonFunction(element.cloneNode(true));
  }
}

function restartButtons() {
  score.style.setProperty('border-right-width', '2px');

  over = false;
  currentDeleted = 0;
  changeScore(currentDeleted);

  [...field.children].forEach(button => {
    randomize(button);
    button.style.display = 'inline-block';
  });
}

function buttonFunction(button) {
  randomize(button);

  button.onmousedown = (e) => {
    currentDeleted++;
    changeScore(currentDeleted);

    e.preventDefault();

    button.style.display = 'none';
    if (currentDeleted === _button.number) {
      over = true;
      winButtons();
    }
    else {
      let t = time.start + time.diff * (currentDeleted / _button.number) * time.scale()
      timeoutPool.push(setTimeout(() => {
        if (!over) {
          currentDeleted--;
          changeScore(currentDeleted);
          randomize(button);
          button.style.display = 'inline-block';
        }
      }, t));
    }
  };

  field.appendChild(button);
}

function winButtons() {
  score.style.setProperty('border-right-width', '0');

  console.log('win');
  winDrop.style.display = 'block';
  win.style.display = 'flex';

  winDrop.onclick = () => {
    if (confirm('restart ?')) {
      winDrop.style.display = 'none';
      win.style.display = 'none';

      timeoutPool.forEach(id => clearTimeout(id));
      timeoutPool = [];

      restartButtons();
    }
  }
}

function changeScore(sc) {
  score.style.setProperty('width', 100 * sc / _button.number + '%');
}

createButtons();

