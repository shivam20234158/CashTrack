import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dns from "dns";

dotenv.config();

// DNS configuration for MongoDB Atlas SRV lookup reliability
try {
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
} catch (e) {
  console.warn("Could not override DNS servers:", e.message);
}

import connectDB from "./config/db.config.js";
import authRoutes from "./routes/auth.route.js";
import expenseRoutes from "./routes/expense.route.js";
import incomeRoutes from "./routes/income.route.js";
import budgetRoutes from "./routes/budget.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";

// Initialize Express
const app = express();

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  "http://localhost:3000",
  "https://fin-track-two-rose.vercel.app",
];

// CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header, such as server-to-server requests
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked this origin: ${origin}`)
      );
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parse JSON request bodies
app.use(express.json());

// Connect to MongoDB
connectDB();

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to CashTrack API 🚀",
    status: "online",
    features: [
      "Auth",
      "Expenses",
      "Income",
      "Budgets",
      "Dashboard",
      "Upstash Redis Token Blacklisting",
    ],
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err.message);

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    stack:
      process.env.NODE_ENV === "production"
        ? null
        : err.stack,
  });
});

// Start server
const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`CashTrack Server running on port ${PORT}`);
});