// Database.tsx
import React, { useEffect, useState } from "react";
import "./Database.css";

interface DocumentItem {
  _id: string;
  username: string;
  filename: string;
  form_type: string;
  keywords: string[];
}

const Database: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formType, setFormType] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchDocuments = async () => {
    try {
      const res = await fetch("http://localhost:5000/documents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) setDocuments(data.documents);
    } catch (err) {
      console.error("Failed to fetch documents", err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleAddDocument = async () => {
    if (!selectedFile || !formType) {
      alert("Please select a file and form type");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("form_type", formType);
    formData.append("name", "Sample Company");
    formData.append("sic", "1234");
    formData.append("fye", "12/31");
    formData.append("filing_date", "2024-12-31");
    formData.append("filing_date_period", "2024");
    formData.append("filing_date_change", "2024-01-15");

    try {
      const res = await fetch("http://localhost:5000/documents", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        fetchDocuments();
        setIsModalOpen(false);
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      console.error("Upload error", err);
    }
    setLoading(false);
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/documents/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        fetchDocuments();
      } else {
        alert("Failed to delete document");
      }
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  return (
    <div>
      <header className="header">
        <div className="logo">
          <img src="/logo.png" alt="DocDocket Logo" />
        </div>
      </header>

      <div className="add-button-container">
        <button className="add-button" onClick={() => setIsModalOpen(true)}>
          Add Document
        </button>
      </div>

      <div className="document-tab">
        <ul className="document-list">
          {documents.map((doc) => (
            <li key={doc._id} className="document-item">
              <img
                src={
                  doc.form_type === "contract"
                    ? "/contractIcon.png"
                    : "/financialStatementsIcon.png"
                }
                alt={`${doc.form_type} Icon`}
                className="file-icon"
              />
              {doc.filename} ({doc.form_type}) - Uploaded by: {doc.username}
              <button
                className="delete-button"
                onClick={() => handleDeleteDocument(doc._id)}
              >
                X
              </button>
            </li>
          ))}
        </ul>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add New Document</h2>
            <label>
              Select File:
              <input
                type="file"
                onChange={(e) =>
                  setSelectedFile(e.target.files ? e.target.files[0] : null)
                }
              />
            </label>
            <label>
              Form Type:
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
              >
                <option value="">Select</option>
                <option value="contract">Contract</option>
                <option value="financial statement">Financial Statement</option>
              </select>
            </label>
            <div className="modal-buttons">
              <button onClick={handleAddDocument} disabled={loading}>
                {loading ? "Uploading..." : "Add"}
              </button>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Database;
