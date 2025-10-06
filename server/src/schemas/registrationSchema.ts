import mongoose from "mongoose";

const RegistrationSchema = new mongoose.Schema(
  {
    name: String,
    course: String,
    branch: String,
    batch: String,
    admissionNumber: String,
    phone: String,
    registrationDate: { type: Date, default: Date.now },
  },
  { collection: "registration" }
);

const Registration = mongoose.model("RegistrationSchema", RegistrationSchema);

export default Registration;

