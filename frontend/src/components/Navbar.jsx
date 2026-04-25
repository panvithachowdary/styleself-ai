import { Link } from "react-router-dom";
import "../App.css";

function Navbar() {
  const isLoggedIn = localStorage.getItem("token");

  return (
    <div className="navbar">
      <h2 className="logo">StyleSelf</h2>

      <div className="nav-links">
        {isLoggedIn ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/buy-outfit">Buy Outfit</Link>
            <Link to="/wardrobe">Wardrobe</Link>
            <Link to="/complete-look">Complete Look</Link>
            <Link to="/saved">Saved</Link>
            <Link to="/profile">Profile</Link>
            <button
              className="logout-btn"
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/">Register</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;