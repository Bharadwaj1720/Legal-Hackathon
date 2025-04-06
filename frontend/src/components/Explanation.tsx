import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Explanation.css";

const Explanation = () => {
  const navigate = useNavigate();
  const [visibleStep, setVisibleStep] = useState(0); // Track which section is visible

  const sections = [
    {
      heading: "1. Register and Log In",
      content: (
        <p>
          To get started with DocDocket, create an account by providing your
          username and password. Once registered, log in to access your
          personalized dashboard. From here, you can manage your documents,
          track changes, and explore all the features DocDocket has to offer.
        </p>
      ),
      image: "/exp1.png",
      alt: "Register and Log In",
    },
    {
      heading: "2. Upload Documents",
      content: (
        <p>
          Upload your legal documents securely to the platform. DocDocket
          ensures your files are encrypted and stored using blockchain
          technology, providing unparalleled security. You can upload multiple
          files at once and organize them into folders for easy access.
        </p>
      ),
      image: "/exp2.png",
      alt: "Upload Documents",
    },
    {
      heading: "3. Smart Search",
      content: (
        <p>
          Use our AI-powered search feature to quickly locate documents by
          keywords, metadata, or client information. The smart search
          functionality saves you time by providing accurate and relevant
          results, even for large document archives.
        </p>
      ),
      image: "/exp3.png",
      alt: "Smart Search",
    },
    {
      heading: "4. Conflict Detection",
      content: (
        <p>
          DocDocket automatically highlights potential conflicts of interest and
          compliance risks. This feature helps you stay ahead of regulatory
          requirements and ensures that your legal practice operates smoothly
          and ethically.
        </p>
      ),
      image: "/exp4.png",
      alt: "Conflict Detection",
    },
    {
      heading: "5. Manage Your Archive",
      content: (
        <p>
          Keep your documents organized with tags, categories, and metadata.
          DocDocket makes it easy to retrieve files when you need them, ensuring
          that your archive remains structured and accessible at all times.
        </p>
      ),
      image: "/exp5.png",
      alt: "Manage Archive",
    },
  ];

  useEffect(() => {
    if (visibleStep <= sections.length) {
      const timer = setTimeout(() => {
        setVisibleStep((prev) => prev + 1);
      }, 1000); // Delay between each section
      return () => clearTimeout(timer);
    }
  }, [visibleStep, sections.length]);

  return (
    <div className="explanation-container">
      <div className="back-arrow" onClick={() => navigate("/")}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="arrow-icon"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        <span>Back to Login</span>
      </div>

      <h1 className="animated-text">
        {"How to Use DocDocket".split("").map((char, index) => (
          <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h1>

      {sections.map((section, index) => (
        <div
          key={index}
          className={`explanation-section ${
            visibleStep > index + 1 ? "visible" : "hidden"
          }`}
        >
          <img
            src={section.image}
            alt={section.alt}
            className="explanation-gif"
          />
          <div className="explanation-content">
            <h2>{section.heading}</h2>
            {section.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Explanation;
