require("dotenv").config();
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

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

// AI route
app.post("/ask", async (req, res) => {
  console.log("Incoming:", req.body);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "user",
          content: req.body.question,
        },
      ],
    });

    res.json({
      answer: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ error: "AI failed" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});