// index.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import placesRouter from "./routes/place.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_GIS;

// Validasi MONGO_URI
if (!MONGO_URI) {
  console.error("❌ Error: MONGO_GIS tidak ditemukan di file .env");
  console.error("💡 Pastikan file .env ada dan berisi:");
  console.error("   MONGO_GIS=mongodb://localhost:27017/GIS");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI, { dbName: "GIS" })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.json({ message: "Leaflet backend up ✅" });
});

// Route API
app.use("/api/locations", placesRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
