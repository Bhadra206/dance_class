import mongoose from "mongoose";



const LeaveSchema = new mongoose.Schema(
  {
    name:{ type: String, required: true },
    duration:{ type: String, required: true },
    course:{ type: String, required: true },
  },
  { collection: "leave" }
);

const Leave = mongoose.model("LeaveSchema", LeaveSchema);

export default Leave;