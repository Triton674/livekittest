import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { AccessToken } from "livekit-server-sdk"; // plus de VideoGrant

const app = express();
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL;

app.get("/token", (req, res) => {
  const identity = req.query.role + "_" + Math.floor(Math.random() * 1000);
  const roomName = req.query.room || "testroom";

  // Dans la nouvelle version, on crée juste un AccessToken et on ajoute le nom de la room
  const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, { identity });
  token.addGrant({ room: roomName }); // on passe un objet {room: "roomName"}

  res.json({
    token: token.toJwt(),
    url: LIVEKIT_URL,
    room: roomName,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
