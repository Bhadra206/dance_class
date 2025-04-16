// server/src/schemas/CounterSchema.ts
import mongoose from "mongoose";

const admNumberSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const AdmNumer = mongoose.model("AdmNumber", admNumberSchema);

export default AdmNumer;
