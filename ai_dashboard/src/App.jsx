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
import {
  FiHome,
  FiUpload,
  FiSettings,
  FiMessageSquare,
  FiMoon,
} from "react-icons/fi";

function App() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Backend test
  useEffect(() => {
    fetch("http://localhost:5000")
      .then((res) => res.text())
      .then((data) => console.log("Backend:", data));
  }, []);

  // CSV Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        setData(results.data);
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
      setAnswer(result.answer);
    } catch {
      setAnswer("AI not working ❌");
    }
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">

        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? "w-64" : "w-20"
          } bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 p-4`}
        >
          <h1 className="text-xl font-bold text-blue-600 mb-8">
            🤖 {sidebarOpen && "AI Dashboard"}
          </h1>

          <ul className="space-y-6">
            <li className="flex items-center gap-3 hover:text-blue-500 cursor-pointer">
              <FiHome /> {sidebarOpen && "Dashboard"}
            </li>
            <li className="flex items-center gap-3 hover:text-blue-500 cursor-pointer">
              <FiUpload /> {sidebarOpen && "Upload CSV"}
            </li>
            <li className="flex items-center gap-3 hover:text-blue-500 cursor-pointer">
              <FiMessageSquare /> {sidebarOpen && "Ask AI"}
            </li>
            <li className="flex items-center gap-3 hover:text-blue-500 cursor-pointer">
              <FiSettings /> {sidebarOpen && "Settings"}
            </li>
          </ul>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mt-10 text-sm text-gray-500"
          >
            Toggle
          </button>
        </div>

        {/* Main */}
        <div className="flex-1 p-6">

          {/* Topbar */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Dashboard 🚀</h2>

            <div className="flex gap-4 items-center">
              <input type="file" onChange={handleFileUpload} />

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="flex items-center gap-2 bg-gray-800 text-white px-3 py-2 rounded"
              >
                <FiMoon /> Mode
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-xl shadow-lg">
              <h4>Total Sales</h4>
              <h2 className="text-2xl font-bold">₹50,000</h2>
            </div>

            <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 rounded-xl shadow-lg">
              <h4>Orders</h4>
              <h2 className="text-2xl font-bold">120</h2>
            </div>

            <div className="bg-gradient-to-r from-purple-400 to-purple-600 text-white p-6 rounded-xl shadow-lg">
              <h4>Customers</h4>
              <h2 className="text-2xl font-bold">80</h2>
            </div>
          </div>

          {/* Table */}
          {data.length > 0 && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-8">
              <h3 className="text-lg font-bold mb-4">Dataset Preview</h3>

              <div className="overflow-auto max-h-60">
                <table className="w-full text-sm">
                  <thead className="bg-gray-200 dark:bg-gray-700">
                    <tr>
                      {Object.keys(data[0]).map((key) => (
                        <th key={key} className="p-2">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {data.slice(0, 10).map((row, i) => (
                      <tr key={i} className="border-b">
                        {Object.values(row).map((val, j) => (
                          <td key={j} className="p-2">
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
          {data.length > 0 && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-8">
              <h3 className="text-lg font-bold mb-4">
                Glucose vs Age 📊
              </h3>

              <BarChart
                width={600}
                height={300}
                data={data.slice(0, 10).map((row) => ({
                  Age: Number(row.Age),
                  Glucose: Number(row.Glucose),
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Age" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Glucose" fill="#3b82f6" />
              </BarChart>
            </div>
          )}

          {/* AI Panel */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h3 className="text-lg font-bold mb-4">Ask AI 🤖</h3>

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border p-3 w-full rounded mb-3 text-black"
              placeholder="Ask something..."
            />

            <button
              onClick={handleQuery}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Ask
            </button>

            {answer && (
              <p className="mt-4 text-green-500">{answer}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;