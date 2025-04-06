import React from "react";
import "./App.css";

const App = () => {
  return (
    <div>
      <header className="header">
        <div className="logo">
          <img
            src="/logo.png" // Path relative to the `public` folder
            alt="DocDocket Logo"
          />
        </div>
      </header>
      <div className="document-tab">
        <ul className="document-list">
          {/* Financial Statements */}
          <li className="document-item">
            <img
              src="/financialStatementsIcon.png"
              alt="Financial Statements Icon"
              className="file-icon"
            />
            10K_AnnualReport.docx
          </li>
          <li className="document-item">
            <img
              src="/financialStatementsIcon.png"
              alt="Financial Statements Icon"
              className="file-icon"
            />
            Q1_QuarterlyReport.docx
          </li>
          <li className="document-item">
            <img
              src="/financialStatementsIcon.png"
              alt="Financial Statements Icon"
              className="file-icon"
            />
            Q2_QuarterlyReport.docx
          </li>

          {/* Contracts */}
          <li className="document-item">
            <img
              src="/contractIcon.png"
              alt="Contract Icon"
              className="file-icon"
            />
            contractXfirm.docx
          </li>
          <li className="document-item">
            <img
              src="/contractIcon.png"
              alt="Contract Icon"
              className="file-icon"
            />
            briefAfirm.docx
          </li>
          <li className="document-item">
            <img
              src="/contractIcon.png"
              alt="Contract Icon"
              className="file-icon"
            />
            affidavitMsubject.docx
          </li>
          <li className="document-item">
            <img
              src="/contractIcon.png"
              alt="Contract Icon"
              className="file-icon"
            />
            agreementYclient.docx
          </li>
          <li className="document-item">
            <img
              src="/contractIcon.png"
              alt="Contract Icon"
              className="file-icon"
            />
            settlementZcase.docx
          </li>
          <li className="document-item">
            <img
              src="/contractIcon.png"
              alt="Contract Icon"
              className="file-icon"
            />
            templateNmotion.docx
          </li>
          <li className="document-item">
            <img
              src="/contractIcon.png"
              alt="Contract Icon"
              className="file-icon"
            />
            depositionWwitness.docx
          </li>
          <li className="document-item">
            <img
              src="/contractIcon.png"
              alt="Contract Icon"
              className="file-icon"
            />
            complaintVissue.docx
          </li>
        </ul>
      </div>
    </div>
  );
};

export default App;
