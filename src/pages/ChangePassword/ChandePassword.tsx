import React, { useState } from "react";
import axios from "axios"; // Import axios
import "./ChangePassword.css";

const ChangePassword: React.FC = () => {
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // Use axios to make the API request
      const response = await axios.put(
        "http://localhost:4000/api/changePassword",
        {
          username,
          newPassword,
        }
      );

      // Check the response and handle success
      if (response.status === 200) {
        alert(response.data.message);
        setNewPassword("");
        setConfirmPassword("");
      } else {
        alert(response.data.message || "Error updating password");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
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
      <div className="change-password-container">
        <h2 className="change-password-title">Change Password</h2>
        <div className="change-password-box">
          <div className="icon-box">
            <i className="fa fa-lock"></i>
          </div>
          <form onSubmit={handleSubmit} className="change-password-form">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <label>Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button type="submit" className="sub-btn">
              ✓
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
