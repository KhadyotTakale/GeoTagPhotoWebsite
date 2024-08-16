import React, { useState } from "react";
import "./Home.css";
import img1 from "/src/assets/img1.png";

const Home = () => {
  return (
    <>
      <div className="container">
        <div className="geotag">
          <h1>Welcome To Photo GeoTagging Website</h1>
        </div>
        <div className="geotagimage">
          <img src={img1} alt="geotag" />
        </div>
      </div>

      <div className="info">
        <div className="info1">info1</div>
        <div className="info2">info2</div>
        <div className="info3">info3</div>
      </div>
    </>
  );
};

export default Home;
