import { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

const ProductCard = ({ item }) => {
  const [data, setData] = useState(null);
  const [loadingImage, setLoadingImage] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          "https://styleself-backend.onrender.com/api/shopping/search",
          {
            params: { q: item.searchQuery }
          }
        );

        setData(res.data);
      } catch (err) {
        console.log(err);
      }

      setLoadingImage(false);
    };

    fetchProduct();
  }, [item.searchQuery]);

  return (
    <div className="pinterest-card">
      {loadingImage ? (
        <div className="image-placeholder">Loading image...</div>
      ) : data?.image ? (
        <img src={data.image} alt={item.name} />
      ) : (
        <div className="image-placeholder">{item.name}</div>
      )}

      <div className="pinterest-card-content">
        <p className="outfit-category">{item.type}</p>
        <h3>{data?.title || item.name}</h3>
        {data?.price && <p>{data.price}</p>}

        <a
          href={
            data?.link ||
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
  );
};

function CompleteLook() {
  const [occasion, setOccasion] = useState("");
  const [textInput, setTextInput] = useState("");
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [budget, setBudget] = useState(1500);

  const user = JSON.parse(localStorage.getItem("user"));

  const generateLook = async () => {
    if (!occasion) {
      alert("Enter occasion");
      return;
    }

    if (!textInput && !image) {
      alert("Describe your item or upload/capture an image");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post(
        "https://styleself-backend.onrender.com/api/style/generate",
        {
          type: "Complete the look",
          occasion,
          user,
          itemDetails: `
User description: ${textInput || "No text description"}
User image provided: ${image ? "Yes" : "No"}
Budget: under ${budget}
`
        }
      );

      setResult(res.data);
    } catch (err) {
      alert("Error generating look");
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card large-card">
        <p className="eyebrow">SMART PAIRING</p>
        <h1>Complete the Look</h1>
        <p>
          Describe or capture one clothing item. StyleSelf will suggest matching
          pieces to complete your outfit.
        </p>

        <input
          placeholder="Occasion, example: college fest, party, office"
          value={occasion}
          onChange={(e) => setOccasion(e.target.value)}
        />

        <input
          placeholder="Describe your item, example: black crop top"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
        />

        <div className="budget-box">
          <label>Budget: ₹{budget}</label>
          <input
            type="range"
            min="500"
            max="8000"
            step="500"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </div>

        <label className="upload-box">
          Upload / Capture Item Photo
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>

        <p className="upload-hint">
          On mobile: opens camera | On desktop: upload image
        </p>

        {image && (
          <img
            src={URL.createObjectURL(image)}
            alt="preview"
            className="preview-img"
          />
        )}

        <button onClick={generateLook} disabled={loading}>
          {loading ? "Completing Look..." : "Complete Look"}
        </button>

        {loading && (
          <div className="generating">
            <div className="gen-spinner"></div>
            <p>Finding matching pieces...</p>
          </div>
        )}

        {result && (
          <div className="recommendation-section">
            <h2>{result.title}</h2>
            <p className="style-note">{result.summary}</p>

            <div className="pinterest-grid">
              {result.products?.map((item, index) => (
                <ProductCard key={index} item={item} />
              ))}
            </div>

            <div className="style-explain">
              <h3>Makeup</h3>
              <p>{result.makeup}</p>

              <h3>Hairstyle</h3>
              <p>{result.hairstyle}</p>

              <h3>Why it suits you</h3>
              <p>{result.whyItSuits}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CompleteLook;