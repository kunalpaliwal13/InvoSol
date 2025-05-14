import { useState, useMemo } from 'react'
import './App.css'
import Home from './components/Home'
import Invoice from './components/Invoice'
import {WalletModalProvider,WalletDisconnectButton,WalletMultiButton} from '@solana/wallet-adapter-react-ui';
import { Route, Router, BrowserRouter, Routes} from 'react-router-dom'
import { ConnectionProvider, useConnection, useWallet, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';

function App() {
  const network = WalletAdapterNetwork.Devnet;
   const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const wallets = useMemo(() => [new UnsafeBurnerWalletAdapter(),],[network]);
  return (
    <>
    <ConnectionProvider endpoint={endpoint} >
    <WalletProvider wallets={wallets} autoConnect>
       <WalletModalProvider>
    <Routes>
      <Route path='/' element= {<Home/>}>
      </Route>
      <Route path= "/invoice" element= {<Invoice/>}>
      </Route>   
    </Routes>
    </WalletModalProvider>
    </WalletProvider>
    </ConnectionProvider>
    </>
  )
}

export default App
