const mongoose = require("mongoose");
const colors = require("colors");

mongoose.set("strictQuery", true, "useNewUrlParser", true);

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_CONNECT);
      
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1); // Exit with a non-zero status code to indicate an error
  }
};

module.exports = dbConnect;
