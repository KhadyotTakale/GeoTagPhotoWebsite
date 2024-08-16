import React, { useState } from "react";
import { useGeolocated } from "react-geolocated";
import "./UploadImg.css";
import img2 from "/src/assets/img2.svg"; // Import the image
import exifr from "exifr";

const UploadImg = () => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [imageData, setImageData] = useState([]);

  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: true,
      },
      userDecisionTimeout: 5000,
    });

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const uploadTime = new Date().toLocaleString(); // Capture upload time

    const newImages = files.map((file, index) => ({
      name: `img${uploadedImages.length + index + 1}`,
      file: file,
      uploadTime, // Add upload time
    }));

    // Add new images to the uploaded images list
    setUploadedImages((prevImages) => [...prevImages, ...newImages]);

    // Generate preview URLs for the images
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prevPreviews) => [...prevPreviews, ...newPreviews]);

    // Extract EXIF data asynchronously
    const exifPromises = files.map(async (file) => {
      try {
        const data = await exifr.parse(file);
        const latitude = data.latitude || (coords ? coords.latitude : "N/A");
        const longitude = data.longitude || (coords ? coords.longitude : "N/A");
        const dateTime = data.DateTimeOriginal
          ? new Date(data.DateTimeOriginal).toLocaleString()
          : uploadTime; // Use upload time if EXIF date is not available

        return {
          latitude,
          longitude,
          dateTime,
        };
      } catch (error) {
        console.error("Error parsing EXIF data:", error);
        return {
          latitude: coords ? coords.latitude : "N/A",
          longitude: coords ? coords.longitude : "N/A",
          dateTime: uploadTime, // Use upload time if error occurs
        };
      }
    });

    // Update image data after all promises resolve
    const newImageData = await Promise.all(exifPromises);
    setImageData((prevData) => [...prevData, ...newImageData]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Uploaded images:", uploadedImages);
    console.log("Extracted image data:", imageData);
  };

  return (
    <div className="upload-container">
      <img src={img2} alt="Upload" className="upload-icon" />
      <h2>Upload an Image</h2>
      <form onSubmit={handleSubmit}>
        <div className="upload-section">
          <label htmlFor="imageUpload">Select Images:</label>
          <input
            type="file"
            id="imageUpload"
            multiple
            onChange={handleFileChange}
            required
          />
        </div>
        <button type="submit" className="upload-button">
          Upload
        </button>
      </form>
      {uploadedImages.length > 0 && (
        <div className="image-preview-section">
          <h3>Your Uploaded Images:</h3>
          <table className="image-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {uploadedImages.map((image, index) => (
                <tr key={index}>
                  <td>
                    <img
                      src={previewImages[index]}
                      alt={`Preview of ${image.name}`}
                      className="preview-img"
                    />
                  </td>
                  <td>{imageData[index]?.latitude || "N/A"}</td>
                  <td>{imageData[index]?.longitude || "N/A"}</td>
                  <td>{imageData[index]?.dateTime || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!isGeolocationEnabled && (
        <p>Please enable geolocation in your browser to use this feature.</p>
      )}
    </div>
  );
};

export default UploadImg;
