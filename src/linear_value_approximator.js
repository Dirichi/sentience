let utils = require('./utils.js')
let math = require('mathjs')

class LinearValueApproximator {
  constructor(args) {
    this.statesSize = args.statesSize
    this.actionsSize = args.actionsSize
    this._table = utils.random2DMatrix(args.statesSize, args.actionsSize)
  }

  get(state, actionIndex = 'all') {
    // refactor required
    let values = math.multiply(math.matrix(state), this._table).valueOf()
    let return_value = actionIndex == 'all' ? values : values[actionIndex]

    return return_value
  }
}

module.exports = LinearValueApproximator
