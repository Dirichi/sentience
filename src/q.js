let utils = require('./utils.js')
let TransitionList = require('./transition_list.js')

class Q {
  constructor(args) {
    let defaultArgs = {
      alpha: 0.05,
      gamma: 0.8,
      epsilon: 0.99,
      epsilonDecay: 0.9995,
      transitionList: new TransitionList()
    }

    let fullArgs = Object.assign(defaultArgs, args)

    this.alpha = fullArgs.alpha
    this.gamma = fullArgs.gamma
    this.epsilon = fullArgs.epsilon
    this.epsilonDecay = fullArgs.epsilonDecay
    this.actions = fullArgs.actions
    this.approximator = fullArgs.approximator
    this.transitionList = fullArgs.transitionList
  }

  choose(state) {
    return Math.random() > this.epsilon ? this._bestAction(state) : this._randomAction()
  }

  bestChoice(state) {
    return this._bestAction(state)
  }

  update(transition) {
    let t = this._transformTransition(transition)
    this.transitionList.store(t)

    let sampleT = this.transitionList.sample()
    let err = this.error(sampleT)
    this.approximator.update(err, sampleT.state, sampleT.action)

    this.epsilon *= this.epsilonDecay
  }

  error(t) {
    let Qsa = this._get(t.state, t.action)
    let QNsNa = Math.max(...this._get(t.nextState))

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
