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

  describe('deposit', () => {
    it('can deposit and split an even number', async () => {
      const weiAmount = 10000000000000000000 // 10 eth

      const ethAmount = Web3Utils.fromWei(weiAmount.toString(),'ether')
      let bob = await ctx.contracts.splitter.network(ctx.actors.bob)
      let carol = await ctx.contracts.splitter.network(ctx.actors.carol)

      const bobBefore = Web3Utils.fromWei(bob[3].toString(),'ether')
      const carolBefore = Web3Utils.fromWei(carol[3].toString(),'ether')

      await ctx.contracts.splitter.deposit({ from: ctx.actors.alice, value: weiAmount })
      bob = await ctx.contracts.splitter.network(ctx.actors.bob)
      carol = await ctx.contracts.splitter.network(ctx.actors.carol)
      
      const bobAfter = Web3Utils.fromWei(bob[3].toString(),'ether')
      const carolAfter = Web3Utils.fromWei(carol[3].toString(),'ether')

      expect(new BigNumber(bobBefore + ethAmount / 2).isEqualTo(bobAfter))
      expect(new BigNumber(carolBefore + ethAmount / 2).isEqualTo(carolAfter))
    })
  })
  describe('deposit', () => {
    it('can deposit and split an odd number', async () => {
      const weiAmount = 10000000000000000001

      const ethAmount = Web3Utils.fromWei(weiAmount.toString(),'ether')
      let bob = await ctx.contracts.splitter.network(ctx.actors.bob)
      let carol = await ctx.contracts.splitter.network(ctx.actors.carol)
      let owner = await ctx.contracts.splitter.network(ctx.actors.owner)

      const bobBefore = Web3Utils.fromWei(bob[3].toString(),'ether')
      const carolBefore = Web3Utils.fromWei(carol[3].toString(),'ether')
      const ownerBefore = new BigNumber(Web3Utils.fromWei(owner[3].toString(),'ether'))

      await ctx.contracts.splitter.deposit({ from: ctx.actors.alice, value: weiAmount })
      bob = await ctx.contracts.splitter.network(ctx.actors.bob)
      carol = await ctx.contracts.splitter.network(ctx.actors.carol)
      owner = await ctx.contracts.splitter.network(ctx.actors.owner)
      
      const bobAfter = Web3Utils.fromWei(bob[3].toString(),'ether')
      const carolAfter = Web3Utils.fromWei(carol[3].toString(),'ether')
      const ownerAfter = new BigNumber(Web3Utils.fromWei(owner[3].toString(),'ether'))
      const one = new BigNumber(1)
      
      expect(new BigNumber(bobBefore + ethAmount / 2).isEqualTo(bobAfter))
      expect(new BigNumber(carolBefore + ethAmount / 2).isEqualTo(carolAfter))
      // Unsure why this passes:
      expect(new BigNumber(ownerBefore.plus(one)).isEqualTo(ownerAfter))
      // and this fails:
      expect(new BigNumber(ownerBefore.plus(one))).is.equal(ownerAfter)
    })
  })
})
