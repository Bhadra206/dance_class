import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useCourseBranch } from "../CourseBranchContext/CourseBranchContext";

const Navbar: React.FC = () => {
  const [masterOpen, setMasterOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const { course, branch } = useCourseBranch();

  const handleReportNav = (path: string) => {
    if (!course || !branch) {
      alert("Please select Course and Branch from the Dashboard first.");
      navigate("/adminDashboard");
    } else {
      navigate(path);
    }
  };

  return (
    <nav className="navbar">
      <div>
        <img src="src/assets/Logo.webp" alt="Dance" className="logo-image" />
      </div>

      <ul className="nav-links">
        <li
          className="nav-item"
          onMouseEnter={() => setMasterOpen(true)}
          onMouseLeave={() => setMasterOpen(false)}
        >
          Master
          {masterOpen && (
            <ul className="dropdown">
              <li>
                <Link to="/batchDetails">Batch Details</Link>
              </li>
              <li>
                <Link to="/courseDetails">Course Details</Link>
              </li>
              <li>
                <Link to="/branchDetails">Branch Details</Link>
              </li>
              <li>
                <Link to="/students">Student Details</Link>
              </li>
              {/* <li>
                <Link to="/staff">Staff Details</Link>
              </li> */}
              <li onClick={() => handleReportNav("/leavestudent")}>
                Inactive Students
              </li>
              <li>
                <Link to="/adminDetails">Admin Details</Link>
              </li>
              <li onClick={() => handleReportNav("/leaveApproval")}>
                Leave Applied
              </li>
              <li>
                <Link to="/changePassword">Change Password</Link>
              </li>
            </ul>
          )}
        </li>

        <li
          className="nav-item"
          onMouseEnter={() => setReportOpen(true)}
          onMouseLeave={() => setReportOpen(false)}
        >
          Reports
          {reportOpen && (
            <ul className="dropdown">
              <li onClick={() => handleReportNav("/pastStudentReport")}>
                Past Student Report
              </li>
              <li>
                <Link to="/courseReport">Course Report</Link>
              </li>
              <li>
                <Link to="/batchReport">Batch Report</Link>
              </li>
              <li>
                <Link to="/branchReport">Branch Report</Link>
              </li>
              <li onClick={() => handleReportNav("/registrationReport")}>
                Registration Report
              </li>
              <li onClick={() => handleReportNav("/leaveReport")}>
                Leave Report
              </li>
              {/* <li onClick={() => handleReportNav("/duesReport")}>
                Dues Report
              </li> */}
              <li onClick={() => handleReportNav("/cashBook")}>Cash Book</li>
            </ul>
          )}
        </li>

        <li className="logout-btn" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} className="logout-icon" /> Logout
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
