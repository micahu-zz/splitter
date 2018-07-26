import { expect } from 'chai'
import {BigNumber} from 'bignumber.js'
import Web3Utils from 'web3-utils'
const Splitter = artifacts.require('Splitter')

contract('Account Management', accounts => {
  const sender = accounts[1]
  const recipient1 = accounts[2]
  const recipient2 = accounts[3]
  let splitter;

  beforeEach(async () => {
    splitter = await Splitter.new({ from: accounts[0] })
  })
  
  describe('splitFunds', () => {
    it('can split and deposit an even number', async () => {
      const ethAmount = 1
      const weiAmount = Web3Utils.toWei(ethAmount.toString())
      
      const rec1Before = new BigNumber(await splitter.balances(recipient1))
      const rec2Before = new BigNumber(await splitter.balances(recipient2))
      
      await splitter.splitFunds(recipient1, recipient2, { from: sender, value: weiAmount })
      
      const rec1After = new BigNumber(await splitter.balances(recipient1))
      const rec2After = new BigNumber(await splitter.balances(recipient2))
      
      expect(rec1Before.plus(new BigNumber(weiAmount).div(2)).toString(10)).to.equal(rec1After.toString(10))
      expect(rec2Before.plus(new BigNumber(weiAmount).div(2)).toString(10)).to.equal(rec2After.toString(10))
    })
    it('can split and deposit an odd number', async () => {
      const weiAmount = 1000000000000000001 // 1 eth + 1 wei
      const senderBefore = new BigNumber(await splitter.balances(sender))
      
      const rec1Before = new BigNumber(await splitter.balances(recipient1))
      const rec2Before = new BigNumber(await splitter.balances(recipient2))

      await splitter.splitFunds(recipient1, recipient2, { from: sender, value: weiAmount })

      const senderAfter = new BigNumber(await splitter.balances(sender))
      const rec1After = new BigNumber(await splitter.balances(recipient1))
      const rec2After = new BigNumber(await splitter.balances(recipient2))

      expect(rec1Before.plus(new BigNumber(weiAmount).div(2)).toString(10)).to.equal(rec1After.toString(10))
      expect(rec2Before.plus(new BigNumber(weiAmount).div(2)).toString(10)).to.equal(rec2After.toString(10))
      expect(new BigNumber(senderBefore.plus(1)).toString(10)).to.equal(senderAfter.toString(10))
    })
  })
})
