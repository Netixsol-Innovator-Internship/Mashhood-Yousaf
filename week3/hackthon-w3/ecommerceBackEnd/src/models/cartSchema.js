const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//  Sub-schema  
const cartItemSchema = new Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
      required:true,
      min: 1,
    },
  }
);

//  Main cart schema , this will import 
const cartSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
    unique: true, // Each user has one cart
  },
  items: [cartItemSchema],  
});

module.exports = mongoose.model("Cart", cartSchema);
