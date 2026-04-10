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

  // ✅ Backend connection test
  useEffect(() => {
    fetch("http://localhost:5000")
      .then((res) => res.text())
      .then((data) => console.log("Backend:", data))
      .catch((err) => console.error("Backend error:", err));
  }, []);

  // ✅ CSV Upload (SAFE)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    console.log("File selected:", file);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        console.log("Parsed Data:", results.data);

        // ✅ FILTER EMPTY ROWS (important)
        const cleanData = results.data.filter(
          (row) => Object.keys(row).length > 0
        );

        setData(cleanData);
      },
    });
  };

  // ✅ AI FUNCTION (SAFE)
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

      const result = await res.json();

      if (result.answer) {
        setAnswer(result.answer);
      } else {
        setAnswer("AI not responding properly ⚠️");
      }
    } catch (error) {
      console.error(error);
      setAnswer("Error connecting to AI ❌");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">AI Dashboard</h1>

      {/* 📁 Upload CSV */}
      <input type="file" onChange={handleFileUpload} />

      {/* 📊 TABLE (SAFE VERSION) */}
      {data && data.length > 0 && data[0] && (
        <div className="mt-6 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-2">Uploaded Data</h2>

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
      )}

      {/* 📊 CHART (SAFE VERSION) */}
      {data && data.length > 0 && (
        <div className="mt-6 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-2">Chart</h2>

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
                (item) =>
                  !isNaN(item.Age) && !isNaN(item.Glucose)
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

      {/* 🤖 AI SECTION */}
      <div className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-2">Ask AI</h2>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask something..."
          className="border p-2 w-full rounded"
        />

        <button
          onClick={handleQuery}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Ask
        </button>

        {answer && (
          <p className="mt-2 text-green-600 font-semibold">
            {answer}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;