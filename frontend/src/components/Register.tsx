import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    alert("Registration functionality is not implemented yet.");
  };

  return (
    <div className="login-container">
      <h1>Welcome to DOCDOCKET!</h1>
      <img
        src="/coolImage.png" // Path relative to the `public` folder
        alt="Cool Illustration"
        className="cool-image"
      />
      <div className="login-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        <button onClick={handleRegister} className="login-button">
          Register
        </button>
        <p>
          Already have an account?{" "}
          <a href="#" onClick={() => navigate("/")}>
            Log In
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
