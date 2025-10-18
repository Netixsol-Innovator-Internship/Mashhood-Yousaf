"use client";

import {
  useAccount,
  useReadContract,
  useWriteContract,
  useChainId,
} from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./contract/contractConfig";
import { motion } from "framer-motion";
import { waitForTransactionReceipt } from "@wagmi/core";
import { config } from "./lib/wgmi";

export default function Home() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId(); // ✅ Correct wagmi v2 hook
  const { writeContractAsync } = useWriteContract();

  const [mintAmount, setMintAmount] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ✅ READ CONTRACT
  const { data: name } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "name",
  });

  const { data: symbol } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "symbol",
  });

  const { data: totalSupply } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "totalSupply",
  });

  // ✅ UNIVERSAL TX HANDLER
  async function handleTx(fn: string, args: any[] = []) {
    try {
      setIsLoading(true);

      console.log("Using chainId:", chainId); // 👀 Debug log

      const txHash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: fn,
        args,
        chainId, // ✅ now defined
      });

      const receipt = await waitForTransactionReceipt(config, {
        chainId,
        hash: txHash,
      });

      if (receipt.status === "success") alert(`✅ ${fn} confirmed!`);
      else alert(`❌ ${fn} failed.`);
    } catch (err) {
      console.error(err);
      alert(`❌ ${fn} transaction failed or rejected.`);
    } finally {
      setIsLoading(false);
    }
  }

  // ✅ UI
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex flex-col items-center py-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl bg-white shadow-lg rounded-3xl p-8 border border-gray-100"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2 tracking-tight">
            MyToken DApp 💎
          </h1>
          <p className="text-gray-500">Manage your ERC-20 tokens seamlessly</p>
        </motion.div>

        <div className="flex justify-center mb-6">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <ConnectButton />
          </motion.div>
        </div>

        {isConnected && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-gray-700 mb-6"
          >
            ✅ Connected Wallet:{" "}
            <span className="font-mono text-indigo-600">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-gradient-to-r from-indigo-50 via-blue-50 to-sky-50 p-6 mb-8 text-center border border-indigo-100"
        >
          <h2 className="text-xl font-semibold mb-4 text-indigo-700">
            Token Overview 📊
          </h2>
          <div className="space-y-2 text-gray-800">
            <p>
              <span className="font-medium">Name:</span>{" "}
              {name?.toString() || "Loading..."}
            </p>
            <p>
              <span className="font-medium">Symbol:</span>{" "}
              {symbol?.toString() || "Loading..."}
            </p>
            <p>
              <span className="font-medium">Total Supply:</span>{" "}
              {totalSupply
                ? (Number(totalSupply) / 10 ** 18).toLocaleString()
                : "Loading..."}
            </p>
          </div>
        </motion.div>

        {isConnected ? (
          <div className="space-y-6">
            {/* Mint */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                🪙 Mint Tokens
              </h3>
              <input
                placeholder="Amount (tokens)"
                value={mintAmount}
                onChange={(e) => setMintAmount(e.target.value)}
                className="border border-gray-300 p-2.5 rounded-xl w-full mb-3"
              />
              <button
                disabled={isLoading}
                onClick={() =>
                  handleTx("mint", [
                    address,
                    BigInt(mintAmount || "0") * 10n ** 18n,
                  ])
                }
                className={`w-full ${
                  isLoading
                    ? "bg-green-300 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                } transition text-white font-medium py-2.5 rounded-xl`}
              >
                {isLoading ? "Processing..." : "Mint Tokens"}
              </button>
            </motion.div>

            {/* Transfer */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                💸 Transfer Tokens
              </h3>
              <input
                placeholder="Recipient address"
                value={transferTo}
                onChange={(e) => setTransferTo(e.target.value)}
                className="border border-gray-300 p-2.5 rounded-xl w-full mb-3"
              />
              <input
                placeholder="Amount (tokens)"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                className="border border-gray-300 p-2.5 rounded-xl w-full mb-3"
              />
              <button
                disabled={isLoading}
                onClick={() =>
                  handleTx("transfer", [
                    transferTo,
                    BigInt(transferAmount || "0") * 10n ** 18n,
                  ])
                }
                className={`w-full ${
                  isLoading
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                } transition text-white font-medium py-2.5 rounded-xl`}
              >
                {isLoading ? "Processing..." : "Transfer"}
              </button>
            </motion.div>

            {/* Pause / Unpause */}
            <motion.div
              className="flex gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <button
                disabled={isLoading}
                onClick={() => handleTx("pause")}
                className={`flex-1 ${
                  isLoading
                    ? "bg-yellow-300 cursor-not-allowed"
                    : "bg-yellow-400 hover:bg-yellow-500"
                } text-white font-semibold py-2.5 rounded-xl`}
              >
                Pause
              </button>

              <button
                disabled={isLoading}
                onClick={() => handleTx("unpause")}
                className={`flex-1 ${
                  isLoading
                    ? "bg-green-300 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                } text-white font-semibold py-2.5 rounded-xl`}
              >
                Unpause
              </button>
            </motion.div>
          </div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 italic mt-10"
          >
            Connect your wallet to interact with the token.
          </motion.p>
        )}
      </motion.div>
    </main>
  );
}
