class RewardAssigner {
  constructor(args) {
    this.agents = args.agents
    this.rewardFunction = args.rewardFunction
    this.condition = args.condition
  }

  assign() {
    if (this.condition.call()) {
      // refactor to use agentList
      let reward = this.rewardFunction.call()
      this.agents.forEach((agent) => agent.rewardCurrentTransition(reward))
    }
  }
}

module.exports = RewardAssigner
