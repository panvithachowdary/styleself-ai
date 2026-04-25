import { useState } from "react";
import "../App.css";

function Profile() {
  const userData = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState(userData);
  const [editing, setEditing] = useState(false);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const saveChanges = () => {
    localStorage.setItem("user", JSON.stringify(user));
    setEditing(false);
    alert("Profile updated ✅");
  };

  return (
    <div className="auth-page">
      <div className="auth-card large-card">
        <h1>My Profile</h1>
        <p>View and update your personal styling details.</p>

        <div className="form-grid">
          <input
            name="name"
            value={user.name || ""}
            onChange={handleChange}
            disabled={!editing}
            placeholder="Name"
          />

          <input
            name="gender"
            value={user.gender || ""}
            onChange={handleChange}
            disabled={!editing}
            placeholder="Gender"
          />

          <input
            name="skinTone"
            value={user.skinTone || ""}
            onChange={handleChange}
            disabled={!editing}
            placeholder="Skin Tone"
          />

          <input
            name="bodyType"
            value={user.bodyType || ""}
            onChange={handleChange}
            disabled={!editing}
            placeholder="Body Type"
          />

          <input
            name="bodyShape"
            value={user.bodyShape || ""}
            onChange={handleChange}
            disabled={!editing}
            placeholder="Body Shape"
          />

          <input
            name="height"
            value={user.height || ""}
            onChange={handleChange}
            disabled={!editing}
            placeholder="Height"
          />

          <input
            name="size"
            value={user.size || ""}
            onChange={handleChange}
            disabled={!editing}
            placeholder="Size"
          />

          <input
            name="budget"
            value={user.budget || ""}
            onChange={handleChange}
            disabled={!editing}
            placeholder="Budget"
          />

          <input
            name="aesthetics"
            value={user.aesthetics || ""}
            onChange={handleChange}
            disabled={!editing}
            placeholder="Aesthetics"
          />

          <input
            name="pinterest"
            value={user.pinterest || ""}
            onChange={handleChange}
            disabled={!editing}
            placeholder="Pinterest link"
          />
        </div>

        {!editing ? (
          <button onClick={() => setEditing(true)}>Edit Profile</button>
        ) : (
          <button onClick={saveChanges}>Save Changes</button>
        )}
      </div>
    </div>
  );
}

export default Profile;