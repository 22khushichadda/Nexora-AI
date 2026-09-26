import React, { useEffect, useRef, useState } from "react";
import { Plus, ArrowUp, FileText, X, Sparkles, FileSearch, HelpCircle, Clock, Scale } from "lucide-react";
import { useAuth } from "./context/AuthContext";
import Message from "./Message";
import {
  uploadDocument,
  askAI,
  getDocumentStatus
} from "../services/api";
import "../styles/chat.css";

function ChatBox({ conversation, onSelectPrompt }) {
  const { permissions, isOwner } = useAuth();
  const fileInput = useRef();
  const chatBottomRef = useRef();

  const canUpload = isOwner || permissions?.upload_documents !== false;
  const canChat = isOwner || permissions?.ai_chat !== false;

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [documentReady, setDocumentReady] = useState(false);
  const [conversationId, setConversationId] = useState(null);

  // Load conversation state if passed
  useEffect(() => {
    if (conversation) {
      setConversationId(conversation.conversation_id);
      setMessages(conversation.messages || []);
      setDocumentReady(true);
    }
  }, [conversation]);

  // Auto scroll to bottom when messages update
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Poll Document Status
  useEffect(() => {
    if (!processing) return;

    const interval = setInterval(async () => {
      try {
        const response = await getDocumentStatus();
        if (response.status === "ready") {
          setProcessing(false);
          setDocumentReady(true);
          clearInterval(interval);
        }
      } catch (err) {
        console.log("Status polling error:", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [processing]);

  // Upload PDF - ONLY sets uploadedFile and processing state; NO chat message bubble created!
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      await uploadDocument(file);
      setUploadedFile(file.name);
      setProcessing(true);
      setDocumentReady(false);
    } catch (err) {
      console.log("Upload error:", err);
      alert(err.response?.data?.detail || err.message || "Upload Failed.");
    } finally {
      setLoading(false);
    }
  };

  // Ask AI - ONLY called when user submits a prompt
  const handleAsk = async (customPrompt) => {
    const promptToSend = typeof customPrompt === "string" ? customPrompt : question;
    if (!promptToSend.trim()) return;

    if (!documentReady && processing) {
      alert("Document is still being analyzed. Please wait a few seconds.");
      return;
    }

    if (!documentReady && !uploadedFile) {
      alert("Please upload a PDF document first.");
      return;
    }

    setQuestion("");

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "user",
        text: promptToSend,
      },
    ]);

    try {
      setLoading(true);
      const response = await askAI(promptToSend, conversationId);

      if (response?.conversation_id) {
        setConversationId(response.conversation_id);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: response.answer,
        },
      ]);
    } catch (err) {
      console.log("Ask AI error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: err.response?.data?.detail || err.message || "Something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestionPrompts = [
    { text: "Summarize this document", icon: FileSearch },
    { text: "Find the key points", icon: HelpCircle },
    { text: "What are the important deadlines?", icon: Clock },
    { text: "Compare important information", icon: Scale },
  ];

  return (
    <>
      <input
        hidden
        type="file"
        accept=".pdf"
        ref={fileInput}
        onChange={handleUpload}
      />

      <div className="chat-wrapper">
        <div className="chat-history">
          {/* Welcome State when no messages */}
          {messages.length === 0 && (
            <div className="chat-welcome">
              <div className="chat-welcome-icon">
                <Sparkles size={32} />
              </div>
              <h3>Nexora AI Workspace</h3>
              <p>Upload a document to get started, ask questions, and analyze research documents.</p>

              <div className="suggestions-grid" style={{ width: "100%", marginTop: "12px" }}>
                {suggestionPrompts.map((item, idx) => {
                  const IconComp = item.icon;
                  return (
                    <div
                      key={idx}
                      className="suggestion-card"
                      onClick={() => handleAsk(item.text)}
                    >
                      <div className="suggestion-icon">
                        <IconComp size={18} />
                      </div>
                      <span className="suggestion-text">{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Attached File Pill - ONLY shown when user actually selects/uploads a file */}
          {uploadedFile && (
            <div className="attached-file">
              <div className="file-left">
                <FileText size={16} />
                <span>{uploadedFile}</span>
              </div>
              <button
                className="remove-file"
                title="Remove attached file"
                onClick={() => {
                  setUploadedFile(null);
                  setDocumentReady(false);
                  setProcessing(false);
                  setMessages([]);
                  setConversationId(null);
                  if (fileInput.current) fileInput.current.value = "";
                }}
              >
                <X size={15} />
              </button>
            </div>
          )}

          {/* Messages Stream */}
          {messages.map((msg, index) => (
            <Message
              key={msg.id || index}
              messageId={msg.id}
              sender={msg.sender}
              text={msg.text}
            />
          ))}

          {/* Animated Loading / Typing State */}
          {loading && (
            <div className="message ai">
              <div className="avatar">
                <Sparkles size={16} />
              </div>
              <div className="bubble">
                <div className="typing-dots">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Floating Modern Input Box */}
        <div className="chat-input-container">
          <div className="chat-box">
            <button
              className="plus-btn"
              title={canUpload ? "Upload PDF Document" : "Uploading documents is disabled for your role"}
              disabled={!canUpload || loading || processing}
              onClick={() => canUpload && fileInput.current.click()}
              style={{ opacity: canUpload ? 1 : 0.4, cursor: canUpload ? "pointer" : "not-allowed" }}
            >
              <Plus size={20} />
            </button>

            <input
              className="chat-input-field"
              value={question}
              placeholder={
                !canChat
                  ? "AI Chat is disabled for your role..."
                  : processing
                  ? "Analyzing the document..."
                  : "Ask Nexora anything about your documents..."
              }
              disabled={processing || !canChat}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && canChat) {
                  e.preventDefault();
                  handleAsk();
                }
              }}
            />

            <button
              className="send-btn"
              onClick={() => canChat && handleAsk()}
              disabled={loading || processing || !question.trim() || !canChat}
              title={canChat ? "Send Prompt" : "AI Chat is disabled for your role"}
            >
              <ArrowUp size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatBox;