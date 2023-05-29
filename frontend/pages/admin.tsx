import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import AdminComponent from '../components/AdminComponent';

const Home: NextPage = () => {
  return (
    <main className={styles.main}>
      <AdminComponent />
    </main>
  );
};

export default Home;
