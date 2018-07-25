import { expect } from 'chai'
import {BigNumber} from 'bignumber.js'
import Web3Utils from 'web3-utils'
const init = require('./helpers/init')

contract('Account Management', accounts => {
  const alice = accounts[1]
  const bob = accounts[2]
  const carol = accounts[3]
  let splitter;

  beforeEach(async () => {
    splitter = await init.getSplitterContract({ owner: accounts[0] })
  })

  describe('splitFunds', () => {
    it('can split and deposit an even number', async () => {
      const weiAmount = 1000000000000000000 // 1 eth

      const ethAmount = Web3Utils.fromWei(weiAmount.toString(), 'ether')
      let bobBalance = await splitter.balances(bob)
      let carolBalance = await splitter.balances(carol)

      const bobBefore = Web3Utils.fromWei(bobBalance.toString(), 'ether')
      const carolBefore = Web3Utils.fromWei(carolBalance.toString(), 'ether')

      await splitter.splitFunds(bob, carol, { from: alice, value: weiAmount })
      bob = await splitter.balances(bob)
      carol = await splitter.balances(carol)

      const bobAfter = Web3Utils.fromWei(bob.toString(), 'ether')
      const carolAfter = Web3Utils.fromWei(carol.toString(), 'ether')

      expect(new BigNumber(bobBefore + ethAmount / 2).isEqualTo(bobAfter))
      expect(new BigNumber(carolBefore + ethAmount / 2).isEqualTo(carolAfter))
    })
    it('can split and deposit an odd number', async () => {
      const weiAmount = 1000000000000000001 // 1 eth + 1 wei

      const ethAmount = Web3Utils.fromWei(weiAmount.toString(), 'ether')
      let alice = await splitter.balances(alice)
      let bob = await splitter.balances(bob)
      let carol = await splitter.balances(carol)

      const bobBefore = Web3Utils.fromWei(bob.toString(), 'ether')
      const carolBefore = Web3Utils.fromWei(carol.toString(), 'ether')
      const aliceBefore = new BigNumber(Web3Utils.fromWei(alice.toString(), 'ether'))

      await splitter.splitFunds(bob, carol, { from: alice, value: weiAmount })
      bob = await splitter.balances(bob)
      carol = await splitter.balances(carol)
      
      const bobAfter = Web3Utils.fromWei(bob.toString(), 'ether')
      const carolAfter = Web3Utils.fromWei(carol.toString(), 'ether')
      const aliceAfter = new BigNumber(Web3Utils.fromWei(alice.toString(), 'ether'))

      expect(new BigNumber(bobBefore + ethAmount / 2).isEqualTo(bobAfter))
      expect(new BigNumber(carolBefore + ethAmount / 2).isEqualTo(carolAfter))
      expect(new BigNumber(aliceBefore.plus(1))).is.equal(aliceAfter)
    })
  })
})
