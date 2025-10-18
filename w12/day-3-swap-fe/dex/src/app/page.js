"use client";

import { useEffect, useState } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useDisconnect,
} from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Wallet, ArrowDownUp, ChevronDown } from "lucide-react";

// ----------------- Contract Addresses -----------------
const SWAP_CONTRACT_ADDRESS = "0x76e2E13b62Bf3abCA6D4165eD52B507172D4A1aB";
const TOKEN_A_ADDRESS = "0xD2e24009E44Ff2d2A302c551b784F904D4061A4B";
const TOKEN_B_ADDRESS = "0xae012ED4756a1fFe98B582441F330b64aada5312";

// ----------------- ABIs -----------------
const SWAP_ABI = [
  {
    type: "function",
    name: "getReserves",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }, { type: "uint256" }],
  },
  {
    type: "function",
    name: "getSwapAmount",
    stateMutability: "view",
    inputs: [
      { type: "uint256", name: "amountIn" },
      { type: "bool", name: "aToB" },
    ],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "swapAforB",
    stateMutability: "nonpayable",
    inputs: [{ type: "uint256", name: "amountAIn" }],
    outputs: [],
  },
  {
    type: "function",
    name: "swapBforA",
    stateMutability: "nonpayable",
    inputs: [{ type: "uint256", name: "amountBIn" }],
    outputs: [],
  },
  {
    type: "function",
    name: "addLiquidity",
    stateMutability: "nonpayable",
    inputs: [{ type: "uint256" }, { type: "uint256" }],
    outputs: [],
  },
];

const TOKEN_ABI = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [{ type: "address" }, { type: "uint256" }],
    outputs: [{ type: "bool" }],
  },
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint8" }],
  },
  {
    type: "function",
    name: "symbol",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string" }],
  },
];

export default function App() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  // ------------------- UI STATES -------------------
  const [aToB, setAToB] = useState(true);
  const [amountIn, setAmountIn] = useState("");
  const [estimatedOut, setEstimatedOut] = useState("0");

  // ------------------- READ DECIMALS -------------------
  const { data: decimalsAData } = useReadContract({
    address: TOKEN_A_ADDRESS,
    abi: TOKEN_ABI,
    functionName: "decimals",
    watch: true,
  });
  const { data: decimalsBData } = useReadContract({
    address: TOKEN_B_ADDRESS,
    abi: TOKEN_ABI,
    functionName: "decimals",
    watch: true,
  });
  const decimalsA = decimalsAData ?? 18;
  const decimalsB = decimalsBData ?? 18;

  // ------------------- READ RESERVES -------------------
  const { data: reserves } = useReadContract({
    address: SWAP_CONTRACT_ADDRESS,
    abi: SWAP_ABI,
    functionName: "getReserves",
    watch: true,
  });
  // const reserveAraw = reserves ? BigInt(reserves[0]) : 0n;
  // const reserveBraw = reserves ? BigInt(reserves[1]) : 0n;
  // const reserveADisplay = formatUnits(reserveAraw, Number(decimalsA));
  // console.log('reserveADisplay', reserveADisplay)
  // const reserveBDisplay = formatUnits(reserveBraw, Number(decimalsB));
  const reserveAraw = reserves ? BigInt(reserves[0]) : 0n;
  const reserveBraw = reserves ? BigInt(reserves[1]) : 0n;

  // show same as Remix (raw contract value)
  const reserveADisplay = reserveAraw.toString();
  const reserveBDisplay = reserveBraw.toString();
  const totalLiquidity = (
    parseFloat(reserveADisplay || "0") + parseFloat(reserveBDisplay || "0")
  ).toString();

  // ------------------- READ BALANCES -------------------
  const { data: balanceA } = useReadContract({
    address: TOKEN_A_ADDRESS,
    abi: TOKEN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    watch: true,
  });
  const { data: balanceB } = useReadContract({
    address: TOKEN_B_ADDRESS,
    abi: TOKEN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    watch: true,
  });

  // ------------------- WRITE -------------------
  const { writeContractAsync: approveToken } = useWriteContract();
  const { writeContractAsync: swapTokens } = useWriteContract();

  // ------------------- ESTIMATED OUTPUT (on-chain) -------------------
  const amountInArg =
    amountIn && amountIn !== ""
      ? parseUnits(amountIn, aToB ? Number(decimalsA) : Number(decimalsB))
      : undefined;

  const { data: estimatedOutRaw } = useReadContract({
    address: SWAP_CONTRACT_ADDRESS,
    abi: SWAP_ABI,
    functionName: "getSwapAmount",
    args: amountInArg ? [amountInArg, aToB] : undefined,
    watch: true,
  });

  useEffect(() => {
    if (!estimatedOutRaw) {
      setEstimatedOut("0");
      return;
    }
    const outDecimals = aToB ? Number(decimalsB) : Number(decimalsA);
    setEstimatedOut(formatUnits(BigInt(estimatedOutRaw), outDecimals));
  }, [estimatedOutRaw, aToB, decimalsA, decimalsB]);

  // ------------------- HANDLE SWAP -------------------
  const handleSwap = async () => {
    if (!amountIn || Number(amountIn) <= 0) return;
    try {
      const amount = parseUnits(
        amountIn,
        aToB ? Number(decimalsA) : Number(decimalsB)
      );

      // Step 1: Approve correct token
      const tokenAddress = aToB ? TOKEN_A_ADDRESS : TOKEN_B_ADDRESS;
      await approveToken({
        address: tokenAddress,
        abi: TOKEN_ABI,
        functionName: "approve",
        args: [SWAP_CONTRACT_ADDRESS, amount],
      });

      // Step 2: Wait a short delay to ensure approval mined
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Step 3: Call correct swap function on the swap contract
      const functionName = aToB ? "swapAforB" : "swapBforA";
      await swapTokens({
        address: SWAP_CONTRACT_ADDRESS,
        abi: SWAP_ABI,
        functionName,
        args: [amount],
      });

      alert("✅ Swap Successful");
      setAmountIn("");
    } catch (error) {
      console.error("Swap failed:", error);
      alert("❌ Swap Failed. Check console for details.");
    }
  };

  // ------------------- PRICE IMPACT -------------------
  const priceImpact = () => {
    if (!amountIn) return "0.00";

    const inputAmountHuman = parseFloat(amountIn);
    const rA = parseFloat(reserveADisplay || "0");
    const rB = parseFloat(reserveBDisplay || "0");

    if (aToB) {
      const spotPrice = rB / rA;
      const effectivePrice = parseFloat(estimatedOut) / inputAmountHuman;
      return Math.abs(((spotPrice - effectivePrice) / spotPrice) * 100).toFixed(
        2
      );
    } else {
      const spotPrice = rA / rB;
      const effectivePrice = parseFloat(estimatedOut) / inputAmountHuman;
      return Math.abs(((spotPrice - effectivePrice) / spotPrice) * 100).toFixed(
        2
      );
    }
  };

  const toggleDirection = () => {
    setAToB(!aToB);
    setAmountIn("");
    setEstimatedOut("0");
  };

  // ------------------- UI -------------------
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0a0a0f] overflow-hidden text-white">
      <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-gradient-to-tr from-fuchsia-500 via-purple-600 to-blue-600 blur-3xl opacity-30 animate-pulse-slow rounded-full" />

      <div className="relative w-full max-w-lg bg-gradient-to-br from-gray-900/70 via-gray-900/80 to-black/90 backdrop-blur-2xl border border-gray-800/50 rounded-3xl shadow-[0_0_60px_rgba(168,85,247,0.2)] p-8 transition-all duration-500 hover:shadow-[0_0_80px_rgba(168,85,247,0.4)]">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-xl flex items-center justify-center animate-[spin_6s_linear_infinite] hover:animate-none transition">
              <ArrowDownUp className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-fuchsia-400 to-purple-500 bg-clip-text text-transparent">
              MYG DEX POOL
            </h1>
          </div>
        </div>

        <div className="space-y-6">
          {!isConnected ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center shadow-[0_0_40px_rgba(236,72,153,0.3)]">
                <Wallet className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Connect Wallet</h2>
              <p className="text-gray-400 mb-6">
                Connect your wallet to begin trading
              </p>
              <ConnectButton />
            </div>
          ) : (
            <>
              {/* STATUS BAR */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-700/50 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-sm text-gray-400">Connected</span>
                </div>
                <span className="text-sm font-mono text-gray-300">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
                <button
                  onClick={() => disconnect()}
                  className="text-xs bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-3 py-1.5 rounded-lg font-semibold shadow-[0_0_10px_rgba(239,68,68,0.4)] hover:shadow-[0_0_15px_rgba(239,68,68,0.6)] transition-all"
                >
                  Disconnect
                </button>
              </div>

              {/* FROM */}
              <div className="bg-gray-900/70 rounded-2xl p-5 border border-gray-800 hover:border-purple-600/50 transition">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>From</span>
                  <span>
                    Reserve:{" "}
                    {aToB
                      ? reserveADisplay // Show Token A reserve when swapping A→B
                      : reserveBDisplay}{" "}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <input
                    type="number"
                    placeholder="0.0"
                    value={amountIn}
                    onChange={(e) => setAmountIn(e.target.value)}
                    className="bg-transparent w-full text-4xl font-semibold outline-none placeholder-gray-600 
                    [&::-webkit-outer-spin-button]:appearance-none 
                    [&::-webkit-inner-spin-button]:appearance-none 
                    [-moz-appearance:textfield]"
                  />
                  <button className="flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-2 rounded-xl">
                    <span>{aToB ? "Token A" : "Token B"}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* SWITCH */}
              <div className="flex justify-center -my-3 z-10 relative">
                <button
                  onClick={toggleDirection}
                  className="bg-gradient-to-br from-purple-600 to-fuchsia-600 p-3 rounded-2xl hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                >
                  <ArrowDownUp className="w-5 h-5 text-white animate-spin-slow" />
                </button>
              </div>

              {/* TO */}
              <div className="bg-gray-900/70 rounded-2xl p-5 border border-gray-800 hover:border-pink-600/50 transition">
                <div className="flex justify-between text-sm  text-gray-400 mb-2">
                  <span>To</span>
                  <span>
                    {aToB
                      ? reserveBDisplay // Show Token B reserve when swapping A→B
                      : reserveADisplay}{" "}
                  </span>
                </div>
                <div className="flex items-center  justify-between">
                  <div className="text-3xl max-w-65 break-words font-semibold">
                    {estimatedOut}
                  </div>
                  <button className="flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-2 rounded-xl">
                    <span>{aToB ? "Token B" : "Token A"}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* INFO */}
              {amountIn && parseFloat(amountIn) > 0 && (
                <div className="bg-gray-900/40 rounded-2xl p-4 text-sm space-y-2 border border-gray-800/50">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Price Impact</span>
                    <span
                      className={`${
                        parseFloat(priceImpact()) > 5
                          ? "text-red-400"
                          : "text-green-400"
                      }`}
                    >
                      {priceImpact()}%
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Liquidity Fee</span>
                    <span>0.3%</span>
                  </div>
                  <div className="flex justify-between text-gray-300 text-xs">
                    <span>Reserve A</span>
                    <span>
                      {Math.floor(Number(reserveADisplay)).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-300 text-xs">
                    <span>Reserve B</span>
                    <span>
                      {Math.floor(Number(reserveBDisplay)).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-300 text-xs">
                    <span>Total Pool Liquidity</span>
                    <span>
                      {Math.floor(Number(totalLiquidity)).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* BUTTON */}
              <button
                onClick={handleSwap}
                disabled={!amountIn}
                className="w-full bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-700 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed font-semibold py-4 rounded-2xl mt-2 transition-all duration-300 shadow-[0_0_25px_rgba(236,72,153,0.3)] hover:shadow-[0_0_40px_rgba(236,72,153,0.5)]"
              >
                Swap Tokens
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
