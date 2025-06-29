const express = require("express");
const router = express.Router();
const multer = require("multer");
const Product = require("../models/Product");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// ✅ Load env and verify
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

console.log("📡 Cloudinary configured with cloud name:", process.env.CLOUD_NAME);

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    console.log("📂 Accessing Cloudinary folder: pleasurepop");
    return {
      folder: "pleasurepop",
      allowed_formats: ["jpg", "png", "jpeg"],
    };
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

// 🆕 POST new product
router.post("/", upload.single("image"), async (req, res) => {
  console.log("🔥 HITTING Cloudinary POST route");

  try {
    const { name, price, rating, tags, description, category } = req.body;

    if (!req.file || !req.file.path.includes("cloudinary.com")) {
      console.error("❌ Image not hosted on Cloudinary:", req.file?.path);
      return res.status(400).json({ message: "Image upload failed or invalid path." });
    }

    const imagePath = req.file.path;
    console.log("📸 Uploaded to Cloudinary:", imagePath);

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

// 🔄 UPDATE product
router.put("/:id", upload.single("image"), async (req, res) => {
  console.log("🛠️ Updating product:", req.params.id);
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

    if (req.file && req.file.path.includes("cloudinary.com")) {
      updateFields.image = req.file.path;
      console.log("✅ Updated image path:", req.file.path);
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    res.json(updated);
  } catch (err) {
    console.error("Update failed:", err);
    res.status(400).json({ message: "Update failed", error: err.message });
  }
});

module.exports = router;
