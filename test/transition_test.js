let Transition = require('../src/transition.js')
let assert = require('assert')

describe('Transition', function() {
  describe('#incrementReward', function() {
    it('increments reward', function() {
      let transition = new Transition({reward: 0})
      transition.incrementReward(2)

      assert.equal(transition.reward, 2)
    })
  })
})
