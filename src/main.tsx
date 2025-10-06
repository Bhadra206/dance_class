import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { CourseBranchProvider } from "./pages/CourseBranchContext/CourseBranchContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CourseBranchProvider>
      <App />
    </CourseBranchProvider>
  </StrictMode>
);
