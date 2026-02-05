import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";

const app = express();
app.use(cors());

// Permet de servir les fichiers statiques dans /public
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

// Si tu veux une route par défaut
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/token", async (req, res) => {
  const role = req.query.role || "listener";

  const tokenResponse = await fetch(
    `https://livekittest-production.up.railway.app/token?role=${role}`
  );
  const data = await tokenResponse.json();
  
  res.json(data); // ton frontend appelle maintenant /token sur ton backend
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
