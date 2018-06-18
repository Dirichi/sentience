let Environment = require('../src/environment.js')
let assert = require('assert')

let env = new Environment()

let chaser = {
  y: 0,
  up: () => chaser.y = Math.max(0, chaser.y - 0.1),
  down: () => chaser.y = Math.min(1, chaser.y + 0.1)
}

let ball = {
  y: 0,
  up: () => chaser.y = Math.max(0, chaser.y - 0.1),
  down: () => chaser.y = Math.min(1, chaser.y + 0.1)
}

let agentArgs = {
  stateSize: 2,
  stateFunction: () => [ball.y, chaser.y],
  policyType: 'QLVAAgent',
  actions: ['up', 'down']
}

env.createSentience([chaser], agentArgs)
env.rewardSentience([chaser], () => Math.abs(chaser.y - ball.y) <= 0.001, 2)

describe('Integration', function() {
  it('works together in a beautiful symphony', function() {
    for (var i = 0; i < 1000; i++) {
      env.run(function () {
        if (i % 50 == 0) { i % 100 == 50 ? ball.up() : ball.down() }
      })
    }
  })
})
