import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Listimage.css"; // Create and use this CSS file for styling
import cross_icon from "../assets/cross_icon.png";

const Listimage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:4000/my-images", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setImages(response.data);
      } catch (err) {
        setError("Failed to fetch images");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const remove_images = async (id) => {
    try {
      await fetch("http://localhost:4000/removeimage", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });

      // Update state to remove the image without refreshing
      setImages(images.filter((image) => image._id !== id));
    } catch (error) {
      console.error("Failed to remove the image:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="list-images">
      <h1>Uploaded Images</h1>
      <div className="list-images-header">
        <p>Image</p>
        <p>Latitude</p>
        <p>Longitude</p>
        <p>Date</p>
        <p>City</p> {/* Added City Column */}
        <p>Remove</p>
      </div>
      {images.length === 0 ? (
        <p>No images found</p>
      ) : (
        images.map((image) => (
          <div key={image._id} className="list-images-item">
            <img
              src={`http://localhost:4000/images/${image.filename}`}
              alt={image.filename}
              className="image-thumbnail"
            />
            <p>{image.latitude}</p>
            <p>{image.longitude}</p>
            <p>{image.dateTime}</p>
            <p>{image.city || "Unknown"}</p> {/* Display City */}
            <img
              onClick={() => remove_images(image._id)} // Use image._id for removal
              src={cross_icon}
              alt="Remove"
              className="remove-icon"
              style={{ cursor: "pointer" }} // Add pointer cursor to indicate clickability
            />
          </div>
        ))
      )}
    </div>
  );
};

export default Listimage;
