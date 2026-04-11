const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ OpenAI setup
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ AI ROUTE (FULL + FALLBACK)
app.post("/ask", async (req, res) => {
  try {
    const { question, data } = req.body;
    const q = question.toLowerCase();

    // 🔥 LOCAL FALLBACK (works without API credits)
    if (q.includes("average glucose")) {
      const avg =
        data.reduce((sum, row) => sum + Number(row.Glucose || 0), 0) /
        data.length;
      return res.json({ answer: `Average glucose is ${avg.toFixed(2)}` });
    }

    if (q.includes("max age")) {
      const max = Math.max(...data.map((r) => Number(r.Age || 0)));
      return res.json({ answer: `Max age is ${max}` });
    }

    if (q.includes("total")) {
      return res.json({ answer: `Total records are ${data.length}` });
    }

    // 🤖 REAL AI (needs credits)
    const prompt = `
You are a data analyst.

Dataset:
${JSON.stringify(data)}

Question:
${question}
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({
      answer: response.choices[0].message.content,
    });

  } catch (error) {
    console.log("ERROR:", error.message);

    res.json({
      answer: "AI limited (no credits). Using basic analysis 🤖",
    });
  }
});

// ✅ SERVER START
app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});