import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import router from "./routes/index";
import bodyParser from "body-parser";

require("dotenv").config();
// mongoose.connect('mongodb://localhost:27017/dance-class');

const app = express();
mongoose.connect(process.env.MONGO_URL!);

const server = app.listen(4000, () => console.log("connected"));

const allowedOrigins = ["http://localhost:5173"];

const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "build")));
app.use("/", router);
app.use(bodyParser.json({ limit: "500mb" })); 
// app.get("/*", (req, res) => {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });
