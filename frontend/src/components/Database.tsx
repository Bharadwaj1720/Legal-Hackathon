import React, { useState } from "react";
import "./Database.css"; // Import the new CSS file

const Database = () => {
  const [documents, setDocuments] = useState([
    {
      name: "10K_AnnualReport.docx",
      type: "financial statement",
      icon: "financialStatementsIcon.png",
    },
    { name: "contractXfirm.docx", type: "contract", icon: "contractIcon.png" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDocumentName, setNewDocumentName] = useState("");
  const [newDocumentType, setNewDocumentType] = useState("");
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const handleAddDocument = () => {
    if (!newDocumentName || !newDocumentType) {
      alert("Please fill out all fields.");
      return;
    }

    if (
      newDocumentType !== "contract" &&
      newDocumentType !== "financial statement"
    ) {
      alert(
        "Invalid document type. Please enter 'contract' or 'financial statement'."
      );
      return;
    }

    const icon =
      newDocumentType === "contract"
        ? "contractIcon.png"
        : "financialStatementsIcon.png";

    setDocuments([
      ...documents,
      { name: newDocumentName, type: newDocumentType, icon },
    ]);

    // Reset modal state
    setNewDocumentName("");
    setNewDocumentType("");
    setIsModalOpen(false);
  };

  const handleDeleteDocument = (index: number) => {
    setDeleteIndex(index); // Set the index of the document to delete
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      setDocuments(documents.filter((_, i) => i !== deleteIndex)); // Remove the document
      setDeleteIndex(null); // Reset the delete index
    }
  };

  const cancelDelete = () => {
    setDeleteIndex(null); // Reset the delete index
  };

  return (
    <div>
      <header className="header">
        <div className="logo">
          <img
            src="/logo.png" // Path relative to the public folder
            alt="DocDocket Logo"
          />
        </div>
      </header>

      {/* Add Document Button */}
      <div className="add-button-container">
        <button className="add-button" onClick={() => setIsModalOpen(true)}>
          Add Document
        </button>
      </div>

      <div className="document-tab">
        <ul className="document-list">
          {documents.map((doc, index) => (
            <li key={index} className="document-item">
              <img
                src={`${process.env.PUBLIC_URL}/${doc.icon}`}
                alt={`${doc.type} Icon`}
                className="file-icon"
              />
              {doc.name} ({doc.type})
              <button
                className="delete-button"
                onClick={() => handleDeleteDocument(index)}
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
              Document Name:
              <input
                type="text"
                value={newDocumentName}
                onChange={(e) => setNewDocumentName(e.target.value)}
              />
            </label>
            <label>
              Document Type:
              <select
                value={newDocumentType}
                onChange={(e) => setNewDocumentType(e.target.value)}
              >
                <option value="">Select Type</option>
                <option value="contract">Contract</option>
                <option value="financial statement">Financial Statement</option>
              </select>
            </label>
            <div className="modal-buttons">
              <button onClick={handleAddDocument}>Add</button>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteIndex !== null && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Are you sure you want to delete this document?</h2>
            <div className="modal-buttons">
              <button onClick={confirmDelete}>Yes</button>
              <button onClick={cancelDelete}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Database;
