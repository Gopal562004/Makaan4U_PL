import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import compression from "compression";
import helmet from "helmet";
import cookieParser from "cookie-parser";

// Load env vars
dotenv.config();

// Connect DB
import connectDB from "./config/database.js";

import "./config/cloudinary.js";
import routes from "./routes/index.js";
import { generalLimiter } from "./middlewares/rateLimit.js";
import { expressMiddleware } from "lognexis-node"; 

const app = express();

// Trust the AWS API Gateway proxy to get the real client IP (fixes express-rate-limit error)
app.set("trust proxy", 1);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5173",
  "http://192.168.1.34:3000",
  "http://192.168.1.35:3000",
  "http://172.17.144.1:3000",
  "https://makaan4u-clean.vercel.app",
];

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// CORS
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.includes("localhost") ||
        origin.includes("127.0.0.1")
      ) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// LogNexis API Monitoring SDK
if (process.env.MONITOR_API_KEY) {
  app.use(expressMiddleware({ 
    apiKey: process.env.MONITOR_API_KEY,
    baseUrl: "https://lognexis-node.onrender.com",
    debug: process.env.NODE_ENV === "development"
  }));
}

// Enable GZIP compression
app.use(compression());

// Disable caching for development/dynamic responses
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

// Rate limiter
app.use(generalLimiter);

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", routes);

// Root
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Real Estate API is running!",
    version: "1.0.0",
  });
});

app.get("/cloudinary-status", (req, res) => {
  res.json({
    success: true,
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      hasAllCredentials: !!(
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
      ),
    },
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

app.all("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use((err, req, res, next) => {
  console.error("💥 Server Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "production" ? {} : err.stack,
  });
});

export default app;
