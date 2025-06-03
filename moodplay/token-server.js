const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

app.get("/token", async (req, res) => {
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      "grant_type=client_credentials",
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    res.json({ access_token: response.data.access_token });
  } catch (error) {
    console.error("Token error:", error.message);
    res.status(500).json({ error: "Failed to get token" });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Token server running at http://localhost:${PORT}`);
});
