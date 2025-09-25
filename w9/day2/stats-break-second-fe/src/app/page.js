"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { MdSend } from "react-icons/md";
// Helper for dynamic class names
const cx = (...classes) => classes.filter(Boolean).join(" ");

// Array of cricket quotes for dynamic display
const cricketQuotes = [
  {
    quote: "Cricket is a game of glorious uncertainties.",
    author: "Richie Benaud",
  },
  {
    quote: "No matter how hot the water is, it cannot cook the yam.",
    author: "Michael Holding",
  },
  {
    quote: "When you have an opening, you should go for it.",
    author: "Kapil Dev",
  },
  {
    quote: "Test cricket is a marathon, not a sprint.",
    author: "Geoffrey Boycott",
  },
  {
    quote: "Enjoy the game and chase your dreams. Dreams do come true.",
    author: "Sachin Tendulkar",
  },
];

export default function AskPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  // New state for rotating quotes
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  // Effect to rotate quotes every 5 seconds
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % cricketQuotes.length);
    }, 5000);
    return () => clearInterval(quoteInterval);
  }, []);

  const fetchHistoryData = async () => {
    if (!userId || !token) return;
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/ask/history/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setHistory(data.conversations ? data.conversations.reverse() : []);
      setSummary(data.summary || "");
    } catch (err) {
      // handle error silently
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isSidebarOpen && userId && token) {
      fetchHistoryData();
    }
  }, [isSidebarOpen, userId, token]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    if (!storedToken || !storedUserId) {
      router.push("/login");
      return;
    }
    setToken(storedToken);
    setUserId(storedUserId);
    setAuthChecked(true);
  }, [router]);

  const askQuestion = async () => {
    if (!question.trim() || isLoading) return;
    try {
      setIsLoading(true);
      setAnswer(""); // Clear previous answer
      const res = await fetch("http://localhost:4000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, question }),
      });

      if (!res.ok) throw new Error("Failed to get answer");

      const data = await res.json();
      setAnswer(data.response);
      setHistory((prev) => [
        {
          question,
          answer: data.response,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setQuestion("");
    } catch (error) {
      // handle error silently
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const logout = () => {
    localStorage.clear();
    router.push("/login");
  };

  // Redesigned renderResponse function with TailwindCSS
  const renderResponse = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-4">
          <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-green-600"></div>
          <p className="ml-4 text-gray-300">Searching our database...</p>
        </div>
      );
    }
    if (!answer) return null;

    const lines = answer.split("\n").filter(Boolean);
    const isTable = lines.some(
      (line) => line.includes("|") && line.includes("---")
    );

    // Render table with Tailwind
    if (isTable) {
      const headerLineIndex = lines.findIndex(
        (line) => line.includes("|") && !line.includes("---")
      );
      const separatorLineIndex = lines.findIndex((line) =>
        line.includes("---")
      );

      if (headerLineIndex === -1 || separatorLineIndex === -1) {
        return (
          <div className="p-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg animate-fadeIn">
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown>{answer}</ReactMarkdown>
            </div>
          </div>
        );
      }

      const headers = lines[headerLineIndex]
        .split("|")
        .map((h) => h.trim())
        .filter(Boolean);
      const rows = lines.slice(separatorLineIndex + 1).map((row) =>
        row
          .split("|")
          .map((cell) => cell.trim())
          .filter(Boolean)
      );

      return (
        <div className="w-full overflow-x-auto rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm animate-fadeIn">
          <div className="min-w-max">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs text-gray-200 uppercase bg-gray-700/50 sticky top-0">
                <tr>
                  {headers.map((header, idx) => (
                    <th
                      key={idx}
                      scope="col"
                      className="px-6 py-3 whitespace-nowrap"
                    >
                      {header.replace(/\*\*/g, "")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-700 hover:bg-gray-700/50"
                  >
                    {row.map((cell, cid) => (
                      <td key={cid} className="px-6 py-4 whitespace-nowrap">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // Default markdown rendering with prose for better typography
    return (
      // <div className="p-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg animate-fadeIn">
        <div className="p-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg animate-fadeIn">
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown>{answer}</ReactMarkdown>
          </div>
        </div>
      // </div>
    );
  };

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen overflow-hidden bg-gray-900 text-gray-200 font-sans">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: "url('/cricket-stadium.jpg')" }}
      ></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>

      {/* Main Content */}
      <main
        className={cx(
          "relative flex-1 flex flex-col transition-all duration-300 ease-in-out",
          isSidebarOpen ? "mr-[350px]" : "mr-0"
        )}
      >
        <header className="flex items-center justify-between p-4 border-b border-gray-800/50 backdrop-blur-sm">
          <h1 className="text-2xl font-bold text-green-400">Cricket Q&A</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="px-4 py-2 text-sm font-medium transition-colors bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {isSidebarOpen ? "Hide History" : "See History"}
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium transition-colors bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-y-auto pb-32">
          <div className="max-w-4xl mx-auto">
            {!answer && !isLoading ? (
              <div className="flex flex-col items-center justify-center h-full text-center animate-fadeIn">
                <img
                  src="/cricket-helmet-svgrepo-com.svg"
                  className="w-24 h-24 mb-6 opacity-80"
                />
                <div className="relative w-full max-w-2xl px-4">
                  <p className="text-xl italic text-gray-400">
                    "{cricketQuotes[currentQuoteIndex].quote}"
                  </p>
                  <p className="mt-2 text-lg font-semibold text-green-400">
                    - {cricketQuotes[currentQuoteIndex].author}
                  </p>
                </div>
              </div>
            ) : (
              renderResponse()
            )}
          </div>
        </div>

        {/* Sticky Input Footer */}
        <footer className="absolute bottom-0 left-0 w-full p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="relative max-w-4xl mx-auto">
            <input
              type="text"
              className="w-full py-4 pl-6 pr-20 text-white placeholder-gray-500 bg-gray-800 border-2 border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="Ask a cricket question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && askQuestion()}
              disabled={isLoading}
            />
            <button
              onClick={askQuestion}
              disabled={isLoading || !question.trim()}
              className="absolute inset-y-0 right-0 flex items-center justify-center w-16 h-full text-white transition-transform duration-200 transform bg-green-600 rounded-full disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-green-500 active:scale-95"
            >
              <MdSend size={30} className="text-green-400" />
            </button>
          </div>
        </footer>
      </main>

      {/* Sidebar */}
      <aside
        className={cx(
          "fixed top-0 right-0 z-50 h-full w-[350px] bg-gray-900/80 backdrop-blur-lg border-l border-gray-700/50 shadow-2xl transition-transform duration-300 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-green-400">
              History & Summary
            </h2>
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-full hover:bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {isLoading && history.length === 0 ? (
              <div className="text-center text-gray-400">
                Loading History...
              </div>
            ) : (
              <>
                {summary && (
                  <div className="p-4 rounded-lg bg-green-900/30 border border-green-700/50">
                    <h3 className="font-semibold text-green-300">
                      Your Interest Summary:
                    </h3>
                    <pre className="mt-2 text-sm text-gray-300 whitespace-pre-wrap font-sans">
                      {summary}
                    </pre>
                  </div>
                )}

                {history.length > 0 ? (
                  history.map((item, i) => (
                    <div
                      key={i}
                      className="p-3 transition-colors bg-gray-800 rounded-lg hover:bg-gray-700/50"
                    >
                      <p className="font-semibold text-gray-200 truncate">
                        Q: {item.question}
                      </p>
                      <p className="mt-1 text-sm text-gray-400 line-clamp-2">
                        A: {item.answer}
                      </p>
                      {item.createdAt && (
                        <small className="block mt-2 text-xs text-gray-500">
                          {new Date(item.createdAt).toLocaleString()}
                        </small>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="py-10 text-center text-gray-500">
                    No chat history yet.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
        ></div>
      )}
    </div>
  );
}
