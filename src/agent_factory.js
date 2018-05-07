let Agent = require('./agent.js')

class AgentFactory {

  build(object, observables, actions) {

    let newAgentArgs = {
      object: object,
      observables: observables,
      policy: 'nothing for now', //refactor to allow passing in policy
      actions: actions
    }

    return new Agent(newAgentArgs)
  }
}

module.exports = AgentFactory
