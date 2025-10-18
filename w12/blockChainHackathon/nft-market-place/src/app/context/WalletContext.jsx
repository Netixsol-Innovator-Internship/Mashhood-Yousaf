"use client";
import { createContext, useContext, useState, useEffect } from "react";
import {
  connectWallet,
  getProvider,
  getSigner,
  switchToKasplex,
} from "../utils/web3";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  const connect = async () => {
    setLoading(true);
    try {
      await switchToKasplex();
      const address = await connectWallet();
      setAccount(address);
      setIsConnected(true);
    } catch (error) {
      console.error("Connection failed:", error);
      alert("Connection failed: " + error.message);
    }
    setLoading(false);
  };

  const disconnect = () => {
    setAccount(null);
    setIsConnected(false);
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        const provider = getProvider();
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0].address);
          setIsConnected(true);
        }
      }
    };

    checkConnection();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        } else {
          disconnect();
        }
      });
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{
        account,
        isConnected,
        loading,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
