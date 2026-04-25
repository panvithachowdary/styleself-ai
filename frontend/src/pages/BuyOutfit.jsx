import { useState } from "react";
import axios from "axios";
import "../App.css";

function BuyOutfit() {
  const [occasion, setOccasion] = useState("");
  const [budget, setBudget] = useState(2000);
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

    const cleanBudget = `under ${budget}`;

    try {
      const styleRes = await axios.post(
        "https://styleself-backend.onrender.com/api/style/generate",
        {
          type: "Buy a new outfit",
          occasion,
          user,
          itemDetails: `Budget: ${cleanBudget}`
        }
      );

      const productsWithImages = await Promise.all(
        styleRes.data.products.map(async (item) => {
          const shopRes = await axios.get(
            "https://styleself-backend.onrender.com/api/shopping/search",
            {
              params: {
                q: `${item.searchQuery} ${cleanBudget} affordable India`
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
      await axios.post("https://styleself-backend.onrender.com/api/saved/add", {
        userId: user._id,
        title: styleData.title,
        products: styleData.products
      });

      alert("Outfit saved");
    } catch (err) {
      alert("Error saving outfit");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card large-card">
        <p className="eyebrow">AI STYLIST</p>
        <h1>Generate an Outfit</h1>
        <p>
          Type your occasion and select your budget. StyleSelf will create a
          complete look with real shopping links.
        </p>

        <input
          placeholder="Type occasion, example: interview, wedding, party"
          value={occasion}
          onChange={(e) => setOccasion(e.target.value)}
        />

        <div className="budget-box">
          <label>Budget: ₹{budget}</label>
          <input
            type="range"
            min="500"
            max="10000"
            step="500"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </div>

        <button onClick={generateOutfit} disabled={loading}>
          {loading ? "Styling your look..." : "Generate Outfit"}
        </button>

        {loading && (
          <div className="generating">
            <div className="gen-spinner"></div>
            <p>Finding your perfect outfit...</p>
          </div>
        )}

        {styleData && (
          <div className="recommendation-section">
            <h2>{styleData.title}</h2>
            <p className="style-note">{styleData.summary}</p>

            <button onClick={saveOutfit}>Save Outfit</button>

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
                    <p className="outfit-category">{item.type}</p>
                    <h3>{item.shoppingTitle || item.name}</h3>
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
                      Shop Now →
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