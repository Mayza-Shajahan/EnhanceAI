import React from "react";
import { motion } from "framer-motion";

export default function History({ history, deleteHistoryItem }) {
  if (!history.length) {
    return (
      <div style={styles.empty}>
        <h2>No History Yet 😴</h2>
        <p>Start enhancing images or videos to see results here</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={styles.title}
      >
        🕘 Enhancement History
      </motion.h1>

      <div style={styles.grid}>
        {history.map((item, index) => {
          const isVideo = item.output?.includes("video") || item.output?.endsWith(".mp4");

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              style={styles.card}
            >
              {/* MEDIA */}
              {isVideo ? (
                <video
                  src={item.output}
                  controls
                  style={styles.media}
                />
              ) : (
                <img
                  src={item.output}
                  alt="Enhanced"
                  style={styles.media}
                />
              )}

              {/* INFO */}
              <div style={styles.info}>
                <p>⏱ {item.time.toFixed(2)}s</p>
              </div>

              {/* ACTIONS */}
              <div style={styles.actions}>
                <button
                  onClick={() => deleteHistoryItem(index)}
                  style={styles.deleteBtn}
                >
                  🗑
                </button>

                <a href={item.output} download>
                  <button style={styles.downloadBtn}>⬇</button>
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
  },

  title: {
    fontSize: "2.5rem",
    marginBottom: "30px",
    color: "white"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    maxWidth: "1000px",
    margin: "auto",
  },

  card: {
    position: "relative",
    borderRadius: "20px",
    overflow: "hidden",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.2)",
    boxShadow: "0 0 20px rgba(0, 200, 255, 0.2)",
  },

  media: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
  },

  info: {
    padding: "10px",
    fontSize: "0.9rem",
    color: "#ccc",
  },

  actions: {
    position: "absolute",
    top: "10px",
    right: "10px",
    display: "flex",
    gap: "8px",
  },

  deleteBtn: {
    background: "rgba(255, 0, 0, 0.7)",
    border: "none",
    color: "white",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    cursor: "pointer",
  },

  downloadBtn: {
    background: "rgba(0, 255, 200, 0.7)",
    border: "none",
    color: "black",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    cursor: "pointer",
  },

  empty: {
    marginTop: "100px",
    color: "#aaa",
  },
};