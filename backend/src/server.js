const express = require("express");
const cors = require("cors");

require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Remplacez par votre clé API obtenue sur Google AI Studio
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview", generationConfig: { responseMimeType: "application/json" } });

const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true, app: "FactDrop API" });
});

app.get("/domains", async (_, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name FROM domains ORDER BY id ASC"
    );

    return res.json({
      status: 200,
      domains: result.rows
    });
  } catch (error) {
    console.error("Error fetching domains:", error.message);
    throw error;
  }
});

app.get("/facts", async (req, res) => {
  try {
    const domains = [];

    for (const key in req.query) {
      const match = key.match(/items\[(\d+)\]\[(\w+)\]/);

      if (match) {
        const index = Number(match[1]);
        const field = match[2];

        if (!domains[index]) {
          domains[index] = {};
        }

        domains[index][field] = req.query[key];
      }
    }

    const prompts = [];
    domains.map((domain) => domain.name).forEach((domain) => {
      prompts.push(`Peux-tu m'écrire dans un tableau JSON de chaîne de caractères et seulement retourner ce tableau, ${Math.round(10/domains.length)} faits aléatoires de 200 caractères à propos de ce domaine: ${domain}`);
    })

    const results = await Promise.all(prompts.map((prompt) => model.generateContent(prompt)));
    let output = [];
    results.forEach((result) => {
      output = [...output, ...JSON.parse(result.response.text())];
    });

    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        // Choisir un index aléatoire entre 0 et i
        const j = Math.floor(Math.random() * (i + 1));
        
        // Échanger les éléments array[i] et array[j]
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    res.json({
      output: shuffleArray(output),
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.toString() });
  }
})

app.get("/", (req, res) => {
  res.json({ message: "Welcome to FactDrop API" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`FactDrop API running on port ${PORT}`);
});