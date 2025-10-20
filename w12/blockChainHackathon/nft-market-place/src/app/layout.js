import { Inter } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "./context/WalletContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SwapMarket DEX",
  description: "Multi-token DEX and NFT Marketplace on Kasplex",
};

<Toaster
  position="top-right"
  toastOptions={{
    style: {
      fontSize: "18px",
      padding: "16px 20px",
      borderRadius: "12px",
      minWidth: "260px",
    },
    success: {
      style: {
        background: "rgba(46, 204, 113, 0.9)",
        color: "white",
      },
    }
  }}
/>;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          {" "}
          <Toaster position="top-right" />
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
