import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { AccessToken, RoomServiceClient } from "livekit-server-sdk";

const app = express();
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Route pour générer un token LiveKit
app.get("/token", (req, res) => {
  const role = req.query.role === "admin" ? "admin" : "participant";

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    return res.status(500).json({ error: "LIVEKIT_API_KEY/SECRET missing" });
  }

  const at = new AccessToken(apiKey, apiSecret, {
    identity: `user-${Math.floor(Math.random() * 1000)}`,
  });
  at.addGrant({ roomJoin: true, room: "*" });
  at.addGrant({ roomAdmin: role === "admin" });

  res.json({ token: at.toJwt() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
