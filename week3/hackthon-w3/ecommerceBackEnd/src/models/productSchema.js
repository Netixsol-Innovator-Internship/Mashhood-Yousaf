const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true }, // link from Cloudinary or other storage
    category: { type: String, required: true, trim: true, lowercase: true }, //  REQUIRED for grouping
    origin: { type: String, enum: ["india", "japan", "iran", "southAfrica"],  required: true, },
    flavor: { type: String, enum: ["spice", "sweet", "citrus", "smooth","fruity","floral","minty","bitter","creamy"],  required: true, },
    qualities: { type: String, enum: ["detox", "energy", "relax", "digestion" ],  required: true, },
    caffeine: { type: String, enum: ["low", "high", "medium", "no" ],  required: true, },
    allergens: { type: String, enum: ["lactose", "gluten", "nuts", "soy" ],  required: true, },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
