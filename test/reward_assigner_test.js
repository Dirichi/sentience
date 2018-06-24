let RewardAssigner = require('../src/reward_assigner.js')
let assert = require('assert')
let sinon = require('sinon')

describe('RewardAssigner', function() {
  describe('#assign', function() {
    describe('when the condition is fulfilled', function () {
      it('rewards its agents\' current transition(s)', function() {
        let rewardTransitionFunc = sinon.fake()
        let agent = { rewardCurrentTransition: rewardTransitionFunc }
        let assigner = new RewardAssigner({ agents: [agent], rewardFunction: () => 2, condition: () => true })
        assigner.assign()

        assert(rewardTransitionFunc.calledWith(2))
      })
    })

    describe('when the condition is not fulfilled', function () {
      it('leaves current transition(s) rewards unchanged', function() {
        let rewardTransitionFunc = sinon.fake()
        let agent = { rewardCurrentTransition: rewardTransitionFunc }
        let assigner = new RewardAssigner({ agents: [agent], rewardFunction: () => 2, condition: () => false })
        assigner.assign()

        assert(rewardTransitionFunc.notCalled)
      })
    })
  })
})
