const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, isAdmin } = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { orderItems, shippingAddress, itemsPrice, taxPrice, shippingPrice, totalPrice, paymentInfo } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items' });
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    // Update product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/orders/my
// @desc    Get logged in user orders
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('orderItems.product', 'name images')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    // Check if order belongs to user (or admin)
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/orders (Admin)
// @desc    Get all orders
// @access  Private/Admin
router.get('/', protect, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    const totalAmount = orders.reduce((acc, order) => acc + order.totalPrice, 0);
    res.json({ success: true, orders, totalAmount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/orders/:id/status (Admin)
// @desc    Update order status
// @access  Private/Admin
router.put('/:id/status', protect, isAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.orderStatus = req.body.status;
    if (req.body.status === 'Delivered') order.deliveredAt = Date.now();
    await order.save();

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel order
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (order.orderStatus === 'Delivered') {
      return res.status(400).json({ success: false, message: 'Cannot cancel delivered order' });
    }

    order.orderStatus = 'Cancelled';

    // Restore stock
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    await order.save();
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
