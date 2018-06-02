let env = new Environment()
let chaser = { y: 0.5, x: 0.5, attributes: ['x', 'y'] }
let ball = { y: 0.5, x: 0.5, attributes: ['x', 'y'] }
let tick = 0

function setup() {
  createCanvas(500, 500)

  ball.up =  () => { ball.y > 0.1 ? ball.y -= 0.1 : console.log('out of bounds') }
  ball.down = () => { ball.y < 0.9 ? ball.y += 0.1 : console.log('out of bounds') }
  ball.left =  () => { ball.x > 0.1 ? ball.x -= 0.1 : console.log('out of bounds') }
  ball.right = () => { ball.x < 0.9 ? ball.x += 0.1 : console.log('out of bounds') }

  chaser.up =  () => { chaser.y > 0.1 ? chaser.y -= 0.1 : console.log('out of bounds') }
  chaser.down = () => { chaser.y < 0.9 ? chaser.y += 0.1 : console.log('out of bounds') }
  chaser.left =  () => { chaser.x > 0.1 ? chaser.x -= 0.1 : console.log('out of bounds') }
  chaser.right = () => { chaser.x < 0.9 ? chaser.x += 0.1 : console.log('out of bounds') }
  chaser.chill = () => { }

  env.createSentience([chaser], [ball, chaser], ['up', 'down', 'left', 'right', 'chill'])
  env.rewardSentience([chaser], () => distance(chaser.x, chaser.y, ball.x, ball.y) > 0, -0.5)
  env.rewardSentience([chaser], () => distance(chaser.x, chaser.y, ball.x, ball.y) > 0.1, -0.5)
  env.rewardSentience([chaser], () => distance(chaser.x, chaser.y, ball.x, ball.y) > 0.2, -0.5)
  env.rewardSentience([chaser], () => distance(chaser.x, chaser.y, ball.x, ball.y) > 0.3, -0.5)
}

function draw() {
  background(0)

  env.run(() => animate())
}

function animate() {
  tick += 1
  text(`Epsilon: ${env.agents[0].policy.epsilon}`, 20, 20)
  text(`Current Distance: ${distance(chaser.x, chaser.y, ball.x, ball.y)}`, 20, 40)
  text(`Current Reward: ${env.agents[0].currentTransition.reward}`, 20, 60)
  text(`Weights: ${env.agents[0].policy.approximator.weights.valueOf()}`, 20, 80)

  fill(255, 0, 0)
  ellipse(500 * chaser.x, 500 * chaser.y, 10)
  fill(0, 0, 255)
  ellipse(500 * ball.x, 500 * ball.y, 10)

  if (tick % 100 == 0) {
    let actionChoice = randomChoiceFrom(['up', 'down', 'left', 'right'])
    ball[actionChoice]()
  }
}

function distance(x, y, x2, y2) {
  let squareDistance = ((x - x2) ** 2) + ((y - y2) ** 2)
  return Math.sqrt(squareDistance)
}

function randomChoiceFrom(array) {
  let randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex]
}
