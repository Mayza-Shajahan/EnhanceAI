import React from "react";
import { motion } from "framer-motion";

export default function Dashboard({ stats }) {
  return (
    <div style={styles.container}>
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={styles.title}
      >
        🚀 AI Dashboard
      </motion.h1>

      {/* Subtitle */}
      <p style={styles.subtitle}>
        Monitor your enhancement performance in real-time
      </p>

      {/* Stats Grid */}
      <div style={styles.grid}>
        {/* Total Images */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          style={styles.card}
        >
          <h2 style={styles.bigText}>{stats.count}</h2>
          <p style={styles.label}>Images Enhanced</p>
        </motion.div>

        {/* Avg Time */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          style={styles.card}
        >
          <h2 style={styles.bigText}>{stats.avgTime}s</h2>
          <p style={styles.label}>Avg Processing Time</p>
        </motion.div>

        {/* Performance Indicator */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          style={styles.card}
        >
          <h2 style={styles.bigText}>
            {stats.avgTime < 500 ? "⚡ Fast" : "🐢 Slow"}
          </h2>
          <p style={styles.label}>Performance</p>
        </motion.div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    paddingTop: "20px",
  },

  title: {
    fontSize: "2.8rem",
    fontWeight: "bold",
    color: "white"
  },

  subtitle: {
    marginTop: "10px",
    marginBottom: "40px",
    color: "#aaa",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "25px",
    maxWidth: "900px",
    margin: "auto",
  },

  card: {
    padding: "40px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.2)",
    boxShadow: "0 0 25px rgba(0, 200, 255, 0.2)",
    transition: "0.3s",
  },

  bigText: {
    fontSize: "2.5rem",
    marginBottom: "10px",
    color: "#00eaff",
  },

  label: {
    color: "#ccc",
  },
};