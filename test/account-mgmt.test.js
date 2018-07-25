import { expect } from 'chai'
import {BigNumber} from 'bignumber.js'
import Web3Utils from 'web3-utils'
const init = require('./helpers/init')

contract('Account Management', accounts => {
  const ctx = {
    actors: init.getTestActorsContext(accounts),
    contracts: {
      splitter: null,
      safeMath: null
    }
  }

  beforeEach(async () => {
    ctx.contracts.splitter = await init.getSplitterContract(ctx.actors)
  })

  describe('splitFunds', () => {
    it('can split and deposit an even number', async () => {
      const weiAmount = 1000000000000000000 // 1 eth

      const ethAmount = Web3Utils.fromWei(weiAmount.toString(), 'ether')
      let bob = await ctx.contracts.splitter.balances(ctx.actors.bob)
      let carol = await ctx.contracts.splitter.balances(ctx.actors.carol)

      const bobBefore = Web3Utils.fromWei(bob.toString(), 'ether')
      const carolBefore = Web3Utils.fromWei(carol.toString(), 'ether')

      await ctx.contracts.splitter.splitFunds(ctx.actors.bob, ctx.actors.carol, { from: ctx.actors.alice, value: weiAmount })
      bob = await ctx.contracts.splitter.balances(ctx.actors.bob)
      carol = await ctx.contracts.splitter.balances(ctx.actors.carol)

      const bobAfter = Web3Utils.fromWei(bob.toString(), 'ether')
      const carolAfter = Web3Utils.fromWei(carol.toString(), 'ether')

      expect(new BigNumber(bobBefore + ethAmount / 2).isEqualTo(bobAfter))
      expect(new BigNumber(carolBefore + ethAmount / 2).isEqualTo(carolAfter))
    })
    it('can split and deposit an odd number', async () => {
      const weiAmount = 1000000000000000001 // 1 eth + 1 wei

      const ethAmount = Web3Utils.fromWei(weiAmount.toString(), 'ether')
      let bob = await ctx.contracts.splitter.balances(ctx.actors.bob)
      let carol = await ctx.contracts.splitter.balances(ctx.actors.carol)
      let owner = await ctx.contracts.splitter.balances(ctx.actors.owner)

      const bobBefore = Web3Utils.fromWei(bob.toString(), 'ether')
      const carolBefore = Web3Utils.fromWei(carol.toString(), 'ether')
      const ownerBefore = new BigNumber(Web3Utils.fromWei(owner.toString(), 'ether'))

      await ctx.contracts.splitter.splitFunds(ctx.actors.bob, ctx.actors.carol, { from: ctx.actors.alice, value: weiAmount })
      bob = await ctx.contracts.splitter.balances(ctx.actors.bob)
      carol = await ctx.contracts.splitter.balances(ctx.actors.carol)
      owner = await ctx.contracts.splitter.balances(ctx.actors.owner)

      const bobAfter = Web3Utils.fromWei(bob.toString(), 'ether')
      const carolAfter = Web3Utils.fromWei(carol.toString(), 'ether')
      const ownerAfter = new BigNumber(Web3Utils.fromWei(owner.toString(), 'ether'))

      expect(new BigNumber(bobBefore + ethAmount / 2).isEqualTo(bobAfter))
      expect(new BigNumber(carolBefore + ethAmount / 2).isEqualTo(carolAfter))
      expect(new BigNumber(ownerBefore.plus(1))).is.equal(ownerAfter)
    })
  })
})
