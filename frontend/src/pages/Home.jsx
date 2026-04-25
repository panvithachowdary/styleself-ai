import { Link } from "react-router-dom";
import "../App.css";

function Home() {
  return (
    <div className="home">
      <div className="home-content">
        <h1>Style Yourself Smartly</h1>
        <p>
          AI-powered fashion assistant that helps you choose outfits,
          style from your wardrobe, and complete your look effortlessly.
        </p>

        <div className="home-buttons">
          <Link to="/register" className="btn">
            Get Started
          </Link>
          <Link to="/login" className="btn outline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;