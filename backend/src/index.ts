// Tutor Marketplace Backend API
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import routes from "@/routes/index.js";

import { createServer } from "http";
import { initializeSocket } from "@/utils/socket.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize Socket.io
initializeSocket(httpServer);

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "x-user-id", "Authorization"]
}));
app.use(express.json());

// API Routes
app.use("/api", routes);

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Tutor Marketplace API is running" });
});

httpServer.listen(PORT, () => {
  console.log(`Tutor Backend running on http://localhost:${PORT}`);
});
