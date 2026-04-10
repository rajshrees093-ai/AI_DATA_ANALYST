import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// AI route
app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    // TEMP: dummy AI (so it ALWAYS works)
    if (question.toLowerCase().includes("diabetes")) {
      return res.json({
        answer: "Diabetes is a condition where blood sugar levels are high.",
      });
    }

    if (question.toLowerCase().includes("glucose")) {
      return res.json({
        answer: "Glucose is a type of sugar in your blood.",
      });
    }

    res.json({
      answer: "AI learning... ask something else 🤖",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});