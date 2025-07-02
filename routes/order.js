const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const verifyToken = require('../middleware/authMiddleware');

router.post('/', verifyToken, async (req, res) => {
  try {
    const { items, shippingAddress, shippingMethod, shippingFee, totalAmount, paymentMethod } = req.body;
    const newOrder = new Order({
      user: req.user.id,
      items,
      shippingAddress,
      shippingMethod,
      shippingFee,
      totalAmount,
      paymentMethod
    });
    const saved = await newOrder.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Order creation failed', error: err.message });
  }
});


// GET all orders for admin view
router.get('/', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email") // optional if you want user details
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }

// Update order status (e.g., to Delivered)
router.put('/:id/status', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = req.body.status || "Delivered";
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ message: "Failed to update order status", error: err.message });
  }
});
});


module.exports = router;
