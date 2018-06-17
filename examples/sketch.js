position_hash = {
  x0y0: 0,
  x1y0: 0,
  x2y0: 1,
  x3y0: 0,
  x4y0: 0,
  x0y1: 0,
  x1y1: 0,
  x2y1: 1,
  x3y1: 0,
  x4y1: 0,
  x0y2: 0,
  x1y2: 0,
  x2y2: 1,
  x3y2: 0,
  x4y2: 0,
  x0y3: 0,
  x1y3: 0,
  x2y3: 1,
  x3y3: 0,
  x4y4: 0,
  x0y4: 0,
  x1y4: 0,
  x2y4: 1,
  x3y4: 0,
  x4y4: 0,
}

positions = Object.keys(position_hash)


function allStates() {
  positions
}

class RewardBuffer {
  constructor(limit) {
    this.limit = limit
    this.values = []
  }
  add(value) {
    if (this.full()) { this.values.shift() }
    this.values.push(value)
  }
  full() {
    return this.values.length == this.limit
  }
  clear() {
    this.values = []
  }
  average() {
    let sum = 0
    this.values.forEach((v) => sum += v)
    return sum / this.values.length
  }
}
let counter = 0
let env = new Environment()
let chaser = {
    y: 0.5,
    x: 0.5,
    x0y0: 0,
    x1y0: 0,
    x2y0: 1,
    x3y0: 0,
    x4y0: 0,
    x0y1: 0,
    x1y1: 0,
    x2y1: 1,
    x3y1: 0,
    x4y1: 0,
    x0y2: 0,
    x1y2: 0,
    x2y2: 1,
    x3y2: 0,
    x4y2: 0,
    x0y3: 0,
    x1y3: 0,
    x2y3: 1,
    x3y3: 0,
    x4y4: 0,
    x0y4: 0,
    x1y4: 0,
    x2y4: 1,
    x3y4: 0,
    x4y4: 0,
    attributes: positions }
let ball = {
    y: 0.5,
    x: 0.5,
    x0y0: 0,
    x1y0: 0,
    x2y0: 1,
    x3y0: 0,
    x4y0: 0,
    x0y1: 0,
    x1y1: 0,
    x2y1: 1,
    x3y1: 0,
    x4y1: 0,
    x0y2: 0,
    x1y2: 0,
    x2y2: 1,
    x3y2: 0,
    x4y2: 0,
    x0y3: 0,
    x1y3: 0,
    x2y3: 1,
    x3y3: 0,
    x4y4: 0,
    x0y4: 0,
    x1y4: 0,
    x2y4: 1,
    x3y4: 0,
    x4y4: 0,
    attributes: positions
  }
let tick = 0
let buffer = new RewardBuffer(500)
let points = []
const NO_MOTION = 0

let Moveable = {
  up() {
    this.y > 0.1 ? this.y -= 0.1 : NO_MOTION
    this.setAttributes()
  },
  down() {
    this.y < 0.9 ? this.y += 0.1 : NO_MOTION
    this.setAttributes()
   },
  left() {
    this.x > 0.1 ? this.x -= 0.1 : NO_MOTION
    this.setAttributes()
  },
  right() {
    this.x < 0.9 ? this.x += 0.1 : NO_MOTION
    this.setAttributes()
  },
  stop() { NO_MOTION },
  setAttributes() {
    xIndex = parseInt(this.x * 5)
    yIndex = parseInt(this.y * 5)
    for (var i = 0; i < positions.length; i++) {
      this[positions[i]] = 0
    }
    this['x' + xIndex + 'y' + yIndex] = 1
  }
}

function setup() {
  createCanvas(1000, 500)
  Object.assign(ball, Moveable)
  Object.assign(chaser, Moveable)
  env.createSentience([chaser], [ball, chaser], ['up', 'down', 'left', 'right', 'stop'])

  env.rewardSentience([chaser], () => distance(chaser.x, chaser.y, ball.x, ball.y) == 0, 0.5)
  env.rewardSentience([chaser], () => distance(chaser.x, chaser.y, ball.x, ball.y) > 0.1, -0.1)
  env.rewardSentience([chaser], () => distance(chaser.x, chaser.y, ball.x, ball.y) > 0.2, -0.1)
  env.rewardSentience([chaser], () => distance(chaser.x, chaser.y, ball.x, ball.y) > 0.3, -0.1)
  env.rewardSentience([chaser], () => distance(chaser.x, chaser.y, ball.x, ball.y) > 0.4, -0.1)
  env.rewardSentience([chaser], () => distance(chaser.x, chaser.y, ball.x, ball.y) > 0.5, -0.1)
}

function draw() {
  background(0)
  env.run(() => animate())
}

function animate() {
  tick += 1
  showStatus()
  fill(255, 0, 0)
  ellipse(500 * chaser.x, 500 * chaser.y, 10)
  fill(0, 0, 255)
  ellipse(500 * ball.x, 500 * ball.y, 10)

  if (tick > 100) {
    if(counter > 3) { counter = 0 }
    let actionChoice = ['up', 'left', 'down', 'right'][counter]
    // let actionChoice = randomChoiceFrom(['up', 'left', 'down', 'right'])
    ball[actionChoice]()
    tick = 0
    counter += 1
  }
  buffer.add(env.agents[0].currentTransition.reward)

  if (buffer.full()) {
    points.push(buffer.average())
    buffer.clear()
  }
  plotReward(points)
}

function distance(x, y, x2, y2) {
  let squareDistance = ((x - x2) ** 2) + ((y - y2) ** 2)
  return Math.sqrt(squareDistance)
}

function randomChoiceFrom(array) {
  let randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex]
}

function plotReward(points, min = -0.5, max = 0.5, xstart = 500, xend = 980, ystart = 480, yend = 20) {
  stroke(255)
  line(xstart, ystart, xstart, yend)
  let xspace = (xend - xstart) / points.length
  let xlocation = xstart

  points.forEach(function(p) {
    x = xlocation
    distanceFromMin = p - min
    normalRange = max - min
    plotRange = yend - ystart
    plotDistance = (distanceFromMin / normalRange) * plotRange
    y = ystart + plotDistance
    fill(0,255,0)
    ellipse(x, y, 3)
    fill(255)
    xlocation += xspace
  })
  line(xstart, ystart, xend, ystart)
  stroke(0)
}

function showStatus() {
  fill(255)
  text(`Epsilon: ${env.agents[0].policy.epsilon}`, 20, 20)
  text(`Current Distance: ${distance(chaser.x, chaser.y, ball.x, ball.y)}`, 20, 40)
  text(`Current Reward: ${env.agents[0].currentTransition.reward}`, 20, 60)
}
