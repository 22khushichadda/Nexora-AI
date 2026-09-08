import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import PageTransition from "../components/PageTransition";
import { ShieldCheck, ShieldAlert, ArrowLeft, Check, Lock } from "lucide-react";
import { useAuth } from "../components/context/AuthContext";
import { getPermissionsMatrix, togglePermission, WORKSPACE_ID } from "../services/api";
import "../styles/permissions.css";

function PermissionsPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [matrix, setMatrix] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingKey, setUpdatingKey] = useState(null);
  const [isOwner, setIsOwner] = useState(true);

  useEffect(() => {
    loadMatrix();
  }, [user]);

  const loadMatrix = async () => {
    try {
      setLoading(true);
      const data = await getPermissionsMatrix(WORKSPACE_ID);
      setMatrix(data.matrix || []);
      setIsOwner(true);
      setError(null);
    } catch (err) {
      console.error("Failed to load permissions matrix:", err);
      if (err?.response?.status === 403) {
        setIsOwner(false);
      } else {
        setError("Failed to load permission settings. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (role, permissionKey, currentVal) => {
    const newVal = !currentVal;
    setUpdatingKey(`${role}-${permissionKey}`);

    // Optimistic UI update
    setMatrix((prevMatrix) =>
      prevMatrix.map((item) => {
        if (item.key === permissionKey) {
          return {
            ...item,
            [role.toLowerCase()]: newVal
          };
        }
        return item;
      })
    );

    try {
      const updatedData = await togglePermission(role, permissionKey, newVal, WORKSPACE_ID);
      if (updatedData && updatedData.matrix) {
        setMatrix(updatedData.matrix);
      }
    } catch (err) {
      console.error("Failed to update permission:", err);
      // Revert optimistic update on failure
      setMatrix((prevMatrix) =>
        prevMatrix.map((item) => {
          if (item.key === permissionKey) {
            return {
              ...item,
              [role.toLowerCase()]: currentVal
            };
          }
          return item;
        })
      );
    } finally {
      setUpdatingKey(null);
    }
  };

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="permissions-page">
          <p style={{ color: "var(--text-muted)", textAlign: "center", paddingTop: "40px" }}>
            Loading authentication session...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  // Access restriction for non-owners (Admin & Member)
  if (!isOwner) {
    return (
      <DashboardLayout>
        <PageTransition>
          <div className="permissions-page">
            <div className="rbac-forbidden-box">
              <div className="forbidden-icon-wrap">
                <ShieldAlert size={32} />
              </div>
              <h2 className="forbidden-title">HTTP 403 - Forbidden</h2>
              <p className="forbidden-desc">
                Access to the Permissions / RBAC configuration is restricted exclusively to the Workspace Owner.
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
        <div className="permissions-page">
          <div className="permissions-header">
            <h1 className="permissions-title">Permissions</h1>
            <p className="permissions-subtitle">
              Manage what each workspace role can access.
            </p>
          </div>

          {error && (
            <div
              style={{
                padding: "12px 16px",
                background: "#FEF2F2",
                border: "1px solid #FCA5A5",
                color: "#991B1B",
                borderRadius: "var(--radius-sm)",
                marginBottom: "20px",
                fontSize: "0.9rem"
              }}
            >
              {error}
            </div>
          )}

          {loading ? (
            <div className="permissions-card" style={{ padding: "40px", textAlign: "center" }}>
              <p style={{ color: "var(--text-muted)" }}>Loading permission matrix...</p>
            </div>
          ) : (
            <>
              {/* Desktop Matrix View */}
              <div className="permissions-card permissions-table-card">
                <div className="permissions-table-wrapper">
                  <table className="permissions-table">
                    <thead>
                      <tr>
                        <th className="col-feature">Capability</th>
                        <th className="col-role">Owner</th>
                        <th className="col-role">Admin</th>
                        <th className="col-role">Member</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matrix.map((row) => (
                        <tr key={row.key}>
                          <td>
                            <div className="permission-feature-info">
                              <span className="permission-feature-name">{row.label}</span>
                            </div>
                          </td>
                          <td className="permission-role-cell">
                            <span className="owner-badge">
                              <Lock size={12} /> Always ON
                            </span>
                          </td>
                          <td className="permission-role-cell">
                            <label className="toggle-wrapper">
                              <div className="toggle-switch">
                                <input
                                  type="checkbox"
                                  checked={!!row.admin}
                                  disabled={updatingKey === `Admin-${row.key}`}
                                  onChange={() => handleToggle("Admin", row.key, !!row.admin)}
                                />
                                <span className="toggle-slider"></span>
                              </div>
                              <span className={`toggle-label-text ${row.admin ? "on" : "off"}`}>
                                {row.admin ? "ON" : "OFF"}
                              </span>
                            </label>
                          </td>
                          <td className="permission-role-cell">
                            <label className="toggle-wrapper">
                              <div className="toggle-switch">
                                <input
                                  type="checkbox"
                                  checked={!!row.member}
                                  disabled={updatingKey === `Member-${row.key}`}
                                  onChange={() => handleToggle("Member", row.key, !!row.member)}
                                />
                                <span className="toggle-slider"></span>
                              </div>
                              <span className={`toggle-label-text ${row.member ? "on" : "off"}`}>
                                {row.member ? "ON" : "OFF"}
                              </span>
                            </label>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Responsive Cards View */}
              <div className="permissions-mobile-list">
                {matrix.map((row) => (
                  <div className="permission-mobile-card" key={row.key}>
                    <div className="permission-mobile-title">{row.label}</div>
                    <div className="permission-mobile-roles">
                      <div className="permission-mobile-role-row">
                        <span className="role-tag">Owner</span>
                        <span className="owner-badge">
                          <Lock size={12} /> Always ON
                        </span>
                      </div>
                      <div className="permission-mobile-role-row">
                        <span className="role-tag">Admin</span>
                        <label className="toggle-wrapper">
                          <div className="toggle-switch">
                            <input
                              type="checkbox"
                              checked={!!row.admin}
                              disabled={updatingKey === `Admin-${row.key}`}
                              onChange={() => handleToggle("Admin", row.key, !!row.admin)}
                            />
                            <span className="toggle-slider"></span>
                          </div>
                          <span className={`toggle-label-text ${row.admin ? "on" : "off"}`}>
                            {row.admin ? "ON" : "OFF"}
                          </span>
                        </label>
                      </div>
                      <div className="permission-mobile-role-row">
                        <span className="role-tag">Member</span>
                        <label className="toggle-wrapper">
                          <div className="toggle-switch">
                            <input
                              type="checkbox"
                              checked={!!row.member}
                              disabled={updatingKey === `Member-${row.key}`}
                              onChange={() => handleToggle("Member", row.key, !!row.member)}
                            />
                            <span className="toggle-slider"></span>
                          </div>
                          <span className={`toggle-label-text ${row.member ? "on" : "off"}`}>
                            {row.member ? "ON" : "OFF"}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </PageTransition>
    </DashboardLayout>
  );
}

export default PermissionsPage;
