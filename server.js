import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { AccessToken, VideoGrant } from "livekit-server-sdk"; // <-- VideoGrant ici

const app = express();
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL; // ex: wss://livekit-production-34a9.up.railway.app

app.get("/token", (req, res) => {
  const role = req.query.role || "listener";
  const roomName = req.query.room || "testroom";

  const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity: role + "_" + Math.floor(Math.random() * 1000),
  });

  const grant = new VideoGrant({ room: roomName }); // <-- VideoGrant
  at.addGrant(grant);

  const token = at.toJwt();

  res.json({
    token,
    url: LIVEKIT_URL,
    room: roomName,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
