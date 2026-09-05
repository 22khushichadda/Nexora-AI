import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Bookmark, Copy, Check, FileText, Bot, User } from "lucide-react";
import { addBookmark } from "../services/api";
import "../styles/message.css";

function Message({ sender, text, sources, messageId }) {
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  const safeText =
    typeof text === "string"
      ? text
      : JSON.stringify(text, null, 2);

  const handleBookmark = async () => {
    try {
      if (messageId) {
        await addBookmark(messageId);
        setBookmarked(true);
      }
    } catch (err) {
      console.log("Bookmark error:", err);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(safeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`message ${sender}`}>
      <div className="avatar">
        {sender === "user" ? <User size={18} /> : <Bot size={18} />}
      </div>

      <div className="bubble">
        <ReactMarkdown>{safeText}</ReactMarkdown>

        {/* Sources Section */}
        {sender === "ai" && Array.isArray(sources) && sources.length > 0 && (
          <div className="sources">
            <h4>Sources & Citations</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {sources.map((source, index) => {
                const srcStr = typeof source === "string" ? source : JSON.stringify(source);
                return (
                  <div key={index} className="source-item">
                    <FileText size={13} />
                    <span>{srcStr}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Controls */}
        {sender === "ai" && (
          <div className="message-actions">
            {messageId && (
              <button className="bookmark-btn" onClick={handleBookmark}>
                <Bookmark
                  size={14}
                  fill={bookmarked ? "#8B5CF6" : "none"}
                  color={bookmarked ? "#8B5CF6" : "currentColor"}
                />
                <span>{bookmarked ? "Bookmarked" : "Bookmark"}</span>
              </button>
            )}

            <button className="copy-btn" onClick={handleCopy}>
              {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Message;