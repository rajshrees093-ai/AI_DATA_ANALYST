const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.post("/ask", (req, res) => {
  const { question, data } = req.body;

  if (!data || data.length === 0) {
    return res.json({ answer: "Upload data first." });
  }

  const q = question.toLowerCase();

  if (q.includes("average glucose")) {
    const avg =
      data.reduce((sum, r) => sum + Number(r.Glucose || 0), 0) /
      data.length;

    return res.json({
      answer: `Average glucose is ${avg.toFixed(2)}`
    });
  }

  if (q.includes("max age")) {
    const max = Math.max(...data.map((r) => Number(r.Age || 0)));

    return res.json({
      answer: `Max age is ${max}`
    });
  }

  if (q.includes("total")) {
    return res.json({
      answer: `Total records are ${data.length}`
    });
  }

  return res.json({
    answer: "Try: average glucose, max age, total records"
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});