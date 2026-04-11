const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ AI ROUTE (FINAL CLEAN)
app.post("/ask", async (req, res) => {
  try {
    const { question, data } = req.body;

    const prompt = `
You are an expert data analyst.

Dataset:
${JSON.stringify(data)}

Instructions:
- Answer ONLY using dataset
- Be short and clear
- Do calculations if needed
- If unrelated → say "Not related to dataset"

User Question:
${question}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const answer = response.choices[0].message.content;

    res.json({ answer });

  } catch (error) {
    console.log("ERROR:", error.message);

    res.status(500).json({
      answer: "AI error ❌",
    });
  }
});

// ✅ SERVER START
app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});