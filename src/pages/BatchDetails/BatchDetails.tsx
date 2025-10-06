import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BatchDetails.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { FaEdit, FaTrash } from "react-icons/fa";

interface Batch {
  _id: string;
  batch: string;
  time: string;
  instructor: string;
  capacity: number;
}

const BatchDetails: React.FC = () => {
  const navigate = useNavigate();
  const [batches, setBatches] = useState<Batch[]>([]);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/batches");
         console.log("Fetched batches:", res.data);
        setBatches(res.data);
      } catch (error) {
        console.error("Failed to fetch batches:", error);
      }
    };

    fetchBatches();
  }, []);

  const handleDelete = async (id: string) => {
    if (id && window.confirm("Are you sure you want to delete this batch?")) {
      try {
        await axios.delete(`http://localhost:4000/api/batches/${id}`);
        setBatches(batches.filter((batch) => batch._id !== id));
      } catch (error) {
        console.error("Failed to delete batch:", error);
      }
    }
  };

  const handleEdit = (batch: Batch) => {
    navigate("/AddBatch", { state: { batch } }); // Optional: use state to send data to edit
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
      <div className="batch-details-container">
        <Navbar />
        <div className="batch-header">
          <h1 className="batch-title">Batch Details</h1>
          <button
            className="add-batch-button"
            onClick={() => navigate("/AddBatch")}
          >
            Add Batch
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="batch-table">
            <thead>
              <tr>
                <th>Batch</th>
                <th>Time</th>
                <th>Name of the Instructor</th>
                <th>Student Capacity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((batch, index) => (
                <tr key={index}>
                  <td>{batch.batch}</td>
                  <td>{batch.time}</td>
                  <td>{batch.instructor}</td>
                  <td>{batch.capacity}</td>
                  <td>
                    <button
                      className="icon-btn blue"
                      onClick={() => handleEdit(batch)}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="icon-btn red"
                      onClick={() => handleDelete(batch._id)}
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

export default BatchDetails;
