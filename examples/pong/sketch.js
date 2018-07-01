let tick = 0
let env = new Environment()
let buffer = []
let points = []
let missed = 0

let tiler = new Tiler({
  minX: 0,
  minY: 0,
  maxX: 500,
  maxY: 500,
  xTiles: 20,
  yTiles: 20,
  tileRadius: 50
})

class Paddle {
  constructor(args) {
    this.x = args.x
    this.y = args.y
    this.width = args.width
    this.height = args.height
    this.yMin = args.yMin
    this.yMax = args.yMax
    this.yStep = args.yStep
  }

  animate() {
    rect(this.x, this.y, this.width, this.height)
  }

  up() {
    this.y = Math.max(this.y - this.yStep, this.yMin)
  }

  down() {
    this.y = Math.min(this.y + this.yStep, this.yMax - this.height)
  }

  stop() {}

  contains(x, y) {
    return (this.x < x) && (x < this.x + this.width) && (this.y < y) && (y < this.y + this.height)
  }

  follow(y) {
    if ((this.y + this.height / 2) < y) { this.down() }
    else if ((this.y + this.height / 2) >y) {
      this.up()
    }
    else {
      this.up()
    }
  }
}

class Ball {
  constructor(args) {
    this.x = args.x
    this.y = args.y
    this.diameter = args.diameter
    this.vx = args.vx
    this.vy = args.vy
  }

  animate() {
    ellipse(this.x, this.y, this.diameter)
  }

  move() {
    this.x += this.vx
    this.y += this.vy
  }
}

let ball = new Ball({ x: 250, y: 250, diameter: 10, vx: -20, vy: 8 })
let controlPaddle = new Paddle({ x: 0, y: 250, width: 15, height: 250, yMin: 0, yMax: 500, yStep: 250 })
let sentientPaddle = new Paddle({ x: 485, y: 250, width: 15, height: 250, yMin: 0, yMax: 500, yStep: 250 })
let paddles = [controlPaddle, sentientPaddle]

function showGrid() {
  for (var i = 0; i < 500; i += 250) {
    for (var j = 0; j < 500; j += 250) {
      push()
      noFill()
      stroke(255)
      rect(i, j, 250, 250)
      pop()
    }
  }

}

function stateFunc() {
  let ballLocationVec = []
  let sentientPaddleVec = []

  for (var i = 0; i < 500; i += 250) {
    for (var j = 0; j < 500; j += 250) {
      if ((i <= ball.x) && (ball.x < i + 250) && (j <= ball.y) && (ball.y < j + 250)) {
        ballLocationVec.push(1)
      }
      else {
        ballLocationVec.push(0)
      }
    }
  }

  let sentientLocation = sentientPaddle.y + sentientPaddle.height / 2
  for (var i = 0; i < 500; i += 250) {
    if ((i <= sentientLocation) && (sentientLocation < i + 250)) {
      sentientPaddleVec.push(1)
    }
    else {
      sentientPaddleVec.push(0)
    }
  }

  let stateVec = [...ballLocationVec, ...sentientPaddleVec]
  let ballXVector = ball.vx > 0 ? 1 : 0
  let ballYVector = ball.vy > 0 ? 1 : 0
  stateVec.push(ballXVector)
  stateVec.push(ballYVector)
  let binaryRepresentation = parseInt(stateVec.join(''), 2)

  return binaryRepresentation
}

let sentienceArgs = {
  actions: ['up', 'down', 'stop'],
  policyType: 'BasicAgent',
  stateSize: 255,
  stateFunction: stateFunc,
  alpha: 0.1,
  epsilonDecay: 0.9999
}

let rewardArgs = {
  condition: () => ball.x >= (sentientPaddle.x + sentientPaddle.width),
  rewardFunction: function () {
    return -1
  }
}

env.createSentience([sentientPaddle], sentienceArgs)
env.rewardSentience([sentientPaddle], rewardArgs)

function setup() {
  createCanvas(1000, 500)
}

function draw() {
  tick += 1
  background(0)
  fill(255)
  text(`Epsilon: ${env.agents[0].policy.epsilon}`, 20, 20)
  text(`Current Reward: ${env.agents[0].currentTransition.reward}`, 20, 40)
  text(`Alpha: ${env.agents[0].policy.alpha}`, 20, 60)
  text(`Gamma: ${env.agents[0].policy.gamma}`, 20, 80)
  text(`Weights: ${env.agents[0].policy.approximator.weights.valueOf()}`, 20, 100)
  text(`State: ${env.agents[0].state}`, 20, 120)


  ball.animate()
  controlPaddle.animate()
  sentientPaddle.animate()
  showRewardProgress()
  // if (tick % 300 == 0) {
    ball.move()
    controlPaddle.follow(ball.y)
    env.run()
    paddles.forEach((paddle) => runBallPaddleInteraction(ball, paddle))
    runBallBoundaryInteraction(ball)
  // }
  showGrid()
}

function runBallPaddleInteraction(ball, paddle) {
  if (paddle.contains(ball.x, ball.y)) {
      ball.vx *= -1
      fill(255)
  }
}

function runBallBoundaryInteraction(ball) {
  if (ball.y > 500 || ball.y < 0) {
    ball.vy *= -1
  }

  if (ball.x < 0 || ball.x > 500) {
    ball.x = 250
    ball.y = 250
  }
}


function showRewardProgress() {
  buffer.push(env.agents[0].currentTransition.reward)
  if (buffer.length >= 500) {
    let sum = 0
    buffer.forEach((v) => sum += v)
    let avg = sum / buffer.length
    points.push(avg)
    buffer = []
  }

  plotReward(points)
}

function plotReward(points, min = -0.1, max = 0, xstart = 500, xend = 980, ystart = 480, yend = 20) {
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
