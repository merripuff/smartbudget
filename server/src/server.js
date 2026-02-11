require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth.routes");
const transactionsRoutes = require("./routes/transactions.routes");

const app = express();

/**
 * CORS:
 * - lokalnie: Live Server / inne porty
 * - produkcyjnie: Vercel
 */
const allowedOrigins = [
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://smartbudget-delta.vercel.app"
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    if (origin.endsWith(".vercel.app")) return callback(null, true);


    return callback(null, false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

app.options("/*", cors(corsOptions));

app.use(express.json());


app.get("/", (req, res) => {
  res.send("SmartBudget API działa. Sprawdź /api/health");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "SmartBudget API działa" });
});

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionsRoutes);

async function start() {
  if (!process.env.MONGODB_URI) throw new Error("Brak MONGODB_URI (Render Env Vars / .env lokalnie)");
  if (!process.env.JWT_SECRET) throw new Error("Brak JWT_SECRET (Render Env Vars / .env lokalnie)");

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ Connected to MongoDB");

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log("✅ Server running on port", PORT));
}

start().catch((e) => {
  console.error("❌ Startup error:", e.message);
  process.exit(1);
});
