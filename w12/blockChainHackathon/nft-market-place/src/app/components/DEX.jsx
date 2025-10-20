  'use client';
  import { useState, useEffect } from 'react';
  import { ethers } from 'ethers';
  import { useWallet } from '../context/WalletContext';
  import { getSigner, formatBalance, formatAddress } from '../utils/web3';
  import { CONTRACT_ADDRESSES, TOKENS } from '../config/constants';
  import { multiTokenDEXABI } from '../lib/abis/multiTokenDEX';
  import { platformTokenABI } from '../lib/abis/platformToken';
  import { testTokenABI } from '../lib/abis/testTokens';

  // Simple token ABI with only essential functions
  const SIMPLE_TOKEN_ABI = [
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address to, uint256 value) returns (bool)",
    "function approve(address spender, uint256 value) returns (bool)",
    "function transferFrom(address from, address to, uint256 value) returns (bool)",
  ];

  export default function DEX() {
    const { account } = useWallet();
    const [activeSection, setActiveSection] = useState("swap");
    const [balances, setBalances] = useState({ SMKT: "0", TBTC: "0", TUSD: "0" });
    const [reserves, setReserves] = useState({
      "SMKT-TBTC": { reserveA: "0", reserveB: "0" },
      "SMKT-TUSD": { reserveA: "0", reserveB: "0" },
      "TBTC-TUSD": { reserveA: "0", reserveB: "0" },
    });
    const [swapFromToken, setSwapFromToken] = useState("SMKT");
    const [swapToToken, setSwapToToken] = useState("TBTC");
    const [swapAmountIn, setSwapAmountIn] = useState("");
    const [swapAmountOut, setSwapAmountOut] = useState("");
    const [liquidityTokenA, setLiquidityTokenA] = useState("SMKT");
    const [liquidityTokenB, setLiquidityTokenB] = useState("TBTC");
    const [liquidityAmountA, setLiquidityAmountA] = useState("");
    const [liquidityAmountB, setLiquidityAmountB] = useState("");
    const [loading, setLoading] = useState(false);
    const [txStatus, setTxStatus] = useState("");

    useEffect(() => {
      if (account) {
        loadAllData();
      }
    }, [account]);

    const loadAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([loadBalances(), loadAllReserves()]);
      } catch (error) {
        console.error("Error loading data:", error);
      }
      setLoading(false);
    };

    const loadBalances = async () => {
      try {
        const signer = await getSigner();
        const newBalances = {};

        for (const [symbol, token] of Object.entries(TOKENS)) {
          const contract = new ethers.Contract(
            token.address,
            SIMPLE_TOKEN_ABI,
            signer
          );
          const balance = await contract.balanceOf(account);
          newBalances[symbol] = balance.toString();
        }

        setBalances(newBalances);
      } catch (error) {
        console.error("Error loading balances:", error);
      }
    };

    const loadAllReserves = async () => {
      try {
        const signer = await getSigner();
        const dexContract = new ethers.Contract(
          CONTRACT_ADDRESSES.multiTokenDEX,
          multiTokenDEXABI,
          signer
        );

        const newReserves = {};
        const tokenPairs = [
          ["SMKT", "TBTC"],
          ["SMKT", "TUSD"],
          ["TBTC", "TUSD"],
        ];

        for (const [tokenA, tokenB] of tokenPairs) {
          try {
            const [reserveA, reserveB] = await dexContract.getReserves(
              TOKENS[tokenA].address,
              TOKENS[tokenB].address
            );
            newReserves[`${tokenA}-${tokenB}`] = {
              reserveA: reserveA.toString(),
              reserveB: reserveB.toString(),
            };
          } catch (error) {
            console.log(`Pool ${tokenA}-${tokenB} not found`);
            newReserves[`${tokenA}-${tokenB}`] = {
              reserveA: "0",
              reserveB: "0",
            };
          }
        }

        setReserves(newReserves);
      } catch (error) {
        console.error("Error loading reserves:", error);
      }
    };

    const calculateSwapOutput = async () => {
      if (!swapAmountIn || parseFloat(swapAmountIn) <= 0) {
        setSwapAmountOut("");
        return;
      }

      try {
        const signer = await getSigner();
        const dexContract = new ethers.Contract(
          CONTRACT_ADDRESSES.multiTokenDEX,
          multiTokenDEXABI,
          signer
        );

        const amountIn = ethers.parseUnits(swapAmountIn, 18);
        const poolKey = `${swapFromToken}-${swapToToken}`;
        const reserveData =
          reserves[poolKey] || reserves[`${swapToToken}-${swapFromToken}`];

        if (
          !reserveData ||
          reserveData.reserveA === "0" ||
          reserveData.reserveB === "0"
        ) {
          setSwapAmountOut("No liquidity");
          return;
        }

        const isDirectPair = reserves[poolKey];
        const reserveIn = isDirectPair
          ? reserveData.reserveA
          : reserveData.reserveB;
        const reserveOut = isDirectPair
          ? reserveData.reserveB
          : reserveData.reserveA;

        if (reserveIn === "0" || reserveOut === "0") {
          setSwapAmountOut("No liquidity");
          return;
        }

        const amountOut = await dexContract.getAmountOut(
          amountIn,
          reserveIn,
          reserveOut
        );
        setSwapAmountOut(ethers.formatUnits(amountOut, 18));
      } catch (error) {
        console.error("Error calculating swap:", error);
        setSwapAmountOut("Error");
      }
    };

    // Simple approval function
    const approveToken = async (tokenSymbol, amount) => {
      try {
        setTxStatus(`Approving ${tokenSymbol}...`);
        const signer = await getSigner();
        const tokenContract = new ethers.Contract(
          TOKENS[tokenSymbol].address,
          SIMPLE_TOKEN_ABI,
          signer
        );

        // Use the exact amount needed
        const approveTx = await tokenContract.approve(
          CONTRACT_ADDRESSES.multiTokenDEX,
          amount
        );
        setTxStatus(`Waiting for ${tokenSymbol} approval...`);
        await approveTx.wait();

        setTxStatus(`${tokenSymbol} approved successfully!`);
        return true;
      } catch (error) {
        console.error(`Approve failed for ${tokenSymbol}:`, error);
        setTxStatus(`Approve failed: ${error.message}`);
        return false;
      }
    };

    const handleSwap = async () => {
      if (
        !swapAmountIn ||
        !swapAmountOut ||
        swapAmountOut === "No liquidity" ||
        swapAmountOut === "Error"
      )
        return;

      try {
        setLoading(true);
        setTxStatus("Starting swap...");

        const amountIn = ethers.parseUnits(swapAmountIn, 18);
        const minAmountOut = ethers.parseUnits(swapAmountOut, 18);

        // Approve the exact amount needed
        setTxStatus(`Approving ${swapFromToken}...`);
        const approved = await approveToken(swapFromToken, amountIn);
        if (!approved) return;

        setTxStatus("Executing swap...");
        const signer = await getSigner();
        const dexContract = new ethers.Contract(
          CONTRACT_ADDRESSES.multiTokenDEX,
          multiTokenDEXABI,
          signer
        );

        const swapTx = await dexContract.swap(
          TOKENS[swapFromToken].address,
          TOKENS[swapToToken].address,
          amountIn,
          minAmountOut
        );

        setTxStatus("Waiting for confirmation...");
        await swapTx.wait();

        setTxStatus("Swap successful!");
        alert("✅ Swap successful!");

        setSwapAmountIn("");
        setSwapAmountOut("");
        await loadAllData();
      } catch (error) {
        console.error("Swap failed:", error);
        setTxStatus(`Swap failed: ${error.message}`);
        alert("❌ Swap failed: " + error.message);
      } finally {
        setLoading(false);
        setTimeout(() => setTxStatus(""), 3000);
      }
    };

    const handleAddLiquidity = async () => {
      if (!liquidityAmountA || !liquidityAmountB) return;

      try {
        setLoading(true);
        setTxStatus("Starting liquidity add...");

        // Convert to wei (18 decimals) - matching your Remix input
        const amountA = ethers.parseUnits(liquidityAmountA, 18);
        const amountB = ethers.parseUnits(liquidityAmountB, 18);

        // Approve token A with exact amount
        setTxStatus(`Approving ${liquidityTokenA}...`);
        const approvedA = await approveToken(liquidityTokenA, amountA);
        if (!approvedA) return;

        // Approve token B with exact amount
        setTxStatus(`Approving ${liquidityTokenB}...`);
        const approvedB = await approveToken(liquidityTokenB, amountB);
        if (!approvedB) return;

        setTxStatus("Adding liquidity to pool...");
        const signer = await getSigner();
        const dexContract = new ethers.Contract(
          CONTRACT_ADDRESSES.multiTokenDEX,
          multiTokenDEXABI,
          signer
        );

        // Call addLiquidity with exact parameters like in your Remix
        const liquidityTx = await dexContract.addLiquidity(
          TOKENS[liquidityTokenA].address, // tokenA
          TOKENS[liquidityTokenB].address, // tokenB
          amountA, // amountA (in wei)
          amountB // amountB (in wei)
        );

        setTxStatus("Waiting for transaction confirmation...");
        await liquidityTx.wait();

        setTxStatus("Liquidity added successfully!");
        alert("✅ Liquidity added successfully!");

        // Reset form
        setLiquidityAmountA("");
        setLiquidityAmountB("");
        await loadAllData();
      } catch (error) {
        console.error("Add liquidity failed:", error);
        setTxStatus(`Add liquidity failed: ${error.message}`);
        alert("❌ Add liquidity failed: " + error.message);
      } finally {
        setLoading(false);
        setTimeout(() => setTxStatus(""), 3000);
      }
    };

    const createPool = async () => {
      if (liquidityTokenA === liquidityTokenB) {
        alert("Please select two different tokens");
        return;
      }

      try {
        setLoading(true);
        setTxStatus("Creating pool...");

        const signer = await getSigner();
        const dexContract = new ethers.Contract(
          CONTRACT_ADDRESSES.multiTokenDEX,
          multiTokenDEXABI,
          signer
        );

        const createTx = await dexContract.createPool(
          TOKENS[liquidityTokenA].address,
          TOKENS[liquidityTokenB].address
        );

        setTxStatus("Waiting for pool creation...");
        await createTx.wait();

        setTxStatus("Pool created successfully!");
        alert("✅ Pool created successfully!");
        await loadAllData();
      } catch (error) {
        console.error("Create pool failed:", error);
        setTxStatus(`Create pool failed: ${error.message}`);
        alert("❌ Create pool failed: " + error.message);
      } finally {
        setLoading(false);
        setTimeout(() => setTxStatus(""), 3000);
      }
    };

    const getAvailableToTokens = (fromToken) => {
      return Object.keys(TOKENS).filter((token) => token !== fromToken);
    };

    const getPoolExists = (tokenA, tokenB) => {
      return (
        reserves[`${tokenA}-${tokenB}`]?.reserveA !== "0" ||
        reserves[`${tokenB}-${tokenA}`]?.reserveA !== "0"
      );
    };

    // Quick add liquidity buttons for common amounts
    const quickAddLiquidity = (amount) => {
      setLiquidityAmountA(amount.toString());
      setLiquidityAmountB(amount.toString());
    };

    return (
      <div className="space-y-6">
        {/* Loading and Status */}
        {txStatus && (
          <div className="glass-card p-4 rounded-xl bg-blue-500/20">
            <div className="text-white text-center">
              {loading && (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto mb-2"></div>
              )}
              {txStatus}
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(TOKENS).map(([symbol, token]) => (
            <div key={symbol} className="glass-card p-4 rounded-xl">
              <h3 className="text-white font-semibold">Your {symbol}</h3>
              <p className="text-2xl text-white font-bold">
                {formatBalance(balances[symbol])}
              </p>
              <p className="text-sm text-gray-300">Available for trading</p>
            </div>
          ))}
        </div>

        {/* Pool Reserves */}
        <div className="glass-card p-6 rounded-2xl">
          <h2 className="text-2xl font-bold text-white mb-4">💰 Pool Reserves</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(reserves).map(([pair, reserve]) => (
              <div
                key={pair}
                className={`p-4 rounded-lg ${
                  reserve.reserveA !== "0" ? "bg-green-500/20" : "bg-red-500/20"
                }`}
              >
                <h3 className="text-white font-semibold">{pair}</h3>
                <p className="text-white text-sm">
                  {pair.split("-")[0]}: {formatBalance(reserve.reserveA)}
                </p>
                <p className="text-white text-sm">
                  {pair.split("-")[1]}: {formatBalance(reserve.reserveB)}
                </p>
                <p
                  className={`text-xs ${
                    reserve.reserveA !== "0" ? "text-green-300" : "text-red-300"
                  }`}
                >
                  {reserve.reserveA !== "0" ? "Active" : "No Liquidity"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="glass-card p-2 rounded-xl">
          <div className="flex space-x-2">
            {["swap", "add-liquidity"].map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                  activeSection === section
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-white hover:bg-white/20"
                }`}
              >
                {section === "swap" && "💱 Swap"}
                {section === "add-liquidity" && "💰 Add Liquidity"}
              </button>
            ))}
          </div>
        </div>

        {/* Swap Section */}
        {activeSection === "swap" && (
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">Token Swap</h2>
            <div className="space-y-4">
              {/* From Token */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="text-white block mb-2">Amount In</label>
                  <input
                    type="number"
                    value={swapAmountIn}
                    onChange={(e) => {
                      setSwapAmountIn(e.target.value);
                      setTimeout(calculateSwapOutput, 500);
                    }}
                    placeholder="0.0"
                    className="input-field text-white focus:text-black focus:bg-amber-300 "
                  />
                  <p className="text-xs text-gray-300 mt-1">
                    Balance: {formatBalance(balances[swapFromToken])}
                  </p>
                </div>
                <div>
                  <label className="text-white block mb-2">From Token</label>
                  <select
                    value={swapFromToken}
                    onChange={(e) => {
                      setSwapFromToken(e.target.value);
                      setSwapAmountIn("");
                      setSwapAmountOut("");
                    }}
                    className="input-field text-white focus:text-black focus:bg-amber-300"
                  >
                    {Object.keys(TOKENS).map((token) => (
                      <option key={token} value={token}>
                        {token}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* To Token */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="text-white block mb-2">
                    Estimated Output
                  </label>
                  <input
                    type="text"
                    value={swapAmountOut}
                    readOnly
                    placeholder="0.0"
                    className="input-field  bg-gray-100"
                  />
                </div>
                <div>
                  <label className="text-white block mb-2">To Token</label>
                  <select
                    value={swapToToken}
                    onChange={(e) => {
                      setSwapToToken(e.target.value);
                      setSwapAmountOut("");
                      if (swapAmountIn) {
                        setTimeout(calculateSwapOutput, 500);
                      }
                    }}
                    className="input-field text-white focus:text-black focus:bg-amber-300"
                  >
                    {getAvailableToTokens(swapFromToken).map((token) => (
                      <option key={token} value={token}>
                        {token}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {swapAmountOut === "No liquidity" && (
                <div className="bg-red-500/20 p-3 rounded-lg">
                  <p className="text-white text-sm">
                    No liquidity available for {swapFromToken}-{swapToToken} pair
                  </p>
                </div>
              )}

              <button
                onClick={handleSwap}
                disabled={
                  !swapAmountIn ||
                  !swapAmountOut ||
                  swapAmountOut === "No liquidity" ||
                  swapAmountOut === "Error" ||
                  loading
                }
                className="btn-primary w-full py-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Swap Tokens"}
              </button>
            </div>
          </div>
        )}

        {/* Add Liquidity Section */}
        {activeSection === "add-liquidity" && (
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">Add Liquidity</h2>

            {/* Quick Add Buttons */}
            <div className="mb-4">
              <p className="text-white text-sm mb-2">Quick add:</p>
              <div className="flex space-x-2">
                {[10, 50, 100, 500].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => quickAddLiquidity(amount)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm"
                  >
                    {amount} each
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {/* Token Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white block mb-2">Token A</label>
                  <select
                    value={liquidityTokenA}
                    onChange={(e) => setLiquidityTokenA(e.target.value)}
                    className="input-field text-white focus:text-black focus:bg-amber-300"
                  >
                    {Object.keys(TOKENS).map((token) => (
                      <option key={token} value={token}>
                        {token}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-white block mb-2">Token B</label>
                  <select
                    value={liquidityTokenB}
                    onChange={(e) => setLiquidityTokenB(e.target.value)}
                    className="input-field text-white focus:text-black focus:bg-amber-300"
                  >
                    {Object.keys(TOKENS)
                      .filter((token) => token !== liquidityTokenA)
                      .map((token) => (
                        <option key={token} value={token}>
                          {token}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Amount Inputs */}
              <div>
                <label className="text-white block mb-2">
                  {liquidityTokenA} Amount
                </label>
                <input
                  type="number"
                  value={liquidityAmountA}
                  onChange={(e) => setLiquidityAmountA(e.target.value)}
                  placeholder="0.0"
                  className="input-field text-white focus:text-black focus:bg-amber-300"
                />
                <p className="text-xs text-gray-300 mt-1">
                  Balance: {formatBalance(balances[liquidityTokenA])}
                </p>
              </div>
              <div>
                <label className="text-white block mb-2">
                  {liquidityTokenB} Amount
                </label>
                <input
                  type="number"
                  value={liquidityAmountB}
                  onChange={(e) => setLiquidityAmountB(e.target.value)}
                  placeholder="0.0"
                  className="input-field text-white focus:text-black focus:bg-amber-300"
                />
                <p className="text-xs text-gray-300 mt-1">
                  Balance: {formatBalance(balances[liquidityTokenB])}
                </p>
              </div>

              {/* Transaction Details */}
              {(liquidityAmountA || liquidityAmountB) && (
                <div className="bg-blue-500/20 p-3 rounded-lg">
                  <p className="text-white text-sm font-semibold">
                    Transaction Details:
                  </p>
                  <p className="text-white text-xs">
                    • Approve {liquidityTokenA}: {liquidityAmountA || "0"} tokens
                  </p>
                  <p className="text-white text-xs">
                    • Approve {liquidityTokenB}: {liquidityAmountB || "0"} tokens
                  </p>
                  <p className="text-white text-xs">
                    • Add liquidity to {liquidityTokenA}-{liquidityTokenB} pool
                  </p>
                </div>
              )}

              {/* Pool Status */}
              <div
                className={`p-3 rounded-lg ${
                  getPoolExists(liquidityTokenA, liquidityTokenB)
                    ? "bg-green-500/20"
                    : "bg-yellow-500/20"
                }`}
              >
                <p className="text-white text-sm">
                  {getPoolExists(liquidityTokenA, liquidityTokenB)
                    ? `✅ ${liquidityTokenA}-${liquidityTokenB} Pool Exists`
                    : `⚠️ ${liquidityTokenA}-${liquidityTokenB} Pool Needs Creation`}
                </p>
                {!getPoolExists(liquidityTokenA, liquidityTokenB) && (
                  <button
                    onClick={createPool}
                    disabled={loading}
                    className="btn-secondary mt-2 w-full py-2"
                  >
                    Create Pool First
                  </button>
                )}
              </div>

              <button
                onClick={handleAddLiquidity}
                disabled={!liquidityAmountA || !liquidityAmountB || loading}
                className="btn-primary w-full py-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Adding Liquidity..." : "Add Liquidity"}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }