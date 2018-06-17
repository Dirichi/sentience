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
