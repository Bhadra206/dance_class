import mongoose from "mongoose";



const AdminSchema = new mongoose.Schema(
  {
    username:{ type: String, required: true },
    password:{ type: String, required: true },
    role:{ type: String, required: true },
  },
  { collection: "admin" }
);

const Admin = mongoose.model("AdminSchema", AdminSchema);

export default Admin;