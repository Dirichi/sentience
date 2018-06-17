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
