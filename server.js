import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { AccessToken } from "livekit-server-sdk"; // juste AccessToken

const app = express();
app.use(cors());

// Pour servir les fichiers statiques dans /public
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

// Variables d'environnement LiveKit (à configurer sur Railway)
const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL;

// Route pour générer un token
app.get("/token", (req, res) => {
  try {
    const role = req.query.role || "listener";
    const identity = `${role}_${Math.floor(Math.random()*10000)}`;
    const roomName = req.query.room || "testroom";

    console.log("LIVEKIT_URL:", process.env.LIVEKIT_URL);
    console.log("LIVEKIT_API_KEY:", process.env.LIVEKIT_API_KEY ? "ok" : "missing");
    console.log("LIVEKIT_API_SECRET:", process.env.LIVEKIT_API_SECRET ? "ok" : "missing");

    const token = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      { identity }
    );
    token.addGrant({ room: roomName });

    res.json({
      token: token.toJwt(),
      url: process.env.LIVEKIT_URL,
      room: roomName,
      identity
    });
  } catch (err) {
    console.error("Erreur génération token:", err);
    res.status(500).json({ error: err.message });
  }
});


// Route par défaut
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
