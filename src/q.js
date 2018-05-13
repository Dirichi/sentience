let utils = require('./utils.js')
const DEFAULT = { alpha: 0.2, gamma: 0.8, epsilon: 0.9, epsilonDecay: 0.9999 }

class Q {
  constructor(args) {
    Object.assign(args, DEFAULT)
    this.alpha = args.alpha
    this.gamma = args.gamma
    this.epsilon = args.epsilon
    this.epsilonDecay = args.epsilonDecay
    this.actions = args.actions
    this.approximator = args.approximator
  }

  choose(state) {
    return Math.random() > this.epsilon ? this._bestAction(state) : this._randomAction()
  }

  update(transition) {
    let t = this._transformTransition(transition)
    let err = this.error(t)

    this.approximator.update(err, t.state, t.action)
    this.epsilon *= this.epsilonDecay
  }

  error(t) {
    let Qsa = this._get(t.state, t.action)
    let QNsNa = this._get(t.nextState, t.nextAction)

    let unweighted_err = (t.reward + (this.gamma * QNsNa)) - Qsa
    let err = this.alpha * unweighted_err

    return err
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

  _get(stateIndex, actionIndex = 'all') {
    return this.approximator.get(stateIndex, actionIndex)
  }

  _transformTransition(transition) {
    // this method would not be necessary if q
    // only dealt with the vector representation
    // of actions, and not the full string form

    return {
      state: transition.state,
      action: this.actions.indexOf(transition.action),
      reward: transition.reward,
      nextState: transition.nextState,
      nextAction: this.actions.indexOf(transition.nextAction)
    }
  }
}

module.exports = Q
