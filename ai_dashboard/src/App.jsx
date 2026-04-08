import { useState } from "react";
import Papa from "papaparse";

function App() {
  const [data, setData] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log(results.data);
        setData(results.data);
      },
    });
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

          {/* File Upload */}
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

          {/* CSV Table */}
          {data.length > 0 && (
            <div className="mt-8 bg-white p-4 rounded shadow overflow-auto">
              <h2 className="text-xl font-bold mb-4">
                Uploaded Data
              </h2>

              <table className="w-full border border-gray-300">
                <thead>
                  <tr>
                    {Object.keys(data[0]).map((key) => (
                      <th
                        key={key}
                        className="border p-2 bg-gray-200 text-left"
                      >
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

        </div>

      </div>
    </div>
  );
}

export default App;