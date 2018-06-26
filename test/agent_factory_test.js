let AgentFactory = require('../src/agent_factory.js')
let Q = require('../src/q.js')
let LinearApproximator = require('../src/linear_approximator.js')
let assert = require('assert')

describe('AgentFactory', function() {
  describe('#_build', function() {
    it('creates an agent with a policy and observables', function() {
      let obj = { y: 10, move: () => obj.y += 5 }
      let stateFunc = () => [obj.y]
      let policyDouble = {}

      let agent = AgentFactory._build(obj, stateFunc, ['move'], policyDouble)

      assert.deepEqual(agent.state, [10])
      assert.equal(agent.policy, policyDouble)
      assert.deepEqual(agent.actions, ['move'])
    })
  })

  describe('#QLVAAgent', function() {
    it('creates an agent with a Q policy and LVA approximation', function() {
      let obj = { y: 10, x: 5, move: () => obj.y += 5 }
      let observable = { y: 10}
      let stateFunc = () => [obj.x, obj.y, observable.y]

      let agent = AgentFactory.QLVAAgent(obj, {
        stateFunction: stateFunc,
        stateSize: 3,
        actions: ['move']
      })

      let policy = agent.policy
      let approximator = policy.approximator

      assert.ok(policy instanceof Q)
      assert.deepEqual(policy.actions, ['move'])
      assert.ok(typeof policy.alpha == 'number')
      assert.ok(typeof policy.epsilon == 'number')
      assert.ok(typeof policy.epsilonDecay == 'number')
      assert.ok(typeof policy.gamma == 'number')

      assert.ok(approximator instanceof LinearApproximator)
      assert.equal(approximator.statesSize, 3)
      assert.equal(approximator.actionsSize, 1)

      assert.deepEqual(agent.state, [5, 10, 10])
    })

    it('creates an agent with a Q policy, Linear approximator from passed in args', function() {
      let obj = { y: 10, x: 5, move: () => obj.y += 5 }
      let observable = { y: 10}
      let stateFunc = () => [obj.x, obj.y, observable.y]

      let agent = AgentFactory.QLVAAgent(obj, {
        stateFunction: stateFunc,
        stateSize: 3,
        actions: ['move'],
        alpha: 0.15,
        epsilon: 0.85,
        epsilonDecay: 0.99,
        gamma: 0.7
      })

      let policy = agent.policy
      let approximator = policy.approximator

      assert.ok(policy instanceof Q)
      assert.deepEqual(policy.actions, ['move'])
      assert.ok(policy.alpha == 0.15)
      assert.ok(policy.epsilon == 0.85)
      assert.ok(policy.epsilonDecay == 0.99)
      assert.ok(policy.gamma == 0.7)

      assert.ok(approximator instanceof LinearApproximator)
      assert.equal(approximator.statesSize, 3)
      assert.equal(approximator.actionsSize, 1)

      assert.deepEqual(agent.state, [5, 10, 10])
    })
  })
})
