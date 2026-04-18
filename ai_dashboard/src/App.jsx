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

  // CSV Upload
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

  // ✅ SAFE AI QUERY
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

      // ✅ SAFE handling
      if (result.success) {
        setAnswer(JSON.stringify(result.structuredQuery, null, 2));
      } else {
        setAnswer(result.error || "Something went wrong ❌");
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
          <input type="file" onChange={handleFile} />

          {/* TABLE (FIXED — WON’T DISAPPEAR) */}
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
            <BarChart width={500} height={300} data={data.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Age" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Glucose" />
            </BarChart>
          )}

          {/* AI */}
          <div className="mt-6">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask AI..."
              className="border p-2"
            />

            <button
              onClick={handleQuery}
              className="ml-2 bg-blue-500 text-white px-3 py-1"
            >
              Ask
            </button>

            <pre className="mt-4 text-green-500 whitespace-pre-wrap">
              {answer}
            </pre>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;