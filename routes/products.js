const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const Product = require("../models/Product");

// 🧠 Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder must exist
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
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

// 🆕 POST new product with image
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, rating, tags, description, category } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

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
    res.status(400).json({ message: "Creation failed", error: err.message });
  }
});

// 🔄 UPDATE a product
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, rating, tags, description, category } = req.body;
    const updatedFields = {
      name,
      price,
      rating,
      tags: tags.split(",").map((tag) => tag.trim()),
      description,
      category,
    };

    if (req.file) {
      updatedFields.image = `/uploads/${req.file.filename}`;
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updatedFields, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Update failed", error: err.message });
  }
});

// 🗑️ DELETE a product
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
});

module.exports = router;
