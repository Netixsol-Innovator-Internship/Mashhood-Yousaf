"use client";

import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

/**
 * Replace with your deployed contract address (you already gave this one)
 */
const CONTRACT_ADDRESS = "0x9C9Bb9121D526f3f23265f8afb94AAAb3ec0511e";

/**
 * Minimal ABI for the functions/events we use in the frontend
 */
const TODO_ABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_content",
        type: "string",
      },
    ],
    name: "createTask",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "deleteTask",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_newContent",
        type: "string",
      },
    ],
    name: "editTask",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "content",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "TaskCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "TaskDeleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "newContent",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "TaskEdited",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "completed",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "TaskToggled",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "toggleTask",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getMyTaskIds",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "getTask",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "string",
        name: "content",
        type: "string",
      },
      {
        internalType: "bool",
        name: "completed",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "createdAt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "updatedAt",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "exists",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

/**
 * Kasplex Testnet info
 */
const KASPLEX_RPC = "https://rpc.kasplextest.xyz";
const KASPLEX_CHAIN_ID_HEX = "0x28C64"; // 167012 dec
const KASPLEX_CHAIN_PARAMS = {
  chainId: KASPLEX_CHAIN_ID_HEX,
  chainName: "kasplex",
  nativeCurrency: { name: "kasplex", symbol: "kas", decimals: 18 },
  rpcUrls: [KASPLEX_RPC],
  blockExplorerUrls: ["https://explorer.testnet.kasplextest.xyz"],
};

export default function Page() {
  const [provider, setProvider] = useState(null); // ethers provider (BrowserProvider)
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);

  const [myTaskIds, setMyTaskIds] = useState([]);
  const [tasks, setTasks] = useState([]); // array of {id, owner, content, completed, createdAt, updatedAt}
  const [loadingTasks, setLoadingTasks] = useState(false);

  const [newContent, setNewContent] = useState("");
  const [txPending, setTxPending] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  // Init: detect ethereum, set provider and listeners
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.ethereum) {
      const p = new ethers.BrowserProvider(window.ethereum);
      setProvider(p);

      // listen for accounts changed
      window.ethereum.on &&
        window.ethereum.on("accountsChanged", (accounts) => {
          setAccount(
            accounts && accounts.length ? ethers.getAddress(accounts[0]) : null
          );
        });

      // listen for chain changed
      window.ethereum.on &&
        window.ethereum.on("chainChanged", (chainHex) => {
          setChainId(chainHex);
        });
    }
    // cleanup listeners when component unmounts
    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        try {
          window.ethereum.removeListener("accountsChanged", () => {});
          window.ethereum.removeListener("chainChanged", () => {});
        } catch (e) {}
      }
    };
  }, []);

  // Update signer + contract when provider and account present
  useEffect(() => {
    if (!provider) return;
    (async () => {
      try {
        // if MetaMask already connected, set signer/account
        const accounts = await provider.send("eth_accounts", []);
        if (accounts && accounts.length) {
          const s = await provider.getSigner();
          setSigner(s);
          setAccount(await s.getAddress());
        }
        // read chainId
        const network = await provider.send("eth_chainId", []);
        setChainId(network);

        // create read-only contract initially (use signer for writes later)
        const c = new ethers.Contract(CONTRACT_ADDRESS, TODO_ABI, provider);
        setContract(c);
      } catch (err) {
        console.error("init error", err);
      }
    })();
  }, [provider]);

  // whenever signer changes, set contract connected to signer for writes
  useEffect(() => {
    if (!signer) return;
    const c = new ethers.Contract(CONTRACT_ADDRESS, TODO_ABI, signer);
    setContract(c);
  }, [signer]);

  // Fetch tasks when account + contract changes
  useEffect(() => {
    if (!contract || !account) {
      setMyTaskIds([]);
      setTasks([]);
      return;
    }
    fetchMyTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, account]);

  // --- Wallet helpers ---
  async function connectWallet() {
    if (!window.ethereum) {
      alert("MetaMask not detected. Please install MetaMask extension.");
      return;
    }
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts && accounts.length) {
        const s = await provider.getSigner();
        setSigner(s);
        setAccount(ethers.getAddress(accounts[0]));
      }
    } catch (err) {
      console.error("connectWallet error:", err);
      alert("Failed to connect wallet: " + (err?.message || err));
    }
  }

  async function ensureKasplexNetwork() {
    if (!window.ethereum) {
      alert("MetaMask not available");
      return false;
    }
    try {
      // try switching first
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: KASPLEX_CHAIN_ID_HEX }],
      });
      return true;
    } catch (switchError) {
      // If the chain has not been added, add it
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [KASPLEX_CHAIN_PARAMS],
        });
        return true;
      } catch (addError) {
        console.error("Failed to add Kasplex chain:", addError);
        alert("Please add Kasplex Testnet to MetaMask manually.");
        return false;
      }
    }
  }

  // --- Contract interactions ---

  async function fetchMyTasks() {
    if (!contract || !account) return;
    setLoadingTasks(true);
    try {
      // get my ids (read-only contract if provider used)
      // Use provider-based contract if signer not set
      const readContract = signer
        ? new ethers.Contract(CONTRACT_ADDRESS, TODO_ABI, signer)
        : contract;
      const ids = await readContract.getMyTaskIds();
      // ids is array of BigInt-like (ethers v6 returns BigInt?)
      const idsNum = ids.map((b) =>
        typeof b === "bigint" ? Number(b) : Number(b.toString())
      );
      setMyTaskIds(idsNum);

      // fetch each task gracefully; contract.getTask reverts if exists==false (your contract does require exists)
      const fetched = [];
      for (const id of idsNum) {
        try {
          const t = await readContract.getTask(id);
          // t is tuple: (id, owner, content, completed, createdAt, updatedAt, exists)
          const parsed = {
            id:
              typeof t[0] === "bigint" ? Number(t[0]) : Number(t[0].toString()),
            owner: t[1],
            content: t[2],
            completed: t[3],
            createdAt:
              typeof t[4] === "bigint" ? Number(t[4]) : Number(t[4].toString()),
            updatedAt:
              typeof t[5] === "bigint" ? Number(t[5]) : Number(t[5].toString()),
            exists: t[6],
          };
          // only push if exists === true
          if (parsed.exists) fetched.push(parsed);
        } catch (err) {
          // task might be deleted (your contract sets exists=false, but getTask reverts),
          // so safely ignore tasks that can't be fetched.
          console.warn("Skipping task id", id, "error:", err?.message || err);
        }
      }
      // sort by createdAt desc
      fetched.sort((a, b) => b.createdAt - a.createdAt);
      setTasks(fetched);
    } catch (err) {
      console.error("fetchMyTasks error", err);
      alert("Failed to fetch tasks: " + (err?.message || err));
    } finally {
      setLoadingTasks(false);
    }
  }

  async function handleCreateTask(e) {
    e.preventDefault();
    if (!newContent.trim()) {
      alert("Please enter content");
      return;
    }
    if (!(await ensureKasplexNetwork())) return;
    if (!signer) {
      await connectWallet();
      if (!signer) return;
    }

    setTxPending(true);
    try {
      const s = await provider.getSigner();
      const c = new ethers.Contract(CONTRACT_ADDRESS, TODO_ABI, s);
      const tx = await c.createTask(newContent);
      await tx.wait();
      setNewContent("");
      fetchMyTasks();
    } catch (err) {
      console.error("createTask error", err);
      alert("Transaction failed: " + (err?.message || err));
    } finally {
      setTxPending(false);
    }
  }

  async function handleToggleTask(id) {
    if (!(await ensureKasplexNetwork())) return;
    if (!signer) {
      await connectWallet();
      if (!signer) return;
    }
    setTxPending(true);
    try {
      const s = await provider.getSigner();
      const c = new ethers.Contract(CONTRACT_ADDRESS, TODO_ABI, s);
      const tx = await c.toggleTask(id);
      await tx.wait();
      fetchMyTasks();
    } catch (err) {
      console.error("toggleTask error", err);
      alert("Toggle failed: " + (err?.message || err));
    } finally {
      setTxPending(false);
    }
  }

  function startEdit(task) {
    setEditingId(task.id);
    setEditingContent(task.content);
  }
  function cancelEdit() {
    setEditingId(null);
    setEditingContent("");
  }

  async function handleSaveEdit(id) {
    if (!editingContent.trim()) {
      alert("Content cannot be empty");
      return;
    }
    if (!(await ensureKasplexNetwork())) return;
    if (!signer) {
      await connectWallet();
      if (!signer) return;
    }
    setTxPending(true);
    try {
      const s = await provider.getSigner();
      const c = new ethers.Contract(CONTRACT_ADDRESS, TODO_ABI, s);
      const tx = await c.editTask(id, editingContent);
      await tx.wait();

      // Close the edit mode immediately
      setEditingId(null);
      setEditingContent("");

      setTimeout(() => {
        fetchMyTasks();
      }, 100);
    } catch (err) {
      console.error("editTask error", err);
      alert("Edit failed: " + (err?.message || err));
    } finally {
      setTxPending(false);
    }
  }

  async function handleDeleteTask(id) {
    if (!confirm("Are you sure you want to delete this task?")) return;
    if (!(await ensureKasplexNetwork())) return;
    if (!signer) {
      await connectWallet();
      if (!signer) return;
    }
    setTxPending(true);
    try {
      const s = await provider.getSigner();
      const c = new ethers.Contract(CONTRACT_ADDRESS, TODO_ABI, s);
      const tx = await c.deleteTask(id);
      await tx.wait();
      fetchMyTasks();
    } catch (err) {
      console.error("deleteTask error", err);
      alert("Delete failed: " + (err?.message || err));
    } finally {
      setTxPending(false);
    }
  }

  // Helper to format timestamp
  function fmt(ts) {
    try {
      const d = new Date(ts * 1000);
      return d.toLocaleString();
    } catch {
      return String(ts);
    }
  }

  const isOnKasplex = chainId === KASPLEX_CHAIN_ID_HEX;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Decentralized Todo List</h1>
          <div className="text-sm">
            {!account ? (
              <button
                onClick={connectWallet}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Connect MetaMask
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="text-xs text-slate-600">Connected:</div>
                <div className="px-3 py-1 bg-white border rounded-md text-sm">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </div>
                <div className="text-xs">
                  {isOnKasplex ? (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md">
                      Kasplex
                    </span>
                  ) : (
                    <button
                      onClick={ensureKasplexNetwork}
                      className="px-2 py-1 bg-yellow-100 rounded-md text-yellow-800 text-sm"
                    >
                      Switch to Kasplex
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="space-y-6">
          <section className="bg-white p-4 rounded-lg shadow-sm">
            <form onSubmit={handleCreateTask} className="flex gap-3">
              <input
                className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="New task content..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                disabled={txPending}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-60"
                disabled={txPending}
              >
                {txPending ? "Waiting..." : "Create"}
              </button>
            </form>
            <p className="mt-2 text-xs text-slate-500">
              Transactions will prompt in MetaMask on Kasplex Testnet.
            </p>
          </section>

          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-medium">My Tasks</h2>
              <div className="text-sm text-slate-500">
                {loadingTasks ? "Loading..." : `${tasks.length} visible tasks`}
              </div>
            </div>

            <div className="space-y-3">
              {tasks.length === 0 && !loadingTasks && (
                <div className="text-center text-slate-500 py-8 bg-white rounded-md shadow-sm">
                  No tasks yet — create one!
                </div>
              )}

              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-3 rounded-md shadow-sm flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleTask(task.id)}
                      className="mt-1 h-4 w-4"
                      title="Toggle complete"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`text-sm font-medium ${
                            task.completed ? "line-through text-slate-400" : ""
                          }`}
                        >
                          {editingId === task.id ? (
                            <input
                              value={editingContent}
                              onChange={(e) =>
                                setEditingContent(e.target.value)
                              }
                              onKeyDown={(e) =>
                                e.key === "Enter" && handleSaveEdit(task.id)
                              }
                              className="border-b px-1 py-0 focus:outline-none"
                            />
                          ) : (
                            task.content
                          )}
                        </div>
                        <div className="text-xs text-slate-400">#{task.id}</div>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Created: {fmt(task.createdAt)} &nbsp;•&nbsp; Updated:{" "}
                        {fmt(task.updatedAt)}
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        {editingId === task.id ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(task.id)}
                              className="text-sm px-2 py-1 bg-green-100 rounded"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-sm px-2 py-1 bg-slate-100 rounded"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(task)}
                              className="text-sm px-2 py-1 bg-indigo-50 rounded"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="text-sm px-2 py-1 bg-red-50 rounded text-red-600"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400">
                    Owner:{" "}
                    {task.owner === account
                      ? "You"
                      : `${task.owner.slice(0, 6)}...${task.owner.slice(-4)}`}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="text-xs text-slate-500">
            <div>
              Contract:{" "}
              <code className="bg-white px-2 py-1 rounded">
                {CONTRACT_ADDRESS}
              </code>
            </div>
            <div className="mt-2">
              Network RPC:{" "}
              <code className="bg-white px-2 py-1 rounded">{KASPLEX_RPC}</code>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
