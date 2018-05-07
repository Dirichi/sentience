let Environment = require('../src/environment.js')
let assert = require('assert')
let sinon = require('sinon')

describe('Environment', function() {
  describe('#createSentience', function () {
    it('creates agents with observables and actions', function () {
      let env = new Environment()
      let observable = { y: 10, attributes: ['y'] }

      let object = { y: 10 }
      object.move = () => object.y += 5

      env.createSentience([object], [observable], ['move'])
      let agent = env.agents[0]

      assert.deepEqual(agent.observables, [observable])
      assert.deepEqual(agent.actions, ['move'])
    })

    it('does not create multiple agents for the same object', function () {
      let env = new Environment()
      let observable = { y: 10, attributes: ['y'] }

      let object = { y: 10 }
      object.move = () => object.y += 5

      env.createSentience([object], [observable], ['move'])

      assert.throws(() => env.createSentience([object], [observable], ['move']),
      /Single objects cannot have .* multiple agents.*/)
    })
  })

  describe('#rewardSentience', function () {
    it('creates a rewardAssigner with agents and conditions', function () {
      let env = new Environment()
      let observable = { y: 10, attributes: ['y'] }

      let object = { y: 10 }
      object.move = () => object.y += 5

      env.createSentience([object], [observable], ['move'])
      env.rewardSentience([object], () => true, 3)

      assert.equal(env.rewardAssigners.length, 1)

      let assigner = env.rewardAssigners[0]
      assert.deepEqual(assigner.agents, env.agents)
      assert.equal(assigner.reward, 3)
      assert.ok(assigner.condition.call())
    })
  })

  describe('#run', function () {
    it('runs a callback', function () {
      let env = new Environment()
      let callback = sinon.fake()
      env.run(callback)

      assert(callback.calledOnce)
    })

    it('runs a single transition', function () {
      let beginFunc = sinon.fake()
      let completeFunc = sinon.fake()
      let assignFunc = sinon.fake()

      let agentListDouble = { beginTransition: beginFunc, completeTransition: completeFunc }
      let assignerListDouble = { assign: assignFunc }

      let env = new Environment(agentListDouble, assignerListDouble)
      env.run()

      assert(beginFunc.calledOnce)
      assert(completeFunc.calledOnce)
      assert(assignFunc.calledOnce)
    })
  })
})
