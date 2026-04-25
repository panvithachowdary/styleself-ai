const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,

  gender: String,
  skinTone: String,
  bodyType: String,
  bodyShape: String,
  height: String,

  size: String,
  topSize: String,
  bottomSize: String,
  shoeSize: String,

  budget: String,
  aesthetics: String,
  pinterest: String
});

module.exports = mongoose.model("User", userSchema);