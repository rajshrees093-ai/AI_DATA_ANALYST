import { useState } from "react";
import Papa from "papaparse";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function App() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // ✅ CSV Upload
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

  // 🔥 PROCESS DATA (MAIN LOGIC)
  const processData = (aiQuery) => {
    if (!data.length) return "No data uploaded ❌";

    // 🔥 Fix column case issue
    const column = Object.keys(data[0]).find(
      (key) => key.toLowerCase() === aiQuery.column.toLowerCase()
    );

    if (!column) return "Column not found ❌";

    const values = data.map((row) => Number(row[column]) || 0);

    switch (aiQuery.operation) {
      case "average":
        const avg =
          values.reduce((a, b) => a + b, 0) / values.length;
        return `Average ${column}: ${avg.toFixed(2)}`;

      case "max":
        return `Max ${column}: ${Math.max(...values)}`;

      case "min":
        return `Min ${column}: ${Math.min(...values)}`;

      case "count":
        return `Total Records: ${data.length}`;

      default:
        return "Operation not supported ❌";
    }
  };

  // ✅ AI QUERY
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
        const finalAnswer = processData(result.structuredQuery);
        setAnswer(finalAnswer);
      } else {
        setAnswer("Error ❌");
      }

    } catch (err) {
      console.error(err);
      setAnswer("Server not responding ❌");
    }
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white flex">

        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-gray-800 p-5 shadow">
          <h1 className="text-2xl font-bold mb-6">AI Dashboard</h1>

          <ul className="space-y-3">
            <li>📊 Dashboard</li>
            <li>📂 Upload CSV</li>
            <li>🤖 Ask AI</li>
            <li>⚙️ Settings</li>
          </ul>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="mt-6 bg-blue-500 text-white px-3 py-2 rounded"
          >
            Toggle Mode 🌙
          </button>
        </div>

        {/* Main */}
        <div className="flex-1 p-6">

          {/* Upload */}
          <input
            type="file"
            onChange={handleFile}
            className="border p-2 rounded"
          />

          {/* Table */}
          {data.length > 0 && (
            <div className="mt-6 overflow-auto">
              <table className="border w-full">
                <thead>
                  <tr>
                    {Object.keys(data[0]).map((key) => (
                      <th key={key} className="border p-2">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, 10).map((row, i) => (
                    <tr key={i}>
                      {Object.values(row).map((val, j) => (
                        <td key={j} className="border p-2">{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Chart */}
          {data.length > 0 && (
            <div className="mt-6">
              <BarChart width={500} height={300} data={data.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Age" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Glucose" fill="#3b82f6" />
              </BarChart>
            </div>
          )}

          {/* AI Section */}
          <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Ask AI 🤖</h2>

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask (e.g. average glucose)"
              className="border p-3 w-full rounded"
            />

            <button
              onClick={handleQuery}
              className="mt-3 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Ask
            </button>

            <p className="mt-4 text-green-500 font-semibold">
              {answer}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;