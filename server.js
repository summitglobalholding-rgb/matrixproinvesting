import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve file statici dalla cartella public
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Rotta per la dashboard (pagina principale)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Rotta per login
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Rotta API per Matrix Assistant
app.post("/api/assistant", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Sei Matrix Assistant, un coach finanziario per l’intermediazione e i bonus ADM." },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Errore nella risposta.";

    res.json({ reply });
  } catch (err) {
    console.error("Errore API:", err);
    res.status(500).json({ reply: "Errore del server Matrix Assistant." });
  }
});

// Avvio server
app.listen(PORT, () => {
  console.log(`Matrix Pro Investing in esecuzione sulla porta ${PORT}`);
});
