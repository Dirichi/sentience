function randomChoiceFrom(array) {
  let randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex]
}

let Environment = require('../src/environment.js')
let assert = require('assert')

let env = new Environment()
let chaser = { y: 10, attributes: ['y'] }

chaser.up =  () => chaser.y -= 5
chaser.down = () => chaser.y += 5


let ball = { y: 10, attributes: ['y'] }
ball.move = () => ball.y += randomChoiceFrom([-5, 5])

env.createSentience([chaser], [ball, chaser], ['up', 'down'])
env.rewardSentience([chaser], () => chaser.y == ball.y, 2)

describe('Integration', function() {
  it('works together in a beautiful symphony', function() {
    for (var i = 0; i < 1000000; i++) {  env.run(function () {
      console.log(chaser.y - ball.y)
      ball.move()
    }) }
  })
})
