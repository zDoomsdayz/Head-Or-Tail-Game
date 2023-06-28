import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import ProfileComponent from "../components/ProfileComponent";

import Footer from "../components/Footer";


const Home: NextPage = () => {
  return (
    <main className={styles.main}>
      <Head>
        <title>PulsePepe - Heads or Tails</title>
        <meta name="description" content="Head Tail Game" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png"/>
      </Head>
      <ProfileComponent />
    </main>
  );
};

export default Home;
