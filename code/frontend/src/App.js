import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [backendStatus, setBackendStatus] = useState("checking...");
  const [aiStatus, setAiStatus] = useState("checking...");
  const [algoStatus, setAlgoStatus] = useState("checking...");

  useEffect(() => {
    // Check backend health
    axios
      .get("/api/health")
      .then(() => setBackendStatus("connected"))
      .catch(() => setBackendStatus("disconnected"));

    // Check AI backend health
    axios
      .get("http://localhost:8001/health")
      .then(() => setAiStatus("connected"))
      .catch(() => setAiStatus("disconnected"));

    // Check Algo backend health
    axios
      .get("http://localhost:8002/health")
      .then(() => setAlgoStatus("connected"))
      .catch(() => setAlgoStatus("disconnected"));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>PAX Underwriting Platform</h1>
        <div className="status-container">
          <div className="status-item">
            <span>Backend: </span>
            <span className={`status ${backendStatus}`}>{backendStatus}</span>
          </div>
          <div className="status-item">
            <span>AI Service: </span>
            <span className={`status ${aiStatus}`}>{aiStatus}</span>
          </div>
          <div className="status-item">
            <span>Algo Service: </span>
            <span className={`status ${algoStatus}`}>{algoStatus}</span>
          </div>
        </div>
        <p>Welcome to the PAX Underwriting Application</p>
      </header>
    </div>
  );
}

export default App;
