import { expect } from 'chai'
import {BigNumber} from 'bignumber.js'
import Web3Utils from 'web3-utils'
const init = require('./helpers/init')

contract('Account Management', accounts => {
  const sender = accounts[1]
  const recipient1 = accounts[2]
  const recipient2 = accounts[3]
  let splitter;

  beforeEach(async () => {
    splitter = await init.getSplitterContract(accounts[0])
  })

  describe('splitFunds', () => {
    it('can split and deposit an even number', async () => {
      const weiAmount = 1000000000000000000 // 1 eth
      const ethAmount = Web3Utils.fromWei(weiAmount.toString(), 'ether')
      let rec1Balance = await splitter.balances(recipient1)
      let rec2Balance = await splitter.balances(recipient2)

      const rec1Before = Web3Utils.fromWei(rec1Balance.toString(), 'ether')
      const rec2Before = Web3Utils.fromWei(rec2Balance.toString(), 'ether')

      await splitter.splitFunds(recipient1, recipient2, { from: sender, value: weiAmount })
      rec1Balance = await splitter.balances(recipient1)
      rec2Balance = await splitter.balances(recipient2)

      const rec1After = Web3Utils.fromWei(rec1Balance.toString(), 'ether')
      const rec2After = Web3Utils.fromWei(rec2Balance.toString(), 'ether')

      expect(new BigNumber(rec1Before + ethAmount / 2).isEqualTo(rec1After))
      expect(new BigNumber(rec2Before + ethAmount / 2).isEqualTo(rec2After))
    })
    it('can split and deposit an odd number', async () => {
      const weiAmount = 1000000000000000001 // 1 eth + 1 wei

      const ethAmount = Web3Utils.fromWei(weiAmount.toString(), 'ether')
      let senderBalance = await splitter.balances(sender)
      let rec1Balance = await splitter.balances(recipient1)
      let rec2Balance = await splitter.balances(recipient2)

      const senderBefore = new BigNumber(senderBalance)
      const rec1Before = Web3Utils.fromWei(rec1Balance.toString(), 'ether')
      const rec2Before = Web3Utils.fromWei(rec2Balance.toString(), 'ether')

      await splitter.splitFunds(recipient1, recipient2, { from: sender, value: weiAmount })
      senderBalance = await splitter.balances(sender)
      rec1Balance = await splitter.balances(recipient1)
      rec2Balance = await splitter.balances(recipient2)

      const senderAfter = new BigNumber(senderBalance)
      const rec1After = Web3Utils.fromWei(rec1Balance.toString(), 'ether')
      const rec2After = Web3Utils.fromWei(rec2Balance.toString(), 'ether')

      expect(new BigNumber(rec1Before + ethAmount / 2).isEqualTo(rec1After))
      expect(new BigNumber(rec2Before + ethAmount / 2).isEqualTo(rec2After))
      assert.strictEqual(new BigNumber(senderBefore.plus(1)).toString(10), senderAfter.toString(10))
    })
  })
})
