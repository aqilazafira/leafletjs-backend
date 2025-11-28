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
  console.error("❌ Error: MONGO_GIS tidak ditemukan di environment variables");
  process.exit(1);
}

// MongoDB Connection dengan error handling untuk serverless
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("✅ Using existing MongoDB connection");
    return;
  }

  try {
    const db = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = db.connections[0].readyState === 1;
    console.log("✅ MongoDB connected");
    console.log("📂 Database:", mongoose.connection.db.databaseName);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    throw err;
  }
};

// Middleware untuk connect DB sebelum setiap request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({
      message: "Database connection failed",
      error: error.message
    });
  }
});

app.get("/", (req, res) => {
  res.json({
    message: "Leaflet backend up ✅",
    endpoints: [
      "GET /api/locations - Get all locations",
      "POST /api/locations - Create location",
      "DELETE /api/locations/:id - Delete location"
    ],
    timestamp: new Date().toISOString()
  });
});

// Route API
app.use("/api/locations", placesRouter);

// For Vercel serverless
if (process.env.VERCEL) {
  export default app;
} else {
  // For local development
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api/locations`);
  });
}
