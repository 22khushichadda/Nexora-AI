import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import PageTransition from "../components/PageTransition";
import { Users, UserPlus, Shield, Trash2, Mail, Clock, CheckCircle } from "lucide-react";
import {
  getMembers,
  getInvitations,
  addMember,
  removeMember,
  updateMemberRole,
  WORKSPACE_ID
} from "../services/api";

function TeamPage() {
  const [members, setMembers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member");
  const [loading, setLoading] = useState(false);
  const [inviteMessage, setInviteMessage] = useState("");
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
      setInviteMessage("❌ Please fill in both name and email.");
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

      setInviteMessage(`✅ ${response.message || "Invitation created successfully."}`);
    } catch (err) {
      console.log("Invite error:", err);
      setInviteMessage(err.response?.data?.detail || "❌ Unable to create invitation.");
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
        <div style={{ padding: "24px", maxWidth: "1100px", margin: "0 auto", width: "100%" }}>
          {/* Header */}
          <div style={{ marginBottom: "24px" }}>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800 }}>👥 Team & Members</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.92rem" }}>
              Invite colleagues and manage workspace permissions
            </p>
          </div>

          {/* Invite Member Card */}
          <div
            className="glass-card"
            style={{
              padding: "24px",
              marginBottom: "30px",
              background: "var(--white)",
              borderRadius: "var(--radius-md)"
            }}
          >
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
                  justifyContent: "center"
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

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px", marginBottom: "16px" }}>
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
              className="primary-btn"
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
                  color: inviteMessage.startsWith("✅") ? "#16A34A" : "#DC2626"
                }}
              >
                {inviteMessage}
              </p>
            )}
          </div>

          {/* Pending Invitations */}
          {pendingInvitations.length > 0 && (
            <div style={{ marginBottom: "30px" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "14px" }}>
                ⏳ Pending Invitations ({pendingInvitations.length})
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {pendingInvitations.map((inv) => (
                  <div
                    key={inv.id}
                    className="glass-card"
                    style={{
                      padding: "16px 20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: "var(--white)",
                      borderRadius: "var(--radius-sm)"
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: 700, margin: 0 }}>{inv.name}</h4>
                      <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>{inv.email}</p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span className="badge badge-amber">
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
                  <div
                    key={mem.id}
                    className="glass-card"
                    style={{
                      padding: "16px 20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: "var(--white)",
                      borderRadius: "var(--radius-sm)"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
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
                          justifyContent: "center"
                        }}
                      >
                        {mem.name ? mem.name.slice(0, 2).toUpperCase() : "NX"}
                      </div>
                      <div>
                        <h4 style={{ fontSize: "0.95rem", fontWeight: 700, margin: 0 }}>{mem.name}</h4>
                        <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>{mem.email}</p>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <select
                        value={mem.role}
                        onChange={(e) => handleRoleChange(mem.id, e.target.value)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "var(--radius-xs)",
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          width: "auto"
                        }}
                      >
                        <option value="Member">Member</option>
                        <option value="Admin">Admin</option>
                        <option value="Owner">Owner</option>
                      </select>

                      <button
                        title="Remove Member"
                        onClick={() => handleRemoveMember(mem.id)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#EF4444",
                          padding: "6px",
                          borderRadius: "var(--radius-xs)",
                          cursor: "pointer"
                        }}
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