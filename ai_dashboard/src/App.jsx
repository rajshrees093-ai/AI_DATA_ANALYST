import { useState, useEffect } from "react";
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

  // Backend test
  useEffect(() => {
    fetch("http://localhost:5000")
      .then((res) => res.text())
      .then((data) => console.log("Backend:", data));
  }, []);

  // CSV upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const clean = results.data.filter(
          (row) => Object.keys(row).length > 0
        );
        setData(clean);
      },
    });
  };

  // AI
  const handleQuery = async () => {
    try {
      const res = await fetch("http://localhost:5000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: query }),
      });

      const result = await res.json();
      setAnswer(result.answer || "No response");
    } catch (err) {
      setAnswer("AI not working ❌");
    }
  };

  return (
    <div className={darkMode ? "bg-gray-900 text-white" : "bg-gray-100"}>
      <div className="flex min-h-screen">
        
        {/* Sidebar */}
        <div className="w-60 bg-white dark:bg-gray-800 p-5 shadow">
          <h1 className="text-xl font-bold text-blue-600 mb-6">
            AI Dashboard
          </h1>

          <ul className="space-y-4">
            <li>📊 Dashboard</li>
            <li>📁 Upload CSV</li>
            <li>🤖 Ask AI</li>
            <li>⚙️ Settings</li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          
          {/* Navbar */}
          <div className="flex justify-between mb-6">
            <h2 className="text-xl font-semibold">Welcome 👋</h2>

            <div className="flex gap-4">
              <input type="file" onChange={handleFileUpload} />

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="bg-gray-800 text-white px-3 py-1 rounded"
              >
                Toggle Mode 🌙
              </button>
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded shadow">
              <p>Total Sales</p>
              <h3 className="text-green-600 text-2xl font-bold">
                ₹50,000
              </h3>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <p>Orders</p>
              <h3 className="text-blue-600 text-2xl font-bold">
                120
              </h3>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <p>Customers</p>
              <h3 className="text-purple-600 text-2xl font-bold">
                80
              </h3>
            </div>
          </div>

          {/* Table */}
          {data && data.length > 0 && data[0] && (
            <div className="bg-white p-4 rounded shadow mb-6">
              <h2 className="text-lg font-bold mb-3">Uploaded Data</h2>

              <div className="overflow-auto max-h-60">
                <table className="w-full border">
                  <thead>
                    <tr>
                      {Object.keys(data[0]).map((key) => (
                        <th key={key} className="border p-2 bg-gray-200">
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
            </div>
          )}

          {/* Chart */}
          {data && data.length > 0 && (
            <div className="bg-white p-4 rounded shadow mb-6">
              <h2 className="text-lg font-bold mb-3">
                Glucose vs Age
              </h2>

              <BarChart
                width={600}
                height={300}
                data={data
                  .slice(0, 10)
                  .map((row) => ({
                    Age: Number(row.Age),
                    Glucose: Number(row.Glucose),
                  }))
                  .filter(
                    (d) => !isNaN(d.Age) && !isNaN(d.Glucose)
                  )}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Age" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Glucose" fill="#3b82f6" />
              </BarChart>
            </div>
          )}

          {/* AI Section */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-bold mb-3">Ask AI 🤖</h2>

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border p-2 w-full rounded"
              placeholder="Ask anything..."
            />

            <button
              onClick={handleQuery}
              className="mt-3 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Ask
            </button>

            {answer && (
              <p className="mt-3 text-green-600 font-semibold">
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