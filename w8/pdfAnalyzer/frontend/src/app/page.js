"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [docId, setDocId] = useState(null);
  const [chat, setChat] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE = "https://pdf-analyzer-chatbot-be.vercel.app"; // ⬅️ Replace with your actual base URL

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setChat([]);
    setDocId(null);
  };

  const uploadFile = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/documents/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setDocId(data._id);

      // Add initial system message
      setChat([
        {
          sender: "system",
          message: `**Summary:** ${data.summary}\n\n**Category:** ${
            data.category
          }\n\n**Highlights:**\n${data.highlights.join("\n")}`,
        },
      ]);
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    }
    setLoading(false);
  };

  const askQuestion = async () => {
    if (!question.trim() || !docId) return;

    const newChat = [...chat, { sender: "user", message: question }];
    setChat(newChat);
    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/documents/${docId}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      setChat([...newChat, { sender: "bot", message: data.answer }]);
    } catch (err) {
      console.error(err);
      alert("Failed to get answer.");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded shadow p-6 space-y-4">
        <h1 className="text-2xl font-bold">📄 PDF AI Assistant</h1>

        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="block w-full"
        />

        <button
          onClick={uploadFile}
          disabled={!file || loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload & Analyze"}
        </button>

        <div className="h-px bg-gray-300 my-4" />

        <div className="space-y-3 max-h-96 overflow-y-auto border rounded p-3 bg-gray-50">
          {chat.map((msg, i) => (
            <div
              key={i}
              className={msg.sender === "user" ? "text-right" : "text-left"}
            >
              <p
                className={`inline-block px-4 py-2 rounded ${
                  msg.sender === "user"
                    ? "bg-blue-100 text-blue-900"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.message}
              </p>
            </div>
          ))}
        </div>

        {docId && (
          <div className="flex space-x-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 border px-3 py-2 rounded"
            />
            <button
              onClick={askQuestion}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Thinking..." : "Ask"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
