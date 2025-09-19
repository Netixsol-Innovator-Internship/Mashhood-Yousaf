import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

function SourceList({ sources }) {
  if (!sources || sources.length === 0) return null;
  return (
    <div style={{ marginTop: 8 }}>
      <h4>Sources</h4>
      <ul>
        {sources.map((s) => (
          <li key={s.chunk_id}>
            {s.chunk_id} (pages {s.page_start}-{s.page_end}) — score: {s.score?.toFixed(3)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function DocumentPage() {
  const router = useRouter();
  const { id } = router.query ;
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [sources, setSources] = useState([]);

  useEffect(() => {
    if (!id) return;
    async function fetchDoc() {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"}/documents/${id}`);
        setDoc(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchDoc();
  }, [id]);

  async function ask() {
    if (!id || !question.trim()) return;
    setLoading(true);
    setAnswer(null);
    setSources([]);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"}/documents/${id}/query`, { question });
      setAnswer(res.data.answer);
      setSources(res.data.sources || []);
    } catch (err) {
      alert("Query failed: " + (err?.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <button onClick={() => router.push("/")}>← Back</button>
      {!doc ? <h2>Loading document...</h2> : (
        <>
          <h1>{doc.filename}</h1>
          <div><strong>Category:</strong> {doc.category || "—"}</div>
          <h3>Executive Summary</h3>
          <p>{doc.executive_summary || "Not generated yet."}</p>
          <h3>Highlights</h3>
          <ul>{(doc.highlights || []).map((h, i) => <li key={i}>{h}</li>)}</ul>

          <hr />
          <h3>Ask a question (answers only from this document)</h3>
          <input style={{ width: "80%" }} value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="e.g. What is the main conclusion?" />
          <button onClick={ask} disabled={loading}>{loading ? "Thinking..." : "Ask"}</button>

          <div style={{ marginTop: 16 }}>
            <h4>Answer</h4>
            <div style={{ background: "#f6f6f6", padding: 12, minHeight: 60 }}>{answer ?? "No answer yet."}</div>
            <SourceList sources={sources} />
          </div>
        </>
      )}
    </main>
  );
}
