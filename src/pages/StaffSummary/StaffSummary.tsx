import React, { useEffect, useState, useRef } from "react";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./StaffSummary.css";
import { useCourseBranch } from "../CourseBranchContext/CourseBranchContext";

type Staff = {
  _id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  status: string;
  paymentStatus: string;
};

const StaffSummary: React.FC = () => {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [filteredStaffs, setFilteredStaffs] = useState<Staff[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const { course: selectedCourse, branch: selectedBranch } = useCourseBranch();
  console.log(selectedCourse);
  console.log(selectedBranch);

  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/staff", {
          params: {
            course: selectedCourse,
            branch: selectedBranch,
          },
        });
        setStaffs(res.data);
        setFilteredStaffs(res.data);
      } catch (err) {
        console.error("Error fetching staffs", err);
      }
    };

    if (selectedCourse && selectedBranch) {
      fetchStaffs();
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
    const filtered = staffs.filter((s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStaffs(filtered);
  }, [searchTerm, staffs]);

  return (
    <div className="staff-summary-container">
      <Navbar />
      <div className="staff-header">
        <h1 className="title">Staff Summary</h1>
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
              placeholder="Search staffs..."
              className="staff-search-dropdown"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          )}
        </div>
      </div>

      <div className="staff-cards-grid">
        {filteredStaffs.map((staff) => (
          <div className="staff-card" key={staff._id}>
            <h2>{staff.name}</h2>
            <div className="staff-info">
              <p>📞 {staff.phone}</p>
              <p>📧 {staff.email}</p>
              <p>📍 {staff.address}</p>
            </div>
            <button
              className="view-btn"
              onClick={() => navigate(`/staffDetails/${staff._id}`)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffSummary;
