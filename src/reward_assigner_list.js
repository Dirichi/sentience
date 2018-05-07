let RewardAssigner = require('./reward_assigner.js')

class RewardAssignerList {
  constructor() {
    this.values = []
  }

  build(agents, condition, credit) {
    let newAssignerArgs = {
      agents: agents,
      condition: condition,
      reward: credit
    }

    let assigner = new RewardAssigner(newAssignerArgs)
    this.values.push(assigner)
  }

  assign() {
    this.values.forEach((assigner) => assigner.assign())
  }
}

module.exports = RewardAssignerList
