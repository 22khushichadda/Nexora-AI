import React from "react";

function NexoraLogo({ size = "md", showBadge = true, collapsed = false }) {
  const dimensions = {
    sm: { icon: 32, font: "1.1rem", subFont: "0.65rem" },
    md: { icon: 40, font: "1.35rem", subFont: "0.75rem" },
    lg: { icon: 48, font: "1.65rem", subFont: "0.85rem" },
  }[size] || { icon: 40, font: "1.35rem", subFont: "0.75rem" };

  return (
    <div className="nexora-logo" style={{ display: "inline-flex", alignItems: "center", gap: "12px", textDecoration: "none", userSelect: "none" }}>
      {/* Geometric SVG Icon */}
      <div
        className="nexora-logo-icon"
        style={{
          width: `${dimensions.icon}px`,
          height: `${dimensions.icon}px`,
          borderRadius: "12px",
          background: "linear-gradient(135deg, #8B5CF6 0%, #6366F1 50%, #3B82F6 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 14px rgba(139, 92, 246, 0.3)",
          flexShrink: 0,
        }}
      >
        <svg
          width={dimensions.icon * 0.6}
          height={dimensions.icon * 0.6}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Neural Node Connections / Geometric N */}
          <path
            d="M4 19V5L12 14V5L20 14V19"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="4" cy="5" r="2" fill="#C4B5FD" />
          <circle cx="20" cy="19" r="2" fill="#93C5FD" />
          <circle cx="12" cy="14" r="1.8" fill="white" />
        </svg>
      </div>

      {!collapsed && (
        <div className="nexora-logo-text" style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 800,
                fontSize: dimensions.font,
                letterSpacing: "-0.03em",
                background: "linear-gradient(135deg, #1E1B4B 0%, #4338CA 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              NEXORA
            </span>
            {showBadge && (
              <span
                style={{
                  fontSize: dimensions.subFont,
                  fontWeight: 700,
                  color: "#8B5CF6",
                  background: "linear-gradient(135deg, #EDE9FE 0%, #DBEAFE 100%)",
                  padding: "2px 6px",
                  borderRadius: "6px",
                  border: "1px solid rgba(196, 181, 253, 0.5)",
                  letterSpacing: "0.05em",
                }}
              >
                AI
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NexoraLogo;
