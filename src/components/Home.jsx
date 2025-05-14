import React, { FC, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import Airdrop from './Airdrop';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css'; 
import { Link } from 'react-router-dom';
import Header from './Header';



const MainContent = () => (
  <section className=" text-white text-center pt-35 container bg-transparent min-w-screen min-h-screen">
    <h1 className="text-4xl md:text-7xl font-medium mb-6">Create and Track Invoices,<br></br> Powered by Solana.</h1>
    <p className="text-lg md:text-2xl max-w-2xl container my-10 min-w-screen">
      Easily generate and share invoices that can only be paid in Solana (SOL).<br></br> Track payments in real time — no bank, no middlemen.
    </p>
      <Link to="/invoice" className="text-2xl px-8 py-4 border border-[#ffffff5e] rounded-full hover:border-white hover:bg-[#ffffff0f]">Get Started</Link>
    <div className='flex items-center justify-center mt-18'>
      <img src ="/images/invoice.png" className='w-[60%] rounded-t-2xl'></img>
    </div>
    
  </section>
);


export default function Home() {
  return (
    <div className="w-screen overflow-x-hidden flex flex-col justify-center">
      <Header />
      <div className='bg-[url(/images/bg.jpg))] bg-cover bg-no-repeat'>
      <MainContent />
      </div>
    </div>
  );
}
