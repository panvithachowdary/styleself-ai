const express = require("express");
const router = express.Router();
const SavedOutfit = require("../models/SavedOutfit");

// save outfit
router.post("/add", async (req, res) => {
  try {
    const outfit = new SavedOutfit(req.body);
    await outfit.save();
    res.json({ message: "Saved successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get user saved outfits
router.get("/:userId", async (req, res) => {
  const data = await SavedOutfit.find({ userId: req.params.userId });
  res.json(data);
});
// delete outfit
router.delete("/:id", async (req, res) => {
    try {
      await SavedOutfit.findByIdAndDelete(req.params.id);
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

module.exports = router;