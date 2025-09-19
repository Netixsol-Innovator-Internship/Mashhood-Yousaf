"use client";

import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentId, setDocumentId] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // const API_BASE = "https://pdf-analyzer-chatbot-be.vercel.app"; // Replace with your API URL
  const API_BASE = "http://localhost:8000"; // Replace with your API URL

  // Scroll chat to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setConversation([]);
      setDocumentId(null);
      setQuery("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch(`${API_BASE}/docs/upload-file`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setDocumentId(data._id);

      setConversation([
        {
          sender: "system",
          message: `📄 **Summary:**\n${data.summary}\n\n🏷️ **Category:** ${data.category}\n\n⭐ **Highlights:**\n${data.highlights.join(
            "\n"
          )}`,
        },
      ]);
    } catch (error) {
      alert("Failed to upload file. Please try again.");
      console.error(error);
    }
    setIsLoading(false);
  };

  const submitQuestion = async () => {
    if (!query.trim() || !documentId) return;

    const updatedChat = [...conversation, { sender: "user", message: query.trim() }];
    setConversation(updatedChat);
    setQuery("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/docs/${documentId}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query.trim() }),
      });

      if (!res.ok) throw new Error("Failed to fetch answer");

      const data = await res.json();
      setConversation([...updatedChat, { sender: "bot", message: data.answer }]);
    } catch (error) {
      alert("Sorry, could not get an answer. Try again later.");
      console.error(error);
    }
    setIsLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isLoading && query.trim() !== "") {
      submitQuestion();
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50 flex flex-col items-center p-6">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8 flex flex-col">
        <h1 className="text-3xl font-extrabold text-indigo-700 mb-6 flex items-center gap-2">
          <span>📄</span> PDF AI Assistant
        </h1>

        <input
          type="file"
          accept="application/pdf"
          onChange={onFileChange}
          className="block w-full border border-gray-300 rounded-md p-2 mb-4 transition focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          aria-label="Upload PDF file"
          disabled={isLoading}
        />

        <button
          onClick={handleUpload}
          disabled={!selectedFile || isLoading}
          className="w-full bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isLoading ? "Uploading..." : "Upload & Analyze"}
        </button>

        <div className="my-6 border-t border-indigo-200" />

        <section
          className="flex-1 overflow-y-auto max-h-96 bg-indigo-50 p-4 rounded-md space-y-4 shadow-inner"
          aria-live="polite"
          aria-atomic="false"
        >
          {conversation.length === 0 && (
            <p className="text-center text-indigo-400 select-none">No messages yet. Upload a PDF to start.</p>
          )}

          {conversation.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-[80%] ${
                msg.sender === "user"
                  ? "self-end bg-indigo-600 text-white rounded-l-lg rounded-tr-lg"
                  : "self-start bg-white text-gray-800 rounded-r-lg rounded-tl-lg shadow-sm"
              } px-4 py-3 whitespace-pre-wrap`}
              role={msg.sender === "system" ? "alert" : undefined}
            >
              {msg.message}
            </div>
          ))}

          <div ref={chatEndRef} />
        </section>

        {documentId && (
          <div className="mt-6 flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about your document..."
              className="flex-grow border border-indigo-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isLoading}
              aria-label="Question input"
              autoComplete="off"
            />
            <button
              onClick={submitQuestion}
              disabled={isLoading || query.trim() === ""}
              className="bg-green-600 text-white px-5 py-3 rounded-md font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              aria-label="Submit question"
            >
              {isLoading ? "Thinking..." : "Ask"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
