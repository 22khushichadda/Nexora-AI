import React from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import PageTransition from "../components/PageTransition";
import { motion } from "framer-motion";
import ChatBox from "../components/ChatBox";
import "../styles/dashboard.css";

function Dashboard() {
  const location = useLocation();
  const conversation = location.state?.conversation;

  return (
    <DashboardLayout>
      <PageTransition>
        <div className="dashboard-content" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <motion.div
            style={{ flex: 1, display: "flex", flexDirection: "column" }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ChatBox
              conversation={conversation}
              key={conversation?.conversation_id || "new"}
            />
          </motion.div>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
}

export default Dashboard;