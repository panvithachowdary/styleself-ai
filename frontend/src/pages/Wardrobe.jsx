import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

function Wardrobe() {
  const [items, setItems] = useState([]);
  const [occasion, setOccasion] = useState("");
  const [suggestion, setSuggestion] = useState("");
const [selectedLook, setSelectedLook] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  const loadWardrobe = async () => {
    const res = await axios.get(`http://localhost:5000/api/wardrobe/${user._id}`);
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
    const imageBase64 = await convertToBase64(imageFile);

    const newItem = {
      userId: user._id,
      image: imageBase64,
      category: form.get("category"),
      color: form.get("color"),
      size: form.get("size"),
      style: form.get("style"),
      occasion: form.get("occasion")
    };

    await axios.post("http://localhost:5000/api/wardrobe/add", newItem);

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
  
    const top = items.find((i) => i.category.toLowerCase().includes("top"));
    const bottom = items.find((i) => i.category.toLowerCase().includes("bottom"));
    const dress = items.find((i) => i.category.toLowerCase().includes("dress"));
  
    if (dress) {
      setSelectedLook([dress]);
      setSuggestion(
        `For ${occasion}, wear your ${dress.color} ${dress.style} dress. This look is selected from your saved wardrobe.`
      );
    } else if (top && bottom) {
      setSelectedLook([top, bottom]);
      setSuggestion(
        `For ${occasion}, pair your ${top.color} ${top.style} top with your ${bottom.color} ${bottom.style} bottom. This outfit is created only from your wardrobe.`
      );
    } else {
      setSelectedLook([items[0], items[1]]);
      setSuggestion(
        `For ${occasion}, combine these two wardrobe items for a balanced look.`
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card large-card">
        <h1>Style from My Wardrobe</h1>
        <p>Upload or capture your clothes and get outfit combinations from your own wardrobe.</p>

        <input
          placeholder="Occasion to style for"
          value={occasion}
          onChange={(e) => setOccasion(e.target.value)}
        />

        <form onSubmit={addItem} className="form-grid">
        <label className="upload-box">
  📷 Upload / Capture Clothing Photo
  <input
    type="file"
    name="image"
    accept="image/*"
    capture="environment"
    required
  />
  <p style={{ fontSize: "13px", marginTop: "6px", color: "#666" }}>
  On mobile: opens camera 📷 | On desktop: upload image
</p>
</label>
          <input name="category" placeholder="Category: top, bottom, dress" required />
          <input name="color" placeholder="Color" required />
          <input name="size" placeholder="Size" required />
          <input name="style" placeholder="Style: casual, ethnic, formal" required />
          <input name="occasion" placeholder="Suitable occasion" required />
          <button type="submit">Add Wardrobe Item</button>
        </form>

        <button onClick={suggestOutfit}>Suggest Outfit From My Wardrobe</button>

        {suggestion && (
  <div className="style-explain">
    <h3>Suggested Wardrobe Look</h3>

    <div className="selected-look-grid">
      {selectedLook.map((item, index) => (
        <div className="wardrobe-card" key={index}>
          <img src={item.image} alt={item.category} />
          <h3>{item.category}</h3>
          <p>{item.color} • {item.size}</p>
          <p>{item.style} • {item.occasion}</p>
        </div>
      ))}
    </div>

    <p>{suggestion}</p>
  </div>
)}

        <div className="wardrobe-grid">
          {items.map((item, index) => (
            <div className="wardrobe-card" key={index}>
              <img src={item.image} alt={item.category} />
              <h3>{item.category}</h3>
              <p>{item.color} • {item.size}</p>
              <p>{item.style} • {item.occasion}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Wardrobe;