import { useState } from "react";
import axios from "axios";
import "../App.css";

function BuyOutfit() {
  const [occasion, setOccasion] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [styleData, setStyleData] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const generateOutfit = async () => {
    if (!occasion) {
      alert("Please enter an occasion");
      return;
    }

    setLoading(true);
    setStyleData(null);

    // 🔥 FIX: normalize budget
    const cleanBudget =
      budget && !budget.toLowerCase().includes("under")
        ? `under ${budget}`
        : budget;

    try {
      const styleRes = await axios.post(
        "http://localhost:5000/api/style/generate",
        {
          type: "Buy a new outfit",
          occasion,
          user,
          itemDetails: `Budget: ${
            cleanBudget || user?.budget || "No budget specified"
          }`
        }
      );

      const budgetText = cleanBudget || user?.budget || "";

      const productsWithImages = await Promise.all(
        styleRes.data.products.map(async (item) => {
          const shopRes = await axios.get(
            "http://localhost:5000/api/shopping/search",
            {
              params: {
                // 🔥 STRONG budget enforcement in search
                q: `${item.searchQuery} ${budgetText} affordable India under ${budgetText}`
              }
            }
          );

          return {
            ...item,
            shoppingTitle: shopRes.data?.title,
            price: shopRes.data?.price,
            image: shopRes.data?.image,
            link: shopRes.data?.link
          };
        })
      );

      setStyleData({
        ...styleRes.data,
        products: productsWithImages
      });
    } catch (err) {
      alert("Error generating outfit");
    }

    setLoading(false);
  };

  const saveOutfit = async () => {
    if (!styleData) {
      alert("Generate an outfit first");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/saved/add", {
        userId: user._id,
        title: styleData.title,
        products: styleData.products
      });

      alert("Outfit saved ❤️");
    } catch (err) {
      alert("Error saving outfit");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card large-card">
        <h1>Buy a New Outfit</h1>
        <p>Get personalized outfit recommendations with real shopping images.</p>

        <input
          placeholder="Enter occasion, example: interview, wedding"
          value={occasion}
          onChange={(e) => setOccasion(e.target.value)}
        />

        <input
          placeholder="Budget, example: under 2000"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />

        <button onClick={generateOutfit} disabled={loading}>
          {loading ? "✨ Styling your look..." : "Generate Outfit"}
        </button>

        {/* 🔥 Loading Skeleton */}
        {loading && (
          <div className="pinterest-grid">
            {[1, 2, 3, 4].map((_, i) => (
              <div className="pinterest-card skeleton" key={i}>
                <div className="skeleton-img"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text small"></div>
              </div>
            ))}
          </div>
        )}

        {styleData && (
          <div className="recommendation-section">
            <h2>{styleData.title}</h2>
            <p className="style-note">{styleData.summary}</p>

            <button onClick={saveOutfit}>Save Outfit ❤️</button>

            {user?.pinterest && (
              <div className="pinterest-box">
                <h3>Pinterest Style Reference</h3>
                <a href={user.pinterest} target="_blank" rel="noreferrer">
                  Open Pinterest Board
                </a>
              </div>
            )}

            <div className="pinterest-grid">
              {styleData.products?.map((item, index) => (
                <div className="pinterest-card" key={index}>
                  <img
                    src={
                      item.image ||
                      `https://placehold.co/400x500/f5d7e8/25112e?text=${encodeURIComponent(
                        item.name
                      )}`
                    }
                    alt={item.name}
                  />

                  <div className="pinterest-card-content">
                    <h3>{item.shoppingTitle || item.name}</h3>
                    <p>{item.type}</p>

                    {item.price && <p>{item.price}</p>}

                    <a
                      href={
                        item.link ||
                        `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(
                          item.searchQuery
                        )}`
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Product
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="style-explain">
              <h3>Makeup</h3>
              <p>{styleData.makeup}</p>

              <h3>Hairstyle</h3>
              <p>{styleData.hairstyle}</p>

              <h3>Why it suits you</h3>
              <p>{styleData.whyItSuits}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BuyOutfit;