import React, { useEffect, useState, useRef } from "react";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LeaveStudentSummary.css";
import { useCourseBranch } from "../CourseBranchContext/CourseBranchContext";

type Student = {
  _id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  status: string;
  paymentStatus: string;
};

const StudentSummary: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const { course: selectedCourse, branch: selectedBranch } = useCourseBranch();
  console.log(selectedCourse);
  console.log(selectedBranch);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/leavestudent", {
          params: {
            course: selectedCourse,
            branch: selectedBranch,
          },
        });
        setStudents(res.data);
        setFilteredStudents(res.data);
      } catch (err) {
        console.error("Error fetching students", err);
      }
    };

    if (selectedCourse && selectedBranch) {
      fetchStudents();
    }
  }, [selectedCourse, selectedBranch]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const filtered = students.filter((s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  return (
    <div className="lstudent-summary-container">
      <Navbar />
      <div className="lstudent-header">
        <h1 className="title">Inactive Students</h1>
        <div className="search-container" ref={searchRef}>
          <span
            className="search-icon"
            onClick={() => setShowSearch(!showSearch)}
          >
            🔍
          </span>
          {showSearch && (
            <input
              type="text"
              placeholder="Search students..."
              className="lstudent-search-dropdown"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          )}
        </div>
      </div>

      <div className="lstudent-cards-grid">
        {filteredStudents.map((student) => (
          <div className="lstudent-card" key={student._id}>
            <h2>{student.name}</h2>
            <div className="lstudent-info">
              <p>📞 {student.phone}</p>
              <p>📧 {student.email}</p>
              <p>📍 {student.address}</p>
            </div>
            <div className="lbadge-container">
              <span className={`badge ${student.status.toLowerCase()}`}>
                {student.status}
              </span>
              <span className={`badge ${student.paymentStatus.toLowerCase()}`}>
                {student.paymentStatus}
              </span>
            </div>
            <button
              className="view-btn"
              onClick={() => navigate(`/leavestudentDetails/${student._id}`)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentSummary;
