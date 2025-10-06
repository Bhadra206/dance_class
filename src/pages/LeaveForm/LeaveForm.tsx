import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LeaveForm.css";
import Navbar2 from "../Navbar2/Navbar2";

const LeaveForm: React.FC = () => {
  const [leaveStartDate, setLeaveStartDate] = useState("");
  const [leaveEndDate, setLeaveEndDate] = useState("");
  const [message, setMessage] = useState("");
  const [student, setStudent] = useState<any | null>(null);

  useEffect(() => {
    const studentData = localStorage.getItem("student");
    if (studentData) {
      setStudent(JSON.parse(studentData)); // Retrieve student data from localStorage
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) {
      setMessage("Student ID missing from URL.");
      return;
    }

    try {
      await axios.post(`http://localhost:4000/api/leave/apply`, {
        studentId: student._id,
        leaveStartDate,
        leaveEndDate,
      });
      setMessage("Leave request submitted successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong. Please try again.");
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="leave-form-box">
        <Navbar2 />
        <h2 className="leave-form-title">Apply for Leave</h2>
        <form onSubmit={handleSubmit} className="leave-form">
          <div className="form-group">
            <label htmlFor="start">Start Date</label>
            <input
              type="date"
              id="start"
              value={leaveStartDate}
              onChange={(e) => setLeaveStartDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="end">End Date</label>
            <input
              type="date"
              id="end"
              value={leaveEndDate}
              onChange={(e) => setLeaveEndDate(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            Submit
          </button>
          {message && <p className="leave-message">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default LeaveForm;
