import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import PageTransition from "../components/PageTransition";
import {
  FileText,
  CheckCircle,
  Clock,
  Trash2,
  Users,
  User,
  ShieldAlert,
  ArrowLeft
} from "lucide-react";
import { useAuth } from "../components/context/AuthContext";
import { getDocuments, deleteDocument } from "../services/api";
import "../styles/documents.css";

function Documents() {
  const navigate = useNavigate();
  const { permissions, isOwner } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [forbidden, setForbidden] = useState(false);

  const canView = isOwner || permissions?.view_documents !== false;
  const canDelete = isOwner || permissions?.delete_documents !== false;

  useEffect(() => {
    if (canView) {
      fetchDocuments();
    } else {
      setForbidden(true);
    }
  }, [permissions, isOwner]);

  const fetchDocuments = async () => {
    try {
      setForbidden(false);
      const data = await getDocuments();
      setDocuments(data);
    } catch (err) {
      console.log("Error fetching documents:", err);
      if (err?.response?.status === 403) {
        setForbidden(true);
      }
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

  if (forbidden) {
    return (
      <DashboardLayout>
        <PageTransition>
          <div className="documents-page">
            <div className="rbac-forbidden-box">
              <div className="forbidden-icon-wrap">
                <ShieldAlert size={32} />
              </div>
              <h2 className="forbidden-title">HTTP 403 - Forbidden</h2>
              <p className="forbidden-desc">
                Viewing documents is disabled for your role in this workspace.
              </p>
              <button onClick={() => navigate("/dashboard")} className="back-btn">
                <ArrowLeft size={16} />
                Return to Dashboard
              </button>
            </div>
          </div>
        </PageTransition>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageTransition>
        <div className="documents-page">
          <div style={{ marginBottom: "24px" }} className="documents-header">
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800 }}>
              <span className="desktop-title">Shared Documents</span>
              <span className="mobile-title">Documents</span>
            </h1>
            <p className="documents-subtitle">
              <span className="desktop-sub">Documents uploaded to your workspace</span>
              <span className="mobile-sub">Workspace files</span>
            </p>
          </div>

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

                      {canDelete && (
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
                      )}
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