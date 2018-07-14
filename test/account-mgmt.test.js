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
      const bobBefore = Web3Utils.fromWei(bob[3].toString(),'ether')
      await ctx.contracts.splitter.deposit({ from: ctx.actors.alice, value: weiAmount })
      bob = await ctx.contracts.splitter.network(ctx.actors.bob)
      const bobAfter = Web3Utils.fromWei(bob[3].toString(),'ether')
      
      expect(new BigNumber(bobBefore + ethAmount / 2).isEqualTo(bobAfter))
    })
  })
  describe('deposit', () => {
    it('can deposit and split an odd number', async () => {
      const weiAmount = 10000000000000000001

      const ethAmount = Web3Utils.fromWei(weiAmount.toString(),'ether')
      let bob = await ctx.contracts.splitter.network(ctx.actors.bob)
      const bobBefore = Web3Utils.fromWei(bob[3].toString(),'ether')
      await ctx.contracts.splitter.deposit({ from: ctx.actors.alice, value: weiAmount })
      bob = await ctx.contracts.splitter.network(ctx.actors.bob)
      const bobAfter = Web3Utils.fromWei(bob[3].toString(),'ether')
      console.log(weiAmount/2)

      expect(new BigNumber(bobBefore + ethAmount / 2).isEqualTo(bobAfter))
    })
  })
})
