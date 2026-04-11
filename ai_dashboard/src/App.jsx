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

  // ✅ AI Query
  const handleQuery = async () => {
    if (!query) return;

    setAnswer("Thinking... 🤖");

    try {
      const res = await fetch("http://localhost:5000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: query,
          data: data.slice(0, 100),
        }),
      });

      const result = await res.json();
      setAnswer(result.answer);
    } catch {
      setAnswer("AI not working ❌");
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

        {/* Main Content */}
        <div className="flex-1 p-6">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Welcome 👋</h1>

            <input
              type="file"
              onChange={handleFile}
              className="border p-2 rounded"
            />
          </div>

          {/* Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
              <h3>Total Sales</h3>
              <p className="text-green-500 text-xl">₹50,000</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
              <h3>Orders</h3>
              <p className="text-blue-500 text-xl">120</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
              <h3>Customers</h3>
              <p className="text-purple-500 text-xl">80</p>
            </div>
          </div>

          {/* Insights */}
          {data.length > 0 && (
            <div className="mt-8 bg-white dark:bg-gray-800 p-4 rounded shadow">
              <h2 className="text-xl font-bold mb-4">Basic Insights</h2>

              <p>Total Records: {data.length}</p>

              <p>
                Average Glucose:{" "}
                {(
                  data.reduce(
                    (sum, row) => sum + Number(row.Glucose || 0),
                    0
                  ) / data.length
                ).toFixed(2)}
              </p>

              <p>
                Max Age:{" "}
                {Math.max(...data.map((row) => Number(row.Age || 0)))}
              </p>
            </div>
          )}

          {/* Chart */}
          {data.length > 0 && (
            <div className="mt-8 bg-white dark:bg-gray-800 p-4 rounded shadow">
              <h2 className="text-xl font-bold mb-4">Glucose vs Age</h2>

              <BarChart width={600} height={300} data={data.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Age" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Glucose" fill="#3b82f6" />
              </BarChart>
            </div>
          )}

          {/* Table */}
          {data.length > 0 && (
            <div className="mt-8 bg-white dark:bg-gray-800 p-4 rounded shadow overflow-auto">
              <h2 className="text-xl font-bold mb-4">Uploaded Data</h2>

              <table className="w-full border">
                <thead>
                  <tr>
                    {Object.keys(data[0]).map((key) => (
                      <th key={key} className="border p-2">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, 10).map((row, i) => (
                    <tr key={i}>
                      {Object.values(row).map((val, j) => (
                        <td key={j} className="border p-2">
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* AI Section */}
          <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Ask AI 🤖</h2>

            <input
              type="text"
              placeholder="Ask about your data..."
              className="border p-3 w-full rounded"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setQuery("average glucose")}
                className="bg-gray-200 px-2 py-1 rounded"
              >
                Avg Glucose
              </button>

              <button
                onClick={() => setQuery("max age")}
                className="bg-gray-200 px-2 py-1 rounded"
              >
                Max Age
              </button>
            </div>

            <button
              onClick={handleQuery}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Ask
            </button>

            {answer && (
              <p className="mt-4 text-green-500 font-semibold">
                {answer}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;