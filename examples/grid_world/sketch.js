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
let agent = { x: 50, y: 50, minX: 50, maxX: 450, minY: 50, maxY: 450, xStep: 100, yStep: 100, size: 10 }

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
  mobilize(agent)
    canvas = createCanvas(1000, 500);
    canvas.parent('sketch-holder');
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
  showRewardProgress()
}

function animateAgent() {
  push()
  fill(0, 0, 255)
  ellipse(agent.x, agent.y, agent.size)
  pop()
}
