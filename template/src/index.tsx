import React from 'react'
import ReactDOM from 'react-dom/client'
import { darkTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { WagmiConfig } from 'wagmi'

import App from './App'
import { chains, wagmiClient } from './networks'

import './index.css'
import '@rainbow-me/rainbowkit/styles.css'
import appConfig from './constants/appConfig'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        id='walletbutton'
        chains={chains}
        coolMode={true}
        theme={darkTheme({
          accentColor: 'rgba(0,0,0,.5)',
          accentColorForeground: '#fff',
          borderRadius: 'large',
          fontStack: 'system',
          overlayBlur: 'large'
        })}
        showRecentTransactions={true}
        appInfo={{
          appName: appConfig.name,
          // disclaimer: ()=>(<p></p>),
          learnMoreUrl: 'https://ethereum.org/en/wallets/'
        }}
      >
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
)
