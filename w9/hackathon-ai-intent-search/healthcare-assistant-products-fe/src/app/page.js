"use client";
import { useState, useEffect, useRef } from "react";
import { authService } from "./auth";
import { useRouter } from "next/navigation";
import { MicrophoneIcon } from "@heroicons/react/24/solid";

export default function Home() {
  const SpeechRecognition =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ailoading, setAiLoading] = useState(false);
  const router = useRouter();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef(null);

  const [voices, setVoices] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        if (availableVoices.length > 0) {
          setVoices(availableVoices);
        }
      };

      loadVoices(); // Call once in case voices are already loaded
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const utteranceRef = useRef(null);

  const startListening = () => {
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      console.log("🎤 Voice recognition started");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("📝 Recognized:", transcript);
      setChatInput(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
      console.log("🛑 Voice recognition ended");
    };

    recognition.start();
  };

  const speak = (text) => {
    if (!window.speechSynthesis) {
      console.warn("Speech synthesis is not supported in this browser.");
      return;
    }

    // Cancel any ongoing speech before starting a new one
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1.3;
    utterance.voice = voices.find((v) => v.lang === "en-US") || null;

    if (voices.length > 0) {
      utterance.voice = voices.find((v) => v.lang === "en-US") || voices[0];
    }
    console.log("Speech started with rate:", utterance.rate);

    // Attach event handlers for debugging and state management
    utterance.onstart = () => {
      console.log("🔊 Speech started");
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      console.log("✅ Speech ended");
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error("❌ Speech synthesis error:", event.error);
      setIsSpeaking(false);
    };

    // Save utterance in case you need to pause/resume
    utteranceRef.current = utterance;

    // Speak with slight delay to ensure readiness
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 100); // 100ms delay fixes race conditions in some browsers
  };

  const pauseSpeech = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const resumeSpeech = () => {
    window.speechSynthesis.resume();
    setIsPaused(false);
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMsg = { sender: "You", text: chatInput };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");

    const userId = "68d650a142f7709d2f63245f";

    try {
      setAiLoading(true);
      const res = await fetch("http://localhost:4000/ask/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, question: chatInput }),
      });
      const data = await res.json();

      console.log("Backend response:", data); // Debug log

      let botMessages = [];

      // Always show the text response if available
      if (data.response) {
        botMessages.push({ sender: "Bot", text: data.response });
        speak(data.response); // <--- speak response
      }

      // Add products if available
      if (data.products && data.products.length > 0) {
        const productMessages = data.products.map((product) => ({
          sender: "Bot",
          product,
        }));
        botMessages = [...botMessages, ...productMessages];
      }

      // If no response at all, show default message
      if (botMessages.length === 0) {
        botMessages.push({ sender: "Bot", text: "No response received." });
      }

      setChatMessages((prev) => [...prev, ...botMessages]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatMessages((prev) => [
        ...prev,
        { sender: "Bot", text: "⚠️ Error contacting AI." },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleLogout = () => {
    authService.clearAuthData(); // Use utility function
    router.push("/login");
  };
  const handleChatKeyDown = (e) => {
    if (e.key === "Enter") {
      sendChatMessage();
    }
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const fetchProducts = async (name = "") => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:4000/products${name ? `?name=${name}` : ""}`
      );
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      fetchProducts(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  return (
    // Main container with a clinical light gray background
    <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-teal-50 px-4 md:px-8 py-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-teal-800 border-b-4 border-cyan-500 pb-2">
            Herbal Products
          </h1>
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-all duration-200"
          >
            Logout
          </button>
        </div>

        {/* Search + Ask AI Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <input
            type="text"
            placeholder="Search products by name or condition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:flex-1 px-5 py-3 rounded-full border border-gray-300 shadow-sm text-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/50 focus:border-cyan-500 transition duration-300"
          />

          <button
            onClick={() => setIsChatOpen(true)}
            className="w-full md:w-auto px-6 py-3 bg-cyan-600 text-white font-medium rounded-full shadow-md hover:bg-cyan-700 transition duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
            aria-label="Ask Our AI Assistant"
          >
            Ask Our AI Assistant 🤖
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-pulse space-y-2">
              <div className="w-1/4 h-6 bg-teal-200 mx-auto rounded"></div>
              <p className="text-teal-600 text-lg font-semibold">
                Fetching vital products...
              </p>
            </div>
          </div>
        ) : (
          // Product Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product._id}
                className="p-5 bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl hover:border-cyan-500 transition-transform transform hover:-translate-y-1 duration-300"
              >
                {/* Title + Price */}
                <div className="flex justify-between items-center border-b pb-2 mb-4">
                  <h2 className="text-lg font-semibold text-teal-800">
                    {product.name}
                  </h2>
                  {product.price && (
                    <span className="text-cyan-600 font-bold text-base">
                      ${product.price}
                    </span>
                  )}
                </div>

                {/* Description */}
                {product.description && (
                  <p className="text-sm text-gray-600 italic mb-4 line-clamp-2">
                    {product.description}
                  </p>
                )}

                {/* Details */}
                <div className="text-sm space-y-1 text-gray-700">
                  <p>
                    <span className="font-medium text-teal-800">Brand:</span>{" "}
                    {product.brand}
                  </p>
                  <p>
                    <span className="font-medium text-teal-800">Category:</span>{" "}
                    {product.category}
                  </p>
                  <p className="line-clamp-1">
                    <span className="font-medium text-teal-800">
                      Ingredients:
                    </span>{" "}
                    {product.ingredients}
                  </p>
                  <p className="line-clamp-1">
                    <span className="font-medium text-teal-800">Dosage:</span>{" "}
                    {product.dosage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-gray-300 rounded-xl bg-white shadow-sm">
            <p className="text-gray-600 text-lg font-medium">
              🔍 No matching products found. Try a different search term or{" "}
              <button
                onClick={() => setIsChatOpen(true)}
                className="text-cyan-600 hover:underline font-semibold"
              >
                ask the AI
              </button>
              !
            </p>
          </div>
        )}
      </div>

      {/* Chat Component */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
          isChatOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        style={{ pointerEvents: isChatOpen ? "auto" : "none" }}
      >
        <div className="w-80 md:w-96 bg-white rounded-xl border border-gray-200 shadow-xl flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="bg-teal-700 px-4 py-3 text-white font-bold flex justify-between items-center">
            <span className="text-lg">AI Health Assistant 🩺</span>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-xl p-1 rounded-full hover:bg-teal-600 transition"
              aria-label="Close Chat"
            >
              ✕
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 h-80 max-h-96 overflow-y-auto bg-gray-50 space-y-3 text-sm chat-scroll">
            {ailoading ? (
              <div className="text-gray-500 animate-pulse">Searching...</div>
            ) : (
              chatMessages.map((msg, idx) => {
                const isUser = msg.sender === "You";
                const bgColor = isUser ? "bg-cyan-100" : "bg-teal-100";
                const align = isUser ? "self-end" : "self-start";
                const textColor = isUser ? "text-cyan-800" : "text-teal-800";

                if (msg.product) {
                  const p = msg.product;
                  return (
                    <div
                      key={idx}
                      className={`max-w-[85%] p-4 rounded-xl shadow border ${bgColor} ${align}`}
                    >
                      <strong className={`${textColor} text-base mb-2`}>
                        {msg.sender}: Product Found!
                      </strong>
                      <div className="text-xs space-y-1 text-gray-700">
                        <p className="font-bold text-teal-900">{p.name}</p>
                        <p>
                          <span className="font-medium">Price:</span>{" "}
                          <span className="text-cyan-600 font-bold">
                            ${p.price}
                          </span>
                        </p>
                        <p className="line-clamp-2">
                          <span className="font-medium">Description:</span>{" "}
                          {p.description}
                        </p>
                        <p>
                          <span className="font-medium">Brand:</span> {p.brand}
                        </p>
                        <p>
                          <span className="font-medium">Ingredient:</span>{" "}
                          {p.ingredients}
                        </p>
                        <p>
                          <span className="font-medium">Dosage:</span>{" "}
                          {p.dosage}
                        </p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={idx}
                    className={`max-w-[85%] p-3 rounded-xl shadow-sm ${bgColor} ${align}`}
                  >
                    <strong className={`${textColor} font-semibold`}>
                      {msg.sender}:
                    </strong>{" "}
                    <span className="text-gray-800">{msg.text}</span>
                  </div>
                );
              })
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          {/* Chat Input Row */}
          <div className="border-t border-gray-200 bg-white flex items-center px-3 py-2 gap-2">
            {/* Voice Controls */}
            <button
              onClick={startListening}
              className="w-9 text-teal-600 hover:text-teal-800 transition"
              aria-label="Start Voice Input"
            >
              <MicrophoneIcon className="w-6 h-6" />
              {isListening && (
                <div className="text-center text-sm text-cyan-600">
                  Listening...
                </div>
              )}
            </button>

            <input
              type="text"
              placeholder="Search products"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleChatKeyDown}
              className="flex-1 px-2 py-1 text-sm focus:outline-none"
            />
            <button
              onClick={sendChatMessage}
              className="text-teal-600 hover:text-teal-800 text-2xl px-2 transition transform hover:scale-110 disabled:opacity-50"
              disabled={!chatInput.trim()}
              aria-label="Send Message"
            >
              ➤
            </button>
          </div>

          {/* Speech Synthesis Controls - place this BELOW the input row */}
          {isSpeaking && (
            <div className="flex flex-col items-center justify-center text-gray-600 text-sm py-2 space-y-2">
              <div>🔊 Speaking...</div>
              <div className="flex space-x-2">
                {!isPaused ? (
                  <button
                    onClick={pauseSpeech}
                    className="px-3 py-1 bg-yellow-300 hover:bg-yellow-400 text-yellow-900 rounded text-xs font-medium"
                  >
                    ⏸ Pause
                  </button>
                ) : (
                  <button
                    onClick={resumeSpeech}
                    className="px-3 py-1 bg-green-300 hover:bg-green-400 text-green-900 rounded text-xs font-medium"
                  >
                    ▶ Resume
                  </button>
                )}
                <button
                  onClick={stopSpeech}
                  className="px-3 py-1 bg-red-300 hover:bg-red-400 text-red-900 rounded text-xs font-medium"
                >
                  ⏹ Stop
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-cyan-500 text-white rounded-full shadow-xl flex items-center justify-center text-3xl hover:bg-cyan-600 transition transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-cyan-500/30 z-50"
          aria-label="Open AI Chat"
        >
          🤖
        </button>
      )}

      {/* Custom Scrollbar Styling */}
      <style jsx global>{`
        .chat-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .chat-scroll::-webkit-scrollbar-thumb {
          background-color: #0d9488;
          border-radius: 4px;
        }
        .chat-scroll::-webkit-scrollbar-track {
          background-color: #e5e7eb;
        }
      `}</style>
    </main>
  );
}
