import { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

const ProductCard = ({ item }) => {
  const [data, setData] = useState(null);
  const [loadingImage, setLoadingImage] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/shopping/search", {
          params: { q: item.searchQuery }
        });

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
        <h3>{data?.title || item.name}</h3>
        <p>{item.type}</p>

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
          View Product
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
  const [budget, setBudget] = useState("");

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
      const res = await axios.post("http://localhost:5000/api/style/generate", {
        type: "Complete the look",
        occasion,
        user,
        itemDetails: `
User description: ${textInput || "No text description"}
User image provided: ${image ? "Yes" : "No"}
Budget: ${budget || user?.budget || "No budget specified"}
`
      });

      setResult(res.data);
    } catch (err) {
      alert("Error generating look");
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card large-card">
        <h1>Complete the Look</h1>
        <p>Describe or capture one clothing item and get matching products.</p>

        <input
          placeholder="Occasion, example: party, college, office"
          value={occasion}
          onChange={(e) => setOccasion(e.target.value)}
        />

        <input
          placeholder="Describe your item, example: black crop top"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
        />

        <input
          placeholder="Budget, example: under 1500"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />

        <label className="upload-box">
          📷 Upload / Capture Item Photo
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>

        <p className="upload-hint">
          On mobile: opens camera 📷 | On desktop: upload image
        </p>

        <button onClick={generateLook} disabled={loading}>
          {loading ? "Completing Look..." : "Complete Look"}
        </button>

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