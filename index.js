// index.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import placesRouter from "./routes/place.js";

dotenv.config();

const app = express();

// CORS Configuration - Allow all origins
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_GIS;

// Validasi MONGO_URI
if (!MONGO_URI) {
  console.error("❌ Error: MONGO_GIS tidak ditemukan di file .env");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    console.log("📂 Database:", mongoose.connection.db.databaseName);
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.json({
    message: "Leaflet backend up ✅",
    endpoints: [
      "GET /api/locations - Get all locations",
      "POST /api/locations - Create location",
      "DELETE /api/locations/:id - Delete location"
    ]
  });
});

// Route API
app.use("/api/locations", placesRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api/locations`);
});
