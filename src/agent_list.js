let AgentFactory = require('./agent_factory.js')

class AgentList {
  // refactor to inherit from a typedList class
  // that implements all the public methods of
  // the type
  // and some custom methods like find, build
  constructor(values = [], agentFactory = AgentFactory) {
    this.values = values
    this.agentFactory = agentFactory
  }

  build(object, agentArgs) {
    let agent = this._buildAgent(object, agentArgs)
    object.agent_id = this.values.length
    this.values.push(agent)
  }

  find(objects) {
    return objects.map((o) => this._findAgentFor(o))
  }

  beginTransition() {
    this.values.forEach((v) => v.beginTransition() )
  }

  completeTransition() {
    this.values.forEach((v) => v.completeTransition() )
  }

  rewardCurrentTransition() {
    this.values.forEach((v) => v.rewardCurrentTransition() )
  }

  _findAgentFor(object) {
    return this.values[object.agent_id]
  }

  _buildAgent(object, agentArgs) {
    this._preventDuplicates(object)

    return this.agentFactory.build(object, agentArgs)
  }

  _preventDuplicates(object) {
    if (Number.isInteger(object.agent_id)) {
      throw new Error('Single objects cannot have \
      multiple agents / sentience. That would be madness')
    }
  }
}

module.exports = AgentList
