import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import Home from "./routes/Home";
import Login from "./routes/Login";
import UploadImg from "./routes/UploadImg.jsx";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/uploadimg" element={<UploadImg />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
