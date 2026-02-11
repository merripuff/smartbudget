const express = require("express");
const Transaction = require("../models/Transaction");
const { auth } = require("../middleware/auth");

const router = express.Router();

// GET /api/transactions?type=&category=&from=&to=
router.get("/", auth, async (req, res) => {
  const { type, category, from, to } = req.query;

  const q = { userId: req.user.userId };

  if (type === "income" || type === "expense") q.type = type;
  if (category) q.category = category;

  if (from || to) {
    q.date = {};
    if (from) q.date.$gte = from;
    if (to) q.date.$lte = to;
  }

  const items = await Transaction.find(q).sort({ date: -1, createdAt: -1 });
  res.json(items);
});

router.post("/", auth, async (req, res) => {
  const { type, amount, category, note = "", date } = req.body;

  if (!type || !amount || !category || !date) {
    return res.status(400).json({ message: "type, amount, category, date required" });
  }
  if (!["income", "expense"].includes(type)) {
    return res.status(400).json({ message: "Invalid type" });
  }

  const num = Number(amount);
  if (!Number.isFinite(num) || num <= 0) {
    return res.status(400).json({ message: "Amount must be > 0" });
  }

  const created = await Transaction.create({
    userId: req.user.userId,
    type,
    amount: num,
    category: String(category).trim(),
    note: String(note || "").trim(),
    date
  });

  res.status(201).json(created);
});

router.put("/:id", auth, async (req, res) => {
  const { id } = req.params;

  const tx = await Transaction.findOne({ _id: id, userId: req.user.userId });
  if (!tx) return res.status(404).json({ message: "Not found" });

  const { type, amount, category, note, date } = req.body;

  if (type && ["income", "expense"].includes(type)) tx.type = type;
  if (amount !== undefined) {
    const num = Number(amount);
    if (!Number.isFinite(num) || num <= 0) return res.status(400).json({ message: "Amount must be > 0" });
    tx.amount = num;
  }
  if (category !== undefined) tx.category = String(category).trim();
  if (note !== undefined) tx.note = String(note).trim();
  if (date !== undefined) tx.date = date;

  await tx.save();
  res.json(tx);
});

router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;

  const deleted = await Transaction.findOneAndDelete({ _id: id, userId: req.user.userId });
  if (!deleted) return res.status(404).json({ message: "Not found" });

  res.json({ ok: true });
});

module.exports = router;
