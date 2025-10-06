import React, { useEffect, useState } from "react";
import axios from "axios";
import "./LeaveApproval.css";
import Navbar from "../Navbar/Navbar";

interface Leave {
  _id: string;
  leaveStartDate: string;
  leaveEndDate: string;
  status: string;
  studentId: {
    name: string;
    email: string;
    batch: string;
    time: string;
    course: string;
    branch: string;
  };
}

const LeaveApproval: React.FC = () => {
  const [leaves, setLeaves] = useState<Leave[]>([]);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/leave/pendingleave"
        );
        if (Array.isArray(res.data)) {
          setLeaves(res.data);
        } else {
          console.error("Expected array, got:", res.data);
          setLeaves([]);
        }
      } catch (err) {
        console.error("Failed to fetch leaves:", err);
        setLeaves([]);
      }
    };

    fetchLeaves();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await axios.put(`http://localhost:4000/api/leave/approve/${id}`);
      setLeaves((ls) => ls.filter((l) => l._id !== id));
    } catch (err) {
      console.error("Error approving leave:", err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await axios.delete(`http://localhost:4000/api/leave/reject/${id}`);
      setLeaves((ls) => ls.filter((l) => l._id !== id));
    } catch (err) {
      console.error("Error rejecting leave:", err);
    }
  };

  return (
    <div className="leave-approval-container">
      <Navbar />
      <h2>Leave Applied</h2>
      <table className="leave-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Batch</th>
            <th>Time</th>
            <th>Course</th>
            <th>Branch</th>
            <th>Duration</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave._id}>
              <td>{leave.studentId.name}</td>
              <td>{leave.studentId.batch}</td>
              <td>{leave.studentId.time}</td>
              <td>{leave.studentId.course}</td>
              <td>{leave.studentId.branch}</td>
              <td>
                {new Date(leave.leaveStartDate).toLocaleDateString("en-IN")} —{" "}
                {new Date(leave.leaveEndDate).toLocaleDateString("en-IN")}
              </td>
              <td className="status-buttons">
                <button
                  className="approve-btn"
                  onClick={() => handleApprove(leave._id)}
                >
                  ✅
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleReject(leave._id)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveApproval;
