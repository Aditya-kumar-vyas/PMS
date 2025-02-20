const mongoose = require('mongoose');
mongoose.set("strictQuery", false);


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, { });
    console.log('MongoDB Connected...');
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
