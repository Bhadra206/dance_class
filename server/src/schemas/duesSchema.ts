import mongoose from "mongoose";



const DuesSchema = new mongoose.Schema(
  {
    name:{ type: String, required: true },
    batch:{ type: String, required: true },
    time:{ type: String, required: true },
    dues:{ type: Number, required: true },
  },
  { collection: "dues" }
);

const Dues = mongoose.model("DuesSchema", DuesSchema);

export default Dues;