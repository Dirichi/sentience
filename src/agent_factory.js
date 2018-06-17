let Agent = require('./agent.js')
let Q = require('./q.js')
let LinearApproximator = require('./linear_approximator.js')
let utils = require('./utils.js')

class AgentFactory {
  static QLVAAgent(object, stateFunction, stateSize, actions) {
    let approximator = new LinearApproximator({
      statesSize: stateSize,
      actionsSize: actions.length
    })

    let policy = new Q({ approximator: approximator, actions: actions })

    return this.create(object, stateFunction, actions, policy)
  }

  static create(object, stateFunction, actions, policy) {

    return new Agent({
      object: object,
      stateFunction: stateFunction,
      actions: actions,
      policy: policy
    })
  }
}

module.exports = AgentFactory
