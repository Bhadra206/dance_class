import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  const [courses, setCourses] = useState<string[]>([]);
  const [branches, setBranches] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/courses").then((res) => {
      const courseNames = res.data.map((course: any) => course.course);
      setCourses(courseNames);
    });

    axios.get("http://localhost:5000/branches").then((res) => {
      const branchNames = res.data.map((branch: any) => branch.branch);
      setBranches(branchNames);
    });
  }, []);

  const handleEnter = () => {
    if (selectedCourse && selectedBranch) {
      navigate(
        `/student-details?course=${encodeURIComponent(
          selectedCourse
        )}&branch=${encodeURIComponent(selectedBranch)}`
      );
    } else {
      alert("Please select both course and branch");
    }
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
      <div className="welcome-page">
        <Navbar />
        <h2>Welcome</h2>
        <div className="form-card">
          <label>
            Course:
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="">Select Course</option>
              {courses.map((course, index) => (
                <option key={index} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </label>
          <label>
            Branch:
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              <option value="">Select Branch</option>
              {branches.map((branch, index) => (
                <option key={index} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </label>
          <button onClick={handleEnter}>ENTER</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
