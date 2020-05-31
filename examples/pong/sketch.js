class Cell {
  constructor(xstart, xlength, ystart, ylength) {
    this.xstart = xstart
    this.xlength = xlength
    this.ystart = ystart
    this.ylength = ylength
  }

  setValue(value) {
    this.value = value
  }

  animate() {
    push()
    noFill()
    stroke(255)
    strokeWeight(2)
    if (this.value > 0) { fill(0, 255, 0) }
    if (this.value < 0) { fill(255, 0, 0) }
    rect(this.xstart, this.ystart, this.xlength, this.ylength)
    pop()
  }
}

class Grid {
  constructor(xsize, ysize, xstart, xend, ystart, yend) {
    this.xsize = xsize
    this.ysize = ysize
    this.xstart = xstart
    this.xend = xend
    this.ystart = ystart
    this.yend = yend
    this.size = xsize * ysize
    this.cells = []
    this.initCells()
  }

  initCells() {
    let xstep = (this.xend - this.xstart) / this.xsize
    let ystep = (this.yend - this.ystart) / this.ysize

    for (var i = this.xstart; i < this.xend; i += xstep) {
      for (var j = this.ystart; j < this.yend; j+= ystep) {
        let cell = new Cell(i, xstep, j, ystep)
        this.cells.push(cell)
      }
    }
  }

  locationIndex(x, y) {
    x = Math.min(x, this.xend - 10)
    x = Math.max(x, this.xstart)
    y = Math.min(y, this.yend - 10)
    y = Math.max(y, this.ystart)

    let xstep = (this.xend - this.xstart) / this.xsize
    let ystep = (this.yend - this.ystart) / this.ysize

    let xIndex = parseInt(x / xstep)
    let yIndex = parseInt(y / ystep)
    let index = (xIndex * this.ysize) + yIndex

    return index
  }

  locationVector(x, y) {
    let index = this.locationIndex(x, y)
    let vector = Array(this.size).fill(0)
    vector[index] = 1

    return vector
  }

  locationCell(x, y) {
    let index = this.locationIndex(x, y)
    return this.cells[index]
  }

  animate() {
    this.cells.forEach((cell) => cell.animate())
  }
}

class Paddle {
  constructor(x, y, width, height, minY, maxY, yStep) {
    this.x = x
    this.y = y
    this.minY = minY
    this.maxY = maxY
    this.yStep = yStep
    this.width = width
    this.height = height
    mobilize(this)
  }

  animate() {
    rect(this.x, this.y, this.width, this.height)
  }

  track(x, y) {
    let midy = this.y + this.height / 2
    if (midy < y) { this.down() }
    else if (midy > y) { this.up() }
    else { this.stop() }
  }

  contains(x, y) {
    let xContained = this.x <= x && x <= (this.x + this.width)
    let yContained = this.y <= y && y <= (this.y + this.height)

    return xContained && yContained
  }
}

class Ball {
  constructor(x, y, diameter, vx, vy) {
    this.x = x
    this.y = y
    this.vx = vx
    this.vy = vy
    this.diameter = diameter
  }

  move() {
    this.x += this.vx
    this.y += this.vy
  }

  animate() {
    this.move()
    ellipse(this.x, this.y, this.diameter)
  }
}

let paddle = new Paddle(50, 250, 10, 100, 0, 400, 100)
let sentientPaddle = new Paddle(440, 250, 10, 100, 0, 400, 100)
let ball = new Ball(250, 250, 10, 10, 8)
let grid = new Grid(10, 5, 0, 500, 0, 500)

let env = new Environment()

function stateFunc() {
  // let sentienceVec = grid.locationVector(sentientPaddle.x, sentientPaddle.y + sentientPaddle.height / 2)
  // let ballVec = grid.locationVector(ball.x, ball.y)
  let paddleLocation = sentientPaddle.y + sentientPaddle.height / 2
  let sentienceIdx = parseInt(paddleLocation / 500)
  let ballIdx = parseInt(ball.y / 500)
  let sentienceVec = Array(5).fill(0)
  let ballVec = Array(5).fill(0)
  sentienceVec[sentienceIdx] = 1
  ballVec[ballIdx] = 1
  let locationVecs = [...sentienceVec, ...ballVec]
  if (ball.vy > 0) { locationVecs.push(1) }
  else { locationVecs.push(0) }

  if (ball.vy > 0) { locationVecs.push(1) }
  else(locationVecs.push(0))

  return locationVecs
}

function sentienceInit() {
  let sentienceArgs = {
    actions: ['up', 'down', 'stop'],
    policyType: 'QLVAAgent',
    stateFunction: stateFunc,
    stateSize: 12,
    alpha: 0.15,
    gamma: 0.75,
    epsilonDecay: 0.999
  }

  let rewardArgsOne = {
    condition: () => sentientPaddle.contains(ball.x, ball.y) && ball.vx < 0,
    rewardFunction: () => 2
  }

  let rewardArgsTwo = {
    condition: () => ball.x > sentientPaddle.x + sentientPaddle.width,
    rewardFunction: () => -2
  }

  let rewardArgsThree = {
    condition: () => ball.x < paddle.x,
    rewardFunction: () => 2
  }

  env.createSentience([sentientPaddle], sentienceArgs)
  env.rewardSentience([sentientPaddle], rewardArgsOne)
  env.rewardSentience([sentientPaddle], rewardArgsTwo)
  env.rewardSentience([sentientPaddle], rewardArgsThree)
}

function runBallBoundaryInteraction() {
  if (ball.x >= 500 && ball.vx > 0) {
    ball.vx *= -1
  }

  if (ball.y >= 500 && ball.vy > 0) {
    ball.vy *= -1
  }

  if (ball.x <= 0 && ball.vx < 0) {
    ball.vx *= -1
  }

  if (ball.y <= 0 && ball.vy < 0) {
    ball.vy *= -1
  }
}

function runBallPaddleInteractions() {
  if (sentientPaddle.contains(ball.x, ball.y) && ball.vx > 0) {
    ball.vx *= -1
  }

  if (paddle.contains(ball.x, ball.y) && ball.vx < 0) {
    ball.vx *= -1
  }
}

function setup() {
  createCanvas(1000, 500)
  sentienceInit()
}

function draw() {
  background(0)
  env.run(gamePlay)
}

function gamePlay() {
  animate()
  runBallBoundaryInteraction()
  runBallPaddleInteractions()
  paddle.track(ball.x, ball.y)
}

function animate() {
  showStatus()
  fill(255)
  sentientPaddle.animate()
  paddle.animate()
  ball.animate()
  grid.animate()
  showRewardProgress()
}
