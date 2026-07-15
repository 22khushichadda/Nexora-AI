import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  History,
  Settings,
  Plus,
  ChevronDown
} from "lucide-react";

import "../styles/sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">

      <div>

        <div className="logo-box">

          <div className="logo-icon">

            N

          </div>

          <h2>

            NEXORA

          </h2>

        </div>

        <div className="divider"></div>

        <div className="menu">

          <button className="active">

            <LayoutDashboard size={20} />

            Dashboard

          </button>

          <button>

            <FileText size={20} />

            Documents

          </button>

          <button>

            <MessageSquare size={20} />

            AI Chat

          </button>

          <button>

            <History size={20} />

            History

          </button>

          <button>

            <Settings size={20} />

            Settings

          </button>

        </div>

      </div>

      <div>

        <button className="new-chat-btn">

          <Plus size={18} />

          New Chat

        </button>

        <div className="user-card">

          <div className="avatar">

            NU

          </div>

          <div className="user-info">

            <h4>Nexora User</h4>

          </div>

          <ChevronDown size={18} />

        </div>

      </div>

    </div>
  );
}

export default Sidebar;