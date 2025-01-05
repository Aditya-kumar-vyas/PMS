const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  date: { type: Date, required: true }, // Change this to Date type
  refNo: { type: String, required: true },
  account: { type: String, required: true },
  instrument: { type: String, required: true },
  product: { type: String },
  securityCode: { type: String },
  txnType: { type: String },
  quantity: { type: Number },
  price: { type: Number },
  amount: { type: Number },
  brokerage: { type: Number },
  tax: { type: Number },
});

module.exports = mongoose.model("Transactions", transactionSchema);
