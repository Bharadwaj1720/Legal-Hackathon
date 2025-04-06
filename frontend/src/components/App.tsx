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
import Explanation from "./Explanation";

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
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
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
      <h1 className="animated-text">
        {"Welcome to DocDocket!".split("").map((char, index) => (
          <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h1>
      <p className="intro-text">
        DocDocket is here to serve your documents and dockets. It is a
        revolution in the archiving of legal documents, utilizing blockchain to
        secure documents, while providing AI-driven assistance and granular
        access control to maintain confidentiality.
      </p>
      <button
        className="how-to-button"
        onClick={() => navigate("/explanation")}
      >
        <img
          src="/gear.gif" // Path to your gear.gif file
          alt="Rotating Gear"
          className="gear-gif"
        />
        How to use DocDocket?
      </button>
      <div className="image-text-container">
        <img
          src="/coolImage.png"
          alt="Cool Illustration"
          className="cool-image"
        />
        <div className="description-text">
          <p>
            <strong>Functionalities:</strong>
            <ul>
              <li>Easy-to-use UI with no need for extra training.</li>
              <li>Offers smart suggestions on client conflict history.</li>
              <li>
                Automate identification of potential COIs (conflicts of
                interest).
              </li>
              <li>Smart keyword and metadata search for fast retrieval.</li>
            </ul>
          </p>
        </div>
      </div>
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
        <Route path="/explanation" element={<Explanation />} />
      </Routes>
    </Router>
  );
};

export default App;
