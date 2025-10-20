"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "./context/WalletContext";
import { formatAddress } from "./utils/web3";
import DEX from "./components/DEX";
import NFTMarketplace from "./components/NFTMarketplace";
import TokenFaucet from "./components/TokenFaucet";
import Portfolio from "./components/Portfolio";

export default function Home() {
  const { account, isConnected, connect, disconnect } = useWallet();
  const [activeTab, setActiveTab] = useState("dex");

  const tabAnimation = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.3 },
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 p-10 rounded-3xl shadow-2xl text-center"
        >
          <h1 className="text-5xl font-extrabold text-white mb-3">
            SwapMarket DEX
          </h1>
          <p className="text-blue-100 mb-8 text-lg">
            Multi-token DEX & NFT Marketplace on Kasplex
          </p>
          <button
            onClick={connect}
            className="bg-white text-blue-600 font-semibold px-10 py-3 rounded-2xl shadow-lg hover:scale-105 transition-transform"
          >
            Connect Wallet
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-5 mb-6 shadow-xl"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">SwapMarket DEX</h1>
          <div className="flex items-center space-x-4">
            <span className="bg-white/20 text-white px-4 py-1 rounded-full font-mono text-sm">
              {formatAddress(account)}
            </span>
            <button
              onClick={disconnect}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-1 rounded-xl transition-all"
            >
              Disconnect
            </button>
          </div>
        </div>
      </motion.header>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-3xl p-3 mb-6 shadow-md"
      >
        <div className="flex space-x-3">
          {[
            { id: "dex", label: "💱 DEX Trading" },
            { id: "nft", label: "NFT Marketplace" },
            { id: "faucet", label: "🚰 Token Faucet" },
            { id: "portfolio", label: "Portfolio" },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 cursor-pointer px-5 rounded-2xl font-semibold text-sm transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                  : "text-gray-300 hover:bg-gray-600/50"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>
      </motion.nav>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.main
          key={activeTab}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-3xl shadow-inner"
        >
          {activeTab === "dex" && <DEX />}
          {activeTab === "nft" && <NFTMarketplace />}
          {activeTab === "faucet" && <TokenFaucet />}
          {activeTab === "portfolio" && <Portfolio />}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
