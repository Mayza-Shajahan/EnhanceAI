import React, { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import Enhancer from "./pages/Enhancer";
import History from "./pages/History";
import Antigravity from "./components/Antigravity";

export default function App() {
  const [page, setPage] = useState("enhancer");
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ count: 0, avgTime: 0 });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("enhanceHistory")) || [];
    setHistory(stored);
    updateStats(stored);
  }, []);

  const addHistoryItem = (item) => {
    const newHistory = [item, ...history];
    setHistory(newHistory);
    localStorage.setItem("enhanceHistory", JSON.stringify(newHistory));
    updateStats(newHistory);
  };

  const deleteHistoryItem = (index) => {
    const newHistory = history.filter((_, i) => i !== index);
    setHistory(newHistory);
    localStorage.setItem("enhanceHistory", JSON.stringify(newHistory));
    updateStats(newHistory);
  };

  const updateStats = (historyArr) => {
    const count = historyArr.length;
    const avgTime =
      count === 0
        ? 0
        : historyArr.reduce((sum, h) => sum + h.time, 0) / count;

    setStats({ count, avgTime: avgTime.toFixed(2) });
  };

  return (
    <div style={styles.wrapper}>
      
      {/* 🌌 Animated Background */}
      <div style={styles.bg}>
        <Antigravity />
      </div>

      {/* 🧊 Main Layout */}
      <div style={styles.container}>

        {/* Sidebar */}
        <div style={styles.sidebar}>
          <h2 style={{ marginBottom: "20px" }}>✨ EnhanceAI</h2>

          <NavItem label="Dashboard" active={page === "dashboard"} onClick={() => setPage("dashboard")} />
          <NavItem label="Enhancer" active={page === "enhancer"} onClick={() => setPage("enhancer")} />
          <NavItem label="History" active={page === "history"} onClick={() => setPage("history")} />
        </div>

        {/* Content */}
        <div style={styles.main}>
          {page === "dashboard" && <Dashboard stats={stats} />}
          {page === "enhancer" && <Enhancer addHistoryItem={addHistoryItem} />}
          {page === "history" && (
            <History history={history} deleteHistoryItem={deleteHistoryItem} />
          )}
        </div>

      </div>
    </div>
  );
}

/* 🔹 Sidebar Item Component */
function NavItem({ label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "12px",
        borderRadius: "10px",
        cursor: "pointer",
        background: active ? "rgba(0,255,255,0.2)" : "transparent",
        transition: "0.3s",
      }}
    >
      {label}
    </div>
  );
}

/* 🔥 Styles */
const styles = {
  wrapper: {
    position: "relative",
    height: "100vh",
    overflow: "hidden",
    color: "white",
    fontFamily: "Arial",
    background: "black"
  },

  bg: {
    position: "fixed",
    width: "100%",
    height: "100%",
    zIndex: 0,
    pointerEvents: "none",
  },

  container: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    height: "100%",
  },

  sidebar: {
    width: "240px",
    padding: "25px",
    background: "rgba(0,0,0,0.4)",
    backdropFilter: "blur(15px)",
    borderRight: "1px solid rgba(255,255,255,0.1)",
  },

  main: {
    flex: 1,
    padding: "40px",
    overflowY: "auto",
  },
};