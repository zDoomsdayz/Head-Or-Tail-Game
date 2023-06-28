import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import BettingComponent from "../components/BettingComponent";

import Footer from "../components/Footer";


const Home: NextPage = () => {
  return (
    <main className={styles.main}>
      <Head>
        <title>BET - Pulse Space Apes</title>
        <meta name="description" content="Head Tail Game" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png"/>
      </Head>
      <BettingComponent />
    </main>
  );
};

export default Home;
