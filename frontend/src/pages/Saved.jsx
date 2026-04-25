import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

function Saved() {
  const [data, setData] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchSaved = async () => {
      const res = await axios.get(`https://styleself-backend.onrender.com/api/saved/${user._id}`);
      setData(res.data);
    };

    fetchSaved();
  }, []);

  return (
    <div className="auth-page">
      <div className="auth-card large-card">
        <h1>Saved Outfits</h1>
        <p>Your saved AI outfit recommendations are here.</p>

        {data.length === 0 && <p>No saved outfits yet.</p>}

        {data.map((outfit, index) => (
  <div className="saved-outfit" key={index}>
    <div className="saved-header">
      <h2>{outfit.title}</h2>

      <button
        className="delete-btn"
        onClick={async () => {
          await axios.delete(
            `https://styleself-backend.onrender.com/api/saved/${outfit._id}`
          );

          // refresh list after delete
          setData(data.filter((item) => item._id !== outfit._id));
        }}
      >
        Delete ❌
      </button>
    </div>

    <div className="pinterest-grid">
      {outfit.products?.map((item, i) => (
        <div className="pinterest-card" key={i}>
          <img
            src={
              item.image ||
              `https://placehold.co/400x500?text=${encodeURIComponent(
                item.name
              )}`
            }
            alt={item.name}
          />

          <div className="pinterest-card-content">
            <h3>{item.shoppingTitle || item.name}</h3>
            <p>{item.type}</p>
            {item.price && <p>{item.price}</p>}

            <a href={item.link} target="_blank">
              View Product
            </a>
          </div>
        </div>
      ))}
    </div>
  </div>
))}
      </div>
    </div>
  );
}

export default Saved;