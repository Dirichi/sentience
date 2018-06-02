function randomChoiceFrom(array) {
  let randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex]
}

let Environment = require('../src/environment.js')
let assert = require('assert')

let env = new Environment()
let chaser = { y: 0, attributes: ['y'] }

chaser.up =  () => chaser.y -= 0.001
chaser.down = () => chaser.y += 0.001


let ball = { y: 0, attributes: ['y'] }
ball.move = () => ball.y += randomChoiceFrom([-0.001, 0.001])

env.createSentience([chaser], [ball, chaser], ['up', 'down'])
env.rewardSentience([chaser], () => Math.abs(chaser.y - ball.y) <= 0.001, 2)

describe('Integration', function() {
  it('works together in a beautiful symphony', function() {
    for (var i = 0; i < 1000; i++) {
      env.run(function () { if (i % 100 == 0) { ball.move() } })
    }
  })
})
