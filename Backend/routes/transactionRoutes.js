const express = require("express");
const { getTransactions, addTransaction ,uploadTransactions} = require("../controllers/transactionController");
const multer = require("multer");

const router = express.Router();



// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  const upload = multer({ storage: storage });
  


router.get("/", getTransactions);
router.post("/upload", upload.single("file"), uploadTransactions);
router.post("/", addTransaction);

module.exports = router;
