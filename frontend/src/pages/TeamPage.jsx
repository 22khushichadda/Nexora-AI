import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import PageTransition from "../components/PageTransition";
import { Users, UserPlus, Shield, Trash2, Mail, Clock, CheckCircle, AlertCircle } from "lucide-react";
import {
  getMembers,
  getInvitations,
  addMember,
  removeMember,
  updateMemberRole,
  WORKSPACE_ID
} from "../services/api";
import "../styles/team.css";

function TeamPage() {
  const [members, setMembers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member");
  const [loading, setLoading] = useState(false);
  const [inviteMessage, setInviteMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [pendingInvitations, setPendingInvitations] = useState([]);

  useEffect(() => {
    loadMembers();
    loadInvitations();
  }, []);

  const loadMembers = async () => {
    try {
      const data = await getMembers(WORKSPACE_ID);
      setMembers(data);
    } catch (err) {
      console.log("Unable to load members:", err);
    }
  };

  const loadInvitations = async () => {
    try {
      const data = await getInvitations(WORKSPACE_ID);
      setPendingInvitations(data);
    } catch (err) {
      console.log("Unable to load invitations:", err);
    }
  };

  const handleAddMember = async () => {
    if (!name.trim() || !email.trim()) {
      setIsSuccess(false);
      setInviteMessage("Please fill in both name and email.");
      return;
    }

    try {
      setLoading(true);
      setInviteMessage("");

      const response = await addMember({
        workspace_id: WORKSPACE_ID,
        name: name.trim(),
        email: email.trim(),
        role: role
      });

      setName("");
      setEmail("");
      setRole("Member");

      await loadMembers();
      await loadInvitations();

      setIsSuccess(true);
      setInviteMessage(response.message || "Invitation created successfully.");
    } catch (err) {
      console.log("Invite error:", err);
      setIsSuccess(false);
      setInviteMessage(err.response?.data?.detail || "Unable to create invitation.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    const confirmDelete = window.confirm("Are you sure you want to remove this member?");
    if (!confirmDelete) return;

    try {
      await removeMember(memberId);
      await loadMembers();
    } catch (err) {
      console.log("Remove member error:", err);
      alert(err.response?.data?.detail || "Unable to remove member.");
    }
  };

  const handleRoleChange = async (memberId, newRole) => {
    try {
      await updateMemberRole(memberId, newRole);
      await loadMembers();
    } catch (err) {
      console.log("Role update error:", err);
      alert(err.response?.data?.detail || "Unable to update member role.");
    }
  };

  const getRoleBadgeClass = (r) => {
    if (r === "Owner") return "badge-purple";
    if (r === "Admin") return "badge-blue";
    return "badge-amber";
  };

  return (
    <DashboardLayout>
      <PageTransition>
        <div className="team-container">
          {/* Header */}
          <div style={{ marginBottom: "24px" }} className="team-header-title">
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800 }}>
              <span className="desktop-title">Team & Members</span>
              <span className="mobile-title">Team</span>
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.92rem" }}>
              <span className="desktop-sub">Invite colleagues and manage workspace permissions</span>
              <span className="mobile-sub">Manage workspace members</span>
            </p>
          </div>

          {/* Invite Member Card */}
          <div className="glass-card team-card">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "var(--light-lavender)",
                  color: "var(--primary-purple)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}
              >
                <UserPlus size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>Invite Team Member</h3>
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>
                  Send an email invitation link to collaborate in this workspace
                </p>
              </div>
            </div>

            <div className="team-form-grid">
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "6px" }}>
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Connor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "6px" }}>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="sarah@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "6px" }}>
                  Role & Permissions
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={loading}
                >
                  <option value="Member">Member</option>
                  <option value="Admin">Admin</option>
                  <option value="Owner">Owner</option>
                </select>
              </div>
            </div>

            <button
              className="primary-btn invite-btn"
              onClick={handleAddMember}
              disabled={loading}
            >
              <Mail size={18} />
              <span>{loading ? "Sending Invitation..." : "Send Invite"}</span>
            </button>

            {inviteMessage && (
              <p
                style={{
                  marginTop: "14px",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  color: isSuccess ? "#16A34A" : "#DC2626",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                {isSuccess ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                <span>{inviteMessage}</span>
              </p>
            )}
          </div>

          {/* Pending Invitations */}
          {pendingInvitations.length > 0 && (
            <div style={{ marginBottom: "30px" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "14px" }}>
                Pending Invitations ({pendingInvitations.length})
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {pendingInvitations.map((inv) => (
                  <div key={inv.id} className="glass-card pending-card">
                    <div className="pending-card-left">
                      <h4 className="member-name">{inv.name}</h4>
                      <p className="member-email">{inv.email}</p>
                    </div>

                    <div className="pending-card-right">
                      <span className="badge badge-amber" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <Clock size={12} /> Pending
                      </span>
                      <span className={`badge ${getRoleBadgeClass(inv.role)}`}>
                        {inv.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Current Members */}
          <div>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "14px" }}>
              Workspace Members ({members.length})
            </h2>

            {members.length === 0 ? (
              <div
                className="glass-card"
                style={{ padding: "30px", textAlign: "center", background: "var(--white)" }}
              >
                <p style={{ color: "var(--text-muted)" }}>No members found in this workspace.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {members.map((mem) => (
                  <div key={mem.id} className="glass-card member-card">
                    <div className="member-card-left">
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "10px",
                          background: "linear-gradient(135deg, #C4B5FD 0%, #93C5FD 100%)",
                          color: "var(--text-primary)",
                          fontWeight: 700,
                          fontSize: "0.9rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0
                        }}
                      >
                        {mem.name ? mem.name.slice(0, 2).toUpperCase() : "NX"}
                      </div>
                      <div className="member-info">
                        <div className="member-card-header">
                          <h4 className="member-name">{mem.name}</h4>
                          <button
                            className="delete-member-btn mobile-only-delete"
                            title="Remove Member"
                            onClick={() => handleRemoveMember(mem.id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <p className="member-email">{mem.email}</p>
                      </div>
                    </div>

                    <div className="member-card-right">
                      <span className="member-role-label">Role</span>
                      <select
                        value={mem.role}
                        onChange={(e) => handleRoleChange(mem.id, e.target.value)}
                        className="member-role-select"
                      >
                        <option value="Member">Member</option>
                        <option value="Admin">Admin</option>
                        <option value="Owner">Owner</option>
                      </select>

                      <button
                        className="delete-member-btn desktop-only-delete"
                        title="Remove Member"
                        onClick={() => handleRemoveMember(mem.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
}

export default TeamPage;