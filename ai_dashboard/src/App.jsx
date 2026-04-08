function App() {
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

          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Upload CSV
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">
            Dashboard Overview
          </h2>

          <div className="grid grid-cols-3 gap-6">

            <div className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-gray-500">Total Sales</h3>
              <p className="text-3xl font-bold mt-2 text-green-500">₹50,000</p>
            </div>

            <div className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-gray-500">Orders</h3>
              <p className="text-3xl font-bold mt-2 text-blue-500">120</p>
            </div>

            <div className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-gray-500">Customers</h3>
              <p className="text-3xl font-bold mt-2 text-purple-500">80</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default App;