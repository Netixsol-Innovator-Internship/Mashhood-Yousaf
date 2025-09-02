const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://mashhood:ecommereTeaProject@ecommereteacluster.idfk6bn.mongodb.net/test?retryWrites=true&w=majority&appName=ecommereTeaCluster`
    );
    console.log("Database Connected");
  } catch (err) {
    console.error("Error while connecting database:", err);
  }
};

module.exports = connectDB;
