import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Bookmark,
  History,
  Plus,
  Users,
  LogOut,
  X
} from "lucide-react";
import { useAuth } from "./context/AuthContext";
import NexoraLogo from "./NexoraLogo";
import "../styles/sidebar.css";

function Sidebar({ isOpen = false, onClose = () => {} }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleNewChat = () => {
    onClose();
    navigate("/dashboard");
    window.location.reload();
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "NX";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/documents", label: "Documents", icon: FileText },
    { path: "/bookmarks", label: "Bookmarks", icon: Bookmark },
    { path: "/history", label: "History", icon: History },
    { path: "/team", label: "Team", icon: Users },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="mobile-overlay active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <div className={`sidebar ${isOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-top">
          {/* Logo Header */}
          <div className="logo-area">
            <NexoraLogo size="md" />
            {isOpen && (
              <button
                onClick={onClose}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* New Chat Button */}
          <button className="new-chat-btn" onClick={handleNewChat}>
            <Plus size={19} />
            <span>New Chat</span>
          </button>

          {/* Navigation Links */}
          <nav className="menu">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    isActive ? "menu-link active" : "menu-link"
                  }
                >
                  <Icon size={19} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Profile Card */}
        <div className="sidebar-bottom">
          <div className="user-card">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", overflow: "hidden" }}>
              <div className="user-avatar">
                {getInitials(user?.name)}
              </div>
              <div style={{ overflow: "hidden" }}>
                <h4
                  style={{
                    fontSize: "0.88rem",
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    margin: 0,
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap"
                  }}
                >
                  {user?.name || "Nexora User"}
                </h4>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    margin: 0,
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap"
                  }}
                >
                  {user?.email || "user@nexora.ai"}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="logout-btn"
              title="Log Out"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;