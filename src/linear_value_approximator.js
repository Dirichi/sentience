let utils = require('./utils.js')
let math = require('mathjs')

class LinearValueApproximator {
  constructor(args) {
    this.statesSize = args.statesSize
    this.actionsSize = args.actionsSize
    this.weights = utils.random2DMatrix(args.statesSize, args.actionsSize)
  }

  get(state, actionIndex = 'all') {
    let values = math.multiply(math.matrix(state), this.weights).valueOf()
    let return_value = actionIndex == 'all' ? values : values[actionIndex]

    return return_value
  }

  update(err, state, action) {
    let delta = math.multiply(state, err)
    let actionWeights = math.transpose(this.weights).valueOf()[action]
    let updatedWeights = math.add(delta, actionWeights)

    let weightIndex = math.index(math.range(0, this.actionsSize), action)
    this.weights.subset(weightIndex, updatedWeights)
  }
}

module.exports = LinearValueApproximator
