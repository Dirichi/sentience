let Agent = require('./agent.js')
let Q = require('./q.js')
let Observable = require('./observable.js')
let LinearValueApproximator = require('./linear_value_approximator.js')
let utils = require('./utils.js')

class AgentFactory {
  static QLVAAgent(object, observables, actions) {
    let approximator = new LinearValueApproximator({
      statesSize: observables.reduce((acc, o) => acc + o.attributes.length, 0),
      actionsSize: actions.length
    })

    let policy = new Q({ approximator: approximator, actions: actions })

    return this.create(object, observables, actions, policy)
  }

  static create(object, observables, actions, policy) {

    return new Agent({
      object: object,
      observables: this._wrapObservables(observables),
      policy: policy,
      actions: actions
    })
  }

  static _wrapObservables(observables) {
    return observables.map((o) => Object.assign(o, Observable))
  }
}

module.exports = AgentFactory
