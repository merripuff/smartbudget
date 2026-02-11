const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    amount: { type: Number, required: true, min: 0.01 },
    category: { type: String, required: true, trim: true },
    note: { type: String, default: "", trim: true },
    date: { type: String, required: true } // "YYYY-MM-DD"
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
