let utils = require('./utils.js')

class Q {
  constructor(args) {
    this.alpha = args.alpha
    this.gamma = args.gamma
    this.epsilon = args.epsilon
    this.actions = args.actions
    this.approximator = args.approximator
  }

  choose(state) {
    if (Math.random() > this.epsilon) {
      return this._bestAction(state)
    }

    return this._randomAction()
  }

  _bestAction(state) {
    let values = this._get(state)
    let actionIndex = values.indexOf(Math.max(...values))
    return this.actions[actionIndex]
  }

  _randomAction() {
    let randomIndex = utils.randomInRange(this.actions.length)
    return this.actions[randomIndex]
  }

  _get(stateIndex) {
    return this.approximator.get(stateIndex)
  }
}

module.exports = Q
