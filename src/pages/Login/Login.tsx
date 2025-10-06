import React, { useState } from "react";
import "./login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons"; // Import icons
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  let navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMsg("Username and Password are required");
      return;
    }
    try {
      const response = await axios.post("http://localhost:4000/api/login", {
        username,
        password,
      });
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);

        //Redirection based on role
        const role = response.data.user.role;
        if (role === "admin") {
          navigate("/adminDashboard");
        } else {
          navigate("/userDashboard");
        }
      } else {
        setErrorMsg("Invalid credential.Please try again");
      }
    } catch (error) {
      console.log(error);
      setErrorMsg("Something went wrong.Please try again");
    }
  };
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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="input-group">
              <FontAwesomeIcon icon={faLock} className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="password-toggle-icon"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  position: "absolute",
                  right: "30px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {errorMsg && <div className="error-message">{errorMsg}</div>}

            <button className="login-button" onClick={handleLogin}>
              LOGIN
            </button>
          </div>

          <div className="link-container">
            <Link to="/register">
              <div className="link-left">Don’t have an account? Sign Up</div>
            </Link>
            <div className="link-right">
              <Link to="/changePassword">
                <div className="link">Forgot Password?</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
