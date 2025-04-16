import mongoose from "mongoose";



const CourseSchema = new mongoose.Schema(
  {
    course:{ type: String, required: true },
    duration:{ type: String, required: true },
    instructor:{ type: String, required: true },
    fees:{ type: Number, required: true },
    },
  { collection: "course" }
);

const Course = mongoose.model("CourseSchema", CourseSchema);

export default Course;