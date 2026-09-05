import React from "react";
import { motion } from "framer-motion";
import { Menu, Sparkles } from "lucide-react";
import { useAuth } from "./context/AuthContext";
import NexoraLogo from "./NexoraLogo";
import "../styles/header.css";

function Header({ onToggleSidebar }) {
  const { user } = useAuth();

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
              {user?.name || "Nexora User"}
            </span>
          </h1>
          <p>AI-Powered Document Intelligence Workspace</p>
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