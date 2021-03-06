let Agent = require('../src/agent.js')
let assert = require('assert')
let sinon = require('sinon')

describe('Agent', function() {
  describe('#state', function() {
    it('calls the passed in state function', function() {
      let stateFunc = () => [1, 3]
      let agent = new Agent({ stateFunction: stateFunc })

      assert.deepEqual(agent.state, [1, 3])
    })
  })

  describe('#beginTransition', function() {
    it('creates and stores a new Transition', function() {
      let stateFunc = () => [1, 3]
      let policy = { choose: (state) => 'up' }
      let obj = { y: 2 }
      obj.up = () => obj.y += 1

      let agent = new Agent({ object: obj, stateFunction: stateFunc, policy: policy })
      agent.beginTransition()
      let transition = agent.currentTransition

      assert.deepEqual(transition.state, [1, 3])
      assert.equal(transition.action, 'up')
      assert.equal(transition.reward, 0)
    })

    it('performs the action suggested by its policy', function() {
      let stateFunc = () => [1, 3]
      let policy = { choose: (state) => 'up' }
      let obj = { y: 2 }
      obj.up = () => obj.y += 1

      let agent = new Agent({ object: obj, stateFunction: stateFunc, policy: policy })
      agent.beginTransition()

      assert.equal(obj.y, 3)
    })
  })

  describe('#rewardCurrentTransition', function() {
    it('increments the reward of the currentTransition', function() {
      let agent = new Agent({})
      let incrementFunc = sinon.fake()
      agent.currentTransition = { incrementReward: incrementFunc }
      agent.rewardCurrentTransition(2)

      assert(incrementFunc.calledWith(2))
    })
  })

  describe('#completeTransition', function() {
    it('completes the tranisition', function() {
      let completeFunc = sinon.fake()
      let updateFunc = sinon.fake()

      let stateFunc = () => [1, 3]
      let policy = { bestChoice: (state) => 'up', update: updateFunc }
      let agent = new Agent({ stateFunction: stateFunc, policy: policy })

      agent.currentTransition = { complete: completeFunc }
      agent.completeTransition()

      assert(completeFunc.calledWith([1, 3], 'up'))
      assert(updateFunc.calledWith(agent.currentTransition))
    })
  })
})
