let AgentFactory = require('../src/agent_factory.js')
let Q = require('../src/q.js')
let LinearValueApproximator = require('../src/linear_value_approximator.js')
let assert = require('assert')

describe('AgentFactory', function() {
  describe('#create', function() {
    it('creates an agent with a policy and observables', function() {
      let obj = { y: 10, move: () => true }
      let observable = { y: 10, attributes: ['y'] }
      let policyDouble = {}

      let agent = AgentFactory.create(obj, [observable], ['move'], policyDouble)

      assert.deepEqual(agent.state, [10])
      assert.equal(agent.policy, policyDouble)
      assert.deepEqual(agent.actions, ['move'])
    })
  })

  describe('#QLVAAgent', function() {
    it('creates an agent with a Q policy and LVA approximation', function() {
      let obj = { y: 10, x: 5, move: () => true, attributes: ['x', 'y'] }
      let observable = { y: 10, attributes: ['y'] }

      let agent = AgentFactory.QLVAAgent(obj, [obj, observable], ['move'])
      let policy = agent.policy
      let approximator = policy.approximator

      assert.ok(policy instanceof Q)
      assert.deepEqual(policy.actions, ['move'])

      assert.ok(approximator instanceof LinearValueApproximator)
      assert.equal(approximator.statesSize, 3)
      assert.equal(approximator.actionsSize, 1)
    })
  })
})
