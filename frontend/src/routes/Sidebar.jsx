import React from "react";
import { Link } from "react-router-dom";
import addimage from "../assets/addimage.png";
import listimage from "../assets/listimage.png";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to={"/uploadimg"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <img src={addimage} alt="" />
          <p>Add Images</p>
        </div>
      </Link>
      <Link to={"/listimages"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <img src={listimage} alt="" />
          <p>List Images</p>
        </div>
      </Link>
    </div>
  );
};

export default Sidebar;
