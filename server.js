const express = require("express");
const cors = require("cors");
const { nanoid } = require("nanoid");
const connectDB = require("./db");
const Url = require("./models/Url");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Connect MongoDB
connectDB();

// ✅ Allow CORS for Netlify + Localhost
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://melodious-dango-453826.netlify.app",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// ✅ Middleware
app.use(express.json());

// ✅ Root test
app.get("/", (req, res) => {
  res.send("🚀 URL Shortener backend is running!");
});

// ✅ Shorten URL
app.post("/shorten", async (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ error: "Original URL is required" });
  }

  // Check if URL already exists
  let existingUrl = await Url.findOne({ originalUrl });
  if (existingUrl) {
    return res.json({
      shortUrl: `https://url-shortener-backend-55jr.onrender.com/${existingUrl.shortId}`,
      originalUrl: existingUrl.originalUrl,
      message: "URL already shortened earlier",
    });
  }

  // Otherwise, create new one
  const shortId = nanoid(6);
  const newUrl = new Url({ originalUrl, shortId });
  await newUrl.save();

  res.json({
    shortUrl: `https://url-shortener-backend-55jr.onrender.com/${shortId}`,
    originalUrl,
    message: "New short URL created",
  });
});

// ✅ Redirect short URL
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
  console.log(`✅ Server running on http://localhost:${PORT}`);
});