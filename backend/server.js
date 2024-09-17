const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 4000;
const jwtSecret = "your_jwt_secret";

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("express app is running");
});

// MongoDB connection
mongoose.connect(
  "mongodb+srv://khadyottakale:root123@cluster0.oorfy.mongodb.net/photogeotag"
);

// Define User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Define Image Schema
const imageSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  latitude: { type: String },
  longitude: { type: String },
  dateTime: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Image = mongoose.model("Image", imageSchema);

// Multer config for file upload
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

// Serve uploaded images as static files
app.use("/images", express.static("upload/images"));

// Middleware to check authentication with JWT
const authenticate = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(403).json({ message: "Unauthorized" });

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err)
      return res.status(403).json({ message: "Token invalid or expired" });
    req.userId = decoded.userId;
    next();
  });
};

// Signup route
app.post("/signup", async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match!" });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password!" });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret, {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

// Image upload route (authenticated)
app.post(
  "/upload",
  authenticate,
  upload.array("files", 10),
  async (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: 0, message: "No files uploaded" });
    }

    try {
      const imagePromises = req.files.map((file, index) => {
        const latitude = req.body[`latitude_${index}`] || "N/A";
        const longitude = req.body[`longitude_${index}`] || "N/A";
        const dateTime =
          req.body[`dateTime_${index}`] || new Date().toLocaleString();

        const newImage = new Image({
          filename: file.filename,
          latitude,
          longitude,
          dateTime,
          userId: req.userId,
        });

        return newImage.save();
      });

      await Promise.all(imagePromises);

      res
        .status(200)
        .json({ success: 1, message: "Images uploaded successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Error saving image data", error });
    }
  }
);

// Fetch uploaded images for a user (authenticated)
app.get("/my-images", authenticate, async (req, res) => {
  try {
    const images = await Image.find({ userId: req.userId });
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: "Error fetching images", error });
  }
});

app.post("/removeimage", async (req, res) => {
  try {
    // Use the correct field "_id" instead of "id"
    await Image.findOneAndDelete({ _id: req.body.id });

    console.log("Image Removed");
    res.json({
      success: true,
      message: "Image successfully removed",
    });
  } catch (error) {
    console.error("Error removing image:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove image",
    });
  }
});
f;

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
