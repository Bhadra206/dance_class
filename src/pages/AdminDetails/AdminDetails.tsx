import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDetails.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { FaEdit, FaTrash } from "react-icons/fa";

interface Admin {
  _id: string;
 username: string;
  password: string;
  role:string;
}

const AdminDetails: React.FC = () => {
  const navigate = useNavigate();
  const [admins, setAdmin] = useState<Admin[]>([]);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/admin");
         console.log("Fetched admins:", res.data);
        setAdmin(res.data);
      } catch (error) {
        console.error("Failed to fetch admins:", error);
      }
    };

    fetchAdmins();
  }, []);

  const handleDelete = async (id: string) => {
    if (id && window.confirm("Are you sure you want to delete this Admin?")) {
      try {
        await axios.delete(`http://localhost:4000/api/admin/${id}`);
        setAdmin(admins.filter((admin) => admin._id !== id));
      } catch (error) {
        console.error("Failed to delete Admin:", error);
      }
    }
  };

  const handleEdit = (admin: Admin) => {
    navigate("/AddAdmin", { state: { admin } }); // Optional: use state to send data to edit
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
      <div className="admin-details-container">
        <Navbar />
        <div className="admin-header">
          <h1 className="admin-title">Admin Details</h1>
          <button
            className="add-admin-button"
            onClick={() => navigate("/AddAdmin")}
          >
            Add Admin
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Password</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin, index) => (
                <tr key={index}>
                  <td>{admin.username}</td>
                  <td>{admin.password}</td>
                  <td>{admin.role}</td>
                  <td>
                    <button
                      className="icon-btn blue"
                      onClick={() => handleEdit(admin)}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="icon-btn red"
                      onClick={() => handleDelete(admin._id)}
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

export default AdminDetails;
