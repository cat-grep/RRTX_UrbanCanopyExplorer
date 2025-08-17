import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  // Note: StrictMode re-runs effects in dev (SceneView init happens twice).
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
