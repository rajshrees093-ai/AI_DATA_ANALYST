const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// Test
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// AI route (LOCAL)
app.post("/api/query", (req, res) => {
  const { userQuery } = req.body;

  if (!userQuery) {
    return res.status(400).json({ error: "Query required" });
  }

  const q = userQuery.toLowerCase();

  let result = {
    operation: "",
    column: "",
    metric: "",
    limit: null,
  };

  if (q.includes("average")) {
    result.operation = "average";
    result.column = "Glucose";
    result.metric = "Glucose";
  } else if (q.includes("max")) {
    result.operation = "max";
    result.column = "Age";
    result.metric = "Age";
  } else if (q.includes("top")) {
    result.operation = "top";
    result.column = "product";
    result.metric = "sales";
    result.limit = 5;
  } else {
    result.operation = "unknown";
  }

  res.json({
    success: true,
    structuredQuery: result,
  });
});

// Start
app.listen(5000, () => {
  console.log("🚀 Server running at http://localhost:5000");
});