import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";

import {
    LayoutDashboard,
    FileText,
    Bookmark,
    History,
    Plus,
    Users,
    LogOut
} from "lucide-react";
import { useAuth } from "./context/AuthContext";

import "../styles/sidebar.css";

function Sidebar() {

    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleNewChat = () => {

        navigate("/dashboard");

        // Clear previous chat temporarily
        // Later we'll connect this to ChatBox
        window.location.reload();

    };

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const getInitials = (name) => {
        if (!name) return "NU";
        const parts = name.trim().split(" ");
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    return (

        <motion.div

            className="sidebar"

            initial={{ x: -120, opacity: 0 }}

            animate={{ x: 0, opacity: 1 }}

            transition={{

                duration: .8,

                ease: "easeOut"

            }}

        >

            <div>

                {/* ---------------- Logo ---------------- */}

                <div className="logo-area">

                    <div className="logo-icon">

                        N

                    </div>

                    <h1>NEXORA</h1>

                </div>

                {/* ---------------- Menu ---------------- */}

                <div className="menu">

                    <NavLink

                        to="/dashboard"

                        className={({ isActive }) =>

                            isActive ? "menu-link active" : "menu-link"

                        }

                    >

                        <LayoutDashboard size={20} />

                        Dashboard

                    </NavLink>

                    <NavLink

                        to="/documents"

                        className={({ isActive }) =>

                            isActive ? "menu-link active" : "menu-link"

                        }

                    >

                        <FileText size={20} />

                        Documents

                    </NavLink>

                    <NavLink

                        to="/bookmarks"

                        className={({ isActive }) =>

                            isActive ? "menu-link active" : "menu-link"

                        }

                    >

                        <Bookmark size={20} />

                        Bookmarks

                    </NavLink>

                    <NavLink

                        to="/history"

                        className={({ isActive }) =>

                            isActive ? "menu-link active" : "menu-link"

                        }

                    >

                        <History size={20} />

                        History

                    </NavLink>

                    {/* ---------------- Team ---------------- */}

                    <NavLink

                        to="/team"

                        className={({ isActive }) =>

                            isActive ? "menu-link active" : "menu-link"

                        }

                    >

                        <Users size={20} />

                        Team

                    </NavLink>

                </div>

            </div>

            {/* ---------------- Bottom ---------------- */}

            <div className="bottom">

                <button

                    className="primary-btn"

                    onClick={handleNewChat}

                >

                    <Plus size={18} />

                    New Chat

                </button>

                <div className="user-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px", overflow: "hidden" }}>

                        <div className="avatar">

                            {getInitials(user?.name)}

                        </div>

                        <div style={{ overflow: "hidden" }}>

                            <h4 style={{ textOverflow: "ellipsis", overflow: "hidden", whitespace: "nowrap", margin: 0 }}>
                                {user?.name || "Nexora User"}
                            </h4>

                            {user?.email && (
                                <p style={{ fontSize: "11px", color: "#aeb7d0", margin: 0, textOverflow: "ellipsis", overflow: "hidden", whitespace: "nowrap" }}>
                                    {user.email}
                                </p>
                            )}

                        </div>

                    </div>

                    <button

                        onClick={handleLogout}

                        title="Logout"

                        style={{

                            background: "transparent",

                            border: "none",

                            color: "#aeb7d0",

                            cursor: "pointer",

                            padding: "6px",

                            display: "flex",

                            alignItems: "center"

                        }}

                    >

                        <LogOut size={18} />

                    </button>

                </div>

            </div>

        </motion.div>

    );

}

export default Sidebar;