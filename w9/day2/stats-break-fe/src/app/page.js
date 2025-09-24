'use client'
import { useState } from "react";
import Head from "next/head";
import axios from "axios";

export default function AskPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer(null);

    try {
      const response = await axios.post("https://stats-break-be-production.up.railway.app/ask", {
        question: question,
      });

      // If response is plain text
      const data =
        typeof response.data === "string"
          ? response.data
          : JSON.stringify(response.data, null, 2);

      setAnswer(data);
    } catch (err) {
      console.error("❌ Error:", err);
      setAnswer("❌ Failed to get a response");
    } finally {
      setLoading(false);
    }
  };

  const renderResponse = () => {
    if (!answer) return null;

    const lines = answer.split("\n").filter(Boolean);
    const isTable = lines.some(
      (line) => line.includes("|") && line.includes("---")
    );

    if (isTable) {
      const [headerLine, separatorLine, ...rows] = lines.slice(1);
      const headers = headerLine
        .replace(/\*\*/g, "")
        .split("|")
        .map((h) => h.trim());
      return (
        <div className="overflow-auto animate-fadeIn">
          <table className="w-full text-sm border border-gray-200 dark:border-gray-600 shadow-sm mt-6">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                {headers.map((header, idx) => (
                  <th
                    key={idx}
                    className="px-4 py-2 border border-gray-200 dark:border-gray-600 text-left text-gray-800 dark:text-gray-200"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={idx}
                  className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700"
                >
                  {row.split("|").map((cell, cid) => (
                    <td
                      key={cid}
                      className="px-4 py-2 border border-gray-100 dark:border-gray-600 text-gray-700 dark:text-gray-200"
                    >
                      {cell.trim()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // Single-column list (like "Overs")
    if (lines.length > 2 && lines[1].startsWith("---")) {
      const items = lines.slice(2).map((l) => l.trim());
      return (
        <ul className="list-disc pl-6 space-y-1 animate-fadeIn mt-4 text-gray-800 dark:text-gray-200">
          {items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      );
    }

    // Single value
    if (lines.length === 2) {
      return (
        <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-md p-4 mt-6 text-lg font-medium text-blue-800 dark:text-blue-200 shadow animate-fadeIn">
          {lines[1].trim()}
        </div>
      );
    }

    return (
      <div className="whitespace-pre-line mt-4 animate-fadeIn text-gray-800 dark:text-gray-200">
        {answer}
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Cricket Q&A</title>
      </Head>
      <div className="min-h-screen px-4 py-10 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Ask about Cricket 🏏
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Ask any question about T20, ODI, or Test matches.
          </p>
          <div className="flex flex-col md:flex-row items-center gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Who won the first test match?"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200 w-full"
              onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            />
            <button
              onClick={handleAsk}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md transition"
            >
              Ask
            </button>
          </div>

          {loading && (
            <div className="mt-6 text-blue-600 dark:text-blue-300 animate-pulse">
              Fetching answer...
            </div>
          )}

          {answer && (
            <div className="mt-8 text-left">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Response:
              </h2>
              {renderResponse()}
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </>
  );
}
