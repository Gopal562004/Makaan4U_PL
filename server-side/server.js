import apminsight from "apminsight"; // Must be the first import for APM monitoring
import app from "./app.js";
import connectDB from "./config/database.js";
import path from "path";
import { fileURLToPath } from "url";

const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect DB and start server
connectDB()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🌐 LAN: http://192.168.1.34:${PORT}`);
      console.log(`📁 Uploads: ${path.join(__dirname, "uploads")}`);
      console.log(`📊 LogNexis API Monitoring: ACTIVE`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection error on startup:", err.message);
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`⚠️ Server running without DB on http://localhost:${PORT}`);
    });
  });
