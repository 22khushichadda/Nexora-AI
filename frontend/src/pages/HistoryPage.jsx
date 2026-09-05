import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import PageTransition from "../components/PageTransition";
import { History, MessageSquare, Clock, ArrowRight } from "lucide-react";
import { getHistory, getConversation } from "../services/api";
import "../styles/history.css";

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

      // Fetch preview text & user prompt for each history item
      const historyWithPreviews = await Promise.all(
        sorted.map(async (chat) => {
          try {
            const conv = await getConversation(chat.id);
            const aiMsg = conv.messages?.find(
              (m) => m.sender === "ai" || m.sender === "assistant"
            );
            const userMsg = conv.messages?.find((m) => m.sender === "user");

            let answerPreview = "";
            if (aiMsg?.text) {
              const firstLine = aiMsg.text.split("\n").filter(Boolean)[0] || "";
              answerPreview =
                firstLine.length > 85 ? firstLine.slice(0, 85) + "..." : firstLine;
            }

            return {
              ...chat,
              prompt: userMsg?.text || chat.title || "Untitled Conversation",
              answerPreview,
            };
          } catch {
            return {
              ...chat,
              prompt: chat.title || "Untitled Conversation",
              answerPreview: "",
            };
          }
        })
      );

      setHistory(historyWithPreviews);
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
        <div className="history-container">
          <div style={{ marginBottom: "24px" }} className="history-header">
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800 }}>
              <span className="desktop-title">Conversation History</span>
              <span className="mobile-title">History</span>
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.92rem" }}>
              <span className="desktop-sub">Resume previous research sessions and AI document chats</span>
              <span className="mobile-sub">Your recent conversations</span>
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
            <div className="history-grid">
              {history.map((chat) => (
                <div
                  key={chat.id}
                  className="glass-card history-card"
                  onClick={() => openConversation(chat.id)}
                >
                  <div className="history-prompt-pill">
                    <MessageSquare size={15} style={{ flexShrink: 0 }} />
                    <span>{chat.prompt}</span>
                  </div>

                  {chat.answerPreview && (
                    <p className="history-preview-text">
                      {chat.answerPreview}
                    </p>
                  )}

                  <div className="history-date-row">
                    <Clock size={12} />
                    <span>{formatDate(chat.created_at)}</span>
                  </div>

                  <div className="history-action-link">
                    <span>Open in Conversation</span>
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