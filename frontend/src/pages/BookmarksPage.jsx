import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import PageTransition from "../components/PageTransition";
import { Bookmark, Clock, ArrowRight, Sparkles } from "lucide-react";
import { getBookmarks, getConversation } from "../services/api";
import "../styles/bookmarks.css";

function BookmarksPage() {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      const data = await getBookmarks();
      // Sort descending (newest date first)
      const sorted = [...(data || [])].sort(
        (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
      );
      setBookmarks(sorted);
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

  const getOneLinePreview = (text) => {
    if (!text) return "";
    const firstLine = text.split("\n").filter(Boolean)[0] || "";
    return firstLine.length > 85 ? `${firstLine.slice(0, 85)}...` : firstLine;
  };

  return (
    <DashboardLayout>
      <PageTransition>
        <div className="bookmarks-container">
          <div style={{ marginBottom: "24px" }} className="bookmarks-header">
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800 }}>
              <span className="desktop-title">Bookmarked Insights</span>
              <span className="mobile-title">Bookmarks</span>
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.92rem" }}>
              <span className="desktop-sub">Quick access to your saved research responses</span>
              <span className="mobile-sub">Saved answers</span>
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
            <div className="bookmarks-list">
              {bookmarks.map((bm) => (
                <div
                  key={bm.bookmark_id}
                  className="glass-card bookmark-card"
                  onClick={() => openBookmark(bm.conversation_id)}
                >
                  <div className="bookmark-title-pill">
                    <Sparkles size={13} style={{ flexShrink: 0 }} />
                    <span>{bm.conversation_title || "Saved Response"}</span>
                  </div>

                  <p className="bookmark-preview-text">
                    {getOneLinePreview(bm.answer)}
                  </p>

                  <div className="bookmark-date-row">
                    <Clock size={12} />
                    <span>{formatDate(bm.created_at)}</span>
                  </div>

                  <div className="bookmark-action-link">
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