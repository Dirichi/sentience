let TransitionList = require('../src/transition_list.js')
let assert = require('assert')

describe('TransitionList', function() {
  describe('#store', function() {
    describe('when maximum size is not exceeded', function () {
      it('stores the transition', function() {
        let t = {
          state: [1],
          action: 'A',
          reward: 2,
          nextState: [1],
          nextAction: 'B'
        }

        let list = new TransitionList()
        list.store(t)
        assert.ok(list.values.length == 1)
      })
    })

    describe('when the maximum size is exceeded', function () {
      it('adds the transition and removes the earliest occurring transition', function() {
        let t_1 = {
          state: [1],
          action: 'A',
          reward: 2,
          nextState: [2],
          nextAction: 'B'
        }

        let t_2 = {
          state: [2],
          action: 'B',
          reward: 0,
          nextState: [3],
          nextAction: 'C'
        }

        let list = new TransitionList({maximumSize: 1})
        list.store(t_1)
        list.store(t_2)

        assert.ok(list.values.length == 1)
        assert.ok(list.values[0] == t_2)
      })
    })
  })
})
