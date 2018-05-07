let RewardAssigner = require('../src/reward_assigner.js')
let assert = require('assert')
let sinon = require('sinon')

describe('RewardAssigner', function() {
  describe('#assign', function() {
    describe('when the condition is fulfilled', function () {
      it('rewards its agents\' current transition(s)', function() {
        let rewardFunc = sinon.fake()
        let agent = { rewardCurrentTransition: rewardFunc }
        let assigner = new RewardAssigner({ agents: [agent], reward: 2, condition: () => true })
        assigner.assign()

        assert(rewardFunc.calledWith(2))
      })
    })

    describe('when the condition is not fulfilled', function () {
      it('leaves current transition(s) rewards unchanged', function() {
        let rewardFunc = sinon.fake()
        let agent = { rewardCurrentTransition: rewardFunc }
        let assigner = new RewardAssigner({ agents: [agent], reward: 2, condition: () => false })
        assigner.assign()

        assert(rewardFunc.notCalled)
      })
    })
  })
})
