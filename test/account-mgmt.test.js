import { expect } from 'chai'
import {BigNumber} from 'bignumber.js'
import Web3Utils from 'web3-utils'
const Splitter = artifacts.require('Splitter')

contract('Account Management', accounts => {
  const sender = accounts[1]
  const recipient1 = accounts[2]
  const recipient2 = accounts[3]
  let splitter

  beforeEach('deploy new instance', async () => {
    splitter = await Splitter.new({ from: accounts[0] })
  })

  describe('splitFunds', () => {
    it('can split and deposit an even number', async function () {
      const weiAmount = Web3Utils.toWei('1', 'ether')

      const rec1Before = await splitter.balances(recipient1)
      const rec2Before = await splitter.balances(recipient2)

      await splitter.splitFunds(recipient1, recipient2, { from: sender, value: weiAmount })

      const rec1After = await splitter.balances(recipient1)
      const rec2After = await splitter.balances(recipient2)

      const bn_weiAmount = new BigNumber(weiAmount)
      expect(rec1Before.plus(bn_weiAmount.div(2)).toString(10)).to.equal(rec1After.toString(10))
      expect(rec2Before.plus(bn_weiAmount.div(2)).toString(10)).to.equal(rec2After.toString(10))
    })
    it('can split and deposit an odd number', async function () {
      // const weiAmount = new BigNumber(Web3Utils.toWei('1')).plus(1)
      const weiAmount = '1000000000000000001' // 1 eth + 1 wei

      const senderBefore = await splitter.balances(sender)
      const rec1Before = await splitter.balances(recipient1)
      const rec2Before = await splitter.balances(recipient2)

      await splitter.splitFunds(recipient1, recipient2, { from: sender, value: weiAmount })

      const senderAfter = await splitter.balances(sender)
      const rec1After = await splitter.balances(recipient1)
      const rec2After = await splitter.balances(recipient2)

      expect(rec1After.sub(rec1Before).toString(10)).to.equal(Web3Utils.toWei('500', 'finney'))
      expect(rec2After.sub(rec2Before).toString(10)).to.equal(Web3Utils.toWei('500', 'finney'))
      expect(senderAfter.sub(senderBefore).toString(10)).to.equal('1')
    })
  })
})
