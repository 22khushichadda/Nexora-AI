import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import PageTransition from "../components/PageTransition";
import NexoraLogo from "../components/NexoraLogo";
import API from "../services/api";
import { useAuth } from "../components/context/AuthContext";
import { Users, Mail, Shield, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";

function InvitePage() {
  const { token } = useParams();
  const { user, isAuthenticated } = useAuth();

  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInvitation = async () => {
      try {
        const response = await API.get(`/workspace/invitation/${token}`);
        setInvitation(response.data);
      } catch (err) {
        console.log("Invitation error:", err);
        setError(
          err.response?.data?.detail || "This invitation is invalid or has expired."
        );
      } finally {
        setLoading(false);
      }
    };

    loadInvitation();
  }, [token]);

  const handleAccept = async () => {
    try {
      setAccepting(true);
      setError("");

      const response = await API.post(`/workspace/invitation/${token}/accept`);
      alert(response.data.message || "Invitation accepted successfully.");
      window.location.href = "/team";
    } catch (err) {
      console.log("Accept invitation error:", err);
      setError(
        err.response?.data?.detail || "Unable to accept invitation."
      );
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--text-muted)" }}>
          Loading workspace invitation...
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <PageTransition>
          <div
            className="glass-card"
            style={{
              padding: "40px 30px",
              maxWidth: "520px",
              margin: "60px auto",
              textAlign: "center",
              background: "var(--white)",
              borderRadius: "var(--radius-lg)"
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: "#FEF2F2",
                color: "#DC2626",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px"
              }}
            >
              <AlertCircle size={24} />
            </div>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, margin: "0 0 10px 0" }}>Invitation Link Error</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", margin: 0 }}>{error}</p>
          </div>
        </PageTransition>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageTransition>
        <div
          className="glass-card"
          style={{
            maxWidth: "540px",
            margin: "40px auto",
            padding: "36px",
            borderRadius: "var(--radius-lg)",
            textAlign: "center",
            background: "var(--white)"
          }}
        >
          <div style={{ display: "inline-flex", justifyContent: "center", marginBottom: "16px" }}>
            <NexoraLogo size="md" />
          </div>

          <h1 style={{ fontSize: "1.45rem", fontWeight: 800, margin: "0 0 6px 0" }}>
            You're Invited to Join Workspace!
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: "0 0 24px 0" }}>
            Hello <strong>{invitation.name}</strong>, you've been granted access to collaborate in Nexora AI.
          </p>

          <div
            style={{
              background: "var(--off-white)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-md)",
              padding: "18px",
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginBottom: "24px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyBetween: "space-between", gap: "10px" }}>
              <Mail size={16} color="var(--primary-purple)" />
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Invited Email:</span>
              <strong style={{ fontSize: "0.88rem", marginLeft: "auto", color: "var(--text-primary)" }}>{invitation.email}</strong>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyBetween: "space-between", gap: "10px" }}>
              <Shield size={16} color="var(--primary-purple)" />
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Role:</span>
              <span className="badge badge-purple" style={{ marginLeft: "auto" }}>{invitation.role}</span>
            </div>
          </div>

          <button
            className="primary-btn"
            onClick={handleAccept}
            disabled={accepting}
            style={{ width: "100%", padding: "13px" }}
          >
            <span>{accepting ? "Accepting..." : "Accept Workspace Invitation"}</span>
            <ArrowRight size={18} />
          </button>

          {!isAuthenticated && (
            <div style={{ marginTop: "20px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
              New to Nexora AI?{" "}
              <Link to="/signup" style={{ color: "var(--primary-purple)", textDecoration: "none", fontWeight: "700" }}>
                Sign Up
              </Link>{" "}
              or{" "}
              <Link to="/login" style={{ color: "var(--primary-purple)", textDecoration: "none", fontWeight: "700" }}>
                Log In
              </Link>
            </div>
          )}
        </div>
      </PageTransition>
    </DashboardLayout>
  );
}

export default InvitePage;