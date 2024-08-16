import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import logo from "/src/assets/logo.png";
const Navbar = () => {
  return (
    <div>
      <header className="header">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
        <nav className="navbar">
          <Link to="/">HOME</Link>
          <Link to="/login">LOGIN</Link>
          <Link to="/aboutus">ABOUT US</Link>
          <Link to="/contact">CONTACT </Link>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
