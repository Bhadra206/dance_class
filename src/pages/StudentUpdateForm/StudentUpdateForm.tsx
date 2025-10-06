import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./StudentUpdateForm.css";
import { Student } from "../UserDashboard/UserDashboard";

// Converts to yyyy-mm-dd (for input[type="date"])
const toDateInputFormat = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toISOString().split("T")[0];
};

const StudentUpdateForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { student } = location.state as { student: Student };

  const [formData, setFormData] = useState<Student>({
    ...student,
    dob: toDateInputFormat(student.dob),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:4000/api/updatestudents/${formData._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Student updated successfully!");
      navigate("/userDashboard");
    } catch (error) {
      console.error("Update failed", error);
      alert("Update failed.");
    }
  };

  const excludedFields = ["_id", "adm_no", "dues", "paymentStatus", "status", "__v"];

  return (
    <div className="update-form-container">
      <h2>Update Your Details</h2>
      <form onSubmit={handleSubmit} className="update-form">
        {Object.entries(formData).map(([key, value]) => {
          if (excludedFields.includes(key)) return null;

          const label = key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase());

          return (
            <div key={key} className="form-group">
              <label>{label}</label>
              <input
                type={key === "dob" ? "date" : "text"}
                name={key}
                value={value as string}
                onChange={handleChange}
              />
            </div>
          );
        })}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default StudentUpdateForm;
