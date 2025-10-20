"use client";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useWallet } from "../context/WalletContext";
import { getSigner, formatBalance } from "../utils/web3";
import { CONTRACT_ADDRESSES, TOKENS } from "../config/constants";
import { tokenFaucetABI } from "../lib/abis/tokenFaucet";
import { multiTokenDEXABI } from "../lib/abis/multiTokenDEX";

const Portfolio = () => {
  const { account } = useWallet();
  const [totalClaimed, setTotalClaimed] = useState(0);
  const [tokenBalances, setTokenBalances] = useState([]);
  const [poolData, setPoolData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (account) {
      loadPortfolio();
      const interval = setInterval(loadPortfolio, 10000); // auto refresh every 10s
      return () => clearInterval(interval);
    }
  }, [account]);

  const loadPortfolio = async () => {
    setLoading(true);
    try {
      const signer = await getSigner();

      // 1️⃣ Load claimed SMKT tokens from faucet
      const faucetContract = new ethers.Contract(
        CONTRACT_ADDRESSES.tokenFaucet,
        tokenFaucetABI,
        signer
      );
      const [, claimed] = await faucetContract.getUserClaimInfo(account);
      setTotalClaimed(Number(claimed));

      // 2️⃣ Load balances for all TOKENS dynamically
      const balances = await Promise.all(
        Object.entries(TOKENS).map(async ([symbol, token]) => {
          const contract = new ethers.Contract(
            token.address,
            ["function balanceOf(address) view returns (uint256)"],
            signer
          );
          const bal = await contract.balanceOf(account);
          return {
            symbol,
            balance: parseFloat(ethers.formatUnits(bal, 18)),
          };
        })
      );
      setTokenBalances(balances);

      // 3️⃣ Load pool info from DEX
      const dexContract = new ethers.Contract(
        CONTRACT_ADDRESSES.multiTokenDEX,
        multiTokenDEXABI,
        signer
      );

      const poolPairs = [];
      const tokenSymbols = Object.keys(TOKENS);
      for (let i = 0; i < tokenSymbols.length; i++) {
        for (let j = i + 1; j < tokenSymbols.length; j++) {
          const tokenA = tokenSymbols[i];
          const tokenB = tokenSymbols[j];
          try {
            const [reserveA, reserveB] = await dexContract.getReserves(
              TOKENS[tokenA].address,
              TOKENS[tokenB].address
            );

            // get user liquidity in pool
            const userLiquidity = await dexContract.getUserLiquidity(
              TOKENS[tokenA].address,
              TOKENS[tokenB].address,
              account
            );

            poolPairs.push({
              pair: `${tokenA}-${tokenB}`,
              reserveA: parseFloat(ethers.formatUnits(reserveA, 18)),
              reserveB: parseFloat(ethers.formatUnits(reserveB, 18)),
              userLiquidity: parseFloat(ethers.formatUnits(userLiquidity, 18)),
            });
          } catch (err) {
            // pool might not exist yet
            poolPairs.push({
              pair: `${tokenA}-${tokenB}`,
              reserveA: 0,
              reserveB: 0,
              userLiquidity: 0,
            });
          }
        }
      }

      setPoolData(poolPairs);
    } catch (err) {
      console.error("Error loading portfolio:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-2xl text-white">
        <h2 className="text-2xl font-bold mb-4">Your Portfolio</h2>
        {loading ? (
          <p>Loading portfolio...</p>
        ) : (
          <>
            <p className="text-lg">
              💰 You’ve claimed{" "}
              <span className="font-bold">{totalClaimed}</span> SMKT tokens
            </p>

            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-2">Wallet Balances</h3>
              <ul className="space-y-1">
                {tokenBalances.map((t, i) => (
                  <li key={i}>
                    🪙 {t.symbol}:{" "}
                    <span className="font-bold">{t.balance.toFixed(4)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-2">DEX Pools</h3>
              {poolData.map((pool, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg mb-2 ${
                    pool.reserveA > 0 && pool.reserveB > 0
                      ? "bg-green-500/20"
                      : "bg-red-500/20"
                  }`}
                >
                  <p className="text-white font-semibold">{pool.pair}</p>
                  <p className="text-white text-sm">
                    {pool.pair.split("-")[0]}: {pool.reserveA.toFixed(4)}
                  </p>
                  <p className="text-white text-sm">
                    {pool.pair.split("-")[1]}: {pool.reserveB.toFixed(4)}
                  </p>
                  <p className="text-white text-sm">
                    Your Liquidity: {pool.userLiquidity.toFixed(4)}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
  