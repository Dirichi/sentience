let Agent = require('./agent.js')
let Q = require('./q.js')
let LinearApproximator = require('./linear_approximator.js')
let utils = require('./utils.js')

class AgentFactory {
  static QLVAAgent(object, args) {
    let approximator = new LinearApproximator({
      statesSize: args.stateSize,
      actionsSize: args.actions.length
    })

    let defaultPolicyArgs = { approximator: approximator }
    let policyArgs = Object.assign(defaultPolicyArgs, args)
    let policy = new Q(policyArgs)

    return this._build(object, args.stateFunction, args.actions, policy)
  }

  static build(object, args) {
    return this[args.policyType](object, args)
  }

  static _build(object, stateFunction, actions, policy) {

    return new Agent({
      object: object,
      stateFunction: stateFunction,
      actions: actions,
      policy: policy
    })
  }
}

module.exports = AgentFactory
