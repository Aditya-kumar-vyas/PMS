const express = require('express');
const path = require('path');
const cors = require("cors");

const dotenv = require('dotenv');
const connectDB = require('./config/db');
const corsOptions = require('./utils/corsOptions');
const credentials = require('./middlewares/credentials');


dotenv.config({ path: "./config/config.env" });
connectDB();

const app = express();
app.use(credentials);

app.use(express.json());
app.use(cors(corsOptions));


const fs = require('fs');
if (!fs.existsSync('uploads')){
    fs.mkdirSync('uploads');
}

app.use('/api/transactions', require('./routes/transactionRoutes'));


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
