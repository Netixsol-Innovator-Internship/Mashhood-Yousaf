// "use client";

// import "@rainbow-me/rainbowkit/styles.css";
// import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
// import { WagmiProvider } from "wagmi";
// import { sepolia } from "wagmi/chains";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// const kasplexTestnet = {
//   id: 167012,
//   name: "kasplex",
//   nativeCurrency: { name: "kas", symbol: "kas", decimals: 18 },
//   rpcUrls: {
//     // default: { http: ['https://testnet.kasplex.dev/rpc'] },
//     default: { http: ["https://rpc.kasplextest.xyz"] },
//   },
//   testnet: true,
// };

// export const config = getDefaultConfig({
//   appName: "MyToken",
//   projectId: "63819faa36cc1bc8a38fe50869f81cc2", // from WalletConnect Cloud
//   chains: [kasplexTestnet],
// });

// const queryClient = new QueryClient();

// export function Providers({ children }: { children: React.ReactNode }) {
//   return (
//     <WagmiProvider config={config}>
//       <QueryClientProvider client={queryClient}>
//         <RainbowKitProvider>{children}</RainbowKitProvider>
//       </QueryClientProvider>
//     </WagmiProvider>
//   );
// }
"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const kasplexTestnet = {
  id: 167012,
  name: "kasplex",
  nativeCurrency: {
    name: "kas",
    symbol: "kas",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://rpc.kasplextest.xyz"] },
  },
  blockExplorers: {
    default: {
      name: "kasplex",
      url: "https://explorer.testnet.kasplextest.xyz",
    },
  },
  testnet: true,
};

export const config = getDefaultConfig({
  appName: "MyToken",
  projectId: "63819faa36cc1bc8a38fe50869f81cc2",
  chains: [kasplexTestnet],
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
