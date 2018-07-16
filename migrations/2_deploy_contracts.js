const Splitter = artifacts.require('Splitter')
const SafeMath = artifacts.require('SafeMath')
const init = require('../test/helpers/init')

module.exports = (deployer, network, accounts) => {
  const actors = init.getTestActorsContext(accounts)
  const owner = actors.owner

  deployer.deploy(SafeMath)
  deployer.link(SafeMath, Splitter)
  deployer.deploy(Splitter, actors.bob, actors.carol, {from: owner})
}
