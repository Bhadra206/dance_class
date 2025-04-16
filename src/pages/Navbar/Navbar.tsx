import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const [masterOpen, setMasterOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const handleLogout = () => {
    // your logout logic here
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
                <Link to="#">School Details</Link>
              </li>
              <li>
                <Link to="#">Batch Details</Link>
              </li>
              <li>
                <Link to="#">Course Details</Link>
              </li>
              <li>
                <Link to="#">Branch Details</Link>
              </li>
              <li>
                <Link to="#">Student Details</Link>
              </li>
              <li>
                <Link to="#">Staff Details</Link>
              </li>
              <li>
                <Link to="#">Leave Applied</Link>
              </li>
              <li>
                <Link to="#">Change Password</Link>
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
              <li>
                <Link to="/course-report">Course Report</Link>
              </li>
              <li>
                <Link to="/batch-report">Batch Report</Link>
              </li>
              <li>
                <Link to="/registration-report">Registration Report</Link>
              </li>
              <li>
                <Link to="/receipt-report">Receipt Report</Link>
              </li>
              <li>
                <Link to="/suspend-report">Suspend Report</Link>
              </li>
              <li>
                <Link to="/dues-report">Dues Report</Link>
              </li>
              <li>
                <Link to="/cash-book">Cash Book</Link>
              </li>
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
