import { useState } from "react";
import Papa from "papaparse";
import { motion } from "framer-motion";
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
  const [darkMode, setDarkMode] = useState(false);
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");

  // CSV upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setData(results.data);
      },
    });
  };

  // AI mock
  const handleQuery = () => {
    if (query.toLowerCase().includes("glucose")) {
      setAnswer("Average glucose is around 120 📊");
    } else {
      setAnswer("Smart AI coming soon 🤖");
    }
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white flex">

        {/* Sidebar */}
        <motion.div
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          className="w-64 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg shadow-xl p-6"
        >
          <h1 className="text-2xl font-bold text-blue-600 mb-10">
            🤖 AI Panel
          </h1>

          <ul className="space-y-6">
            <li className="flex items-center gap-3 hover:text-blue-500 cursor-pointer">
              <FiHome /> Dashboard
            </li>
            <li className="flex items-center gap-3 hover:text-blue-500 cursor-pointer">
              <FiUpload /> Upload
            </li>
            <li className="flex items-center gap-3 hover:text-blue-500 cursor-pointer">
              <FiMessageSquare /> Ask AI
            </li>
            <li className="flex items-center gap-3 hover:text-blue-500 cursor-pointer">
              <FiSettings /> Settings
            </li>
          </ul>
        </motion.div>

        {/* Main */}
        <div className="flex-1 p-8">

          {/* Top Bar */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Dashboard ✨</h2>

            <div className="flex gap-4 items-center">
              <input
                type="file"
                onChange={handleFileUpload}
                className="bg-white dark:bg-gray-700 p-2 rounded shadow"
              />

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="bg-black text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <FiMoon /> Mode
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mb-10">
            {[
              { title: "Revenue", value: "₹50,000", color: "from-green-400 to-green-600" },
              { title: "Orders", value: "120", color: "from-blue-400 to-blue-600" },
              { title: "Users", value: "80", color: "from-purple-400 to-purple-600" },
            ].map((card, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className={`bg-gradient-to-r ${card.color} text-white p-6 rounded-2xl shadow-lg`}
              >
                <h4>{card.title}</h4>
                <h2 className="text-2xl font-bold">{card.value}</h2>
              </motion.div>
            ))}
          </div>

          {/* Chart */}
          {data.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg p-6 rounded-2xl shadow-xl mb-8"
            >
              <h3 className="text-xl font-bold mb-4">Glucose vs Age 📊</h3>

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
                <Bar dataKey="Glucose" fill="#6366f1" />
              </BarChart>
            </motion.div>
          )}

          {/* Table */}
          {data.length > 0 && (
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg p-6 rounded-2xl shadow-xl mb-8 overflow-auto max-h-60">
              <h3 className="text-xl font-bold mb-4">Data Preview</h3>

              <table className="w-full text-sm">
                <thead>
                  <tr>
                    {Object.keys(data[0]).map((key) => (
                      <th key={key} className="p-2 text-left">
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
          )}

          {/* AI */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg p-6 rounded-2xl shadow-xl">
            <h3 className="text-xl font-bold mb-4">Ask AI 🤖</h3>

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full p-3 rounded bg-gray-100 dark:bg-gray-700 mb-3 text-black"
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