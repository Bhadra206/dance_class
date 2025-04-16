import React, { useState } from 'react';
import './ChangePassword.css';

const ChangePassword: React.FC = () => {
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // Make API call to update password
    console.log({ username, newPassword });
  };

  return (
    <div className="change-password-container">
      <h2 className="change-password-title">Change Password</h2>
      <div className="change-password-box">
        <div className="icon-box">
          <i className="fa fa-check"></i>
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

          <button type="submit" className="submit-btn">
            ✓
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
