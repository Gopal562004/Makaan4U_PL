import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/tailwind.css";
import "./styles/index.css";
import { Analytics } from "@vercel/analytics/react";
import { registerServiceWorker } from "./pwa/registerServiceWorker";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(<App />);

// Register Makaan4U Progressive Web App Service Worker
registerServiceWorker();
