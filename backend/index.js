const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();

// ✅ middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ✅ check API key
if (!process.env.GEMINI_API_KEY) {
  console.log("❌ GEMINI_API_KEY missing in .env");
  process.exit(1);
} else {
  console.log("✅ Gemini API Key Loaded");
}

// ✅ Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ TEST ROUTES (important for debugging)
app.get("/", (req, res) => {
  res.send("Backend running with Gemini 🚀");
});

app.get("/test", (req, res) => {
  res.json({ status: "API working ✅" });
});

// 🔥 MAIN AI ROUTE
app.post("/api/query", async (req, res) => {
  try {
    const { userQuery } = req.body;

    console.log("👉 Query received:", userQuery);

    if (!userQuery) {
      return res.status(400).json({ error: "Query required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
Convert the following user query into structured JSON.

Query: "${userQuery}"

Return ONLY JSON in this format:
{
  "operation": "",
  "column": "",
  "metric": "",
  "limit": number
}

Examples:
Top 5 products ->
{
  "operation": "top",
  "column": "product",
  "metric": "sales",
  "limit": 5
}

Average glucose ->
{
  "operation": "average",
  "column": "glucose",
  "metric": "glucose",
  "limit": null
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    console.log("🧠 RAW AI:", text);

    // clean markdown
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch (err) {
      return res.status(500).json({
        error: "Invalid JSON from AI",
        raw: text,
      });
    }

  

  } catch (err) {
    console.error("❌ ERROR:", err.message);

    res.status(500).json({
      error: "Server failed",
      details: err.message,
    });
  }
});

// ✅ start server
app.listen(5000, () => {
  console.log("🚀 Server running at http://localhost:5000");
});