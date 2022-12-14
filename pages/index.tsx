import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import contractInterface from '../contract-abi.json';

const contractConfig = {
  addressOrName: '0x0DB0Ba833d712a42439d0D0E1C25B078C2EADdAA',
  contractInterface: contractInterface,
};

const Home: NextPage = () => {
  const [totalMinted, setTotalMinted] = React.useState(0);
  const { isConnected } = useAccount();

  const { config: contractWriteConfig } = usePrepareContractWrite({
    ...contractConfig,
    functionName: 'mint',
  });

  const {
    data: mintData,
    write: mint,
    isLoading: isMintLoading,
    isSuccess: isMintStarted,
    error: mintError,
  } = useContractWrite(contractWriteConfig);

  const { data: totalSupplyData } = useContractRead({
    ...contractConfig,
    functionName: 'totalSupply',
    watch: true,
  });

  const {
    data: txData,
    isSuccess: txSuccess,
    error: txError,
  } = useWaitForTransaction({
    hash: mintData?.hash,
  });

  React.useEffect(() => {
    if (totalSupplyData) {
      setTotalMinted(totalSupplyData.toNumber());
    }
  }, [totalSupplyData]);

  const isMinted = txSuccess;

  return (
    <div className={styles.container}>
      <Head>
        <title>Nova Cats</title>
        <meta
          name="description"
          content="Generated by @rainbow-me/create-rainbowkit"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <ConnectButton />

        <h1 className={styles.title}>
          Nova Cats
        </h1>

        <p style={{ margin: '12px 0 24px' }}>
          {totalMinted} / 999 minted so far!
        </p>

        {mintError && (
          <p style={{ marginTop: 24, color: '#FF6257' }}>
            Error: {mintError.message}
          </p>
        )}
        {txError && (
          <p style={{ marginTop: 24, color: '#FF6257' }}>
            Error: {txError.message}
          </p>
        )}

        {isConnected && !isMinted && (
          <button
            style={{ marginTop: 24 }}
            disabled={!mint || isMintLoading || isMintStarted}
            className="button"
            data-mint-loading={isMintLoading}
            data-mint-started={isMintStarted}
            onClick={() => mint?.()}
          >
            {isMintLoading && 'Waiting for approval'}
            {isMintStarted && 'Minting...'}
            {!isMintLoading && !isMintStarted && 'Mint'}
          </button>
        )}

      </main>

      <footer className={styles.footer}>
        Made with ?????? by abcoathup
      </footer>
    </div>
  );
};

export default Home;
