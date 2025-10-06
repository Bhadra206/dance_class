import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import "./Navbar2.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const [masterOpen, setMasterOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    navigate("/");
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
                <Link to="/leaveForm">Apply Leave</Link>
              </li>
              <li>
                <Link to="/changePassword">Change Password</Link>
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
