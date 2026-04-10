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

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ AI ROUTE (FIXED)
app.post("/ask", async (req, res) => {
  try {
    const { question, data } = req.body;

    const prompt = `
You are a data analyst AI.

Dataset:
${JSON.stringify(data)}

User question:
${question}

Answer clearly based on dataset.
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
    res.status(500).json({ answer: "AI error ❌" });
  }
});

// Server start
app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});