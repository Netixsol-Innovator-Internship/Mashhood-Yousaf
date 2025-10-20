import { ethers } from "ethers";

let provider;
let signer;


export const getProvider = () => {
  if (!provider) {
    if (typeof window !== "undefined" && window.ethereum) {
      provider = new ethers.BrowserProvider(window.ethereum);
    } else {
      provider = new ethers.JsonRpcProvider("https://rpc.kasplextest.xyz");
    }
  }
  return provider;
};

export const getSigner = async () => {
  if (!signer) {
    const provider = getProvider();
    if (provider instanceof ethers.BrowserProvider) {
      signer = await provider.getSigner();
    }
  }
  return signer;
};

export const connectWallet = async () => {
  if (typeof window !== "undefined" && window.ethereum) {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = getProvider();
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    return address;
  } else {
    throw new Error("MetaMask not installed");
  }
};

export const switchToKasplex = async () => {
  if (typeof window !== "undefined" && window.ethereum) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x28c64" }], // 167012 in hex
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x28c64",
                chainName: "Kasplex Testnet",
                rpcUrls: ["https://rpc.kasplextest.xyz"],
                blockExplorerUrls: ["https://explorer.testnet.kasplextest.xyz"],
                nativeCurrency: {
                  name: "KAS",
                  symbol: "KAS",
                  decimals: 18,
                },
              },
            ],
          });
        } catch (addError) {
          console.error("Error adding Kasplex chain:", addError);
        }
      }
    }
  }
};

export const formatAddress = (address) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatBalance = (balance, decimals = 18) => {
  return parseFloat(ethers.formatUnits(balance, decimals)).toFixed(4);
};
