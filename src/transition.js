class Transition {
  constructor(args) {
    this.state = args.state
    this.action = args.action
    this.reward = args.reward
    this.nextState = args.nextState
    this.nextAction = args.nextAction
  }

  incrementReward(reward) {
    this.reward += reward
  }

  complete(nextState, nextAction){
    this.nextState = nextState
    this.nextAction = nextAction
  }
}

module.exports = Transition
