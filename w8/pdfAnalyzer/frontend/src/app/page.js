"use client";

import React, { useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export default function Home() {
  const [file, setFile] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
  };

  const upload = async () => {
    if (!file) return alert("Select a PDF first.");
    if (file.type !== "application/pdf") return alert("Only PDF allowed.");
    const fd = new FormData();
    fd.append("pdf", file);
    try {
      setLoading(true);
      const res = await axios.post(`${BACKEND}/pdf/upload`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSessionId(res.data.sessionId);
      alert("PDF uploaded. You can now ask questions.");
    } catch (err) {
      alert(err?.response?.data?.message || err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const ask = async () => {
    if (!sessionId) return alert("Upload a PDF first.");
    if (!question.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND}/pdf/ask`, {
        sessionId,
        question,
      });
      const answer = res.data.answer;
      setChat((c) => [...c, { q: question, a: answer }]);
      setQuestion("");
    } catch (err) {
      alert(err?.response?.data?.message || err.message || "Ask failed");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setSessionId(null);
    setChat([]);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg border border-white/20">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">📄</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              PDF → QA Assistant
            </h1>
            <div className="px-3 py-1 bg-gradient-to-r from-emerald-400 to-blue-500 text-white text-xs font-medium rounded-full">
              Powered by MYG
            </div>
          </div>
        </motion.div>

        {/* Upload Section */}
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 mb-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
            <h2 className="text-xl font-semibold text-gray-800">
              Upload Document
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex  flex-col sm:flex-row gap-4">
              <div className="flex-1 relative group">
                <input
                  ref={fileRef}
                  type="file"
                  onChange={handleFile}
                  accept="application/pdf"
                  className="w-full border-2 border-dashed border-gray-300 rounded-xl px-4 py-2 text-sm cursor-pointer transition-all duration-300 hover:border-blue-400 hover:bg-blue-50/50 file:mr-4 file:py-2 file:px-6 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-blue-500 file:to-blue-600 file:text-white file:font-medium file:cursor-pointer hover:file:from-blue-600 hover:file:to-blue-700 file:transition-all file:duration-300"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={upload}
                  disabled={!file || loading}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    !file || loading
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Uploading...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>⬆️</span>
                      Upload PDF
                    </div>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={reset}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium shadow-lg hover:shadow-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300"
                >
                  <div className="flex items-center gap-2">
                    <span>🔄</span>
                    Reset
                  </div>
                </motion.button>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 text-sm"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-gray-600">File:</span>
                <span className="font-medium text-gray-800">
                  {file?.name ?? "No file selected"}
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-gray-600">Session:</span>
                <span className="font-medium text-gray-800">
                  {sessionId ?? "Not started"}
                </span>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Question Section */}
        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 mb-8"
        >
          <div className="flex items-center gap-2  mb-6">
            <div className="w-2 h-8 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full"></div>
            <h2 className="text-xl font-semibold text-gray-800">
              Ask Questions
            </h2>
          </div>

          <p className="text-gray-600 mb-6 bg-amber-50 px-4 py-2 rounded-lg border-l-4 border-amber-400">
            💡 Ask questions about your uploaded PDF. The AI will provide
            answers based on the document content.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What would you like to know about the document?"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 text-gray-800 placeholder-gray-400 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 bg-white/50"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={ask}
              disabled={!sessionId || loading}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                !sessionId || loading
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-green-700"
              }`}
            >
              <div className="flex items-center gap-2">
                Ask Question
              </div>
            </motion.button>
          </div>
        </motion.section>

        {/* Chat Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 mb-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-8 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full"></div>
            <h2 className="text-xl font-semibold text-gray-800">
              Conversation
            </h2>
          </div>

          <div className="bg-gray-50/50 border-2 border-gray-100 rounded-2xl p-6 min-h-[200px] max-h-[500px] overflow-y-auto">
            <AnimatePresence>
              {chat.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💭</span>
                  </div>
                  <p className="text-gray-500">
                    Start a conversation by asking a question about your PDF
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  {chat.map((c, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="space-y-3"
                    >
                      {/* Question */}
                      <div className="flex gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm">Q</span>
                        </div>
                        <div className="flex-1 bg-blue-50 rounded-2xl rounded-tl-none px-4 py-3">
                          <p className="text-gray-800 font-medium">{c.q}</p>
                        </div>
                      </div>

                      {/* Answer */}
                      <div className="flex gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm">A</span>
                        </div>
                        <div className="flex-1 bg-emerald-50 rounded-2xl rounded-tl-none px-4 py-3">
                          <p className="text-gray-700">{c.a}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <span className="text-amber-500">⚠️</span>
            <span>
              The assistant provides answers based solely on your uploaded PDF
              content.
            </span>
          </div>
          {/* <div className="mt-2 text-xs text-gray-500">
           If information isn't found in the document, you'll receive a{" "}
           <span className="font-semibold text-red-500 bg-red-50 px-2 py-1 rounded">
             "Not in document"
           </span>{" "}
           response.
         </div> */}
        </motion.footer>
      </motion.div>
    </div>
  );
}
