import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

function Wardrobe() {
  const [items, setItems] = useState([]);
  const [occasion, setOccasion] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [selectedLook, setSelectedLook] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const API = "https://styleself-backend.onrender.com";

  const loadWardrobe = async () => {
    const res = await axios.get(`${API}/api/wardrobe/${user._id}`);
    setItems(res.data);
  };

  useEffect(() => {
    loadWardrobe();
  }, []);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const addItem = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    const imageFile = form.get("image");

    if (!imageFile || imageFile.size === 0) {
      alert("Please upload/capture an image");
      return;
    }

    const imageBase64 = await convertToBase64(imageFile);

    const newItem = {
      userId: user._id,
      image: imageBase64,
      category: form.get("category"),
      color: form.get("color"),
      size: form.get("size"),
      style: form.get("style"),
      occasion: form.get("occasion"),
    };

    await axios.post(`${API}/api/wardrobe/add`, newItem);

    e.target.reset();
    loadWardrobe();
  };

  const suggestOutfit = () => {
    if (!occasion) {
      alert("Enter occasion first");
      return;
    }

    if (items.length < 2) {
      alert("Add at least 2 wardrobe items");
      return;
    }

    const top = items.find((i) =>
      i.category.toLowerCase().includes("top")
    );
    const bottom = items.find((i) =>
      i.category.toLowerCase().includes("bottom")
    );
    const dress = items.find((i) =>
      i.category.toLowerCase().includes("dress")
    );

    if (dress) {
      setSelectedLook([dress]);
      setSuggestion(
        `For ${occasion}, wear your ${dress.color} ${dress.style} dress.`
      );
    } else if (top && bottom) {
      setSelectedLook([top, bottom]);
      setSuggestion(
        `For ${occasion}, pair your ${top.color} ${top.style} top with ${bottom.color} ${bottom.style} bottom.`
      );
    } else {
      setSelectedLook([items[0], items[1]]);
      setSuggestion(`For ${occasion}, combine these items.`);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card large-card">

        <p className="eyebrow">MY CLOSET</p>
        <h1>Style from My Wardrobe</h1>

        <input
          placeholder="Occasion to style for"
          value={occasion}
          onChange={(e) => setOccasion(e.target.value)}
        />

        {/* FORM */}
        <form onSubmit={addItem} className="wardrobe-form">

          <div className="form-full">
            <label className="upload-box">
              Upload / Capture Clothing Photo
              <input
                type="file"
                name="image"
                accept="image/*"
                capture="environment"
                required
              />
            </label>
          </div>

          <input name="category" placeholder="Category" required />
          <input name="color" placeholder="Color" required />
          <input name="size" placeholder="Size" required />
          <input name="style" placeholder="Style" required />
          <input name="occasion" placeholder="Suitable occasion" required />

          {/* ✅ FULL WIDTH BUTTON */}
          <div className="form-full">
            <button type="submit">ADD WARDROBE ITEM</button>
          </div>

        </form>

        {/* ✅ FULL WIDTH SUGGEST BUTTON */}
        <button className="wardrobe-suggest-btn" onClick={suggestOutfit}>
          SUGGEST OUTFIT FROM MY WARDROBE
        </button>

        {/* RESULT */}
        {suggestion && (
          <div className="style-explain">
            <h3>Suggested Look</h3>

            <div className="selected-look-grid">
              {selectedLook.map((item, index) => (
                <div className="wardrobe-card" key={index}>
                  <img src={item.image} alt="" />
                  <h3>{item.category}</h3>
                </div>
              ))}
            </div>

            <p>{suggestion}</p>
          </div>
        )}

        {/* ITEMS */}
        <div className="wardrobe-grid">
          {items.map((item, index) => (
            <div className="wardrobe-card" key={index}>
              <img src={item.image} alt="" />
              <h3>{item.category}</h3>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Wardrobe;