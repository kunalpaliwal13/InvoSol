import React, { useEffect, useMemo, useState } from 'react'
import Header from './Header'
import { jsPDF } from "jspdf";
import { useConnection, useWallet} from '@solana/wallet-adapter-react';
import "@solana/wallet-adapter-react-ui/styles.css";
import { WalletMultiButton} from '@solana/wallet-adapter-react-ui';
import { getDocument, GlobalWorkerOptions, version } from 'pdfjs-dist';
import { Keypair, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';

GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;


function Invoice() {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [uploadedImage, setUploadedImage] = useState(null);
    const [formData, setFormData] = useState({
      fromName: "",
      toName: "",
      invoiceDate: "",
      dueDate: "",
      description: "",
      fromSolAddress: "",
      totalAmt: "",
      logo: "",
    })
    // GlobalWorkerOptions.workerSrc = pdfWorker;

    useEffect(() => {
        if (!connection || !publicKey) {
            console.error("Wallet not connected");
        }
        try {
            console.log(publicKey);
        }catch (error) {
        console.error("Failed to retrieve account info:", error);
      }
    },[connection, publicKey])

    
    
    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));};

    const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result); // Data URL (base64)
      };
      reader.readAsDataURL(file);
    };   

    const generateInvoiceNumber = () => {
      const now = new Date();
      const id = `INV-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}-${now.getTime().toString().slice(-5)}`;
      return id
    };

// Example: "INV-20250514-12345"

  const generatePDF = async (formData) => {
      const doc = new jsPDF();
      

      const img = new Image();
      img.src = "/images/template.jpg"; 
      img.onload = () => {
        
        doc.addImage(img, "JPEG", 0, 0, 210, 297); 

        //logo
        if (uploadedImage) {
           doc.addImage(uploadedImage, "PNG", 25, 40, 20, 20); // x, y, width, height
        }
      
        // Now overlay formData
        doc.setFontSize(14);
        doc.text(formData.fromName || "FROM NAME",27, 77);
        doc.text(formData.toName || "TO NAME", 27, 103);
        doc.text(`${generateInvoiceNumber()}`, 160, 72);
        doc.text(`${formData.invoiceDate}`, 161, 79);
        doc.text(`${formData.dueDate}`, 161, 87);
        doc.text(formData.description || "Description goes here", 27, 132);

        
        doc.setFontSize(11)
        doc.text(`${publicKey}`, 105, 112);
        doc.text(`${formData.totalAmt} SOL`, 105, 128);
        doc.save("invoice.pdf");
  };
};  


  
  


  const readPDF =(e)=>{
    const file = e.target.files[0];
    if (!file || file.type !== 'application/pdf') return;

    console.log("found file");

    const reader = new FileReader();

    reader.onload = async () => {
      const typedArray = new Uint8Array(reader.result);

    
      
      try{
        const pdf = await getDocument({data: typedArray}).promise;
        const page = await pdf.getPage(1);
        const content = await page.getTextContent();
        const sendTo = content.items[7].str;
        const amt = content.items[8].str
        const match = amt.match(/[\d.]+/);


        const amount = parseFloat(match[0]);  
        console.log(`amt ${amount}`);  

        // console.log(content.items[7].str);

        const lamports = amount * LAMPORTS_PER_SOL;
        console.log(lamports);
        
        const transaction = new Transaction().add(SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: sendTo,
          lamports,}));
    
        const {
          context: { slot: minContextSlot },
          value: { blockhash, lastValidBlockHeight }
        } = await connection.getLatestBlockhashAndContext();

        const signature = await sendTransaction(transaction, connection, { minContextSlot });
        await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });
        alert("Transaction Successful !");
        e.target.value = '';
      }catch(e){alert("There was some error, please try later.");console.error(e);}
    };
    reader.readAsArrayBuffer(file);
  };

  
  



    
    


  return (
    <>
    <Header/>
    <div className='fixed flex p-2'>
    <WalletMultiButton />
    </div>
    <div className="min-h-screen bg-[#212121] bg-cover bg-no-repeat flex items-baseline justify-center pt-20 ">
        
      <div className=" rounded-4xl mt-0  shadow-[#ffffff97] w-6xl " style={{background: "linear-gradient(to bottom, #0F0F0F 0%, #0F0F0F 90%, #0F0F0F 100%)"}}>
        <div className='bg-black w-full flex items-start px-15 pt-5 rounded-t-4xl'>
        <h1 className="text-3xl font-bold text-white mb-6 text-center">InvoSol</h1>
        </div>
        
        <form className=" px-10">
          
        <div className="flex gap-15 my-3"> {/* col -1 full col */}
            <div className='grid grid-cols-2 gap-10'>
                {/* from */}
                <div className='flex flex-col w-80 items-start text-white'>
                    <p className='py-2 text-xl'>
                        From: 
                    </p>
                    <input
                      type="text"
                      name="fromName"
                      onChange={handleChange}
                      placeholder="Sender's Name"
                      className="bg-[#d9d9d936] text-white w-full rounded-md p-3"
                      />
                </div>

                {/* to  */}
                <div className='flex flex-col w-80 items-start text-white'>
                    <p className='py-2 text-xl'>
                        To: 
                    </p>
                    <input
                      type="text"
                      name="toName"
                      onChange={handleChange}
                      placeholder="Recipient's Name"
                      className="bg-[#d9d9d936] text-white rounded-md w-full p-3"
                    />
                </div>

                 <div className='flex flex-col w-80 items-start text-white'>
                    <p className='py-2 text-xl'>
                        Invoice Date: 
                    </p>
                    <input
                      type="date"
                      name="invoiceDate"
                      onChange={handleChange}
                      placeholder="From"
                      className="bg-[#d9d9d936] text-white w-full rounded-md p-3"
                      />
                </div>

                {/* to  */}
                <div className='flex flex-col w-80 items-start text-white'>
                    <p className='py-2 text-xl'>
                        Due Date: 
                    </p>
                    <input
                      type="date"
                      name="dueDate"
                      onChange={handleChange}
                      placeholder="To"
                      className="bg-[#d9d9d936] text-white rounded-md w-full p-3"
                    />
                </div>
            </div>


            <div className='flex flex-col w-sm items-start text-white'>
                <p className='py-2 text-xl'>
                    Description: 
                </p>
                <textarea onChange={handleChange} name="description" placeholder="Purpose of the invoice" type="text" className="bg-[#d9d9d936] text-white rounded-md w-full h-45 p-3"/>
            </div>
        </div>
        
           
        <div className="flex gap-15 my-3"> {/* col -1 full col */}
            <div className='grid grid-cols-1 gap-7'>
                {/* from */}
                <div className='flex flex-col w-2xl items-start text-white'>
                    <p className='py-2 text-xl'>
                        From Sol address: 
                    </p>
                    <input
                      readOnly
                      name="fromSolAddress"
                      type="text"
                      value = {publicKey}
                      placeholder="Your public key"
                      className="bg-[#d9d9d97a] text-white w-full rounded-md p-3"
                      />
                </div>

                 <div className='flex flex-col w-2xl items-start text-white'>
                    <p className='py-2 text-xl'>
                        Total Sol Amount: 
                    </p>
                    <input
                      type="text"
                      name="totalAmt"
                      onChange={handleChange}
                      placeholder="Total Amount in SOL"
                      className="bg-[#d9d9d936] text-white w-full rounded-md p-3"
                      />
                </div>

                
            </div>


            <div className='flex flex-col w-sm items-start text-white'>
                <p className='py-2 text-xl'>
                    Drop your logo: 
                </p>
                <input name="logo" type="file" onChange={handleFileChange} accept= "image/*" className="bg-[#d9d9d936] text-white rounded-md w-full h-45 p-3"/>
            </div>
        </div>
          

          {/* Generate Invoice Button */}
          <div className="flex justify-end my-7 gap-10">
           <input type="file" id="pdfInput" accept="application/pdf" style={{display: "none"}} onChange={(e) => readPDF(e)}/>
            <label htmlFor="pdfInput" className="bg-[#70798c] hover:bg-[#5a606e] text-white rounded-md p-4 font-bold">
              Send Payment
            </label>
            <button
            onClick={() => generatePDF(formData)}
              type="button"
              className="bg-[#70798c] hover:bg-[#5a606e] text-white rounded-md p-4 font-bold"
            >
              Generate Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
    </>

  )
}

export default Invoice
