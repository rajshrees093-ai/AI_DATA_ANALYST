const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();

// ✅ prevent payload crash
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

// ✅ API key check
if (!process.env.OPENAI_API_KEY) {
  console.log("❌ OPENAI_API_KEY missing");
  process.exit(1);
} else {
  console.log("✅ API KEY LOADED");
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// test route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// 🔥 AI ROUTE (SAFE VERSION)
app.post("/api/query", async (req, res) => {
  try {
    const { userQuery } = req.body;

    console.log("👉 Query:", userQuery);

    if (!userQuery) {
      return res.status(400).json({ error: "Query required" });
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `Convert this query into JSON.

Query: ${userQuery}

Return ONLY JSON:
{
  "operation": "",
  "column": "",
  "metric": "",
  "limit": number
}`,
    });

    // ✅ SAFE extraction
    let aiText = "";

    if (response.output && response.output.length > 0) {
      aiText = response.output[0]?.content?.[0]?.text || "";
    }

    if (!aiText) {
      return res.status(500).json({
        error: "Empty AI response",
        fullResponse: response,
      });
    }

    console.log("🧠 AI RAW:", aiText);

    aiText = aiText.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsed;

    try {
      parsed = JSON.parse(aiText);
    } catch (err) {
      return res.status(500).json({
        error: "Invalid JSON",
        raw: aiText,
      });
    }

    res.json({
      success: true,
      structuredQuery: parsed,
    });

  } catch (error) {
    console.error("❌ FULL ERROR:", error);

    res.status(500).json({
      error: "Server failed",
      details: error.message,
    });
  }
});

// start server
app.listen(5000, () => {
  console.log("🚀 Server running at http://localhost:5000");
});