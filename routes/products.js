const express = require("express");
const multer = require("multer");
const router = express.Router();
const Product = require("../models/Product");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// ✅ Cloudinary Storage Setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "pleasurepop",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});
const upload = multer({ storage });

// 🔍 GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 🆕 POST new product with Cloudinary image
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, rating, tags, description, category } = req.body;
    const imagePath = req.file ? req.file.path : "";

    console.log("✅ Uploaded to Cloudinary:", imagePath);

    const product = new Product({
      name,
      price,
      rating,
      tags: tags.split(",").map((tag) => tag.trim()),
      description,
      category,
      image: imagePath,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error("Product creation failed:", err);
    res.status(400).json({ message: "Creation failed", error: err.message });
  }
});

// 🔄 UPDATE a product
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, rating, tags, description, category } = req.body;
    const updateFields = {
      name,
      price,
      rating,
      tags: tags.split(",").map((tag) => tag.trim()),
      description,
      category,
    };

    if (req.file) {
      updateFields.image = req.file.path;
      console.log("✅ Updated image on Cloudinary:", req.file.path);
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    res.json(updated);
  } catch (err) {
    console.error("Update failed:", err);
    res.status(400).json({ message: "Update failed", error: err.message });
  }
});

module.exports = router;
