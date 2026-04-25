const express = require("express");
const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;

    const url = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(
        q
      )}&gl=in&hl=en&currency=INR&api_key=${process.env.SERPAPI_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    const products = (data.shopping_results || []).slice(0, 1).map((item) => ({
      title: item.title,
      price: item.price,
      image: item.thumbnail,
      link: item.product_link || item.link
    }));

    res.json(products[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;