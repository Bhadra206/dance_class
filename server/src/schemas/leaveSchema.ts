import mongoose from "mongoose";



const LeaveSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "StudentSchema", required: true },
    leaveStartDate: { type: Date, required: true },
    leaveEndDate: { type: Date, required: true },
    course:{type: String, required: true},
    branch:{type: String, required: true},
    batch:{type: String, required: true},
    time:{type: String, required: true},
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    appliedAt: { type: Date, default: Date.now },
  },
  { collection: "leave" }
);

const Leave = mongoose.model("LeaveSchema", LeaveSchema);

export default Leave;