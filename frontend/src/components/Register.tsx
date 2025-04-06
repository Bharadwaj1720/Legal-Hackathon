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
      <p className="intro-text">
        DocDocket is here to serve your documents and dockets. It is a
        revolution in the archiving of legal documents, utilizing blockchain to
        secure documents, while providing AI-driven assistance and granular
        access control to maintain confidentiality.
      </p>
      <div className="image-text-container">
        <img
          src="/coolImage.png" // Path relative to the `public` folder
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
