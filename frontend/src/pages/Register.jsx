import { useState } from "react";
import axios from "axios";
import "../App.css";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    skinTone: "",
    bodyType: "",
    bodyShape: "",
    height: "",
    size: "",
    topSize: "",
    bottomSize: "",
    shoeSize: "",
    budget: "",
    aesthetics: "",
    pinterest: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const register = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form);
      alert(res.data.message);
      window.location.href = "/login";
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card large-card">
        <h1>StyleSelf</h1>
        <p>Create your personal AI styling profile</p>

        <form onSubmit={register} className="form-grid">
          <input name="name" placeholder="Full Name" onChange={handleChange} required />
          <input name="email" placeholder="Email" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} required />

          <select name="gender" onChange={handleChange}>
            <option value="">Gender</option>
            <option>Female</option>
            <option>Male</option>
            <option>Other</option>
          </select>

          <input name="skinTone" placeholder="Skin tone / color" onChange={handleChange} />
          <input name="bodyType" placeholder="Body type" onChange={handleChange} />
          <input name="bodyShape" placeholder="Body shape" onChange={handleChange} />
          <input name="height" placeholder="Height" onChange={handleChange} />

          <select name="size" onChange={handleChange}>
            <option value="">Overall Size</option>
            <option>XS</option>
            <option>S</option>
            <option>M</option>
            <option>L</option>
            <option>XL</option>
          </select>

          <input name="topSize" placeholder="Top size" onChange={handleChange} />
          <input name="bottomSize" placeholder="Bottom size" onChange={handleChange} />
          <input name="shoeSize" placeholder="Shoe size" onChange={handleChange} />
          <input name="budget" placeholder="Budget range" onChange={handleChange} />
          <input name="aesthetics" placeholder="Preferred aesthetics" onChange={handleChange} />
          <input name="pinterest" placeholder="Pinterest profile / board link" onChange={handleChange} />

          <button type="submit">Create My Style Profile</button>
        </form>

        <p className="switch-text">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Register;