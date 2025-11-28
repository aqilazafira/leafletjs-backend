import express from "express";
import Location from "../models/location.js";

const router = express.Router();

// GET semua lokasi
router.get("/", async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST lokasi baru
router.post("/", async (req, res) => {
  const location = new Location({
    nama: req.body.nama,
    deskripsi: req.body.deskripsi,
    kategori: req.body.kategori,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
  });

  try {
    const newLocation = await location.save();
    res.status(201).json(newLocation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE lokasi berdasarkan ID
router.delete("/:id", async (req, res) => {
  try {
    await Location.findByIdAndDelete(req.params.id);
    res.json({ message: "Lokasi berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
