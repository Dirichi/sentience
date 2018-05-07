let Observable = require('../src/observable.js')
let assert = require('assert')

class Observed {
  constructor(attrs, x, y) {
    this.attributes = attrs
    this.x = x
    this.y = y
  }
}
Object.assign(Observed.prototype, Observable)

describe('Observable', function() {
  describe('#features', function() {
    it('returns an array of values for passed in attributes', function() {
      let observed = new Observed(['x', 'y'], 10, 5)
      assert.deepEqual(observed.features(), [10, 5])
    })

    it('raises an error when any attribute is not numeric', function() {
      let observed = new Observed(['x', 'y'], 10, 'wrong')
      assert.throws(() => observed.features(), /attribute should be numeric/)
    })
  })
})
