import mongoose from "mongoose";



const LoginSchema = new mongoose.Schema(
  {
    username:{ type: String, required: true },
    password:{ type: String, required: true },
    role:{ type: String, required: true },
  },
  { collection: "login" }
);

const Login = mongoose.model("LoginSchema", LoginSchema);

export default Login;