let math = require('mathjs')
let LinearValueApproximator = require('../src/linear_value_approximator.js')
let assert = require('assert')
let sinon = require('sinon')

describe('LinearValueApproximator', function() {
  describe('#_table', function () {
    describe('by default', function () {
      it('returns random matrix with state-action space dimensions', function () {
        let approximator = new LinearValueApproximator({ statesSize: 3, actionsSize: 5 })

        assert.ok(approximator._table.valueOf() instanceof Array)
        assert.deepEqual(approximator._table.size(), [3, 5])
      })
    })
  })

  describe('#get', function () {
    it('returns the value of all actions in a state', function () {
      let approximator = new LinearValueApproximator({ statesSize: 2, actionsSize: 2 })
      approximator._table = math.matrix([[2, 3], [1, 2]]) // never overwrite a private method in code
      let values = approximator.get([10, 6])
      //  [10, 6] [2, 3] => [26, 42]
      //          [1, 2]
      // 1 , 2 * 2 , 2 => 1, 2
      assert.deepEqual(values, [26, 42])
    })

    it('returns the value of a state action pair when provided an index', function () {
      let approximator = new LinearValueApproximator({ statesSize: 2, actionsSize: 2 })
      approximator._table = math.matrix([[2, 3], [1, 2]]) // never overwrite a private method in code
      let value = approximator.get([10, 6], 1)

      assert.deepEqual(value, 42)
    })
  })
})
