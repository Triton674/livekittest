import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { AccessToken } from "livekit-server-sdk"

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3000
const LIVEKIT_URL = process.env.LIVEKIT_URL
const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET

// Pour garder une room admin
let adminRoomName = null

// Endpoint pour récupérer le token
app.get("/token", (req, res) => {
  const role = req.query.role || "participant" // admin ou participant

  // Création de la room si c'est l'admin et qu'aucune room n'existe
  if (role === "admin" && !adminRoomName) {
    adminRoomName = `room-${Date.now()}`
  }

  if (!adminRoomName) {
    return res.status(400).json({ error: "No admin room active" })
  }

  const identity = role === "admin" ? "admin" : `user-${Math.floor(Math.random()*1000)}`

  const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity,
    name: identity,
  })

  at.addGrant({
    room: adminRoomName,
    type: "room",
  })

  res.json({
    token: at.toJwt(),
    url: LIVEKIT_URL,
    room: adminRoomName,
  })
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))