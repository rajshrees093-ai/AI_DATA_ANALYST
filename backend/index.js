const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();

// ✅ FIX: increase payload limit
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

// ✅ Debug API key
console.log("API KEY:", process.env.OPENAI_API_KEY ? "Loaded ✅" : "Missing ❌");

// OpenAI setup
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Test route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// 🔥 AI QUERY ROUTE (ONLY QUERY — NO DATA)
app.post("/api/query", async (req, res) => {
  try {
    const { userQuery } = req.body;

    console.log("👉 Query received:", userQuery);

    if (!userQuery) {
      return res.status(400).json({ error: "Query is required" });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Convert user query into JSON.

Return ONLY JSON.

Format:
{
  "operation": "",
  "column": "",
  "metric": "",
  "limit": number
}

Examples:

Top 5 products →
{
  "operation": "top",
  "column": "product",
  "metric": "sales",
  "limit": 5
}

Average sales →
{
  "operation": "average",
  "column": "sales",
  "metric": "sales",
  "limit": null
}
`
        },
        {
          role: "user",
          content: userQuery,
        },
      ],
    });

    let aiText = response.choices[0].message.content;

    console.log("🧠 AI RAW:", aiText);

    // Clean response
    aiText = aiText.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsed;

    try {
      parsed = JSON.parse(aiText);
    } catch (err) {
      return res.status(500).json({
        error: "Invalid JSON from AI",
        raw: aiText,
      });
    }

    res.json({
      success: true,
      structuredQuery: parsed,
    });

  } catch (error) {
    console.error("❌ ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(5000, () => {
  console.log("🚀 Server running at http://localhost:5000");
});