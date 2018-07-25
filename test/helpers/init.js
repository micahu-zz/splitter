export function getTestActorsContext (accounts) {
  return {
    owner: accounts[0],
    alice: accounts[1],
    bob: accounts[2],
    carol: accounts[3]
  }
}

export async function getSplitterContract (owner) {
  const Splitter = artifacts.require('Splitter')
  const c = await Splitter.new({ from: owner })
  return c
}
