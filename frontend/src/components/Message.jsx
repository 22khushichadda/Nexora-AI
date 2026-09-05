import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Bookmark, Copy, Check, Bot, User } from "lucide-react";
import { addBookmark } from "../services/api";
import "../styles/message.css";

function Message({ sender, text, messageId }) {
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

        {/* Action Controls (Bookmark & Copy) below AI Answer ONLY */}
        {sender === "ai" && (
          <div className="message-actions">
            <button
              className={`bookmark-btn ${bookmarked ? "active" : ""}`}
              onClick={handleBookmark}
              title="Bookmark Answer"
            >
              <Bookmark
                size={14}
                fill={bookmarked ? "#8B5CF6" : "none"}
                color={bookmarked ? "#8B5CF6" : "currentColor"}
              />
              <span>{bookmarked ? "Bookmarked" : "Bookmark"}</span>
            </button>

            <button className="copy-btn" onClick={handleCopy} title="Copy Answer">
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