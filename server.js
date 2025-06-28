const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require('./routes/auth');
const userAuthRoutes = require('./routes/userAuth');
const orderRoutes = require('./routes/order');
const path = require("path");

dotenv.config(); // Load .env variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ limit: "2mb", extended: true }));
app.use("/api/auth", require("./routes/auth"));
app.use('/api/user', require('./routes/userAuth')); 
app.use('/api/orders', orderRoutes);



// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB error", err));

// Example route
const productRoutes = require("./routes/products");
app.use("/api/products", productRoutes);


// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
