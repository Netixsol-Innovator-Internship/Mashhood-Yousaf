"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWallet } from "../context/WalletContext";
import { getSigner, formatBalance } from "../utils/web3";
import { CONTRACT_ADDRESSES } from "../config/constants";
import { nftMarketplaceABI } from "../lib/abis/nftMarketplace";
import { nftCollectionABI } from "../lib/abis/nftCollection";

export default function NFTMarketplace() {
  const { account } = useWallet();
  const [listings, setListings] = useState([]);
  const [userNFTs, setUserNFTs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listPrice, setListPrice] = useState("");
  const [mintURI, setMintURI] = useState("");
  const [selectedPaymentToken, setSelectedPaymentToken] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");
  const [basePrice, setBasePrice] = useState("0");

  // Map your addresses to the expected token names
  const paymentTokens = [
    {
      address: CONTRACT_ADDRESSES.platformToken,
      symbol: "SMKT",
      name: "Platform Token",
    },
    { address: CONTRACT_ADDRESSES.testUSD, symbol: "TUSD", name: "Test USD" },
    { address: CONTRACT_ADDRESSES.testBTC, symbol: "TBTC", name: "Test BTC" },
  ];

  // Alias addresses for easier reference
  const tokenA = CONTRACT_ADDRESSES.platformToken;
  const tokenB = CONTRACT_ADDRESSES.testUSD;
  const tokenC = CONTRACT_ADDRESSES.testBTC;

  useEffect(() => {
    if (account) {
      console.log("🔵 Account detected:", account);
      setDebugInfo("Account connected: " + account);
      initializeMarketplace();
    }
  }, [account]);

  const initializeMarketplace = async () => {
    try {
      await checkOwnerStatus();
      await loadBasePrice();
      await loadListings();
      await loadUserNFTs();
      // Set default payment token to SMKT
      setSelectedPaymentToken(tokenA);
    } catch (error) {
      console.error("Initialization error:", error);
      setDebugInfo("Initialization failed: " + error.message);
    }
  };

  const checkOwnerStatus = async () => {
    try {
      console.log("🔵 Checking owner status...");
      const signer = await getSigner();
      const marketplaceContract = new ethers.Contract(
        CONTRACT_ADDRESSES.nftMarketplace,
        nftMarketplaceABI,
        signer
      );

      const contractOwner = await marketplaceContract.owner();
      console.log("Contract Owner:", contractOwner);
      console.log("Current Account:", account);

      const ownerStatus = contractOwner.toLowerCase() === account.toLowerCase();
      setIsOwner(ownerStatus);
      console.log("Is Owner:", ownerStatus);

      setDebugInfo((prev) => prev + ` | Owner: ${ownerStatus}`);
    } catch (error) {
      console.error("❌ Error checking owner status:", error);
      setDebugInfo((prev) => prev + " | Owner check failed: " + error.message);
    }
  };

  const loadBasePrice = async () => {
    try {
      const signer = await getSigner();
      const marketplaceContract = new ethers.Contract(
        CONTRACT_ADDRESSES.nftMarketplace,
        nftMarketplaceABI,
        signer
      );

      const price = await marketplaceContract.basePriceTokenA();
      setBasePrice(price.toString());
      console.log("Base Price:", price.toString());
    } catch (error) {
      console.error("Error loading base price:", error);
    }
  };

  const loadListings = async () => {
    try {
      console.log("🔵 Loading NFT listings...");
      const signer = await getSigner();

      const marketplaceContract = new ethers.Contract(
        CONTRACT_ADDRESSES.nftMarketplace,
        nftMarketplaceABI,
        signer
      );

      const nftContract = new ethers.Contract(
        CONTRACT_ADDRESSES.nftCollection,
        nftCollectionABI,
        signer
      );

      // Get all token IDs by checking events or scanning a range
      const allListings = [];
      const MAX_TOKENS_TO_CHECK = 50; // Reduced for better performance

      console.log("Scanning for listed NFTs...");

      for (let tokenId = 1; tokenId <= MAX_TOKENS_TO_CHECK; tokenId++) {
        try {
          const listing = await marketplaceContract.listings(tokenId);
          console.log(`Token ${tokenId}:`, listing);

          if (listing.active) {
            let tokenURI = "";
            try {
              tokenURI = await nftContract.tokenURI(tokenId);
              console.log(`Token ${tokenId} URI:`, tokenURI);
            } catch (e) {
              console.log(`No token URI for ${tokenId}`);
            }

            allListings.push({
              tokenId: tokenId.toString(),
              seller: listing.seller,
              priceInTokenA: listing.priceInTokenA.toString(),
              active: listing.active,
              tokenURI,
            });
            console.log(`✅ Found active listing for token ${tokenId}`);
          }
        } catch (e) {
          // Token not listed or doesn't exist, continue to next
          continue;
        }
      }

      setListings(allListings);
      console.log("✅ Final listings loaded:", allListings);
      setDebugInfo((prev) => prev + ` | Listings: ${allListings.length}`);
    } catch (error) {
      console.error("❌ Error loading listings:", error);
      setDebugInfo(
        (prev) => prev + " | Listings load failed: " + error.message
      );
    }
  };

  const loadUserNFTs = async () => {
    try {
      console.log("🔵 Loading user NFTs...");
      const signer = await getSigner();
      const nftContract = new ethers.Contract(
        CONTRACT_ADDRESSES.nftCollection,
        nftCollectionABI,
        signer
      );

      const marketplaceContract = new ethers.Contract(
        CONTRACT_ADDRESSES.nftMarketplace,
        nftMarketplaceABI,
        signer
      );

      const userNFTsData = [];

      // Check a range of token IDs to find user's NFTs
      const MAX_TOKENS_TO_CHECK = 50;

      console.log("Scanning for user's NFTs...");

      for (let tokenId = 1; tokenId <= MAX_TOKENS_TO_CHECK; tokenId++) {
        try {
          const owner = await nftContract.ownerOf(tokenId);
          if (owner.toLowerCase() === account.toLowerCase()) {
            let tokenURI = "";
            let isListed = false;

            try {
              tokenURI = await nftContract.tokenURI(tokenId);

              const listing = await marketplaceContract.listings(tokenId);
              isListed = listing.active;
            } catch (e) {
              console.error(`Error loading NFT ${tokenId}:`, e);
            }

            userNFTsData.push({
              tokenId: tokenId.toString(),
              tokenURI,
              isListed,
            });
            console.log(`✅ Found user NFT: ${tokenId}`);
          }
        } catch (e) {
          // Token doesn't exist or error, continue
          continue;
        }
      }

      setUserNFTs(userNFTsData);
      console.log("✅ User NFTs loaded:", userNFTsData);
    } catch (error) {
      console.error("❌ Error loading user NFTs:", error);
    }
  };

  const listNFT = async (tokenId, priceInTokenA) => {
    try {
      setLoading(true);
      console.log(`📝 Listing NFT ${tokenId} for ${priceInTokenA} SMKT`);

      const signer = await getSigner();
      const marketplaceContract = new ethers.Contract(
        CONTRACT_ADDRESSES.nftMarketplace,
        nftMarketplaceABI,
        signer
      );

      // Check if marketplace is approved
      const nftContract = new ethers.Contract(
        CONTRACT_ADDRESSES.nftCollection,
        nftCollectionABI,
        signer
      );

      const isApprovedForAll = await nftContract.isApprovedForAll(
        account,
        CONTRACT_ADDRESSES.nftMarketplace
      );
      const isTokenApproved =
        (await nftContract.getApproved(tokenId)) ===
        CONTRACT_ADDRESSES.nftMarketplace;

      console.log("Approval status:", { isApprovedForAll, isTokenApproved });

      if (!isApprovedForAll && !isTokenApproved) {
        // Need to approve the marketplace
        console.log("Approving marketplace for NFT...");
        const approveTx = await nftContract.approve(
          CONTRACT_ADDRESSES.nftMarketplace,
          tokenId
        );
        await approveTx.wait();
        console.log("Marketplace approved for NFT");
      }

      const priceWei = ethers.parseUnits(priceInTokenA, 18);
      console.log("Listing with price:", priceWei.toString());

      const listTx = await marketplaceContract.listNFT(tokenId, priceWei);
      await listTx.wait();

      alert("NFT listed successfully!");
      setListPrice("");
      loadListings();
      loadUserNFTs();
    } catch (error) {
      console.error("❌ Error listing NFT:", error);
      alert("Listing failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const unlistNFT = async (tokenId) => {
    try {
      setLoading(true);
      const signer = await getSigner();
      const marketplaceContract = new ethers.Contract(
        CONTRACT_ADDRESSES.nftMarketplace,
        nftMarketplaceABI,
        signer
      );

      const unlistTx = await marketplaceContract.unlistNFT(tokenId);
      await unlistTx.wait();

      alert("NFT unlisted successfully!");
      loadListings();
      loadUserNFTs();
    } catch (error) {
      console.error("❌ Error unlisting NFT:", error);
      alert("Unlisting failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const buyNFT = async (tokenId, priceInTokenA) => {
    try {
      setLoading(true);
      console.log(
        `🛒 Buying NFT ${tokenId} for ${priceInTokenA} SMKT equivalent`
      );

      const signer = await getSigner();
      const marketplaceContract = new ethers.Contract(
        CONTRACT_ADDRESSES.nftMarketplace,
        nftMarketplaceABI,
        signer
      );

      let tx;
      if (selectedPaymentToken === tokenA) {
        // Direct purchase with SMKT
        console.log("Buying with SMKT...");

        // Approve tokens if needed
        const tokenAContract = new ethers.Contract(
          tokenA,
          [
            "function approve(address spender, uint256 amount) external returns (bool)",
            "function allowance(address owner, address spender) external view returns (uint256)",
          ],
          signer
        );

        const allowance = await tokenAContract.allowance(
          account,
          CONTRACT_ADDRESSES.nftMarketplace
        );
        console.log("Current allowance:", allowance.toString());
        console.log("Required amount:", priceInTokenA);

        if (BigInt(allowance) < BigInt(priceInTokenA)) {
          console.log("Approving tokens...");
          const approveTx = await tokenAContract.approve(
            CONTRACT_ADDRESSES.nftMarketplace,
            priceInTokenA
          );
          await approveTx.wait();
          console.log("Tokens approved");
        }

        console.log("Calling buyWithTokenA...");
        tx = await marketplaceContract.buyWithTokenA(tokenId);
      } else if (selectedPaymentToken === tokenB) {
        // Purchase with TUSD
        console.log("Buying with TUSD...");

        // Calculate required amount of tokenB
        const requiredTokenB = await marketplaceContract.calculatePriceInToken(
          tokenId,
          tokenB
        );
        console.log("Required TUSD:", requiredTokenB.toString());

        // Approve tokenB
        const tokenBContract = new ethers.Contract(
          tokenB,
          [
            "function approve(address spender, uint256 amount) external returns (bool)",
            "function allowance(address owner, address spender) external view returns (uint256)",
          ],
          signer
        );

        const allowance = await tokenBContract.allowance(
          account,
          CONTRACT_ADDRESSES.nftMarketplace
        );
        if (BigInt(allowance) < BigInt(requiredTokenB)) {
          const approveTx = await tokenBContract.approve(
            CONTRACT_ADDRESSES.nftMarketplace,
            requiredTokenB
          );
          await approveTx.wait();
        }

        tx = await marketplaceContract.buyWithTokenB(tokenId);
      } else if (selectedPaymentToken === tokenC) {
        // Purchase with TBTC
        console.log("Buying with TBTC...");

        // Calculate required amount of tokenC
        const requiredTokenC = await marketplaceContract.calculatePriceInToken(
          tokenId,
          tokenC
        );
        console.log("Required TBTC:", requiredTokenC.toString());

        // Approve tokenC
        const tokenCContract = new ethers.Contract(
          tokenC,
          [
            "function approve(address spender, uint256 amount) external returns (bool)",
            "function allowance(address owner, address spender) external view returns (uint256)",
          ],
          signer
        );

        const allowance = await tokenCContract.allowance(
          account,
          CONTRACT_ADDRESSES.nftMarketplace
        );
        if (BigInt(allowance) < BigInt(requiredTokenC)) {
          const approveTx = await tokenCContract.approve(
            CONTRACT_ADDRESSES.nftMarketplace,
            requiredTokenC
          );
          await approveTx.wait();
        }

        tx = await marketplaceContract.buyWithTokenC(tokenId);
      } else {
        throw new Error("Unsupported payment token");
      }

      console.log("Transaction sent, waiting for confirmation...");
      await tx.wait();
      console.log("Transaction confirmed!");

      alert("NFT purchased successfully!");
      loadListings();
      loadUserNFTs();
    } catch (error) {
      console.error("❌ Error buying NFT:", error);
      alert("Purchase failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const mintNFT = async () => {
    try {
      setLoading(true);
      console.log(`🎨 Minting NFT with URI: ${mintURI}`);

      const signer = await getSigner();
      const nftContract = new ethers.Contract(
        CONTRACT_ADDRESSES.nftCollection,
        nftCollectionABI,
        signer
      );

      // For public mint, need to pay with platform token
      const publicMintPrice = await nftContract.publicMintPrice();
      console.log("Public mint price:", publicMintPrice.toString());

      // Approve platform token if needed
      const tokenAContract = new ethers.Contract(
        tokenA,
        [
          "function approve(address spender, uint256 amount) external returns (bool)",
          "function allowance(address owner, address spender) external view returns (uint256)",
        ],
        signer
      );

      const allowance = await tokenAContract.allowance(
        account,
        CONTRACT_ADDRESSES.nftCollection
      );
      console.log("Current mint allowance:", allowance.toString());

      if (BigInt(allowance) < BigInt(publicMintPrice)) {
        console.log("Approving tokens for minting...");
        const approveTx = await tokenAContract.approve(
          CONTRACT_ADDRESSES.nftCollection,
          publicMintPrice
        );
        await approveTx.wait();
        console.log("Tokens approved for minting");
      }

      console.log("Calling publicMint...");
      const mintTx = await nftContract.publicMint(mintURI);
      await mintTx.wait();

      alert("NFT minted successfully!");
      setMintURI("");
      loadUserNFTs();
    } catch (error) {
      console.error("❌ Error minting NFT:", error);
      alert("Minting failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const setBasePriceTokenA = async (newPrice) => {
    try {
      setLoading(true);
      const signer = await getSigner();
      const marketplaceContract = new ethers.Contract(
        CONTRACT_ADDRESSES.nftMarketplace,
        nftMarketplaceABI,
        signer
      );

      const priceWei = ethers.parseUnits(newPrice, 18);
      const priceTx = await marketplaceContract.setBasePrice(priceWei);
      await priceTx.wait();

      alert("Base price updated!");
      loadBasePrice();
    } catch (error) {
      console.error("❌ Error setting base price:", error);
      alert("Price update failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Quick test function to list the first available NFT
  const quickListFirstNFT = async () => {
    if (userNFTs.length > 0 && !userNFTs[0].isListed) {
      await listNFT(userNFTs[0].tokenId, "1.0"); // List for 1 SMKT
    } else {
      alert("No unlisted NFTs found or first NFT is already listed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Debug Info */}
      <div className="glass-card p-4 rounded-2xl bg-yellow-100">
        <h3 className="text-lg font-bold text-gray-800 mb-2">
          🔧 Debug Information
        </h3>
        <p className="text-sm text-gray-600 break-all">{debugInfo}</p>
        <p className="text-sm text-gray-600">
          Base Price: {formatBalance(basePrice)} SMKT
        </p>
        <p className="text-sm text-gray-600">
          Listings Found: {listings.length}
        </p>
        <p className="text-sm text-gray-600">Your NFTs: {userNFTs.length}</p>

        {userNFTs.length > 0 && (
          <button
            onClick={quickListFirstNFT}
            disabled={loading}
            className="mt-2 btn-primary py-2 px-4 text-sm"
          >
            🚀 Quick List First NFT
          </button>
        )}
      </div>

      {/* Owner Controls */}
      {isOwner && (
        <div className="glass-card p-6 rounded-2xl">
          <h2 className="text-2xl font-bold text-white mb-4">
            👑 Owner Controls
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <input
                type="number"
                placeholder="New Base Price (SMKT)"
                className="input-field"
                id="newBasePrice"
                step="0.1"
                min="0.1"
              />
              <button
                onClick={() => {
                  const price = document.getElementById("newBasePrice").value;
                  if (price) setBasePriceTokenA(price);
                }}
                disabled={loading}
                className="btn-primary w-full py-2"
              >
                {loading ? "Updating..." : "Set Base Price"}
              </button>
            </div>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Metadata URI (e.g., https://example.com/nft.json)"
                value={mintURI}
                onChange={(e) => setMintURI(e.target.value)}
                className="input-field"
              />
              <button
                onClick={mintNFT}
                disabled={loading || !mintURI}
                className="btn-primary w-full py-2"
              >
                {loading ? "Minting..." : "Mint New NFT"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Token Selection */}
      <div className="glass-card p-6 rounded-2xl">
        <h2 className="text-2xl font-bold text-white mb-4">
          💳 Payment Method
        </h2>
        <select
          value={selectedPaymentToken}
          onChange={(e) => setSelectedPaymentToken(e.target.value)}
          className="input-field"
        >
          {paymentTokens.map((token) => (
            <option key={token.address} value={token.address}>
              {token.symbol} - {token.name}
            </option>
          ))}
        </select>
        <p className="text-white text-sm mt-2">
          Selected:{" "}
          {
            paymentTokens.find((t) => t.address === selectedPaymentToken)
              ?.symbol
          }
        </p>
      </div>

      {/* NFT Listings */}
      <div className="glass-card p-6 rounded-2xl">
        <h2 className="text-2xl font-bold text-white mb-4">🖼️ NFTs for Sale</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((listing) => (
            <div
              key={listing.tokenId}
              className="bg-white rounded-lg p-4 shadow-lg"
            >
              <div className="bg-gray-200 h-48 rounded-lg mb-3 flex items-center justify-center">
                {listing.tokenURI ? (
                  <img
                    src={listing.tokenURI}
                    alt={`NFT ${listing.tokenId}`}
                    className="h-full w-full object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div className="hidden flex-col items-center justify-center text-center">
                  <span className="text-gray-500">NFT #{listing.tokenId}</span>
                  <span className="text-gray-400 text-sm">No Image</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Price: {formatBalance(listing.priceInTokenA)} SMKT
                </p>
                <p className="text-xs text-gray-500">
                  Seller: {listing.seller.slice(0, 6)}...
                  {listing.seller.slice(-4)}
                  {listing.seller.toLowerCase() === account.toLowerCase() &&
                    " (You)"}
                </p>
                {listing.seller.toLowerCase() !== account.toLowerCase() && (
                  <button
                    onClick={() =>
                      buyNFT(listing.tokenId, listing.priceInTokenA)
                    }
                    disabled={loading}
                    className="btn-primary w-full py-2"
                  >
                    {loading
                      ? "Buying..."
                      : `Buy with ${
                          paymentTokens.find(
                            (t) => t.address === selectedPaymentToken
                          )?.symbol
                        }`}
                  </button>
                )}
                {listing.seller.toLowerCase() === account.toLowerCase() && (
                  <button
                    onClick={() => unlistNFT(listing.tokenId)}
                    disabled={loading}
                    className="btn-secondary w-full py-2"
                  >
                    {loading ? "Unlisting..." : "Unlist NFT"}
                  </button>
                )}
              </div>
            </div>
          ))}
          {listings.length === 0 && (
            <div className="col-span-full text-center text-white py-8">
              No NFTs currently listed for sale.
              {userNFTs.length > 0 && " List your NFTs above to get started!"}
            </div>
          )}
        </div>
      </div>

      {/* User's NFTs */}
      <div className="glass-card p-6 rounded-2xl">
        <h2 className="text-2xl font-bold text-white mb-4">Your NFTs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userNFTs.map((nft) => (
            <div
              key={nft.tokenId}
              className="bg-white rounded-lg p-4 shadow-lg"
            >
              <div className="bg-gray-200 h-48 rounded-lg mb-3 flex items-center justify-center">
                {nft.tokenURI ? (
                  <img
                    src={nft.tokenURI}
                    alt={`NFT ${nft.tokenId}`}
                    className="h-full w-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center">
                    <span className="text-gray-500">NFT #{nft.tokenId}</span>
                    <span className="text-gray-400 text-sm">No Image</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Token ID: {nft.tokenId}</p>
                <p className="text-sm text-gray-600">
                  {nft.isListed ? "🟢 Listed for Sale" : "🔴 Not Listed"}
                </p>
                {!nft.isListed && (
                  <>
                    <input
                      type="number"
                      placeholder="Price in SMKT"
                      value={listPrice}
                      onChange={(e) => setListPrice(e.target.value)}
                      className="input-field"
                      step="0.1"
                      min="0.1"
                    />
                    <button
                      onClick={() => listNFT(nft.tokenId, listPrice)}
                      disabled={loading || !listPrice}
                      className="btn-secondary w-full py-2"
                    >
                      {loading ? "Listing..." : "List for Sale"}
                    </button>
                  </>
                )}
                {nft.isListed && (
                  <button
                    onClick={() => unlistNFT(nft.tokenId)}
                    disabled={loading}
                    className="btn-secondary w-full py-2"
                  >
                    {loading ? "Unlisting..." : "Unlist NFT"}
                  </button>
                )}
              </div>
            </div>
          ))}
          {userNFTs.length === 0 && (
            <div className="col-span-full text-center text-white py-8">
              You don't own any NFTs yet.{" "}
              {!isOwner && "Mint some NFTs to get started!"}
            </div>
          )}
        </div>
      </div>

      {/* Mint Section for Non-Owners */}
      {!isOwner && (
        <div className="glass-card p-6 rounded-2xl">
          <h2 className="text-2xl font-bold text-white mb-4">Mint New NFT</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Metadata URI (e.g., https://example.com/nft.json)"
              value={mintURI}
              onChange={(e) => setMintURI(e.target.value)}
              className="input-field flex-1"
            />
            <button
              onClick={mintNFT}
              disabled={loading || !mintURI}
              className="btn-primary py-2 px-6"
            >
              {loading ? "Minting..." : "Mint NFT"}
            </button>
          </div>
          <p className="text-white text-sm mt-2">
            Note: Minting requires paying {formatBalance(basePrice)} SMKT
          </p>
        </div>
      )}
    </div>
  );
}
