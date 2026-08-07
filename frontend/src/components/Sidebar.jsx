import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";

import {
    LayoutDashboard,
    FileText,
    Bookmark,
    History,
    Plus
} from "lucide-react";

import "../styles/sidebar.css";

function Sidebar() {

    const navigate = useNavigate();

    const handleNewChat = () => {

        navigate("/dashboard");

        // Clear previous chat temporarily
        // Later we'll connect this to ChatBox
        window.location.reload();

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

                <div className="user-card">

                    <div className="avatar">

                        NU

                    </div>

                    <div>

                        <h4>Nexora User</h4>

                    </div>

                </div>

            </div>

        </motion.div>

    );

}

export default Sidebar;