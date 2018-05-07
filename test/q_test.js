let Q = require('../src/q.js')
let assert = require('assert')
let sinon = require('sinon')
let utils = require('../src/utils.js')

describe('Q', function() {
  describe('#choose', function () {
    describe('with a fully greedy policy', function () {
      it('selects the approximator\'s highest valued action in a given state', function () {
        let approximator = {
          get: function (state) {
              return [10, 5]
          }
        }
        let q = new Q({ epsilon: 0, approximator: approximator, actions: ['up', 'down']})

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
})
