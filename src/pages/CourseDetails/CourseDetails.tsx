import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CourseDetails.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { FaEdit, FaTrash } from "react-icons/fa";

interface Course {
  _id: string;
  course: string;
  duration: string;
  instructor: string;
  fees: number;
}

const CourseDetails: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/courses");
         console.log("Fetched batches:", res.data);
        setCourses(res.data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const handleDelete = async (id: string) => {
    if (id && window.confirm("Are you sure you want to delete this course?")) {
      try {
        await axios.delete(`http://localhost:4000/api/courses/${id}`);
        setCourses(courses.filter((course) => course._id !== id));
      } catch (error) {
        console.error("Failed to delete course:", error);
      }
    }
  };

  const handleEdit = (course: Course) => {
    navigate("/AddCourse", { state: { course } }); // Optional: use state to send data to edit
  };
  

  return (
    <div
      className="admin-dashboard-container"
      style={{
        width: "100%",
        height: "100vh",
        backgroundImage: `url('/Dance9.jpg')`, // 👈 use backticks and `url(...)`
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="course-details-container">
        <Navbar />
        <div className="course-header">
          <h1 className="course-title">Course Details</h1>
          <button
            className="add-course-button"
            onClick={() => navigate("/AddCourse")}
          >
            Add Course
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="course-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Duration</th>
                <th>Name of the Instructor</th>
                <th>Fees</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr key={index}>
                  <td>{course.course}</td>
                  <td>{course.duration}</td>
                  <td>{course.instructor}</td>
                  <td>{course.fees}</td>
                  <td>
                    <button
                      className="icon-btn blue"
                      onClick={() => handleEdit(course)}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="icon-btn red"
                      onClick={() => handleDelete(course._id)}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
