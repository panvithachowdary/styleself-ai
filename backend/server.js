const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/auth"); // ✅ ADD THIS
const styleRoutes = require("./routes/style");
const wardrobeRoutes = require("./routes/wardrobe");
const shoppingRoutes = require("./routes/shopping");
const savedRoutes = require("./routes/saved");


const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use("/uploads", express.static("uploads"));

// ✅ ADD THIS
app.use("/api/auth", authRoutes);
app.use("/api/style", styleRoutes);
app.use("/api/wardrobe", wardrobeRoutes);
app.use("/api/shopping", shoppingRoutes);
app.use("/api/saved", savedRoutes);


app.get("/", (req, res) => {
  res.json({ message: "StyleSelf backend running" });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});