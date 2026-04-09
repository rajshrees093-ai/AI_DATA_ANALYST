import { useState } from "react";
import Papa from "papaparse";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");

  // 📁 CSV Upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setData(results.data);
      },
    });
  };

  // 📊 Chart Data
  const chartData = data.slice(0, 10).map((row) => ({
    age: Number(row.Age),
    glucose: Number(row.Glucose),
  }));

  // 🤖 AI Logic
  const handleQuery = () => {
    const q = query.toLowerCase();

    if (!data.length) {
      setAnswer("Please upload a CSV first 📁");
      return;
    }

    if (q.includes("average glucose")) {
      const avg =
        data.reduce((sum, row) => sum + Number(row.Glucose || 0), 0) /
        data.length;

      setAnswer(`Average Glucose is ${avg.toFixed(2)}`);
    } else if (q.includes("max age")) {
      const max = Math.max(...data.map((row) => Number(row.Age || 0)));

      setAnswer(`Max Age is ${max}`);
    } else if (q.includes("total records")) {
      setAnswer(`Total records are ${data.length}`);
    } else {
      setAnswer("Sorry, I don't understand yet 🤔");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-8">
          AI Dashboard
        </h2>

        <ul className="space-y-4">
          <li className="hover:text-blue-500 cursor-pointer">📊 Dashboard</li>
          <li className="hover:text-blue-500 cursor-pointer">📁 Upload CSV</li>
          <li className="hover:text-blue-500 cursor-pointer">💬 Ask AI</li>
          <li className="hover:text-blue-500 cursor-pointer">⚙ Settings</li>
        </ul>
      </div>

      {/* Main Section */}
      <div className="flex-1 flex flex-col">

        {/* Navbar */}
        <div className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Welcome 👋</h1>

          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="border p-2 rounded"
          />
        </div>

        {/* Content */}
        <div className="p-6">

          <h2 className="text-2xl font-bold mb-6">
            Dashboard Overview
          </h2>

          {/* Cards */}
          <div className="grid grid-cols-3 gap-6">

            <div className="bg-white p-5 rounded-lg shadow">
              <h3 className="text-gray-500">Total Sales</h3>
              <p className="text-3xl font-bold mt-2 text-green-500">₹50,000</p>
            </div>

            <div className="bg-white p-5 rounded-lg shadow">
              <h3 className="text-gray-500">Orders</h3>
              <p className="text-3xl font-bold mt-2 text-blue-500">120</p>
            </div>

            <div className="bg-white p-5 rounded-lg shadow">
              <h3 className="text-gray-500">Customers</h3>
              <p className="text-3xl font-bold mt-2 text-purple-500">80</p>
            </div>

          </div>

          {/* 📊 TABLE */}
          {data.length > 0 && (
            <div className="mt-8 bg-white p-4 rounded shadow overflow-auto">
              <h2 className="text-xl font-bold mb-4">
                Uploaded Data
              </h2>

              <table className="w-full border border-gray-300">
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
                  {data.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      {Object.values(row).map((val, i) => (
                        <td key={i} className="border p-2">
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 📈 INSIGHTS */}
          {data.length > 0 && (
            <div className="mt-8 bg-white p-4 rounded shadow">
              <h2 className="text-xl font-bold mb-4">
                Basic Insights
              </h2>

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
                {Math.max(
                  ...data.map((row) => Number(row.Age || 0))
                )}
              </p>
            </div>
          )}

          {/* 📊 CHART */}
          {data.length > 0 && (
            <div className="mt-8 bg-white p-4 rounded shadow">
              <h2 className="text-xl font-bold mb-4">
                Glucose vs Age
              </h2>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="glucose" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* 🤖 AI QUERY */}
          <div className="mt-8 bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-4">
              Ask AI 🤖
            </h2>

            <input
              type="text"
              placeholder="Ask something like 'average glucose'"
              className="border p-2 w-full rounded"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <button
              onClick={handleQuery}
              className="mt-3 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Ask
            </button>

            {answer && (
              <p className="mt-4 font-semibold text-green-600">
                Answer: {answer}
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;