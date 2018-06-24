let AgentList = require('./agent_list.js')
let RewardAssignerList = require('./reward_assigner_list.js')

class Environment {
  constructor(agentList = new AgentList(), assignerList = new RewardAssignerList()) {
    this.agentList = agentList
    this.rewardAssignerList = assignerList
  }

  get agents() {
    return this.agentList.values
  }

  get rewardAssigners() {
    return this.rewardAssignerList.values
  }

  createSentience(objects, agentArgs) {
    objects.forEach((object) => this.agentList.build(object, agentArgs))
  }

  rewardSentience(objects, rewardArgs) {
    let agents = this.agentList.find(objects)
    this.rewardAssignerList.build(agents, rewardArgs)
  }

  run(callback = () => true) {
    callback.call()

    this._transition()
  }

  _transition() {
    this.agentList.beginTransition()
    this.rewardAssignerList.assign()
    this.agentList.completeTransition()
  }
}

module.exports = Environment
