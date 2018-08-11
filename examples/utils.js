let buffer = []
let points = []

const MOVEABLE = {
  up() { this.y = Math.max(this.minX, this.y - this.yStep) },
  down() { this.y = Math.min(this.maxX, this.y + this.yStep) },
  left() { this.x = Math.max(this.minY, this.x - this.xStep) },
  right() { this.x = Math.min(this.maxY, this.x + this.xStep) },
  stop() {}
}


function distance(x, y, x2, y2) {
  let squareDistance = ((x - x2) ** 2) + ((y - y2) ** 2)
  return Math.sqrt(squareDistance)
}

function mobilize(object) {
  Object.assign(object, MOVEABLE)
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
  let epsilon = env.agents[0].policy.epsilon.toPrecision(3)
  let reward = (env.agents[0].currentTransition.reward || 0).toPrecision(3)
  text(`Epsilon: ${epsilon}`, 10, 20)
  text(`Reward: ${reward}`, 10, 60)
}
