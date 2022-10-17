const right = 39
const left = 37
const space = 32
const esc = 27
const c = 67
const s = 83
const r = 82
const u = 85

const gameWidth= 500
const gameHeight = 750

let i = 0
let j = 0

const state = {
  xPos : 0,
  yPos : 0,
  spaceshipWidth : 30,  
  moveRight : false,
  moveLeft : false,
  shoot : false,
  lasers : [],
  enemies : [],
  enemyLasers: [],
  enemyWidth : 25,
  cooldown : 0,
  enemyCooldown: 0,
  numberEnemies : 40,
  paused : false,
  gameOver: false,
  lives: 3,
  score: 0,
  gameWon: false,
  start: false,
  direction: true,
}

const body = document.querySelector('body');
const header = document.querySelector('.header');
const pause = document.querySelector('.pause')
const lives = document.querySelector('.lives p')
const score = document.querySelector('.score p')
const gameOver = document.querySelector('.game-over')
const $container = document.querySelector('.game')
const timeEl = document.querySelector(".time p");
const gameWon = document.querySelector('.win')
const start = document.querySelector('.start')
const game = document.querySelector('.game')
const enemyDiv = document.querySelector(".enemy-div");
const enemies = state.enemies


function setPosition($element, x, y) {
    $element.style.transform = `translate(${x}px, ${y}px)`
}
  
function setSize($element, width) {
    $element.style.width = `${width}px`
    $element.style.height = "auto"
}

function bound(x) {
  if (x >= gameWidth-state.spaceshipWidth) {
    state.xPos = gameWidth-state.spaceshipWidth;
    return gameWidth-state.spaceshipWidth
  } if (x <= 0) {
    state.xPos = 0
    return 0
  } else {
    return x
  }
}

function hideGame() {
  game.style.opacity = '0'
  header.style.display = '0'
}

function playSound(file) {
  const audio = new Audio("sounds/" + file + ".wav");
  audio.play();
}

function collideRect(rect1, rect2){
  return!(rect2.left > rect1.right || 
    rect2.right < rect1.left || 
    rect2.top > rect1.bottom || 
    rect2.bottom < rect1.top)
}

// ENEMIES !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

function createEnemy($container, x, y) {
  const $enemy = document.createElement("img")
  $enemy.src = 'assets/enemy2.svg'
  $enemy.className = "enemy"
  enemyDiv.appendChild($enemy)
  const enemyCooldown = Math.floor(Math.random() * 100);
  const enemy = {x, y, $enemy, enemyCooldown}
  state.enemies.push(enemy)
  setSize($enemy, state.enemyWidth)
  setPosition($enemy, x, y)
}

function updateEnemies() {

// const enemies = state.enemies ////
//   for (i = 0; i < enemies.length; i++){
//     const enemy = enemies[i]
//     console.log(enemies.length)

// if (state.direction === true) {
//   enemy.x += 3
// }
// if (state.direction === false) {
//   enemy.y -= 3
// }



    const dx = Math.sin(Date.now()/1000)*40
    const dy = Math.cos(Date.now()/1000)*60
   //const enemies = state.enemies
    for (i = 0; i < enemies.length; i++){
      const enemy = enemies[i]
      var a = enemy.x + dx
      var b = enemy.y + dy
      setPosition(enemy.$enemy, a, b)
     

     // ENEMY LASERS !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      enemy.Cooldown = Math.random(0, 10);
      if (enemy.enemyCooldown == 0) {
          //createEnemyLaser($container, a, b);
          enemy.enemyCooldown = Math.floor(Math.random() * 100) + 100;
      }
      enemy.enemyCooldown -= 0.5;
    }
}
     



// PLAYER !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

function createPlayer($container) {
    state.xPos = gameWidth /2
    state.yPos = gameHeight -40
    const $player = document.createElement('img')
    $player.src = "assets/spacecraft2.svg"
    $player.className = 'player'
    $container.appendChild($player)
    setPosition($player, state.xPos, state.yPos)
    setSize($player, state.spaceshipWidth)
}

function updatePlayer() {
  if (state.moveLeft){
    state.xPos -= 3;
  } if (state.moveRight){
    state.xPos += 3;
  } if (state.shoot && state.cooldown === 0) {
    createLaser($container, state.xPos - state.spaceshipWidth/2, state.yPos)
    state.cooldown = 20
  }
  const $player = document.querySelector(".player")
  setPosition($player, bound(state.xPos), state.yPos-10)
  if (state.cooldown > 0) {
    state.cooldown -= 0.5
  }
}

// LASER !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

function createLaser($container, x, y) {
  const $laser = document.createElement("img")
  $laser.src = 'assets/laser.png'
  $laser.className = "laser"
  $container.appendChild($laser)
  const laser = {x, y, $laser}
  state.lasers.push(laser)
  setPosition($laser, x, y)
}

function updateLaser(){
  const lasers = state.lasers
  for(i = 0; i < lasers.length; i++){
    const laser = lasers[i]
    laser.y -= 4
    if (laser.y < 0){
      deleteLaser(lasers, laser, laser.$laser)
    }
    setPosition(laser.$laser, laser.x, laser.y)
    const laserRect = laser.$laser.getBoundingClientRect()
    //const enemies = state.enemies
    for(j = 0; j < enemies.length; j++){
      const enemy = enemies[j]
      const enemyRect = enemy.$enemy.getBoundingClientRect()
      if(collideRect(enemyRect, laserRect)){
        playSound("bullet")
        deleteLaser(lasers, laser, laser.$laser)
        const index = enemies.indexOf(enemy)
        enemies.splice(index , 1)
        //$container.removeChild(enemy)
        document.querySelectorAll('.enemy')[index].remove()
        state.score += 100
        score.innerHTML = state.score
      }
    }
  }
}

// Enemy Laser
function createEnemyLaser($container, x, y){
  const $enemyLaser = document.createElement("img");
  $enemyLaser.src = "assets/laser-orange.svg";
  $enemyLaser.className = "enemyLaser";
  $container.appendChild($enemyLaser);
  const enemyLaser = {x, y, $enemyLaser};
  state.enemyLasers.push(enemyLaser);
  setPosition($enemyLaser, x, y);
}

function updateEnemyLaser($container){
  const enemyLasers = state.enemyLasers;
  for(let i = 0; i < enemyLasers.length; i++){
    const enemyLaser = enemyLasers[i];
    enemyLaser.y += 2;
    if (enemyLaser.y > gameHeight-30){
      deleteLaser(enemyLasers, enemyLaser, enemyLaser.$enemyLaser);
    }
    const enemyLaserRect = enemyLaser.$enemyLaser.getBoundingClientRect();
    const spaceshipRect = document.querySelector(".player").getBoundingClientRect();
    if(collideRect(spaceshipRect, enemyLaserRect)){
      playSound("shot2");
      deleteLaser(enemyLasers, enemyLaser, enemyLaser.$enemyLaser);

      // lives.removeChild(lives.lastChild);
      // if (!lives.hasChildNodes()) {
      //   state.gameOver = true;
      // }
      state.lives--
      lives.innerHTML = state.lives


      if (state.lives === 0) {
        state.gameOver = true;
        hideGame()
      }
      
    }
    setPosition(enemyLaser.$enemyLaser, enemyLaser.x + state.enemyWidth/2, enemyLaser.y+15);
  }
}

function createEnemies($container) {
  for (i = 0; i < state.numberEnemies/4; i++) {
    createEnemy($container, i*40, 80)
  }
  for (i = 0; i < state.numberEnemies/4; i++) {
  createEnemy($container, i*40, 120)
  }
  // for (i = 0; i < state.numberEnemies/4; i++) {
  //   createEnemy($container, i*40, 160)
  // }
  // for (i = 0; i < state.numberEnemies/4; i++) {
  //   createEnemy($container, i*40, 200)
  // }
} 



function deleteLaser(lasers, laser, $laser) {  
  const index = lasers.indexOf(laser)
  if (index !== -1) {
    lasers.splice(index, 1)  
    $container.removeChild($laser)
  }
}

function keyPress(event) {
  if (event.keyCode === right) {
    state.moveRight = true
  } else if (event.keyCode === left) {
    state.moveLeft = true 
  } else if (event.keyCode === space) {
    state.shoot = true
  } else if (event.keyCode === esc) {
    if (!state.gameOver && !state.gameWon && !state.paused){
      state.paused = true
    } else {
    state.paused = false
    }
  } else if (event.keyCode === s) {
    if (state.start) {
      window.location.reload()
    } else {
      state.start = true
    }
    
  // } else if (event.keyCode === r) {
  //   window.location.reload()
  }
}

function keyRelease(event) {
  if (event.keyCode === right) {
    state.moveRight = false
  } else if (event.keyCode === left) {
    state.moveLeft = false
  } else if (event.keyCode === space) {
    state.shoot = false
  } 
}

let counter = 0
let time = 0
function update() {  
  if (state.start && !state.paused && !state.gameOver) {
    start.style.opacity = '0'
    header.style.opacity = '1'
  updatePlayer()
  updateLaser()
  updateEnemies()
  updateEnemyLaser()
} if (state.gameOver && !state.gameWon) {
  // playSound("game_over");
  gameOver.style.opacity = "1"
} if (state.enemies.length == 0 && !state.gameOver) {
  // playSound("win")
  state.gameWon = true
  hideGame()
  gameWon.style.opacity = "1"
}
if (state.paused) {
  pause.style.opacity = "1"
} else {
  pause.style.opacity = "0"
}
  
  // set timer
  if (state.start && !state.paused) {
  counter++;
  if (counter === 60) {
    counter = 0
    time++
  }
}
displayTime(time);
if (state.gameOver === true || state.gameWon === true) {
  counter = 0
  time = 0
}
requestAnimationFrame(update)
}
function displayTime(second) {
  const min = Math.floor(second / 60);
  const sec = Math.floor(second % 60);
  timeEl.innerHTML = `${min < 10 ? "0" : ""}${min}:${sec < 10 ? "0" : ""}${sec}`;
}


createPlayer($container)
createEnemies($container)
// createEnemyLaser($container)


// Event listeners 
body.addEventListener('keydown', keyPress)
body.addEventListener('keyup', keyRelease)


update()
