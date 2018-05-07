class RewardAssigner {
  constructor(args) {
    this.agents = args.agents
    this.reward = args.reward
    this.condition = args.condition
  }

  assign() {
    if (this.condition.call()) {
      // refactor to use agentList
      this.agents.forEach((agent) => agent.rewardCurrentTransition(this.reward))
    }
  }
}

module.exports = RewardAssigner
