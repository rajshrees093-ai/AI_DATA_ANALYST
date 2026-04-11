const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ SMART LOCAL AI FUNCTION
function localAI(question, data) {
  const q = question.toLowerCase();

  if (!data || data.length === 0) {
    return "No dataset uploaded.";
  }

  if (q.includes("average glucose")) {
    const avg =
      data.reduce((sum, row) => sum + Number(row.Glucose || 0), 0) /
      data.length;
    return `Average glucose is ${avg.toFixed(2)}`;
  }

  if (q.includes("max age")) {
    const max = Math.max(...data.map((r) => Number(r.Age || 0)));
    return `Max age is ${max}`;
  }

  if (q.includes("total")) {
    return `Total records are ${data.length}`;
  }

  if (q.includes("min age")) {
    const min = Math.min(...data.map((r) => Number(r.Age || 0)));
    return `Minimum age is ${min}`;
  }

  return null; // means not handled
}

// ✅ AI ROUTE (FINAL)
app.post("/ask", async (req, res) => {
  const { question, data } = req.body;

  try {
    // 🔥 1. TRY LOCAL AI FIRST
    const localAnswer = localAI(question, data);

    if (localAnswer) {
      return res.json({ answer: localAnswer });
    }

    // 🔥 2. TRY OPENAI (if credits exist)
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

    return res.json({
      answer: response.choices[0].message.content,
    });

  } catch (error) {
    console.log("OpenAI failed → fallback");

    // 🔥 3. FINAL FALLBACK
    return res.json({
      answer:
        "AI unavailable (no credits). Try questions like 'average glucose', 'max age', 'total records'.",
    });
  }
});

// ✅ SERVER
app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});