import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BuyOutfit from "./pages/BuyOutfit";
import Wardrobe from "./pages/Wardrobe";
import CompleteLook from "./pages/CompleteLook";
import Saved from "./pages/Saved";
import Profile from "./pages/Profile";

const isLoggedIn = localStorage.getItem("token");

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard /> : <Login />}
        />
        <Route
          path="/buy-outfit"
          element={isLoggedIn ? <BuyOutfit /> : <Login />}
        />
        <Route
          path="/wardrobe"
          element={isLoggedIn ? <Wardrobe /> : <Login />}
        />
        <Route
          path="/complete-look"
          element={isLoggedIn ? <CompleteLook /> : <Login />}
        />
<Route path="/saved" element={isLoggedIn ? <Saved /> : <Login />} />
<Route path="/" element={<Home />} />
<Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;