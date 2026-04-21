import { useState } from "react";
import Papa from "papaparse";

function App() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");

  // CSV upload
  const handleFile = (e) => {
    const file = e.target.files[0];

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setData(results.data);
      },
    });
  };

  // AI query
  const handleQuery = async () => {
    if (!query) return;

    setAnswer("Thinking... 🤖");

    try {
      const res = await fetch("http://localhost:5000/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userQuery: query,
        }),
      });

      const result = await res.json();

      if (result.success) {
        setAnswer(JSON.stringify(result.structuredQuery, null, 2));
      } else {
        setAnswer("Error ❌");
      }

    } catch (err) {
      console.error(err);
      setAnswer("Server not responding ❌");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>AI Data Analyst Dashboard</h1>

      {/* Upload CSV */}
      <input type="file" onChange={handleFile} />

      {/* Table */}
      {data.length > 0 && (
        <table border="1" style={{ marginTop: "20px" }}>
          <thead>
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 10).map((row, i) => (
              <tr key={i}>
                {Object.values(row).map((val, j) => (
                  <td key={j}>{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* AI Section */}
      <div style={{ marginTop: "20px" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask AI (e.g. average glucose)"
        />

        <button onClick={handleQuery}>Ask</button>

        <pre style={{ marginTop: "10px", color: "green" }}>
          {answer}
        </pre>
      </div>
    </div>
  );
}

export default App;