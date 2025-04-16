import mongoose from "mongoose";



const BatchSchema = new mongoose.Schema(
  {
    batch:{ type: String, required: true },
    time:{ type: String, required: true },
    instructor:{ type: String, required: true },
    capacity:{ type: Number, required: true },
  },
  { collection: "batch" }
);

const Batch = mongoose.model("BatchSchema", BatchSchema);

export default Batch;