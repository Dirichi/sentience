let math = require('mathjs')
let LinearApproximator = require('../src/linear_approximator.js')
let assert = require('assert')
let sinon = require('sinon')

describe('LinearApproximator', function() {
  describe('#_table', function () {
    describe('by default', function () {
      it('returns random matrix with state-action space dimensions', function () {
        let approximator = new LinearApproximator({ statesSize: 3, actionsSize: 5 })

        assert.ok(approximator.weights.valueOf() instanceof Array)
        assert.deepEqual(approximator.weights.size(), [3, 5])
      })
    })
  })

  describe('#get', function () {
    it('returns the value of all actions in a state', function () {
      let approximator = new LinearApproximator({ statesSize: 2, actionsSize: 2 })
      approximator.weights = math.matrix([[2, 3], [1, 2]])
      let values = approximator.get([10, 6])
      //  [10, 6] [2, 3] => [26, 42]
      //          [1, 2]
      // 1 , 2 * 2 , 2 => 1, 2
      assert.deepEqual(values, [26, 42])
    })

    it('returns the value of a state action pair when provided an index', function () {
      let approximator = new LinearApproximator({ statesSize: 2, actionsSize: 2 })
      approximator.weights = math.matrix([[2, 3], [1, 2]])
      let value = approximator.get([10, 6], 1)

      assert.deepEqual(value, 42)
    })
  })

  describe('#update', function () {
    it('updates it weights with the provided error, state and action', function () {
      let approximator = new LinearApproximator({ statesSize: 2, actionsSize: 3 })
      approximator.weights = math.matrix([[2, 3, 1],[1, 2, 1]])
      approximator.update(2, [0, 1], 0)
      // err = 2; state = [0, 1], action = 0
      // newWeights = weights[actionIndex] += (err * state)
      // [_2_, 3, 1] => [_2_, 3, 1]
      // [_1_, 2, 1]    [_3_, 2, 1]
      assert.deepEqual(approximator.weights.valueOf(), [[2, 3, 1], [3, 2, 1]])
    })
  })
})
