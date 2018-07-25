export async function getSplitterContract (owner) {
  const Splitter = artifacts.require('Splitter')
  const c = await Splitter.new({ from: owner })
  return c
}
