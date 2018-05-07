let AgentList = require('../src/agent_list.js')
let assert = require('assert')
let sinon = require('sinon')

describe('AgentList', function() {
  describe('#beginTransition', function() {
    it('calls beginTransition on its values', function() {
      let beginFunc = sinon.fake()
      let agent = { beginTransition: beginFunc }
      new AgentList([agent]).beginTransition()

      assert(beginFunc.calledOnce)
    })
  })

  describe('#rewardCurrentTransition', function() {
    it('calls rewardCurrentTransition on its values', function() {
      let rewardFunc = sinon.fake()
      let agent = { rewardCurrentTransition: rewardFunc }
      new AgentList([agent]).rewardCurrentTransition()

      assert(rewardFunc.calledOnce)
    })
  })

  describe('#completeTransition', function() {
    it('calls completeTransition on its values', function() {
      let completeFunc = sinon.fake()
      let agent = { completeTransition: completeFunc }
      new AgentList([agent]).completeTransition()

      assert(completeFunc.calledOnce)
    })
  })
})
