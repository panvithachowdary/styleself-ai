const mongoose = require("mongoose");

const wardrobeSchema = new mongoose.Schema({
  userId: String,
  image: String,
  category: String,
  color: String,
  size: String,
  style: String,
  occasion: String
});

module.exports = mongoose.model("Wardrobe", wardrobeSchema);