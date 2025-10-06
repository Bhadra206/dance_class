import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddAdmin.css";
import Navbar from "../Navbar/Navbar";
import { FaPlus } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

type Admin = {
  _id?: string;
  username: string;
  password: string;
  role: string;
};

const AddAdmin: React.FC = () => {
  const [form, setForm] = useState<Admin>({
    username: "",
    password: "",
    role: "",
  });

  const location = useLocation();
  const editingAdmin = location.state?.admin;
  const navigate = useNavigate();

  useEffect(() => {
    if (editingAdmin) {
      setForm({ ...editingAdmin, password: "" });
    }
  }, [editingAdmin]);

  const handleAdd = async () => {
    try {
      if (form._id) {
        let updatedData: any = { username: form.username, role: form.role };
        if (form.password) {
          updatedData.password = form.password;
        }
        await axios.put(
          `http://localhost:4000/api/admin/${form._id}`,
          updatedData
        );
        alert("Admin updated successfully!");
      } else {
        await axios.post("http://localhost:4000/api/admin", form);
        alert("Admin added successfully!");
      }
      setForm({ username: "", password: "", role: "" });
      navigate("/AdminDetails");
    } catch (error) {
      console.error("Error adding/updating Admin:", error);
      alert("Failed to add or update admin. Please try again.");
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
      <div className="new-admin-container">
        <Navbar />
        <h1 className="new-admin-title">
          {editingAdmin ? "Edit Admin" : "New Admin"}
        </h1>

        <input
          type="text"
          className="new-admin-input"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <input
          type="password"
          className="new-admin-input"
          placeholder={
            editingAdmin ? "Enter new password (optional)" : "Password"
          }
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <input
          type="text"
          className="new-admin-input"
          placeholder="Role"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        />

        <div className="icon-buttons">
          <button
            className="icon-btn green"
            onClick={handleAdd}
            title={editingAdmin ? "Update Admin" : "Add Admin"}
          >
            <FaPlus />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAdmin;
