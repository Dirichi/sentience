let Q = require('../src/q.js')
let assert = require('assert')
let sinon = require('sinon')
let utils = require('../src/utils.js')
let math = require('mathjs')

describe('Q', function() {
  describe('#choose', function () {
    describe('with a fully greedy policy', function () {
      it('selects the approximator\'s highest valued action in a given state', function () {
        let approximator = {
          get: function (state) {
              return [10, 5]
          }
        }
        let q = new Q({ epsilon: 0, approximator: approximator, actions: ['up', 'down'] })

        assert.equal(q.choose([1]), 'up')
      })
    })

    describe('with a fully random policy', function () {
      it('chooses at random, not consulting the approximator', function () {
        let fakeGet = sinon.fake()
        let approximator = {
          get: fakeGet
        }
        let q = new Q({ epsilon: 1, approximator: approximator, actions: ['up', 'down'] })
        let choices = utils.range(10).map((v) => q.choose([1]))
        let uniqueChoices = utils.uniqueValues(choices)

        assert(fakeGet.notCalled)
        assert.deepEqual(uniqueChoices.sort(), ['down', 'up'])
      })
    })
  })

  describe('bestChoice', function () {
    it('chooses the action with the highest Q value', function () {
      let approximator = {
        get: function (state) {
            return [10, 5]
        }
      }
      let q = new Q({ epsilon: 0, approximator: approximator, actions: ['up', 'down'] })

      assert.equal(q.bestChoice([1]), 'up')
    })
  })

  describe('error', function () {
    it('error = alpha * ((r + max Q(s`,a`)) - Q(s,a))', function () {
      let transition = {
        state: [1],
        action: 0,
        reward: 5,
        nextState: [2],
        nextAction: 1
      }

      let approximator = {
        get: function (state, actionIndex = 'all') {
          let values = [10, 5]
          if (actionIndex == 'all') { return values }
          else { return values[actionIndex] }
        }
      }

      let policy = new Q({ alpha: 0.2, gamma: 0.8, actions: ['A', 'B'], approximator: approximator })
      // 0.2 * ((5 + (0.8 * 10)) - 10) = 0.6
      let err = policy.error(transition)
      assert.equal(math.round(err, 1), 0.6)
    })
  })

  describe('update', function () {
    it('sends the error, state, and action to the approximator', function () {
      let updateFunc = sinon.fake()

      let transition = {
        state: [1],
        action: 'A',
        reward: 5,
        nextState: [2],
        nextAction: 'B'
      }

      let approximator = {
        get: function (state, actionIndex = 'all') {
          let values = [10, 5]
          if (actionIndex == 'all') { return values }
          else { return values[actionIndex] }
        },
        update: updateFunc
      }

      let policy = new Q({ alpha: 0, gamma: 0.8, actions: ['A', 'B'], approximator: approximator })
      policy.update(transition)

      assert(updateFunc.calledWith(0, [1], 0))
    })
  })
})
