  "use client";
  import { useState, useEffect } from "react";
  import { ethers } from "ethers";
  import { useWallet } from "../context/WalletContext";
  import { getSigner, formatBalance } from "../utils/web3";
  import { CONTRACT_ADDRESSES } from "../config/constants";
  import { tokenFaucetABI } from "../lib/abis/tokenFaucet";
  import { platformTokenABI } from "../lib/abis/platformToken";

  export default function TokenFaucet() {
    const { account } = useWallet();
    const [claimInfo, setClaimInfo] = useState(null);
    const [faucetBalance, setFaucetBalance] = useState("0");
    const [claiming, setClaiming] = useState(false);

    useEffect(() => {
      if (account) {
        loadClaimInfo();
        loadFaucetBalance();
      }
    }, [account]);

    const loadClaimInfo = async () => {
      try {
        const signer = await getSigner();
        const faucetContract = new ethers.Contract(
          CONTRACT_ADDRESSES.tokenFaucet,
          tokenFaucetABI,
          signer
        );

        const [lastClaim, getTotalClaimed, canClaimNow, timeUntilNext] =
          await faucetContract.getUserClaimInfo(account);
        console.log("getTotalClaimed", getTotalClaimed);
        setClaimInfo({
          lastClaim: lastClaim.toString(),
          totalClaimed: getTotalClaimed,
          canClaimNow,
          timeUntilNext: timeUntilNext.toString(),
        });
      } catch (error) {
        console.error("Error loading claim info:", error);
      }
    };

    const loadFaucetBalance = async () => {
      try {
        const signer = await getSigner();
        const faucetContract = new ethers.Contract(
          CONTRACT_ADDRESSES.tokenFaucet,
          tokenFaucetABI,
          signer
        );

        const balance = await faucetContract.getFaucetBalance();
        setFaucetBalance(balance);
      } catch (error) {
        console.error("Error loading faucet balance:", error);
      }
    };

    const claimTokens = async () => {
      try {
        setClaiming(true);
        const signer = await getSigner();
        const faucetContract = new ethers.Contract(
          CONTRACT_ADDRESSES.tokenFaucet,
          tokenFaucetABI,
          signer
        );

        const claimTx = await faucetContract.claimTokens();
        await claimTx.wait();

        alert("Tokens claimed successfully!");
        loadClaimInfo();
        loadFaucetBalance();
      } catch (error) {
        console.error("Error claiming tokens:", error);
        alert("Claim failed: " + error.message);
      } finally {
        setClaiming(false);
      }
    };

    const formatTime = (seconds) => {
      if (seconds === 0) return "Now";
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    };

    if (!claimInfo) {
      return (
        <div className="glass-card p-8 rounded-2xl text-center">
          <div className="text-white">Loading faucet information...</div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Faucet Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-4 rounded-xl">
            <h3 className="text-white font-semibold">Faucet Balance</h3>
            <p className="text-2xl text-white font-bold">
              {Number(faucetBalance)} SMKT
            </p>
          </div>
          <div className="glass-card p-4 rounded-xl">
            <h3 className="text-white font-semibold">Your Total Claimed</h3>
            <p className="text-2xl text-white font-bold">
              {Number(claimInfo.totalClaimed)} SMKT
            </p>
          </div>
          <div className="glass-card p-4 rounded-xl">
            <h3 className="text-white font-semibold">Next Claim Available</h3>
            <p className="text-2xl text-white font-bold">
              {claimInfo.canClaimNow
                ? "Now"
                : formatTime(claimInfo.timeUntilNext)}
            </p>
          </div>
        </div>

        {/* Claim Section */}
        <div className="glass-card p-8 rounded-2xl text-center">
          <div className="text-6xl mb-4">🚰</div>
          <h2 className="text-3xl font-bold text-white mb-4">Token Faucet</h2>
          <p className="text-gray-200 mb-6">
            Get free SMKT tokens to start trading on our DEX and buying NFTs!
          </p>

          <button
            onClick={claimTokens}
            disabled={!claimInfo.canClaimNow || claiming}
            className={`text-lg px-8 py-4 rounded-xl font-bold transition-all ${
              claimInfo.canClaimNow && !claiming
                ? "bg-green-500 hover:bg-green-600 text-white shadow-lg"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          >
            {claiming
              ? "Claiming..."
              : claimInfo.canClaimNow
              ? "Claim 100 SMKT"
              : "Claim Not Available"}
          </button>

          {!claimInfo.canClaimNow && claimInfo.timeUntilNext > 0 && (
            <p className="text-yellow-300 mt-4">
              Next claim available in: {formatTime(claimInfo.timeUntilNext)}
            </p>
          )}
        </div>

        {/* How it works */}
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-4">How it works:</h3>
          <ul className="text-gray-200 space-y-2">
            <li>• Claim 100 SMKT tokens every 24 hours</li>
            <li>• Use tokens to trade on our DEX</li>
            <li>• Buy NFTs from the marketplace</li>
            <li>• Provide liquidity to earn fees</li>
          </ul>
        </div>
      </div>
    );
  }
