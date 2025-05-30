// Database.tsx
import React, { useEffect, useState } from "react";
import "./Database.css";

interface DocumentItem {
  _id: string;
  username: string;
  filename: string;
  form_type: string;
  keywords: string[];
  confidential?: boolean;
}

const Database: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formType, setFormType] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [conflicts, setConflicts] = useState<DocumentItem[] | null>(null);
  const [forceUpload, setForceUpload] = useState(false);
  const [replaceTargetId, setReplaceTargetId] = useState<string | null>(null);

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

  const uploadDocument = async (
    force: boolean = false,
    replacingId?: string
  ) => {
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
    if (force) formData.append("force", "true");

    try {
      const res = await fetch("http://localhost:5000/documents", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();

      if (res.status === 409) {
        setConflicts(data.conflicts);
        setForceUpload(true);
      } else if (data.success) {
        if (replacingId) {
          await handleDeleteDocument(replacingId);
        }
        fetchDocuments();
        setIsModalOpen(false);
        setConflicts(null);
        setForceUpload(false);
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (err) {
      console.error("Upload error", err);
    }
    setLoading(false);
  };

  const handleAddDocument = () => {
    uploadDocument(forceUpload, replaceTargetId || undefined);
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

  const handleRedactReplace = (id: string) => {
    setReplaceTargetId(id);
    setIsModalOpen(true);
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
          <span className="plus-icon">+</span> Add Document
        </button>
      </div>

      <div className="document-tab">
        <ul className="document-list">
          {documents.map((doc) => (
            <li key={doc._id} className="document-item">
              <div className="document-info">
                <img
                  src={
                    doc.form_type === "contract"
                      ? "/contractIcon.png"
                      : "/financialStatementsIcon.png"
                  }
                  alt={`${doc.form_type} Icon`}
                  className="file-icon"
                />
                <span>
                  {doc.filename} ({doc.form_type}) - Uploaded by: {doc.username}
                </span>
                <span
                  className={`marker ${
                    doc.confidential ? "unsafe-marker" : "safe-marker"
                  }`}
                >
                  {doc.confidential ? "Confidential" : "Safe"}
                </span>
                {doc.confidential && (
                  <button
                    className="replace-button"
                    onClick={() => handleRedactReplace(doc._id)}
                  >
                    Replace with Redacted
                  </button>
                )}
              </div>
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
            <h2>
              {replaceTargetId
                ? "Upload Redacted Document"
                : "Add New Document"}
            </h2>
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
                {loading
                  ? "Uploading..."
                  : forceUpload
                  ? "Force Upload"
                  : "Upload"}
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setReplaceTargetId(null);
                }}
              >
                Cancel
              </button>
            </div>

            {conflicts && conflicts.length > 0 && (
              <div className="conflict-warning">
                <p>
                  <strong>Warning:</strong> Matching documents found. Are you
                  sure you want to continue?
                </p>
                <ul>
                  {conflicts.map((doc) => (
                    <li key={doc._id}>
                      {doc.filename} (by {doc.username})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Database;
