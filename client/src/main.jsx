import React from "react";
import "./index.css";
import { createRoot } from "react-dom/client";
import App from "./App";
import Bloc from "./Bloc"; // Asegúrate de que este import sea correcto
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="bloc" element={<Bloc />} />{" "}
        {/* Aquí se configura la ruta para Bloc */}
      </Routes>
    </Router>
  </React.StrictMode>
);
