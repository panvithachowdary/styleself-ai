import { Link } from "react-router-dom";
import "../App.css";

function Home() {
  const isLoggedIn = localStorage.getItem("token");

  return (
    <div className="luxury-home">
      <section className="hero-left">
        <p className="eyebrow">AI-POWERED PERSONAL STYLING</p>

        <h1>
          Your style, <br />
          <span>elevated.</span>
        </h1>

        <p className="hero-text">
          StyleSelf curates complete outfits tailored to your body, budget,
          wardrobe, and occasion — powered by AI, refined by taste.
        </p>

        <div className="hero-actions">
          {isLoggedIn ? (
            <Link to="/dashboard" style={{ textDecoration: "none" }}>
            <button className="primary-btn">
              Go to Dashboard
            </button>
          </Link>
          ) : (
            <>
              <Link to="/register" className="primary-btn">
                Get Started
              </Link>
              <Link to="/login" className="secondary-btn">
                Sign In
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="hero-right">
        <div className="style-card">
          <div className="circle-badge">AI STYLED</div>
          <div className="icon-box">✦</div>
          <p className="small-title">TODAY&apos;S PICK</p>
          <h2>Business Casual</h2>
          <h2>Interview Look</h2>
        </div>

        <div className="mini-row">
          <div className="mini-card">
            <div className="mini-circle"></div>
            <p>SHOES</p>
          </div>
          <div className="mini-card">
            <div className="mini-square"></div>
            <p>BAG</p>
          </div>
          <div className="mini-card">
            <div className="mini-line"></div>
            <p>DETAILS</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;