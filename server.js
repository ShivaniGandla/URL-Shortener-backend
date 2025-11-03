const cors = require('cors');

const connectDB = require("./db");
connectDB();

const express = require("express");
const { nanoid } = require("nanoid");
const Url = require("./models/Url");

const app = express();
const PORT = 3000;

app.use(cors({
  origin: "http://localhost:3001",   // your React app URL
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));
// Middleware to parse JSON requests
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("🚀 URL Shortener backend is running!");
});

// Route to create short URL
app.post("/shorten", async (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ error: "Original URL is required" });
  }

  // Check if URL already exists
  let existingUrl = await Url.findOne({ originalUrl });
  if (existingUrl) {
    return res.json({
      shortUrl: `http://localhost:3000/${existingUrl.shortId}`,
      originalUrl: existingUrl.originalUrl,
      message: "URL already shortened earlier",
    });
  }

  // Otherwise, create a new one
  const shortId = nanoid(6);
  const newUrl = new Url({ originalUrl, shortId });
  await newUrl.save();

  res.json({
    shortUrl: `http://localhost:3000/${shortId}`,
    originalUrl,
    message: "New short URL created",
  });
});

// ✅ Route to redirect short URL to original URL
app.get("/:shortId", async (req, res) => {
  const { shortId } = req.params;

  const urlEntry = await Url.findOne({ shortId });
  if (urlEntry) {
    res.redirect(urlEntry.originalUrl);
  } else {
    res.status(404).send("URL not found");
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});