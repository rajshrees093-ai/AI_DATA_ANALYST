const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Backend running (Local AI Mode) 🚀");
});

// 🔥 AI QUERY ROUTE (LOCAL LOGIC)
app.post("/api/query", (req, res) => {
  try {
    const { userQuery } = req.body;

    console.log("👉 Query:", userQuery);

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

    // 🔥 RULES (AI SIMULATION)

    if (q.includes("average")) {
      result.operation = "average";
      result.column = "glucose";
      result.metric = "glucose";
    }

    else if (q.includes("max")) {
      result.operation = "max";
      result.column = "age";
      result.metric = "age";
    }

    else if (q.includes("min")) {
      result.operation = "min";
      result.column = "age";
      result.metric = "age";
    }

    else if (q.includes("top")) {
      result.operation = "top";
      result.column = "product";
      result.metric = "sales";
      result.limit = 5;
    }

    else if (q.includes("count")) {
      result.operation = "count";
    }

    else {
      result.operation = "unknown";
    }

    res.json({
      success: true,
      structuredQuery: result,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// start server
app.listen(5000, () => {
  console.log("🚀 Server running at http://localhost:5000");
});