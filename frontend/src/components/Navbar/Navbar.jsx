import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/logo.png"; // Assuming your path is correct

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // Use navigate to redirect without reloading
  };

  return (
    <div>
      <header className="header">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
        <nav className="navbar">
          <Link to="/">HOME</Link>
          {localStorage.getItem("token") ? (
            <button onClick={handleLogout}>LOGOUT</button>
          ) : (
            <Link to="/login">LOGIN</Link>
          )}
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
