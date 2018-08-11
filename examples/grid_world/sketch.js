function distance(x, y, x2, y2) {
  let squareDistance = ((x - x2) ** 2) + ((y - y2) ** 2)
  return Math.sqrt(squareDistance)
}

class Cell {
  constructor(xstart, xlength, ystart, ylength, value) {
    this.xstart = xstart
    this.xlength = xlength
    this.ystart = ystart
    this.ylength = ylength
    this.value = value
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
    this.initialCell = this.cells[0]
    this.finalCell = this.cells[this.size - 1]
  }

  initCells() {
    let xstep = (this.xend - this.xstart) / this.xsize
    let ystep = (this.yend - this.ystart) / this.ysize

    for (var i = this.xstart; i < this.xend; i += xstep) {
      for (var j = this.ystart; j < this.yend; j+= ystep) {
        let cell = new Cell(i, xstep, j, ystep, 0)
        this.cells.push(cell)
      }
    }

    this.cells[this.size - 1].setValue(1)
    this.cells[5].setValue(-1)
    this.cells[18].setValue(-1)
    this.cells[7].setValue(-1)
    this.cells[21].setValue(-1)
    this.cells[16].setValue(-1)
  }

  locationIndex(x, y) {
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

let grid = new Grid(5, 5, 0, 500, 0, 500)

let env = new Environment()
let agent = { y: 50, x: 50, size: 10 }

let Moveable = {
  up() { this.y = Math.max(50, this.y - 100) },
  down() { this.y = Math.min(450, this.y + 100) },
  left() { this.x = Math.max(50, this.x - 100) },
  right() { this.x = Math.min(450, this.x + 100) }
}
Object.assign(agent, Moveable)

function runGridAgentInteraction() {
  if (grid.locationCell(agent.x, agent.y) == grid.finalCell) {
    let destinationCell = grid.initialCell
    agent.x = destinationCell.xstart + (destinationCell.xlength / 2)
    agent.y = destinationCell.ystart + (destinationCell.ylength / 2)
  }
}

function sentienceInit() {
  let sentienceArgs = {
    actions: ['up', 'down', 'left', 'right'],
    stateFunction: () => grid.locationVector(agent.x, agent.y),
    stateSize: 25,
    policyType: 'QLVAAgent'
  }

  let rewardArgs = {
    condition: () => true,
    rewardFunction: () => grid.locationCell(agent.x, agent.y).value
  }

  env.createSentience([agent], sentienceArgs)
  env.rewardSentience([agent], rewardArgs)
}

function setup() {
  createCanvas(1000, 500)
  sentienceInit()
}

function draw() {
  background(0)
  env.run(animate)
}

function animate() {
  showStatus()
  grid.animate()
  animateAgent()
  runGridAgentInteraction()
}

function animateAgent() {
  push()
  fill(0, 0, 255)
  ellipse(agent.x, agent.y, agent.size)
  pop()
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

function plotReward(points, min = -0.5, max = 0, xstart = 500, xend = 980, ystart = 480, yend = 20) {
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
  let epsilon = env.agents[0].policy.epsilon.toPrecision(3)
  let reward = (env.agents[0].currentTransition.reward || 0).toPrecision(3)
  text(`Epsilon: ${epsilon}`, 10, 20)
  text(`Reward: ${reward}`, 10, 60)
}
