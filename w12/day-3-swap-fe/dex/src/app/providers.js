// src/app/providers.js
"use client";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient();

// Example: Kasplex Testnet (custom RPC)
const kasplexTestnet = {
  id: 167012,
  name: "kasplex",
  nativeCurrency: { name: "kas", symbol: "kas", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.kasplextest.xyz"] },
  },
  testnet: true,
};

const config = getDefaultConfig({
  appName: "dex",
  projectId: "d0f305855919cb966201a07970d61150",
  chains: [kasplexTestnet],
});

export function Providers({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
