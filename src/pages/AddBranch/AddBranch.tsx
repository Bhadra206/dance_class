import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddBranch.css";
import Navbar from "../Navbar/Navbar";
import { FaPlus } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

type Branch = {
  _id?: string;
  branch: string;
  time: string;
  day: string;
};

const AddBranch: React.FC = () => {
  const [form, setForm] = useState<Branch>({
    branch: "",
    time: "",
    day: "",
  });

  const location = useLocation();
  const editingBranch = location.state?.branch;
  const navigate = useNavigate();

  useEffect(() => {
    if (editingBranch) {
      setForm(editingBranch); // Pre-fill form fields with existing batch data
    }
  }, [editingBranch]);

  const handleAdd = async () => {
    try {
      if (form._id) {
        // If _id exists, we are editing an existing branch
        await axios.put(`http://localhost:4000/api/branchEs/${form._id}`, form);
        alert("Branch updated successfully!");
      } else {
        // If _id doesn't exist, we are adding a new branch
        await axios.post("http://localhost:4000/api/branchEs", form);
        alert("Branch added successfully!");
      }
      setForm({ branch: "", time: "", day: "" }); // Reset form
      navigate("/branchDetails"); // Navigate back to branch details after success
    } catch (error) {
      console.error("Error adding/updating branch:", error);
      alert("Failed to add or update branch. Please try again.");
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
      <div className="new-branch-container">
        <Navbar />
        <h1 className="new-branch-title">New Branch</h1>

        <input
          type="text"
          className="new-branch-input"
          placeholder="Branch"
          value={form.branch}
          onChange={(e) => setForm({ ...form, branch: e.target.value })}
        />
        <input
          type="text"
          className="new-branch-input"
          placeholder="Time"
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
        />
        <input
          type="text"
          className="new-branch-input"
          placeholder="Day"
          value={form.day}
          onChange={(e) => setForm({ ...form, day: e.target.value })}
        />

        <div className="icon-buttons">
          <button
            className="icon-btn green"
            onClick={handleAdd}
            title="Add Branch"
          >
            <FaPlus />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBranch;
