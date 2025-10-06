import React, { useEffect, useState, useRef } from "react";
import Navbar from "../Navbar/Navbar";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./StudentSummary.css";
// import { Search } from "lucide-react";

type Student = {
  _id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  status: String;
  paymentStatus: String;
};

const useQuery = () => new URLSearchParams(useLocation().search);

const StudentSummary: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const query = useQuery();
  const course = query.get("course");
  const branch = query.get("branch");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/student", {
          params: { course, branch },
        });
        setStudents(res.data);
        setFilteredStudents(res.data);
      } catch (err) {
        console.error("Error fetching students", err);
      }
    };

    if (course && branch) {
      fetchStudents();
    }
  }, [course, branch]);

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
    <div className="student-summary-container">
      <Navbar />
      <div className="student-header">
        <button
          onClick={() =>
            navigate(`/AddStudent?course=${course}&branch=${branch}`)
          }
        >
          Add Students
        </button>
        <h1 className="title">Students</h1>
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
              className="student-search-dropdown"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          )}
        </div>
      </div>

      <div className="student-cards-grid">
        {filteredStudents.map((student) => (
          <div className="student-card" key={student._id}>
            <h2>{student.name}</h2>
            <div className="student-info">
              <p>📞 {student.phone}</p>
              <p>📧 {student.email}</p>
              <p>📍 {student.address}</p>
            </div>
            <div className="badge-container">
              <span className={`badge ${student.status.toLowerCase()}`}>
                {student.status}
              </span>
              <span className={`badge ${student.paymentStatus.toLowerCase()}`}>
                {student.paymentStatus}
              </span>
            </div>
            <button
              className="view-btn"
              onClick={() => navigate(`/studentDetails/${student._id}`)}
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
