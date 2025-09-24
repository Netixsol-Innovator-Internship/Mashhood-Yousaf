"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

  const fetchHistoryData = async () => {
    if (!userId || !token) return;

    setIsLoading(true);

    try {
      const res = await fetch(`http://localhost:4000/ask/history/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setHistory(data.conversations ? data.conversations.reverse() : []);
      setSummary(data.summary || "");
    } catch (err) {
      // handle error silently or show user-friendly message if needed
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isSidebarOpen) {
      fetchHistoryData();
    }
  }, [isSidebarOpen]);

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
    if (!question.trim()) return;

    try {
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
        ...prev,
        {
          question,
          answer: data.response,
          createdAt: new Date().toISOString(),
        },
      ]);
      setQuestion("");

      if (isSidebarOpen) {
        fetchHistoryData();
      }
    } catch (error) {
      // optionally handle error, no logs
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const logout = () => {
    localStorage.clear();
    router.push("/login");
  };

  // if (!authChecked) return null;
  return (
    <div style={{ display: "flex", minHeight: "100vh", position: "relative" }}>
      {/* Main Content */}
      <div
        style={{
          flex: 1,
          padding: "24px",
          transition: "margin-left 0.3s",
          marginLeft: isSidebarOpen ? "320px" : "0",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>
              Cricket Q&A
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <button
                onClick={toggleSidebar}
                style={{
                  backgroundColor: "#e5e7eb",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {isSidebarOpen ? "Hide History" : "Show History"}
              </button>
              <button
                onClick={logout}
                style={{
                  color: "#dc2626",
                  textDecoration: "underline",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <input
              style={{
                width: "100%",
                border: "1px solid #d1d5db",
                padding: "8px",
                borderRadius: "4px",
              }}
              placeholder="Ask a cricket question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && askQuestion()}
            />
            <button
              onClick={askQuestion}
              style={{
                marginTop: "8px",
                backgroundColor: "#2563eb",
                color: "white",
                padding: "8px 16px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Ask
            </button>
          </div>

          {answer && (
            <div
              style={{
                backgroundColor: "#dcfce7",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "24px",
              }}
            >
              <strong>Answer:</strong>
              <p>{answer}</p>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100%",
          width: "320px",
          backgroundColor: "white",
          boxShadow: "-2px 0 10px rgba(0,0,0,0.1)",
          transform: isSidebarOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s",
          zIndex: 1000,
          overflowY: "auto",
        }}
      >
        <div style={{ padding: "24px", height: "100%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <h2 style={{ fontSize: "20px", fontWeight: "600" }}>
              Chat History & Summary
            </h2>
            <button
              onClick={toggleSidebar}
              style={{
                border: "none",
                background: "none",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>

          {isLoading ? (
            <div style={{ textAlign: "center", padding: "16px" }}>
              Loading...
            </div>
          ) : (
            <>
              {summary && (
                <div
                  style={{
                    marginBottom: "24px",
                    padding: "16px",
                    backgroundColor: "#fef3c7",
                    borderRadius: "8px",
                  }}
                >
                  <h3 style={{ fontWeight: "600", marginBottom: "8px" }}>
                    Your Interest Summary:
                  </h3>
                  <pre style={{ fontSize: "14px", whiteSpace: "pre-wrap" }}>
                    {summary}
                  </pre>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {history.length > 0 ? (
                  history.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        backgroundColor: "#f3f4f6",
                        padding: "12px",
                        borderRadius: "8px",
                      }}
                    >
                      <p style={{ fontWeight: "600", fontSize: "14px" }}>
                        Q: {item.question}
                      </p>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#374151",
                          marginTop: "4px",
                        }}
                      >
                        A: {item.answer}
                      </p>
                      {item.createdAt && (
                        <small
                          style={{
                            color: "#6b7280",
                            display: "block",
                            marginTop: "8px",
                          }}
                        >
                          {new Date(item.createdAt).toLocaleString()}
                        </small>
                      )}
                    </div>
                  ))
                ) : (
                  <p
                    style={{
                      color: "#6b7280",
                      textAlign: "center",
                      padding: "16px",
                    }}
                  >
                    No chat history yet
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {isSidebarOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 999,
          }}
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}
