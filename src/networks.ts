import { connectorsForWallets, getDefaultWallets } from '@rainbow-me/rainbowkit'
import { Chain, chain, configureChains, createClient } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import appConfig from './constants/appConfig'

const aquachain: Chain = {
  name: 'Aquachain',
  id: 61717561,
  rpcUrls: { public: 'https://c.onical.org', default: 'https://c.onical.org' },
  network: 'aquachain',
  nativeCurrency: {
    name: 'Aquachain',
    symbol: 'AQUA',
    decimals: 18
  }
}
const smartchain: Chain = {
  name: 'Smart Chain',
  id: 56,
  rpcUrls: {
    public: 'https://bsc-dataseed.binance.org',
    default: 'https://bsc-dataseed.binance.org'
  },
  network: 'bsc',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18
  },
  blockExplorers: {
    default: { name: 'BSCScan', url: 'https://bscscan.com/' }
  }
}
export const allChains: Chain[] = (() => {
  // filter by supported
  const all = [
    chain.hardhat,
    chain.polygonMumbai,
    chain.localhost,
    chain.mainnet,
    smartchain,
    aquachain,
    chain.polygon,
    chain.optimism,
    chain.arbitrum,
    ...[chain.goerli, chain.kovan, chain.rinkeby, chain.ropsten]
  ].filter((x) => appConfig.supportedNetworks.includes(x.id))
  const m = all.reduce((prev: { [key: number]: Chain }, curr) => {
    prev[curr.id] = curr
    return prev
  }, {})
  const sorted = appConfig.supportedNetworks.map((n) => m[n])
  // put default first
  const i = sorted.findIndex((chain) => chain.id === appConfig.defaultNetwork)
  if (i === -1) {
    throw new Error('bad default chain id')
  }
  const tmp = sorted[0]
  sorted[0] = all[i]
  sorted[i] = tmp

  return sorted
})()
// console.log("all chains:", allChains.map((chain)=>chain.id))
export const { chains, provider, webSocketProvider } = configureChains(
  allChains.filter((chain) =>
    appConfig.supportedNetworks.includes(chain.id ?? 0)
  ),
  [
    alchemyProvider({ alchemyId: '_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC' }),
    publicProvider()
  ]
)

// export const { connectors } = getDefaultWallets({
//   appName: appConfig.name,
//   chains
// })
const { wallets } = getDefaultWallets({
  appName: appConfig.name,
  chains
})
const allwallets = [...wallets[0].wallets.filter((x) => x.name != 'Rainbow')]
const mm = allwallets[1]
allwallets[1] = allwallets[0]
allwallets[0] = mm
const connectors = connectorsForWallets([
  {
    groupName: 'Supported Wallets',
    wallets: allwallets
  }
])
export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider
})
