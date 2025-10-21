import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));
app.get("/", (req, res) => res.sendFile("index.html", { root: "public" }));

app.post("/api/coach", async (req, res) => {
  const { prompt } = req.body;
  const key = process.env.OPENAI_API_KEY;
  if (!key) return res.status(400).json({ error: "Chiave API mancante" });

  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Sei Matrix Assistant, un coach chiaro e diretto." },
        { role: "user", content: prompt }
      ],
      max_tokens: 300
    })
  });

  const j = await r.json();
  const reply = j?.choices?.[0]?.message?.content || "Errore nella risposta.";
  res.json({ reply });
});

app.listen(10000, () => console.log("Matrix Pro Investing in esecuzione sulla porta 10000"));
