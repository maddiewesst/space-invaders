const up = 38
const down = 40
const right = 39
const left = 37
const space = 32

const gameWidth= 400
const gameHeight = 400

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
  enemyWidth : 20,
  cooldown : 0,
  numberEnemies : 16,

}

function setPosition($element, x, y) {
    $element.style.transform = `translate(${x}px, ${y}px)`
}
  
function setSize($element, width) {
    $element.style.width = `${width}px`
    $element.style.height = "auto"
}

function bound(x){
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

function deleteLaser(lasers, laser, $laser) {
  const index = lasers.indexOf(laser)
  lasers.splice(index, 1)

  // $container.removeChild($laser)

  document.querySelectorAll('.laser')[index].remove()
}

function collideRect(rect1, rect2){
  return!(rect2.left > rect1.right || 
    rect2.right < rect1.left || 
    rect2.top > rect1.bottom || 
    rect2.bottom < rect1.top)
}

function createPlayer($container) {
    state.xPos = gameWidth / 2
    state.yPos = gameHeight - 50
    const $player = document.createElement('img')
    $player.src = "assets/spaceship.svg"
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
    state.cooldown = 30
  }
  const $player = document.querySelector(".player")
  setPosition($player, bound(state.xPos), state.yPos-10)
  if (state.cooldown > 0) {
    state.cooldown -= 0.5
  }
}

// Laser
function createLaser($container, x, y) {
  const $laser = document.createElement("img")
  $laser.src = 'assets/laser.png'
  $laser.className = "laser"
  $container.appendChild($laser)
  const laser = {x, y, $laser}
  state.lasers.push(laser)
  setPosition($laser, x, y)
}

function updateLaser($container){
  const lasers = state.lasers
  for(i = 0; i < lasers.length; i++){
    const laser = lasers[i]
    laser.y -= 2
    if (laser.y < 0){
      deleteLaser(lasers, laser, laser.$laser)
    }
    setPosition(laser.$laser, laser.x, laser.y)
    const laserRect = laser.$laser.getBoundingClientRect()
    const enemies = state.enemies
    for(j = 0; j < enemies.length; j++){
      const enemy = enemies[j]
      const enemyRect = enemy.$enemy.getBoundingClientRect()
      if(collideRect(enemyRect, laserRect)){
        deleteLaser(lasers, laser, laser.$laser)
        const index = enemies.indexOf(enemy)

        console.log(index)
        // $container.removeChild(enemy)

        document.querySelectorAll('.enemy')[index].remove()

        enemies.splice(index , 1)
      }
    }
  }
}


function createEnemy($container, x, y) {
  const $enemy = document.createElement("img")
  $enemy.src = 'assets/alien.svg'
  $enemy.className = "enemy"
  $container.appendChild($enemy)
  const enemy = {x, y, $enemy}
  state.enemies.push(enemy)
  setSize($enemy, state.enemyWidth)
  setPosition($enemy, x, y)
}

function updateEnemies($container){
  const dx = Math.sin(Date.now()/1000)*40
  const dy = Math.sin(Date.now()/1000)*30
  const enemies = state.enemies
  for (let i = 0; i < enemies.length; i++){
    const enemy = enemies[i]
    var a = enemy.x + dx
    var b = enemy.y + dy
    setPosition(enemy.$enemy, a, b)
  }
}

function createEnemies($container) {
  for (i = 0; i <= state.numberEnemies/2; i++) {
    createEnemy($container, i*40, 80)
  }
  for (i = 0; i <= state.numberEnemies/2; i++) {
  createEnemy($container, i*40, 120)
  }
  for (i = 0; i <= state.numberEnemies/2; i++) {
    createEnemy($container, i*40, 160)
  }
  for (i = 0; i <= state.numberEnemies/2; i++) {
    createEnemy($container, i*40, 200)
  }
} 

function keyPress(event) {
    if (event.keyCode === right) {
      state.moveRight = true
    } else if (event.keyCode === left) {
      state.moveLeft = true
    } else if (event.keyCode === space) {
      state.shoot = true
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

// Main update function
function update() {
  updatePlayer()
  updateLaser()
  updateEnemies()

  window.requestAnimationFrame(update)
}

const $container = document.querySelector('.game')
createPlayer($container)
createEnemies($container)

// Event listeners 
window.addEventListener('keydown', keyPress)
window.addEventListener('keyup', keyRelease)


update()