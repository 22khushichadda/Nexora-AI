import { motion } from "framer-motion";
import "../styles/sidebar.css";

function Sidebar() {

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

                <div className="logo-area">

                    <div className="logo-icon">

                        N

                    </div>

                    <h1>NEXORA</h1>

                </div>

                <div className="menu">

                    <button>Dashboard</button>

                    <button>Documents</button>

                    <button>AI Chat</button>

                    <button>History</button>

                    <button>Settings</button>

                </div>

            </div>

            <div className="bottom">

                <button className="primary-btn">

                    + New Chat

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