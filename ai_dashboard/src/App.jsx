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

  // 🔗 Backend Test
  useEffect(() => {
    fetch("http://localhost:5000")
      .then((res) => res.text())
      .then((data) => console.log("Backend:", data));
  }, []);

  // 📂 CSV Upload
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

  // 🤖 REAL AI FUNCTION (UPDATED 🔥)
  const handleQuery = async () => {
    if (!query) return;

    try {
      const res = await fetch("http://localhost:5000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: query }),
      });

      const data = await res.json();

      setAnswer(data.answer);
    } catch (error) {
      console.error(error);
      setAnswer("Error connecting to AI ❌");
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-60 h-screen bg-gray-100 p-4">
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

      {/* Main */}
      <div className="flex-1 p-6 bg-gray-50">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Welcome 👋</h2>

          <input type="file" onChange={handleFileUpload} />
        </div>

        {/* Cards */}
        <h2 className="text-xl font-bold mb-4">
          Dashboard Overview
        </h2>

        <div className="grid grid-cols-3 gap-4">
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

        {/* Insights */}
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
                  (sum, row) =>
                    sum + Number(row.Glucose || 0),
                  0
                ) / data.length
              ).toFixed(2)}
            </p>

            <p>
              Max Age:{" "}
              {Math.max(
                ...data.map((row) =>
                  Number(row.Age || 0)
                )
              )}
            </p>
          </div>
        )}

        {/* Chart */}
        {data.length > 0 && (
          <div className="mt-8 bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-4">
              Glucose vs Age
            </h2>

            <BarChart
              width={600}
              height={300}
              data={data.slice(0, 10)}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Age" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Glucose" />
            </BarChart>
          </div>
        )}

        {/* 🤖 Ask AI */}
        <div className="mt-8 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-4">
            Ask AI 🤖
          </h2>

          <input
            type="text"
            placeholder="Ask anything..."
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
  );
}

export default App;