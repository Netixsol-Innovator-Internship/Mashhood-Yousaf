"use client";

import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";

// 👇 Your Kasplex testnet chain
export const KASPLEX_CHAIN = {
  id: 167012,
  name: "Kasplex Testnet",
  network: "kasplex-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "KAS",
    symbol: "KAS",
  },
  rpcUrls: {
    public: { http: ["https://rpc.kasplextest.xyz"] },
    default: { http: ["https://rpc.kasplextest.xyz"] },
  },
  blockExplorers: {
    default: {
      name: "KasplexScan",
      url: "https://explorer.testnet.kasplextest.xyz",
    },
  },
};

// 👇 Create wagmi config
export const config = createConfig({
  chains: [KASPLEX_CHAIN],
  connectors: [injected()],
  transports: {
    [KASPLEX_CHAIN.id]: http("https://rpc.kasplextest.xyz"),
  },
});
