"use client";
import { useState } from "react";
import { useWallet } from "./context/WalletContext";
import { formatAddress } from "./utils/web3";
import DEX from "./components/DEX";
import NFTMarketplace from "./components/NFTMarketplace";
import TokenFaucet from "./components/TokenFaucet";

export default function Home() {
  const { account, isConnected, connect, disconnect } = useWallet();
  const [activeTab, setActiveTab] = useState("dex");

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 rounded-2xl shadow-2xl text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            🚀 SwapMarket DEX
          </h1>
          <p className="text-gray-200 mb-8">
            Multi-token DEX & NFT Marketplace on Kasplex
          </p>
          <button onClick={connect} className="btn-primary text-lg px-8 py-3">
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <header className="glass-card rounded-2xl p-4 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">SwapMarket DEX</h1>
          <div className="flex items-center space-x-4">
            <span className="text-white bg-blue-600 px-3 py-1 rounded-full">
              {formatAddress(account)}
            </span>
            <button onClick={disconnect} className="btn-secondary">
              Disconnect
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="glass-card rounded-2xl p-2 mb-6">
        <div className="flex space-x-2">
          {[
            { id: "dex", label: "💱 DEX Trading" },
            { id: "nft", label: "🖼️ NFT Marketplace" },
            { id: "faucet", label: "🚰 Token Faucet" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-white text-blue-600 shadow-lg"
                  : "text-white hover:bg-white/20"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {activeTab === "dex" && <DEX />}
        {activeTab === "nft" && <NFTMarketplace />}
        {activeTab === "faucet" && <TokenFaucet />}
      </main>
    </div>
  );
}
