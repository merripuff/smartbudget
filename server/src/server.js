require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth.routes");
const transactionsRoutes = require("./routes/transactions.routes");

const app = express();

/**
 * CORS:
 * - lokalnie: Live Server
 * - produkcyjnie: Vercel
 */
const allowedOrigins = [
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://smartbudget-delta.vercel.app" // <- podmień po deployu frontendu
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Render/monitoring czasem nie wysyła Origin — pozwalamy
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) return callback(null, true);

      return callback(new Error("CORS blocked for origin: " + origin));
    }
  })
);

app.options("*", cors());

app.use(express.json());

/**
 * Root route — żeby Render nie pokazywał "Cannot GET /"
 */
app.get("/", (req, res) => {
  res.send("SmartBudget API działa. Sprawdź /api/health");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "SmartBudget API działa" });
});

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionsRoutes);

async function start() {
  // Na Render zmienne są w Environment Variables, a nie w pliku .env
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
