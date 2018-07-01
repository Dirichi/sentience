function distance(x, y, x2, y2) {
  let squareDistance = ((x - x2) ** 2) + ((y - y2) ** 2)
  return Math.sqrt(squareDistance)
}

let env = new Environment()
let chaser = { y: 0.1, x: 0.1 }
let tick = 0

let Moveable = {
  up() { this.y = Math.max(0.1, this.y - 0.2) },
  down() { this.y = Math.min(0.9, this.y + 0.2) },
  left() { this.x = Math.max(0.1, this.x - 0.2) },
  right() { this.x = Math.min(0.9, this.x + 0.2) },
  stop() {},
}

Object.assign(chaser, Moveable)

function stateFunc() {
  let stateVec = []

  for (var i = 0; i < 1; i += 0.2) {
    for (var j = 0; j < 1; j+= 0.2) {
      if (chaser.x >= i && chaser.x < i + 0.2 && chaser.y >= j && chaser.y < j + 0.2) {
        stateVec.push(1)
      }
      else {
        stateVec.push(0)
      }
    }
  }

  return stateVec
}

function showGrid() {
  push()
  noFill()
  stroke(255)
  strokeWeight(5)
  for (var i = 0; i < 1; i += 0.2) {
    for (var j = 0; j < 1; j += 0.2) {
      let x = 500 * i
      let y = 500 * j
      rect(x, y, 100, 100)
    }
  }
  pop()
}

function setup() {
  createCanvas(500, 500)

  let args = {
    actions: ['up', 'down', 'left', 'right', 'stop'],
    stateFunction: stateFunc,
    stateSize: 25,
    policyType: 'QLVAAgent'
  }
  env.createSentience([chaser], args)
  env.rewardSentience([chaser], () => distance(chaser.x, chaser.y, 0.9, 0.9) > 0.05, -0.04)
  env.rewardSentience([chaser], () => distance(chaser.x, chaser.y, 0.9, 0.9) <= 0.05, 1)
}

function draw() {
  background(0)
  showGrid()
  gameRules()
  animate()
  env.run()
}

function animate() {
  showStatus()
  fill(255, 0, 0)
  ellipse(500 * chaser.x, 500 * chaser.y, 10)
  fill(0, 255, 0)
  ellipse(500 * 0.9, 500 * 0.9, 10)
}

function gameRules() {
  if (distance(chaser.x, chaser.y, 0.9, 0.9) <= 0.05) {
    chaser.x = 0.1
    chaser.y = 0.1
  }
}

function showStatus() {
  fill(255)
  text(`Epsilon: ${env.agents[0].policy.epsilon}`, 20, 20)
  text(`Current Reward: ${env.agents[0].currentTransition.reward}`, 20, 60)
}
