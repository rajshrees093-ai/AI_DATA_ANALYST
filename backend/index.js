const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Debug check
console.log("API KEY:", process.env.OPENAI_API_KEY ? "Loaded ✅" : "Missing ❌");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Test route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// MAIN AI ROUTE
app.post("/api/query", async (req, res) => {
  try {
    const { userQuery } = req.body;

    console.log("Query:", userQuery);

    if (!userQuery) {
      return res.status(400).json({ error: "Query required" });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Return ONLY JSON.

Format:
{
  "operation": "",
  "column": "",
  "metric": "",
  "limit": number
}

Example:
Top 5 products →
{
  "operation": "top",
  "column": "product",
  "metric": "sales",
  "limit": 5
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

    console.log("AI RAW:", aiText);

    aiText = aiText.replace(/```json/g, "").replace(/```/g, "").trim();

    const parsed = JSON.parse(aiText);

    res.json({
      success: true,
      structuredQuery: parsed,
    });

  } catch (err) {
    console.error("ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(5000, () => {
  
});