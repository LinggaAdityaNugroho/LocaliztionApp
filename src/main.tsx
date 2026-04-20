import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./app.css";
import { ThemeProvider } from "./components/themes/themes-provider";
import { GoogleOAuthProvider } from "@react-oauth/google";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
