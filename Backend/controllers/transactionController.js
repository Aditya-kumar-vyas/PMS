const Transaction = require("../models/Transactions");
const moment = require('moment'); 

const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

// Get all transactions
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: 1 }); // Sort by date in ascending order
    // Format the date field for each transaction

     const formattedTransactions = transactions.map(txn => {   
      const plainTxn = txn.toObject();
      plainTxn.date = moment.utc(txn.date).format('DD-MMM-YY');   
      return plainTxn;
    });
    res.json(formattedTransactions);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


// Add a transaction
const addTransaction = async (req, res) => {
  try {
    const newTransaction = new Transaction(req.body);
    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(400).json({ message: "Invalid Data" });
  }
};

//upload transactions by xlsx file
const uploadTransactions = async (req, res) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an Excel file" });
    }

    const filePath = req.file.path;
    // console.log("Processing file:", filePath);

    // Read Excel file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    console.log("Parsed data sample:", data[0]); // For debugging

    // Transform data
    const transactions = data.map((row) => {
      // Parse date from "DD-MMM-YY" format
      const dateStr = row["Date"];
      const [day, monthStr, yearStr] = dateStr.split("-");
      const months = {
        "Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "May": 4, "Jun": 5,
        "Jul": 6, "Aug": 7, "Sep": 8, "Oct": 9, "Nov": 10, "Dec": 11
      };
      const year = 2000 + parseInt(yearStr); // Assuming 20xx year
      const date = new Date(year, months[monthStr], parseInt(day));

      return {
        date: date,
        refNo: row["Ref no"],
        account: row["Account"],
        instrument: row["Instrument"],
        product: row["Product"],
        securityCode: row["Security code"],
        txnType: row["Txn type"],
        quantity: row["Quantity"] ? Number(row["Quantity"]) : null,
        price: row["Price"] ? Number(row["Price"]) : null,
        amount: row["Amount"] ? Number(row["Amount"]) : null,
        brokerage: row["Brokerage"] ? Number(row["Brokerage"]) : null,
        tax: row["Tax"] ? Number(row["Tax"]) : null
      };
    });


    // Insert into database
    await Transaction.insertMany(transactions);

    // Cleanup: remove uploaded file
    fs.unlinkSync(filePath);

    res.status(201).json({ 
      message: "Transactions uploaded successfully",
      count: transactions.length,
      firstRecord: transactions[0] // For verification
    });

  } catch (error) {
    console.error("Upload error:", error);
    
    // Cleanup: remove uploaded file if it exists
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ 
      message: "Error uploading transactions", 
      error: error.message
    });
  }
};




module.exports = { getTransactions, addTransaction ,uploadTransactions};
