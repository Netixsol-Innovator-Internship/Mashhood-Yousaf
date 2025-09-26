"use client";
import { useState, useEffect, useRef } from "react";

// NOTE: All logic and state variables (products, searchTerm, loading, isChatOpen, chatMessages, chatInput, chatEndRef)
// as well as all functions (sendChatMessage, handleChatKeyDown, fetchProducts) remain UNCHANGED, as requested.
// Only the JSX structure and Tailwind CSS classes have been modified for UI/UX.

export default function Home() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ailoading, setAiLoading] = useState(false);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef(null);

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMsg = { sender: "You", text: chatInput };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");

    const userId = "68d650a142f7709d2f63245f"; // apni id yaha daal

    try {
      setAiLoading(true);
      const res = await fetch("http://localhost:4000/ask/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, question: chatInput }),
      });
      const data = await res.json();

      // Agar data ek array hai aur length > 0 toh usko product mana jaaye
      if (Array.isArray(data) && data.length > 0) {
        // Saare products ko alag-alag message me daal do
        const productMessages = data.map((product) => ({
          sender: "Bot",
          product,
        }));
        setChatMessages((prev) => [...prev, ...productMessages]);
      } else if (data.product) {
        setChatMessages((prev) => [
          ...prev,
          { sender: "Bot", product: data.product },
        ]);
      } else if (data.reply) {
        setChatMessages((prev) => [
          ...prev,
          { sender: "Bot", text: data.reply },
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          { sender: "Bot", text: "No response." },
        ]);
      }
    } catch (error) {
      setChatMessages((prev) => [
        ...prev,
        { sender: "Bot", text: "⚠️ Error contacting AI." },
      ]);
    } finally {
      setAiLoading(false);
    }
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
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with deep teal accent */}
        <h1 className="text-2xl font-extrabold mb-8 text-teal-800 border-b-4 border-cyan-500 pb-2">
          Herbal Products
        </h1>

        {/* Search Bar and Chat Toggle - Grouped for cleaner look */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12 px-4 md:px-0">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search products by name or condition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:max-w-4xl px-6 py-3 rounded-2xl border-2 border-gray-300 text-sm text-gray-800 shadow-md placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/60 focus:border-cyan-500 transition duration-300 ease-in-out"
          />

          {/* Ask AI Button */}
          <button
            onClick={() => setIsChatOpen(true)}
            className="w-full md:w-auto mt-2 md:mt-0 px-6 py-3 bg-cyan-600 text-white font-semibold rounded-2xl shadow-lg hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-500/70 transform hover:scale-105 active:scale-95 transition duration-300 ease-in-out select-none"
            aria-label="Ask Our AI Assistant"
          >
            Ask Our AI Assistant 🤖
          </button>
        </div>

        {/* Loading State - Simple animation for professionalism */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-pulse">
              <div className="h-6 bg-teal-200 rounded w-1/4 mx-auto mb-4"></div>
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
                // Product Card - Clean, structured, and interactive
                className="p-6 bg-white rounded-xl border-2 border-gray-100 shadow-xl hover:shadow-cyan-500/20 hover:border-cyan-500 transform hover:-translate-y-1 transition duration-500 ease-in-out"
              >
                {/* Name & Price Header */}
                <div className="flex justify-between items-baseline mb-4 border-b pb-2 border-gray-100">
                  <h2 className="text-xl font-bold text-teal-700 leading-snug">
                    {product.name}
                  </h2>
                  {product.price && (
                    <p className="text-lg font-extrabold text-cyan-600 ml-4 flex-shrink-0">
                      ${product.price}
                    </p>
                  )}
                </div>

                {/* Description */}
                {product.description && (
                  <p className="text-gray-600 text-sm mb-4 italic line-clamp-2">
                    {product.description}
                  </p>
                )}

                {/* Details Section - Structured for clarity */}
                <div className="space-y-1 text-sm">
                  <p className="text-gray-700">
                    <span className="font-semibold text-teal-800">Brand:</span>{" "}
                    {product.brand}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold text-teal-800">
                      Category:
                    </span>{" "}
                    {product.category}
                  </p>
                  <p className="text-gray-700 line-clamp-1">
                    <span className="font-semibold text-teal-800">
                      Ingredients:
                    </span>{" "}
                    {product.ingredients}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-xl">
            <p className="text-gray-600 text-xl font-medium">
              🔍 No matching products found. Try a different search term or{" "}
              <button
                onClick={() => setIsChatOpen(true)}
                className="text-cyan-600 hover:text-cyan-700 font-bold underline transition duration-300"
              >
                ask the AI
              </button>
              !
            </p>
          </div>
        )}
      </div>

      {/* Chat UI - Fixed position with smooth transition */}
      {/* The `isChatOpen` conditional rendering is wrapped in a transition/animation parent */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ease-in-out ${
          isChatOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        style={{ pointerEvents: isChatOpen ? "auto" : "none" }} // Ensure element is only clickable when open
      >
        <div className="w-80 md:w-96 bg-white border border-gray-200 rounded-xl shadow-2xl flex flex-col overflow-hidden">
          {/* Chat Header - Deep Teal */}
          <div className="bg-teal-700 px-4 py-3 text-white font-bold flex justify-between items-center shadow-md">
            <span className="text-lg">AI Health Assistant 🩺</span>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-xl p-1 rounded-full hover:bg-teal-600 transition duration-200"
              aria-label="Close Chat"
            >
              ✕
            </button>
          </div>

          {/* Chat Messages Area */}
          <div className="p-4 h-80 max-h-96 overflow-y-auto text-sm space-y-3 bg-gray-50 chat-scroll">
            {ailoading ? (
              <div className="animate-pulse text-gray-500">Searching...</div>
            ) : (
              chatMessages.map((msg, idx) => {
                const isUser = msg.sender === "You";
                const bgColor = isUser ? "bg-cyan-100" : "bg-teal-100";
                const alignClass = isUser ? "self-end" : "self-start";
                const senderColor = isUser ? "text-cyan-800" : "text-teal-800";

                if (msg.product) {
                  const p = msg.product;
                  return (
                    // Bot Product Message - Enhanced Card UI
                    <div
                      key={idx}
                      className={`max-w-[85%] p-4 rounded-xl shadow-md border border-teal-200 ${bgColor} ${alignClass} flex flex-col transition-all duration-300`}
                    >
                      <strong className={`${senderColor} text-base mb-2`}>
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
                      </div>
                    </div>
                  );
                }

                return (
                  // Regular Text Message - Bubble UI
                  <div
                    key={idx}
                    className={`max-w-[85%] p-3 rounded-xl shadow-sm ${bgColor} ${alignClass} transition-all duration-300`}
                  >
                    <strong className={`${senderColor} font-semibold`}>
                      {msg.sender}:
                    </strong>{" "}
                    <span className="text-gray-800">{msg.text}</span>
                  </div>
                );
              })
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input Area */}
          <div className="border-t border-gray-300 flex items-center bg-white p-2">
            <input
              type="text"
              placeholder="Search products"
              className="flex-1 px-3 py-2 text-sm focus:outline-none focus:ring-0"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleChatKeyDown}
            />
            <button
              onClick={sendChatMessage}
              // Send Button - Teal with hover animation
              className="px-3 py-1 text-2xl text-teal-600 hover:text-teal-800 hover:scale-110 transition duration-300 disabled:opacity-50 disabled:hover:scale-100"
              aria-label="Send Message"
              disabled={!chatInput.trim()}
            >
              ➤
            </button>
          </div>
        </div>
      </div>

      {/* Floating Chat Bubble - Visible when chat is closed */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          // Chat Icon Bubble - Vibrant Cyan, highly interactive
          className="fixed bottom-6 right-6 w-14 h-14 bg-cyan-500 text-white rounded-full shadow-2xl flex items-center justify-center text-3xl hover:bg-cyan-600 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 transform hover:scale-110 active:scale-95 transition duration-300 ease-in-out z-50"
          aria-label="Open AI Chat"
        >
          🤖
        </button>
      )}

      {/* Tailwind Scrollbar Style (needs custom CSS utility or a plugin for a production environment) */}
      <style jsx global>{`
        .chat-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .chat-scroll::-webkit-scrollbar-thumb {
          background-color: #0d9488; /* teal-600 */
          border-radius: 4px;
        }
        .chat-scroll::-webkit-scrollbar-track {
          background-color: #e5e7eb; /* gray-200 */
        }
      `}</style>
    </main>
  );
}
