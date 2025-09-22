"use client";

import { useState } from "react";

export default function HomePage() {
  // Document upload state
  
  const [docTitle, setDocTitle] = useState("");
  const [docTopic, setDocTopic] = useState("");
  const [docContent, setDocContent] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  // Question state
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const [answerData, setAnswerData] = useState(null);
  const [askError, setAskError] = useState(null);
  const BASE_URL = "http://localhost:4000";

  // Upload document handler
  async function handleUpload(e) {
    e.preventDefault();
    setUploading(true);
    setUploadSuccess(null);
    setUploadError(null);

    if (!docTitle.trim() || !docTopic.trim() || docContent.trim().length < 500 ) {
      setUploadError("Please fill in all document fields & content should be greater then 500 chars .");
      setUploading(false);
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: docTitle.trim(),
          topic: docTopic.trim(),
          content: docContent.trim(),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to upload document.");
      }

      setUploadSuccess("Document uploaded successfully!");
      setDocTitle("");
      setDocTopic("");
      setDocContent("");
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setUploading(false);
    }
  }

  // Ask question handler
  async function handleAsk(e) {
    e.preventDefault();
    setAskError(null);
    setAnswerData(null);

    if (!question.trim()) {
      setAskError("Please enter a question.");
      return;
    }

    setAsking(true);

    try {
      const res = await fetch(`${BASE_URL}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: question.trim() }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to get answer.");
      }

      // data contains questionId, answer, trace
      setAnswerData(data);
    } catch (error) {
      setAskError(error.message);
    } finally {
      setAsking(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12">
      <h1 className="text-4xl font-bold text-center mb-8">
        Research Assistant
      </h1>

      {/* Document Upload */}
      <section className="border rounded-lg p-6 shadow-sm bg-white">
        <h2 className="text-2xl font-semibold mb-4">Upload Document</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium" htmlFor="docTitle">
              Title
            </label>
            <input
              id="docTitle"
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Document title"
              disabled={uploading}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium" htmlFor="docTopic">
              Topic
            </label>
            <input
              id="docTopic"
              type="text"
              value={docTopic}
              onChange={(e) => setDocTopic(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Document topic"
              disabled={uploading}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium" htmlFor="docContent">
              Content
            </label>
            <textarea
              id="docContent"
              rows="6"
              value={docContent}
              onChange={(e) => setDocContent(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Document content should be > 500"
              disabled={uploading}
            />
          </div>
          <button
            type="submit"
            disabled={uploading}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
          >
            {uploading ? "Uploading..." : "Upload Document"}
          </button>
          {uploadSuccess && (
            <p className="text-green-600 mt-2">{uploadSuccess}</p>
          )}
          {uploadError && <p className="text-red-600 mt-2">{uploadError}</p>}
        </form>
      </section>

      {/* Question Asking */}
      <section className="border rounded-lg p-6 shadow-sm bg-white">
        <h2 className="text-2xl font-semibold mb-4">Ask a Question</h2>
        <form onSubmit={handleAsk} className="space-y-4">
          <textarea
            rows="3"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question here..."
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            disabled={asking}
          />
          <button
            type="submit"
            disabled={asking}
            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 disabled:bg-green-400"
          >
            {asking ? "Asking..." : "Ask"}
          </button>
          {askError && <p className="text-red-600 mt-2">{askError}</p>}
        </form>

        {/* Answer and Trace Display */}
        {answerData && (
          <div className="mt-8 bg-gray-50 p-6 rounded border border-gray-200">
            <h3 className="text-xl font-semibold mb-4">Answer</h3>
            <p className="whitespace-pre-wrap mb-6">{answerData.answer}</p>

            <h3 className="text-xl font-semibold mb-4">Trace Steps</h3>
            <ol className="list-decimal list-inside space-y-4 max-h-96 overflow-y-auto">
              {answerData.trace.map((step, idx) => (
                <li key={idx} className="border rounded p-4 bg-white shadow-sm">
                  <p>
                    <span className="font-semibold">Step Name:</span>{" "}
                    {step.stepName}
                  </p>
                  <p className="mt-2">
                    <span className="font-semibold">Input:</span>{" "}
                    <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded max-h-48 overflow-auto">
                      {JSON.stringify(step.input, null, 2)}
                    </pre>
                  </p>
                  <p className="mt-2">
                    <span className="font-semibold">Output:</span>{" "}
                    <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded max-h-48 overflow-auto">
                      {JSON.stringify(step.output, null, 2)}
                    </pre>
                  </p>
                </li>
              ))}
            </ol>
          </div>
        )}
      </section>
    </div>
  );
}
