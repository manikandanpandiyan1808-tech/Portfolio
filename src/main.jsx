import React from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "framer-motion";
import App from "./App.jsx";
import { Admin } from "./admin/Admin.jsx";
import { PortfolioProvider } from "./data/PortfolioProvider";
import { defaultPortfolio } from "./data/portfolio";
import "./styles.css";

const isAdmin = window.location.pathname.replace(/\/+$/, "").endsWith("/admin");

if (import.meta.env.DEV && !isAdmin) {
  const { profile } = defaultPortfolio;
  const placeholders = [];
  if (profile.email.includes("example.com")) placeholders.push("email");
  if (profile.github === "https://github.com/") placeholders.push("GitHub URL");
  if (profile.linkedin === "https://linkedin.com/") {
    placeholders.push("LinkedIn URL");
  }

  if (placeholders.length > 0) {
    console.warn(
      `[portfolio] Update ${placeholders.join(", ")} in the admin dashboard or data/portfolio.json`
    );
  }
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {isAdmin ? (
      <Admin />
    ) : (
      <PortfolioProvider>
        <MotionConfig reducedMotion="user">
          <App />
        </MotionConfig>
      </PortfolioProvider>
    )}
  </React.StrictMode>
);
