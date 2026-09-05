import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import PageTransition from "../components/PageTransition";
import { History, MessageSquare, Clock, ArrowRight } from "lucide-react";
import { getHistory, getConversation } from "../services/api";

function HistoryPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getHistory();
      // Sort descending (newest date first)
      const sorted = [...(data || [])].sort(
        (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
      );
      setHistory(sorted);
    } catch (err) {
      console.log("History load error:", err);
    }
  };

  const openConversation = async (conversationId) => {
    try {
      const conversation = await getConversation(conversationId);
      navigate("/dashboard", {
        state: { conversation }
      });
    } catch (err) {
      console.log("Open conversation error:", err);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata"
    });
  };

  return (
    <DashboardLayout>
      <PageTransition>
        <div style={{ padding: "24px", maxWidth: "1100px", margin: "0 auto", width: "100%" }}>
          <div style={{ marginBottom: "24px" }}>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800 }}>Conversation History</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.92rem" }}>
              Resume previous research sessions and AI document chats
            </p>
          </div>

          {history.length === 0 ? (
            <div
              className="glass-card"
              style={{
                padding: "60px 20px",
                textAlign: "center",
                background: "var(--white)",
                borderRadius: "var(--radius-lg)",
                border: "2px dashed var(--border-color)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px"
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "16px",
                  background: "var(--light-lavender)",
                  color: "var(--primary-purple)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <History size={26} />
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>No Conversation History</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Start a new chat on the dashboard to build your research history.
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
              {history.map((chat) => (
                <div
                  key={chat.id}
                  className="glass-card"
                  onClick={() => openConversation(chat.id)}
                  style={{
                    padding: "20px",
                    background: "var(--white)",
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "12px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                    <div
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "10px",
                        background: "var(--light-lavender)",
                        color: "var(--primary-purple)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      }}
                    >
                      <MessageSquare size={18} />
                    </div>

                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <h3
                        style={{
                          fontSize: "1rem",
                          fontWeight: 700,
                          margin: 0,
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {chat.title || "Untitled Conversation"}
                      </h3>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.78rem", color: "var(--text-light)", marginTop: "4px" }}>
                        <Clock size={12} />
                        <span>{formatDate(chat.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "6px", color: "var(--primary-purple)", fontSize: "0.85rem", fontWeight: 600, paddingTop: "8px", borderTop: "1px solid var(--border-color)" }}>
                    <span>Resume Session</span>
                    <ArrowRight size={15} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PageTransition>
    </DashboardLayout>
  );
}

export default HistoryPage;