function distance(x, y, x2, y2) {
  let squareDistance = ((x - x2) ** 2) + ((y - y2) ** 2)
  return Math.sqrt(squareDistance)
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

let chaser = { y: 0.5, x: 0.5 }
let ball = { y: 0.5, x: 0.5 }

let tick = 0
let buffer = new RewardBuffer(500)

let tiler = new Tiler({
  minX: 0,
  minY: 0,
  maxX: 1,
  maxY: 1,
  xTiles: 10,
  yTiles: 10,
  tileRadius: 0.1
})

let points = []

let Moveable = {
  up() { this.y = Math.max(0, this.y - 0.1) },
  down() { this.y = Math.min(1, this.y + 0.1) },
  left() { this.x = Math.max(0, this.x - 0.1) },
  right() { this.x = Math.min(1, this.x + 0.1) },
  stop() {},
}
Object.assign(ball, Moveable)
Object.assign(chaser, Moveable)

function stateFunc() {
  let ballLocationMap = tiler.tileVector(ball.x, ball.y)
  let chaserLocationMap = tiler.tileVector(chaser.x, chaser.y)

  return ballLocationMap.concat(chaserLocationMap)
}

function setup() {
  createCanvas(1000, 500)

  let args = {
    actions: ['up', 'down', 'left', 'right', 'stop'],
    stateFunction: stateFunc,
    stateSize: 200,
    policyType: 'QLVAAgent'
  }
  env.createSentience([chaser], args)

  env.rewardSentience([chaser], () => distance(chaser.x, chaser.y, ball.x, ball.y) < 0.05, 0.5)
  env.rewardSentience([chaser], () => distance(chaser.x, chaser.y, ball.x, ball.y) >= 0.1, -0.1)
  env.rewardSentience([chaser], () => distance(chaser.x, chaser.y, ball.x, ball.y) >= 0.2, -0.1)
  env.rewardSentience([chaser], () => distance(chaser.x, chaser.y, ball.x, ball.y) >= 0.3, -0.1)
  env.rewardSentience([chaser], () => distance(chaser.x, chaser.y, ball.x, ball.y) >= 0.4, -0.1)
  env.rewardSentience([chaser], () => distance(chaser.x, chaser.y, ball.x, ball.y) >= 0.5, -0.1)
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
    fill(0, 255, 0)
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
