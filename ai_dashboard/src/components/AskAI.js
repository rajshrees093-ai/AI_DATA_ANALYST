import { useState } from "react";

function AskAI() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query) return;

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userQuery: query, // ✅ ONLY query
        }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Ask AI</h2>

      <input
        type="text"
        placeholder="Enter your query..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: "10px", width: "300px" }}
      />

      <button onClick={handleAsk} style={{ marginLeft: "10px" }}>
        Ask
      </button>

      {loading && <p>Loading...</p>}

      {response && (
        <pre style={{ marginTop: "20px", background: "#111", color: "#0f0", padding: "10px" }}>
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default AskAI;