import { useEffect, useMemo, useState } from 'react'
import { chains } from './networks'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useContractRead, useContractWrite } from 'wagmi'
import { addresses } from './constants/contractAddresses'
import appConfig from './constants/appConfig'
import { useNetwork } from 'wagmi'
import profileRegistryAbi from './constants/abi/ProfileRegistry.abi.json'
import { BigNumber } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import {
  getCollectionLinks,
  OpenseaCollectionManager
} from './nftstuff/getCollectionLinks'
import './App.css'

function App() {
  const { address } = useAccount()
  let { chain } = useNetwork()
  const [price, setPrice] = useState<BigNumber>()
  if (!chain) {
    chain = chains[0]
  }
  if (!chain.id) {
    console.log('WARNING, no chain id. using default')
    chain.id = appConfig.defaultNetwork
  }
  const { data: priceData } = useContractRead({
    addressOrName: addresses[chain.id],
    contractInterface: profileRegistryAbi,
    functionName: 'price', // TODO: contract maybe doesnt have price()
    args: [],
    chainId: chain.id,
    onError: (e) => {
      console.error('fetching price:', e)
    }
  })
  const {
    data: mintResult,
    error: mintError,
    write: mint,
    reset: mintErrorReset
  } = useContractWrite({
    addressOrName: addresses[chain.id],
    contractInterface: profileRegistryAbi,
    functionName: 'mint',
    args: [],
    chainId: chain.id
  })
  const openseaman = useMemo(
    () =>
      new OpenseaCollectionManager(
        addresses[chain?.id ?? 1],
        chain?.id,
        chain?.id === 1
      ),
    [chain.id]
  )
  useEffect(() => {
    document.title = (appConfig as any).title ?? appConfig.name
  }, [])

  useEffect(() => {
    if (priceData) {
      setPrice(BigNumber.from(priceData.toString()))
    }
    return () => {}
  }, [priceData])

  const handleMintButton = () => {
    console.log('minting')

    if (!chain || !addresses[chain.id]) {
      alert(`unsupported chain ${chain?.id}`)
    } else {
      mint()
    }
  }

  const links = getCollectionLinks(
    addresses[chain.id],
    openseaman.collectionInfo?.collection.slug
  )
  if (!chain.id || !addresses[chain.id]) {
    return (
      <div className='App'>
        <header className='App-header'>
          <div>
            <h2>Unconfigured Network: {chain.id}</h2>
            <p>No contract has been deployed on this network.</p>
            Supported Networks:{' '}
            {`${Object.keys(addresses).filter(
              (x) => !!addresses[Number(x)]
            )}` || (
              <div>
                <p>please deploy and edit:</p>
                <ul>
                  <li> contractAddresses</li>
                  <li>appConfig.supportedNetworks</li>
                </ul>
              </div>
            )}
            <div id='walletbutton'>
              <ConnectButton />
            </div>
          </div>
          {footer}
        </header>
      </div>
    )
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <div>
          {/* Supported Networks: [{allChains.map((x) => `${x.id} `)}] */}
          <div id='walletbutton'>
            <ConnectButton />
          </div>
          {/* {!!address && address} */}
          <div className='container'>
            Mint Price: {!price || price.eq(0) ? 'Free!' : formatEther(price)}
          </div>
          {!!address && (
            <div className='container'>
              <button className='large' onClick={handleMintButton}>
                Mint
              </button>
            </div>
          )}
          {!!mintResult && <p>Tx: {mintResult.hash}</p>}
          {!!mintError && (
            <div className='container'>
              <p onClick={mintErrorReset}>
                error:{' '}
                <span className='error'>{decodeError(mintError.message)}</span>
              </p>
            </div>
          )}
          <div className='linktree'>
            <h4>Links</h4>
            {links.map(({ label, link }) => (
              <a key={link + link} href={link} className='linkleaf'>
                <button>{label}</button>
              </a>
            ))}
          </div>
        </div>
        {footer}
      </header>
    </div>
  )
}
const footer = (
  <p className='footer'>
    Created with{' '}
    <a href='https://github.com/tsunamisystems/cra-template-tsunami'>
      yarn create react-app --template tsunami
    </a>
  </p>
)
const decodeError = (e: string) => {
  const prefix = `reason="execution reverted: `
  const i = e.indexOf(prefix)
  if (i === -1) {
    return e
  }
  const i1 = i + 'reason="'.length
  e = e.slice(i1)
  return e.slice(0, e.indexOf('"'))
}
export default App
