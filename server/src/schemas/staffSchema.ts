import mongoose from "mongoose";



const StaffSchema = new mongoose.Schema(
  {
    adm_no:{ type: String, required: true },
    name:{ type: String, required: true },
    address:{ type: String, required: true },
    phone:{ type: String, required: true },
    email:{ type: String, required: true },
    dob:{ type: Date, required: true },
    gender:{ type: String, required: true },
    religion:{ type: String, required: true },
    caste:{ type: String, required: true },
    nationality:{ type: String, required: true },
    fatherName:{ type: String, required: true },
    fatherOccupation:{ type: String, required: true },
    fatherPhone:{ type: String, required: true },
    motherName: { type: String, required: true },
    motherOccupation: { type: String, required: true },
    motherPhone: { type: String, required: true },
    siblings: { type: Number, required: true },
    school: { type: String, required: true },
    branch: { type: String, required: true },
    course: { type: String, required: true },
  },
  { collection: "staff" }
);

const Staff = mongoose.model("StudentSchema", StaffSchema);

export default Staff;