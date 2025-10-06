import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BranchDetails.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { FaEdit, FaTrash } from "react-icons/fa";

interface Branch {
  _id: string;
  branch: string;
  time: string;
  day: string;
}

const BranchDetails: React.FC = () => {
  const navigate = useNavigate();
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/branches");
         console.log("Fetched branches:", res.data);
        setBranches(res.data);
      } catch (error) {
        console.error("Failed to fetch branches:", error);
      }
    };

    fetchBranches();
  }, []);

  const handleDelete = async (id: string) => {
    if (id && window.confirm("Are you sure you want to delete this branch?")) {
      try {
        await axios.delete(`http://localhost:4000/api/branches/${id}`);
        setBranches(branches.filter((branch) => branch._id !== id));
      } catch (error) {
        console.error("Failed to delete branch:", error);
      }
    }
  };

  const handleEdit = (branch: Branch) => {
    navigate("/addBranch", { state: { branch } }); // Optional: use state to send data to edit
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
      <div className="branch-details-container">
        <Navbar />
        <div className="branch-header">
          <h1 className="branch-title">Branch Details</h1>
          <button
            className="add-branch-button"
            onClick={() => navigate("/addBranch")}
          >
            Add Branch
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="branch-table">
            <thead>
              <tr>
                <th>Branch</th>
                <th>Time</th>
                <th>Day</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((branch, index) => (
                <tr key={index}>
                  <td>{branch.branch}</td>
                  <td>{branch.time}</td>
                  <td>{branch.day}</td>
                  <td>
                    <button
                      className="icon-btn blue"
                      onClick={() => handleEdit(branch)}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="icon-btn red"
                      onClick={() => handleDelete(branch._id)}
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

export default BranchDetails;
