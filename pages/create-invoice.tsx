import CreateInvoiceForm from "@requestnetwork/create-invoice-form/react";
import Head from "next/head";
import { config } from "@/utils/config";
import { useAppContext } from "@/utils/context";
import { currencies } from "@/utils/currencies";


import {
  useRequestSnap,
  useMetaMask,
  isLocalSnap,
} from '../lib/hooks';
import { defaultSnapOrigin } from '../lib/hooks/config';



export default function CreateInvoice() {
  const { wallet, requestNetwork, decryptionProvider } = useAppContext();

  const { isFlask, snapsDetected } = useMetaMask();
  
  const requestSnap = useRequestSnap();
  
  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
    ? isFlask
    : snapsDetected;

  // const invokeSnap = useInvokeSnap();
  // const snapsDecryptionProvider = new SnapsDecryptionProvider(invokeSnap);

  // const handleTestClick = async () => {
  //   const decryptedValue = await snapsDecryptionProvider.decrypt(
  //     {
  //       type: 'ecies' as any,
  //       value: 'e462a1c191d0ded75d658d18893c3ea9023b320924af170bc167d3b6fdfc14fc664527d2ee0387c84a41d671fe28b7ee15906b9d2cf4b7fb31b61541aa9bce6ede0ffe592b3b089f8caaa29d2b1a03afb7f08ed8adcd322cd1c40b97f4b2f1d9d3'
  //     }, 
  //     {
  //       type: 'ethereumAddress' as any,
  //       value: '0xb3de30b4be816dd066b1c5c5c8aed340b88a18a1'
  //     });
  //   console.log(decryptedValue);   
  // };

  return (
    <>
      <Head>
        <title>Request Invoicing - Create an Invoice</title>
      </Head>

      <button
        type="button"
        onClick={requestSnap}
        disabled={!isMetaMaskReady}
      >
        CONNECT
      </button>
      <br />
      {/* <button
        type="button"
        onClick={handleTestClick}
        disabled={!isMetaMaskReady}
      >
        TEST
      </button> */}

      <div className="container m-auto  w-[100%]">
        <CreateInvoiceForm
          config={config}
          signer={wallet?.accounts[0]?.address || ""}
          requestNetwork={requestNetwork}
          decryptionProvider={decryptionProvider}
          currencies={currencies}
        />
      </div>
    </>
  );
}
