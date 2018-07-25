const Splitter = artifacts.require('Splitter')
const SafeMath = artifacts.require('SafeMath')
const init = require('../test/helpers/init')

module.exports = (deployer, network, accounts) => {
  deployer.deploy(SafeMath)
  deployer.link(SafeMath, Splitter)
  deployer.deploy(Splitter, {from: accounts[0]})
}
