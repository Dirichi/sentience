let AgentFactory = require('../src/agent_factory.js')
let Q = require('../src/q.js')
let LinearApproximator = require('../src/linear_approximator.js')
let assert = require('assert')

describe('AgentFactory', function() {
  describe('#create', function() {
    it('creates an agent with a policy and observables', function() {
      let obj = { y: 10, move: () => obj.y += 5 }
      let stateFunc = () => [obj.y]
      let policyDouble = {}

      let agent = AgentFactory.create(obj, stateFunc, ['move'], policyDouble)

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


      let agent = AgentFactory.QLVAAgent(obj, stateFunc, 3, ['move'])
      let policy = agent.policy
      let approximator = policy.approximator

      assert.ok(policy instanceof Q)
      assert.deepEqual(policy.actions, ['move'])

      assert.ok(approximator instanceof LinearApproximator)
      assert.equal(approximator.statesSize, 3)
      assert.equal(approximator.actionsSize, 1)
      assert.deepEqual(agent.state, [5, 10, 10])
    })
  })
})
