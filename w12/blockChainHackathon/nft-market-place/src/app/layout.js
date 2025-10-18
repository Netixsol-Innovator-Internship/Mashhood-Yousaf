import { Inter } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "./context/WalletContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SwapMarket DEX",
  description: "Multi-token DEX and NFT Marketplace on Kasplex",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
