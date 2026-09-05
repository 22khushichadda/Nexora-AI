import React from "react";
import { motion } from "framer-motion";
import { Menu, Sparkles } from "lucide-react";
import { useAuth } from "./context/AuthContext";
import NexoraLogo from "./NexoraLogo";
import "../styles/header.css";

function Header({ onToggleSidebar }) {
  const { user } = useAuth();
  const firstName = user?.name ? user.name.split(" ")[0] : "User";

  return (
    <motion.header
      className="header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="header-left">
        <button
          className="mobile-menu-btn"
          onClick={onToggleSidebar}
          aria-label="Open Navigation Menu"
        >
          <Menu size={20} />
        </button>

        <div className="header-title">
          <h1>
            Welcome back,{" "}
            <span style={{ color: "var(--primary-purple)" }}>
              <span className="desktop-name">{user?.name || "Nexora User"}</span>
              <span className="mobile-name">{firstName}</span>
            </span>
          </h1>
          <p className="header-subtitle">
            <span className="desktop-subtitle">AI-Powered Document Intelligence Workspace</span>
            <span className="mobile-subtitle">Document Intelligence Workspace</span>
          </p>
        </div>
      </div>

      <div className="header-right">
        <div className="status-pill">
          <span className="status-dot"></span>
          <Sparkles size={13} />
          <span>Nexora AI Active</span>
        </div>
      </div>
    </motion.header>
  );
}

export default Header;