const mongoose = require("mongoose");

const savedOutfitSchema = new mongoose.Schema({
  userId: String,
  title: String,
  products: Array,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("SavedOutfit", savedOutfitSchema);