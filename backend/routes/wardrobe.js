const express = require("express");
const router = express.Router();
const Wardrobe = require("../models/Wardrobe");

// add wardrobe item
router.post("/add", async (req, res) => {
  try {
    const item = new Wardrobe(req.body);
    await item.save();
    res.json({ message: "Wardrobe item saved", item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get wardrobe items by user
router.get("/:userId", async (req, res) => {
  try {
    const items = await Wardrobe.find({ userId: req.params.userId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;