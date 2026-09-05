import React, { useEffect } from "react";
import { motion } from "framer-motion";
import AnimatedBackground from "./AnimatedBackground";
import "../styles/intro.css";

function IntroScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2400);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      className="intro"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <AnimatedBackground />

      <div className="splash-content">
        {/* Nexora N Logo with gentle float */}
        <motion.div
          className="splash-logo"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            y: [0, -6, 0]
          }}
          transition={{
            scale: { duration: 0.6, ease: "easeOut" },
            opacity: { duration: 0.5 },
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <svg
            width="46"
            height="46"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
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
        </motion.div>

        {/* Title: NEXORA (navy) AI (pastel gradient) */}
        <motion.h1
          className="splash-title"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <span className="splash-title-brand">NEXORA</span>
          <span className="splash-title-badge">AI</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="splash-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          AI-powered document assistant
        </motion.p>

        {/* Subtle 3-dot Loading Indicator */}
        <motion.div
          className="splash-dots"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <span className="splash-dot"></span>
          <span className="splash-dot"></span>
          <span className="splash-dot"></span>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default IntroScreen;