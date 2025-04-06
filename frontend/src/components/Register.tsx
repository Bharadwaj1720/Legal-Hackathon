import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !password) {
      alert("Username and password are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Registered successfully!");
        navigate("/"); // redirect to login
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error("Registration failed:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="login-container">
      <h1 className="animated-text">
        {"Create Account".split("").map((char, index) => (
          <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h1>
      <img
        src="/coolImage.png"
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
