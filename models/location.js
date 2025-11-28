import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  deskripsi: { type: String, required: true },
  kategori: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
}, {
  timestamps: true
});

export default mongoose.model("Location", locationSchema);
