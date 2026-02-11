require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth.routes");
const transactionsRoutes = require("./routes/transactions.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "SmartBudget API działa" });
});

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionsRoutes);

async function start() {
  if (!process.env.MONGODB_URI) throw new Error("Brak MONGODB_URI w server/.env");
  if (!process.env.JWT_SECRET) throw new Error("Brak JWT_SECRET w server/.env");

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ Connected to MongoDB");

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log("✅ Server running on port", PORT));
}

start().catch((e) => {
  console.error("❌ Startup error:", e.message);
  process.exit(1);
});