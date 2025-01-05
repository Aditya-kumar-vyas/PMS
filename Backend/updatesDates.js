const Transaction = require("./models/Transactions");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, { });
    console.log('MongoDB Connected...');
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

const updateDates = async () => {
  try {
    const transactions = await Transaction.find();
    for (const txn of transactions) {
      const parsedDate = new Date(txn.date); // Update this logic if the date format isn't directly parseable
      txn.date = parsedDate;
      await txn.save();
    }
    console.log("Dates updated successfully");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

connectDB().then(updateDates);
