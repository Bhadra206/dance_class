import mongoose from "mongoose";



const BranchSchema = new mongoose.Schema(
  {
    branch:{ type: String, required: true },
    time:{ type: String, required: true },
    day:{ type: String, required: true },
  },
  { collection: "branch" }
);

const Branch = mongoose.model("BranchSchema", BranchSchema);

export default Branch;