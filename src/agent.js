let Transition = require('./transition.js')

class Agent {
  constructor(args) {
    this.object = args.object
    this.observables = args.observables
    this.policy = args.policy
    this.actions = args.actions
  }

  get state() {
    return this.observables.reduce(
      (arr, observable) => arr.concat(observable.features()), []
    )
  }

  beginTransition() {
    let state = this.state
    this.currentTransition = this._buildTransition(state)
  }

  rewardCurrentTransition(reward) {
    this.currentTransition.incrementReward(reward)
  }

  completeTransition() {
    let state = this.state
    let action = this.policy.choose(state)

    this.currentTransition.complete(state, action)
  }

  perform(action) {
    this.object[action]()
  }

  _buildTransition(state) {
    let action = this.policy.choose(state)
    this.perform(action)

    return new Transition({
      state: state,
      action: action,
      reward: 0
    })
  }
}

module.exports = Agent
