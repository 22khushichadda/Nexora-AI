import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import PageTransition from "../components/PageTransition";
import {
  FileText,
  CheckCircle,
  Clock,
  Trash2,
  Users,
  User
} from "lucide-react";
import { getDocuments, deleteDocument } from "../services/api";
import "../styles/documents.css";

function Documents() {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const data = await getDocuments();
      setDocuments(data);
    } catch (err) {
      console.log("Error fetching documents:", err);
    }
  };

  const handleDeleteDocument = async (docId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this document?"
    );
    if (!confirmDelete) return;

    try {
      await deleteDocument(docId);
      await fetchDocuments();
    } catch (err) {
      console.log("Delete document error:", err);
      alert(
        err.response?.data?.detail || "Unable to delete document."
      );
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusIcon = (status) => {
    if (status === "ready") {
      return <CheckCircle size={14} />;
    }
    return <Clock size={14} />;
  };

  return (
    <DashboardLayout>
      <PageTransition>
        <div className="documents-page">
          <h1>Shared Documents</h1>
          <p className="documents-subtitle">
            Documents uploaded to your workspace
          </p>

          {documents.length === 0 ? (
            <div className="empty-doc">
              <FileText size={40} />
              <h2>No Documents Uploaded Yet</h2>
              <p>Upload a PDF from the dashboard to see it here.</p>
            </div>
          ) : (
            <div className="documents-list">
              {documents.map((doc) => (
                <div className="document-card" key={doc.id}>
                  <div className="document-icon">
                    <FileText size={26} />
                  </div>

                  <div className="document-info">
                    <h2>{doc.filename}</h2>

                    <p className="document-uploader" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <User size={13} />
                      <span>Uploaded by <strong>{doc.uploaded_by || "Nexora User"}</strong></span>
                    </p>

                    <div className="document-date">
                      <span>Uploaded on {formatDate(doc.uploaded_at)}</span>
                      <small>{formatTime(doc.uploaded_at)}</small>
                    </div>

                    <div className="document-meta">
                      <span className="document-badge" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <FileText size={12} /> PDF
                      </span>

                      {doc.pages && (
                        <span className="document-badge">
                          {doc.pages} {doc.pages === 1 ? "Page" : "Pages"}
                        </span>
                      )}

                      <span
                        className={`document-status ${
                          doc.status === "ready" ? "ready" : "processing"
                        }`}
                      >
                        {getStatusIcon(doc.status)}
                        <span>{doc.status === "ready" ? "Ready" : "Processing"}</span>
                      </span>

                      <span className="document-badge" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <Users size={12} /> Shared
                      </span>

                      <button
                        onClick={() => handleDeleteDocument(doc.id)}
                        title="Delete Document"
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#ef4444",
                          cursor: "pointer",
                          padding: "4px",
                          marginLeft: "auto",
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PageTransition>
    </DashboardLayout>
  );
}

export default Documents;