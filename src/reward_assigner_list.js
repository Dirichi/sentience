let RewardAssigner = require('./reward_assigner.js')

class RewardAssignerList {
  constructor() {
    this.values = []
  }

  build(agents, rewardArgs) {
    let newAssignerArgs = {
      agents: agents,
      condition: rewardArgs.condition,
      rewardFunction: rewardArgs.rewardFunction
    }

    let assigner = new RewardAssigner(newAssignerArgs)
    this.values.push(assigner)
  }

  assign() {
    this.values.forEach((assigner) => assigner.assign())
  }
}

module.exports = RewardAssignerList
