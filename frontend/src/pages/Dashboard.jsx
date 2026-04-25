import { useNavigate } from "react-router-dom";
import "../App.css";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="auth-card large-card">
        <h1>StyleSelf</h1>
        <button
  onClick={() => {
    localStorage.clear();
    window.location.href = "/login";
  }}
>
  Logout
</button>
        <p>What occasion do you want to style for?</p>

        <input placeholder="Enter occasion (e.g. wedding, party, office)" />

        <div className="options">
          <div className="option-card" onClick={() => navigate("/buy-outfit")}>
            <h3>Buy a New Outfit</h3>
            <p>Get full outfit with shopping links</p>
          </div>

          <div className="option-card" onClick={() => navigate("/wardrobe")}>
            <h3>Style from My Wardrobe</h3>
            <p>Use clothes you already own</p>
          </div>

          <div className="option-card" onClick={() => navigate("/complete-look")}>
            <h3>Complete the Look</h3>
            <p>Upload one item and complete it</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;