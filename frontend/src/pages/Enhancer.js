import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Enhancer({ addHistoryItem }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [slider, setSlider] = useState(50);
  
  const isVideo = file && file.type.startsWith("video");

  // Upload / Drop
  const handleFile = (f) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setOutput(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  // API Call
  const handleUpload = async () => {
    if (!file) return alert("Upload something first!");

    setLoading(true);
    const startTime = performance.now();

    try {
      const formData = new FormData();
      formData.append("file", file); // ✅ FIXED

      const res = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });

      const blob = await res.blob();
      console.log("BLOB TYPE:", blob.type);
      console.log("BLOB SIZE:", blob.size);
      const videoBlob = new Blob([blob], { type: "video/mp4" });
      const outputUrl = URL.createObjectURL(videoBlob);
      setOutput(outputUrl);

      const endTime = performance.now();

      addHistoryItem({
        input: preview,
        output: outputUrl,
        time: (endTime - startTime) / 1000,
        type: file.type, // 🔥 IMPORTANT
      });

    } catch (err) {
      console.error(err);
      alert("Enhancement failed!");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      {/* TITLE */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={styles.title}
      >
        ✨ AI Enhancer Studio
      </motion.h1>

      {/* UPLOAD BOX */}
      <motion.div
        style={styles.uploadBox}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        whileHover={{ scale: 1.03 }}
      >
        <p>Drag & Drop Image / Video</p>

        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </motion.div>

      {/* BUTTON */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleUpload}
        style={styles.button}
      >
        Enhance 🚀
      </motion.button>

      {/* LOADER */}
      {loading && (
  <div style={styles.loaderOverlay}>
    <div style={styles.loaderCard}>
      
      <div style={styles.spinner}></div>

      <h2 style={styles.loaderTitle}>
        {isVideo ? "Enhancing Video" : "Enhancing Image"}
      </h2>

      <p style={styles.loaderSub}>
        Processing your file...
      </p>

      <div style={styles.progressBar}>
        <div style={styles.progressFill}></div>
      </div>

    </div>
  </div>
)}

      {/* RESULT */}
      {preview && output && (
        <div style={styles.resultBox}>
          {!isVideo ? (
            <>
              {/* IMAGE COMPARISON */}
              <div style={styles.compare}>
                <img src={preview} style={styles.image} alt="Original" />

                <div style={{ ...styles.overlay, width: `${slider}%` }}>
                  <img src={output} style={styles.image} alt="Enhanced" />
                </div>

                <div style={{ ...styles.handle, left: `${slider}%` }} />

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={slider}
                  onChange={(e) => setSlider(e.target.value)}
                  style={styles.range}
                />
              </div>
            </>
          ) : (
            <>
              {/* VIDEO COMPARISON */}
              <div style={styles.videoGrid}>
                <div>
                  <p>Original</p>
                  <video src={preview} controls style={styles.video} >
                    <source src={output} type="video/mp4" />
                  </video>
                  
                </div>

                <div>
                  <p>Enhanced</p>
                  <video key={output} controls style={styles.video}>
                    <source src={output} type="video/mp4" />
                  </video>
                </div>
              </div>
            </>
          )}

          {/* DOWNLOAD */}
          <a href={output} 
          download={isVideo ? "enhanced.mp4" : "enhanced.png"}>
            <button style={styles.download}>⬇ Download</button>
          </a>
        </div>
      )}
      
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
  },

  title: {
    fontSize: "2.8rem",
    marginBottom: "20px",
    color: "white"
  },

  uploadBox: {
    margin: "auto",
    width: "350px",
    padding: "40px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.2)",
    cursor: "pointer",
  },

  button: {
    marginTop: "20px",
    padding: "12px 30px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(90deg,#00c6ff,#0072ff)",
    color: "white",
    cursor: "pointer",
  },

loaderBox: {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",   // ✅ horizontal center
  justifyContent: "center", // ✅ vertical alignment inside box
  gap: "12px",            // spacing between spinner + text
},

  loader: {
    width: "60px",
    height: "60px",
    border: "6px solid white",
    borderTop: "6px solid transparent",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  resultBox: {
    marginTop: "40px",
  },

  compare: {
    position: "relative",
    width: "500px",
    margin: "auto",
  },

  image: {
    width: "500px",
    borderRadius: "15px",
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    overflow: "hidden",
    height: "100%",
  },

  handle: {
    position: "absolute",
    top: 0,
    height: "100%",
    width: "3px",
    background: "#00ffff",
  },

  range: {
    width: "100%",
    marginTop: "10px",
  },

  videoGrid: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
  },

  video: {
    width: "300px",
    borderRadius: "15px",
  },

  download: {
    marginTop: "20px",
    padding: "10px 20px",
    borderRadius: "10px",
    background: "#00ffcc",
    border: "none",
    cursor: "pointer",
  },

loadingText: {
  color: "white",
  marginTop: "15px",
  fontSize: "1.1rem",
},
loaderOverlay: {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.75)",
  backdropFilter: "blur(8px)",

  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  zIndex: 9999,
},

loaderCard: {
  width: "320px",
  padding: "30px",
  borderRadius: "20px",

  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(20px)",

  border: "1px solid rgba(255,255,255,0.15)",

  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "12px",

  boxShadow: "0 0 30px rgba(0,198,255,0.2)",
},

spinner: {
  width: "70px",
  height: "70px",
  border: "6px solid rgba(255,255,255,0.2)",
  borderTop: "6px solid #00c6ff",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
},

loaderTitle: {
  color: "white",
  fontSize: "1.4rem",
  marginTop: "10px",
},

loaderSub: {
  color: "rgba(255,255,255,0.7)",
  fontSize: "0.9rem",
},

progressBar: {
  width: "100%",
  height: "8px",
  background: "rgba(255,255,255,0.1)",
  borderRadius: "10px",
  overflow: "hidden",
  marginTop: "10px",
},

progressFill: {
  width: "40%",
  height: "100%",
  background: "linear-gradient(90deg,#00c6ff,#0072ff)",
  animation: "moveBar 1.2s infinite",
},
};