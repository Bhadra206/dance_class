// src/pages/NewBatch.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddBatch.css";
import Navbar from "../Navbar/Navbar";
import { FaPlus } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

type Batch = {
  _id?: string;
  batch: string;
  time: string;
  instructor: string;
  capacity: number;
};

const AddBatch: React.FC = () => {
  const [form, setForm] = useState<Batch>({
    batch: "",
    time: "",
    instructor: "",
    capacity: 0,
  });

  const location = useLocation();
  const editingBatch = location.state?.batch;
  const navigate = useNavigate();

  useEffect(() => {
    // Check if batch data is passed for editing
    if (editingBatch) {
      setForm(editingBatch); // Pre-fill form fields with existing batch data
    }
  }, [editingBatch]);

  const handleAdd = async () => {
    try {
      if (form._id) {
        // If _id exists, we are editing an existing batch
        await axios.put(`http://localhost:4000/api/batches/${form._id}`, form);
        alert("Batch updated successfully!");
      } else {
        // If _id doesn't exist, we are adding a new batch
        await axios.post("http://localhost:4000/api/batches", form);
        alert("Batch added successfully!");
      }
      setForm({ batch: "", time: "", instructor: "", capacity: 0 }); // Reset form
      navigate("/BatchDetails"); // Navigate back to batch details after success
    } catch (error) {
      console.error("Error adding/updating batch:", error);
      alert("Failed to add or update batch. Please try again.");
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
      <div className="new-batch-container">
        <Navbar />
        <h1 className="new-batch-title">New Batch</h1>

        <input
          type="text"
          className="new-batch-input"
          placeholder="Batch"
          value={form.batch}
          onChange={(e) => setForm({ ...form, batch: e.target.value })}
        />
        <input
          type="text"
          className="new-batch-input"
          placeholder="Time"
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
        />
        <input
          type="text"
          className="new-batch-input"
          placeholder="Instructor"
          value={form.instructor}
          onChange={(e) => setForm({ ...form, instructor: e.target.value })}
        />
        <input
          type="number"
          className="new-batch-input"
          placeholder="Capacity of Students"
          value={form.capacity}
          onChange={(e) =>
            setForm({ ...form, capacity: Number(e.target.value) })
          }
        />

        <div className="icon-buttons">
          <button className="icon-btn green" onClick={handleAdd} title="Add Batch">
            <FaPlus />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBatch;
