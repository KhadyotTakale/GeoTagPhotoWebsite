import React from "react";
import "./Home.css";
import img1 from "/src/assets/img1.png";
import step1 from "/src/assets/step1.png";
import step2 from "/src/assets/step2.png";
import step3 from "/src/assets/step3.png";

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

      <div className="steps">
        <div className="step step1">
          <h2 className="st1">Step1</h2>
          <img src={step1} alt="Step 1" />
        </div>
        <div className="step step2">
          <h2 className="st1">Step2</h2>
          <img src={step2} alt="Step 2" />
        </div>
        <div className="step step3">
          <h2 className="st1">Step3</h2>
          <img src={step3} alt="Step 3" />
        </div>
      </div>
    </>
  );
};

export default Home;
