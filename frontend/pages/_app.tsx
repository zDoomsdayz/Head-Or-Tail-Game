import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import type { AppProps } from 'next/app';
import { configureChains, createConfig, useAccount, WagmiConfig } from 'wagmi';
import { mainnet, sepolia, pulsechain, pulsechainV4} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from "wagmi/providers/alchemy";
import MainLayout from "../layout/mainLayout";
import { useRouter } from "next/router";
import { Analytics } from '@vercel/analytics/react';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    pulsechain,
  ],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Pulse Space Apes dApp',
  projectId: 'YOUR_PROJECT_ID',
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const account = useAccount({
		onConnect({ address, connector, isReconnected }) {
			if (!isReconnected) router.reload();
		},
	});
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider 
        modalSize="compact"
        initialChain={pulsechain}
        chains={chains}
      >
        <MainLayout>
          <Component {...pageProps} />
          <Analytics />
        </MainLayout>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
