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
    fatherName:{ type: String, required: false },
    fatherOccupation:{ type: String, required: false },
    fatherPhone:{ type: String, required: false },
    motherName: { type: String, required: false },
    motherOccupation: { type: String, required: false },
    motherPhone: { type: String, required: false },
    siblings: { type: Number, required: false },
    school: { type: String, required: true },
    branch: { type: String, required: true },
    course: { type: String, required: true },
  },
  { collection: "staff" }
);

const Staff = mongoose.model("StudentSchema", StaffSchema);

export default Staff;