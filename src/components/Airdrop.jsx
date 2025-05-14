import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useState } from 'react'

function Airdrop(){
    const wallet = useWallet();

    const {connection} = useConnection();

    const AirdropSol = async () =>{

      await connection.requestAirdrop(wallet.publicKey, 10000000000);    
      alert("sol sent");
      alert(wallet.publicKey);
    }
    
  return (
    <>
      <input placeholder='Amount'></input>
      <button onClick={AirdropSol}>Send amount</button>
    </>
  )
}

export default Airdrop