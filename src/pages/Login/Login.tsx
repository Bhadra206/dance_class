import React from "react";
import "./login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons"; // Import icons
import { Link } from "react-router-dom";

const LoginPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-200 to-blue-400 relative overflow-hidden">
      <div className="bg-image"></div>

      <div className="card-wrapper">
        <div className="card-container">
          <img src="src\assets\Dance1.jpg" alt="Dance" className="card-image" />

          <h2 className="login-title">Login</h2>
          {/* Add form inputs and buttons here */}

          <div className="input-container">
            <div className="input-group">
              <FontAwesomeIcon icon={faUser} className="input-icon" />
              <input
                type="text"
                placeholder="Username"
                className="input-field"
              />
            </div>

            <div className="input-group">
              <FontAwesomeIcon icon={faLock} className="input-icon" />
              <input
                type="password"
                placeholder="Password"
                className="input-field"
              />
            </div>

            <button className="login-button">LOGIN</button>
          </div>

          <div className="link-container">
            <Link to="/register">
              <div className="link-left">Don’t have an account? Sign Up</div>
            </Link>
            <div className="link-right">
              <a href="#" className="link">
                Forgot Password?
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
