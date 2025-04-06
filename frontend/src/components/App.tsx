import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import Database from "./Database";
import Register from "./Register";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async () => {
    if (!username || !password) {
      alert("Please enter both username and password");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });
  
      const data = await response.json();
  
      if (data.success) {
        localStorage.setItem("token", data.token); // Save token
        alert("Logged in successfully!");
        navigate("/database");
      } else {
        alert("Invalid username or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong. Please try again.");
    }
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
        <button onClick={handleSignIn} className="login-button">
          Sign In
        </button>
        <p>
          Don't have an account?{" "}
          <a href="#" onClick={() => navigate("/register")}>
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/database" element={<Database />} />
      </Routes>
    </Router>
  );
};

export default App;
