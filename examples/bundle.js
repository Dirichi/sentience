(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
let Transition = require('./transition.js')

class Agent {
  constructor(args) {
    this.object = args.object
    this.stateFunction = args.stateFunction
    this.policy = args.policy
    this.actions = args.actions
    this.currentTransition = {}
  }

  get state() {
    return this.stateFunction.call()
  }

  beginTransition() {
    let state = this.state
    this.currentTransition = this._buildTransition(state)
  }

  rewardCurrentTransition(reward) {
    this.currentTransition.incrementReward(reward)
  }

  completeTransition() {
    let nextState = this.state
    let nextAction = this.policy.choose(nextState)

    this.currentTransition.complete(nextState, nextAction)
    this.policy.update(this.currentTransition)
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

},{"./transition.js":12}],2:[function(require,module,exports){
let Agent = require('./agent.js')
let Q = require('./q.js')
let LinearApproximator = require('./linear_approximator.js')
let utils = require('./utils.js')

class AgentFactory {
  static QLVAAgent(object, args) {
    let approximator = new LinearApproximator({
      statesSize: args.stateSize,
      actionsSize: args.actions.length
    })

    let policy = new Q({ approximator: approximator, actions: args.actions })

    return this._build(object, args.stateFunction, args.actions, policy)
  }

  static build(object, args) {
    return this[args.policyType](object, args)
  }

  static _build(object, stateFunction, actions, policy) {

    return new Agent({
      object: object,
      stateFunction: stateFunction,
      actions: actions,
      policy: policy
    })
  }
}

module.exports = AgentFactory

},{"./agent.js":1,"./linear_approximator.js":5,"./q.js":7,"./utils.js":14}],3:[function(require,module,exports){
let AgentFactory = require('./agent_factory.js')

class AgentList {
  // refactor to inherit from a typedList class
  // that implements all the public methods of
  // the type
  // and some custom methods like find, build
  constructor(values = [], agentFactory = AgentFactory) {
    this.values = values
    this.agentFactory = agentFactory
  }

  build(object, agentArgs) {
    let agent = this._buildAgent(object, agentArgs)
    object.agent_id = this.values.length
    this.values.push(agent)
  }

  find(objects) {
    return objects.map((o) => this._findAgentFor(o))
  }

  beginTransition() {
    this.values.forEach((v) => v.beginTransition() )
  }

  completeTransition() {
    this.values.forEach((v) => v.completeTransition() )
  }

  rewardCurrentTransition() {
    this.values.forEach((v) => v.rewardCurrentTransition() )
  }

  _findAgentFor(object) {
    return this.values[object.agent_id]
  }

  _buildAgent(object, agentArgs) {
    this._preventDuplicates(object)

    return this.agentFactory.build(object, agentArgs)
  }

  _preventDuplicates(object) {
    if (Number.isInteger(object.agent_id)) {
      throw new Error('Single objects cannot have \
      multiple agents / sentience. That would be madness')
    }
  }
}

module.exports = AgentList

},{"./agent_factory.js":2}],4:[function(require,module,exports){
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

},{"./agent_list.js":3,"./reward_assigner_list.js":9}],5:[function(require,module,exports){
let utils = require('./utils.js')
let Matrix = require('./matrix.js')

class LinearApproximator {
  constructor(args) {
    this.statesSize = args.statesSize
    this.actionsSize = args.actionsSize
    this.weights = Matrix.random(args.statesSize, args.actionsSize)
  }

  get(state, actionIndex = 'all') {
    let state_matrix =  new Matrix([state])
    let values = Matrix.product(state_matrix, this.weights).valueOf()[0]
    let return_value = actionIndex == 'all' ? values : values[actionIndex]

    return return_value
  }

  update(err, state, action) {
    let state_matrix =  new Matrix([state])
    let delta = Matrix.scalarProduct(state_matrix, err).valueOf()[0]
    let actionWeights = this.weights.columns()[action]
    let updatedWeights = actionWeights.map((_, index) => actionWeights[index] + delta[index])

    this.weights.setColumn(action, updatedWeights)
  }
}

module.exports = LinearApproximator

},{"./matrix.js":6,"./utils.js":14}],6:[function(require,module,exports){
class Matrix {
  constructor(array) {
    this._values = array
  }

  static random(numRows, numColumns) {
    let array = []

    for (let i = 0;  i < numRows; i++) {
      let row = []
      for (let j = 0; j < numColumns; j++) {
        row.push(Math.random())
      }
      array.push(row)
    }

    return new this(array)
  }

  static product(matrixA, matrixB) {
    this._checkProductCompatibility(matrixA, matrixB)

    let rows = matrixA.rows()
    let columns = matrixB.columns()

    let productValues = rows.map(function (row) {
      return columns.map((column) => Matrix.dot(row, column))
    })

    return new this(productValues)
  }

  static _checkProductCompatibility(matrixA, matrixB) {
    if (matrixA.numColumns != matrixB.numRows) {
      throw new Error(`incompatible dimensions for multiplication (${matrixA.size()}, ${matrixB.size()})`)
    }
  }

  static scalarProduct(matrix, scalar) {
    let values = matrix.rows().map((row) => row.map((value) => value * scalar))
    return new this(values)
  }


  static dot(vectorA, vectorB) {
    let Avalues = vectorA.valueOf()
    let Bvalues = vectorB.valueOf()
    let products = Avalues.map((_, index) => Avalues[index] * Bvalues[index])
    let sum = products.reduce((acc, values) => acc + values, 0)

    return sum
  }

  rows() {
    return this._values
  }

  columns() {
    let rows = this.rows()
    let transpose = rows[0].map((_,c) => rows.map(row => row[c]))

    return transpose
  }


  get numRows() {
    return this._values.length
  }

  get numColumns() {
    return this._values[0].length
  }

  setColumn(columnIndex, value) {
    this._checkAllowedColumnIndex(columnIndex)
    this._checkCompatibleColumn(value)

    for (let i = 0; i < this._values.length; i++) {
      let row = this._values[i]
      row[columnIndex] = value[i]
    }
  }

  _checkAllowedColumnIndex(columnIndex) {
    if (columnIndex >= this.numColumns) {
      throw new Error(`provided column index outside column index range (index: ${columnIndex}, numColumns: ${this.numColumns})`)
    }
  }

  _checkCompatibleColumn(columnArray) {
    if (columnArray.length != this.numRows) {
      throw new Error(`incompatible dimensions for column (replacement length: ${columnArray.length}, numRows: ${this.numRows})`)
    }
  }

  size() {
    return [this.numRows, this.numColumns]
  }

  valueOf() {
    return this._values
  }
}

module.exports = Matrix

},{}],7:[function(require,module,exports){
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

},{"./transition_list.js":13,"./utils.js":14}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{"./reward_assigner.js":8}],10:[function(require,module,exports){
Environment = require('./environment')
Q = require('./q');
RewardAssignerList = require('./reward_assigner_list')
RewardAssigner = require('./reward_assigner')
Agent = require('./agent')
AgentList = require('./agent_list')
LinearApproximator = require('./linear_approximator')
Transition = require('./transition')
AgentFactory = require('./agent_factory')
Tiler = require('./tiler')
utils = require('./utils')

},{"./agent":1,"./agent_factory":2,"./agent_list":3,"./environment":4,"./linear_approximator":5,"./q":7,"./reward_assigner":8,"./reward_assigner_list":9,"./tiler":11,"./transition":12,"./utils":14}],11:[function(require,module,exports){
class Tiler {
  constructor(args) {
    this.minX = args.minX
    this.minY = args.minY
    this.maxX = args.maxX
    this.maxY = args.maxY
    this.xTiles = args.xTiles
    this.yTiles = args.yTiles
    this.tileRadius = args.tileRadius
  }

  tileVector(x, y) {
    let tileVec = []

    for (var i = 0; i < this.xTiles; i++) {
      for (var j = 0; j < this.yTiles; j++) {
        let circleX = i * (this.maxX - this.minX) / this.xTiles
        let circleY = j * (this.maxY - this.minY) / this.yTiles
        if (this._distance(circleX, circleY, x, y) <= this.tileRadius) {
          tileVec.push(1)
        }
        else {
          tileVec.push(0)
        }
      }
    }

    return tileVec
  }

  _distance(x, y, x1, y1) {
    let squaredDistance = ((x - x1) ** 2) + ((y - y1) ** 2)
    return Math.sqrt(squaredDistance)
  }
}

module.exports = Tiler

},{}],12:[function(require,module,exports){
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

  complete(nextState, nextAction) {
    this.nextState = nextState
    this.nextAction = nextAction
  }
}

module.exports = Transition

},{}],13:[function(require,module,exports){
let utils = require('./utils.js')

class TransitionList {
  constructor(args = {}) {
    let defaultArgs = { maximumSize: 1000, values: [] }
    let fullArgs = Object.assign(defaultArgs, args)

    this.values = fullArgs.values
    this.maximumSize = fullArgs.maximumSize
  }

  store(t) {
    this.values.push(t)
    if (this.values.length > this.maximumSize) { this.values.shift() }
  }

  sample() {
    return utils.randomChoiceFrom(this.values)
  }

}

module.exports = TransitionList

},{"./utils.js":14}],14:[function(require,module,exports){
module.exports.uniqueValues = function (array) {
  return [...new Set(array)]
}

module.exports.range = function (maximum) {
  return [...Array(maximum).keys()]
}

module.exports.randomInRange = function (maximum) {
  return Math.floor(Math.random() * maximum)
}

module.exports.randomChoiceFrom = function(array) {
  let randomIndex = module.exports.randomInRange(array.length)
  return array[randomIndex]
}

},{}]},{},[10]);
