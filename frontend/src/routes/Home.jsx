import React from "react";
import "./Home.css";
import img1 from "/src/assets/img1.png";

const Home = () => {
  return (
    <div className="home-page">
      <div className="home1">
        <h1>Welcome to Photo Geo Tag Website</h1>
        <img className="img" src={img1} alt="" />
      </div>
    </div>
  );
};

export default Home;
