// db.js
const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect("mongodb+srv://shivanigandla27_db_user:N5qKWcoWQ2wJV6mB@url-shortener.ftiexan.mongodb.net/?appName=URL-SHORTENER", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
  }
}

module.exports = connectDB;