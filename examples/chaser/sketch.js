let env = new Environment()

let chaser = { x: 0.5, y: 0.5, xStep: 0.1, yStep: 0.1, minX: 0, maxX: 1, minY: 0, maxY: 1 }
let ball = { x: 0.5, y: 0.5, xStep: 0.1, yStep: 0.1, minX: 0, maxX: 1, minY: 0, maxY: 1 }

let tick = 0

let tiler = new Tiler({
  minX: 0,
  minY: 0,
  maxX: 1,
  maxY: 1,
  xTiles: 10,
  yTiles: 10,
  tileRadius: 0.1
})

function sentienceInit() {
  let sentienceArgs = {
    actions: ['up', 'down', 'left', 'right', 'stop'],
    stateFunction: () => {
      let ballLocationMap = tiler.tileVector(ball.x, ball.y)
      let chaserLocationMap = tiler.tileVector(chaser.x, chaser.y)

      return ballLocationMap.concat(chaserLocationMap)
    },
    stateSize: 200,
    policyType: 'QLVAAgent'
  }

  let rewardArgs = {
    condition: () => true,
    rewardFunction: () => - distance(chaser.x, chaser.y, ball.x, ball.y)
  }

  env.createSentience([chaser], sentienceArgs)
  env.rewardSentience([chaser], rewardArgs)
}

function setup() {
  canvas = createCanvas(1000, 500);
  canvas.parent('sketch-holder');
  mobilize(chaser)
  mobilize(ball)
  sentienceInit()
}

function draw() {
  background(0)
  env.run(() => animate())
}

function animate() {
  showStatus()
  fill(255, 0, 0)
  ellipse(500 * chaser.x, 500 * chaser.y, 10)
  fill(0, 0, 255)
  ellipse(500 * ball.x, 500 * ball.y, 10)
  runBallMotion()
  showRewardProgress()
}

function runBallMotion() {
  tick += 1

  if (tick % 100 == 0) {
    if (tick == 400) { tick = 0 }
    let index = parseInt(tick / 100)
    let actionChoice = ['up', 'left', 'down', 'right'][index]
    ball[actionChoice]()
  }
}

