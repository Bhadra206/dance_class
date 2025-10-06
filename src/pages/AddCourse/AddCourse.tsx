import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddCourse.css";
import Navbar from "../Navbar/Navbar";
import { FaPlus } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

type Course = {
  _id?: string;
  course: string;
  duration: string;
  instructor: string;
  fees: number;
};

const AddCourse: React.FC = () => {
  const [form, setForm] = useState<Course>({
    course: "",
    duration: "",
    instructor: "",
    fees: 500,
  });

  const location = useLocation();
  const editingCourse = location.state?.course;
  const navigate = useNavigate();

  useEffect(() => {
    if (editingCourse) {
      setForm(editingCourse); // Pre-fill form fields with existing batch data
    }
  }, [editingCourse]);

  const handleAdd = async () => {
    try {
      if (form._id) {
        // If _id exists, we are editing an existing course
        await axios.put(`http://localhost:4000/api/courses/${form._id}`, form);
        alert("Course updated successfully!");
      } else {
        // If _id doesn't exist, we are adding a new course
        await axios.post("http://localhost:4000/api/courses", form);
        alert("Course added successfully!");
      }
      setForm({ course: "", duration: "", instructor: "", fees: 500 }); // Reset form
      navigate("/courseDetails"); // Navigate back to course details after success
    } catch (error) {
      console.error("Error adding/updating course:", error);
      alert("Failed to add or update course. Please try again.");
    }
  };

  return (
    <div
      className="admin-dashboard-container"
      style={{
        width: "100%",
        height: "100vh",
        backgroundImage: `url('/Dance9.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
      }}
    >
      <div className="new-course-container">
        <Navbar />
        <h1 className="new-course-title">New Course</h1>

        <input
          type="text"
          className="new-course-input"
          placeholder="Course"
          value={form.course}
          onChange={(e) => setForm({ ...form, course: e.target.value })}
        />
        <input
          type="text"
          className="new-course-input"
          placeholder="Duration"
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: e.target.value })}
        />
        <input
          type="text"
          className="new-course-input"
          placeholder="Instructor"
          value={form.instructor}
          onChange={(e) => setForm({ ...form, instructor: e.target.value })}
        />
        <input
          type="number"
          className="new-course-input"
          placeholder="Fees"
          value={form.fees}
          onChange={(e) => setForm({ ...form, fees: Number(e.target.value) })}
        />

        <div className="icon-buttons">
          <button
            className="icon-btn green"
            onClick={handleAdd}
            title="Add Course"
          >
            <FaPlus />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
