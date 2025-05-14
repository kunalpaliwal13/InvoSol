import React from 'react'
import { ConnectionProvider, useConnection, useWallet, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';

function Invoicepay() {

    const [balance, setBalance] = useState(0);    
    const { connection } = useConnection();
    const {publicKey, sendTransaction } = useWallet();
    
   

      const sendSol = async (event) => {
        event.preventDefault();

        if (!publicKey) {
            console.error("Wallet not connected");
            return;
        }
         try {
            const recipientPubKey = new PublicKey(event.currentTarget.recipient.value);
            const transaction = new Transaction();
            const sendSolInstruction = SystemProgram.transfer({
              fromPubkey: publicKey,
              toPubkey: recipientPubKey,
              lamports: 0.1 * LAMPORTS_PER_SOL,
            });

            transaction.add(sendSolInstruction);

            const signature = await sendTransaction(transaction, connection);
                console.log(`Transaction signature: ${signature}`);
            } catch (error) {
            console.error("Transaction failed", error);
            }
        };

  return (
    <div>
      <WalletModalProvider>
            <WalletMultiButton />
            <WalletDisconnectButton />
            <form onSubmit={sendSol}>
            <input name="recipient" type="text" placeholder="Recipient's public key" className="bg-[#d9d9d936] text-white w-full rounded-md p-3"/>

            <button type='submit'>hurt me</button>
            </form>
            <p>{publicKey ? `Balance: ${balance+"SOL  "+ publicKey}` : ""}</p>
        </WalletModalProvider>
    </div>
  )
}

export default Invoicepay
