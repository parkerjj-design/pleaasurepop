const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String }, // URL or base64
  rating: { type: Number, default: 5 },
  tags: [String],
  description: { type: String }, // 🆕 New field
  category: { type: String },    // 🆕 New field
}, {
  timestamps: true,
});

module.exports = mongoose.model("Product", productSchema);
