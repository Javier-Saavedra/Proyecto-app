import React from "react";
import { motion } from "framer-motion";

export default function Toggle({ darkMode, setDarkMode }) {
  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      aria-label="Toggle dark mode"
      className="w-14 h-8 rounded-full p-1 flex items-center focus:outline-none shadow-sm"
      style={{ background: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" }}
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        className={`w-6 h-6 rounded-full shadow-md flex items-center justify-center`}
        style={{
          background: darkMode ? "linear-gradient(90deg,#F6C85F,#FF9E4A)" : "#ffffff",
          transform: darkMode ? "translateX(24px)" : "translateX(0px)",
        }}
      />
    </button>
  );
}
