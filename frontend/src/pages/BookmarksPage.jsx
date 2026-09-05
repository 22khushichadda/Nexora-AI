import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import PageTransition from "../components/PageTransition";
import { Bookmark, Clock, ArrowRight, Sparkles } from "lucide-react";
import { getBookmarks, getConversation } from "../services/api";

function BookmarksPage() {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      const data = await getBookmarks();
      setBookmarks(data);
    } catch (err) {
      console.log("Bookmarks load error:", err);
    }
  };

  const openBookmark = async (conversationId) => {
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
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800 }}>📌 Bookmarked Insights</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.92rem" }}>
              Quick access to your saved AI research responses and citations
            </p>
          </div>

          {bookmarks.length === 0 ? (
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
                <Bookmark size={26} />
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>No Bookmarks Yet</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", maxWidth: "400px" }}>
                Click the Bookmark button on any AI response in the chat to save key insights here.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {bookmarks.map((bm) => (
                <div
                  key={bm.bookmark_id}
                  className="glass-card"
                  onClick={() => openBookmark(bm.conversation_id)}
                  style={{
                    padding: "20px 24px",
                    background: "var(--white)",
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span className="badge badge-purple">
                        <Sparkles size={12} /> {bm.conversation_title || "Conversation"}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "var(--text-light)" }}>
                      <Clock size={13} />
                      <span>{formatDate(bm.created_at)}</span>
                    </div>
                  </div>

                  <p style={{ color: "var(--text-primary)", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
                    {bm.answer.length > 220 ? `${bm.answer.substring(0, 220)}...` : bm.answer}
                  </p>

                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--primary-purple)", fontSize: "0.85rem", fontWeight: 600, marginTop: "4px" }}>
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

export default BookmarksPage;