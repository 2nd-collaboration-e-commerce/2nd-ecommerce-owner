const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @route   POST /api/payment/create-order
// @desc    Create Razorpay order
// @access  Private
router.post('/create-order', protect, async (req, res) => {
  try {
    const { amount } = req.body; // amount in rupees

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
      },
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      success: true,
      order: razorpayOrder,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Razorpay error:', error);
    res.status(500).json({ success: false, message: 'Payment order creation failed' });
  }
});

// @route   POST /api/payment/verify
// @desc    Verify Razorpay payment signature
// @access  Private
router.post('/verify', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    // Update order payment info
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        'paymentInfo.razorpay_order_id': razorpay_order_id,
        'paymentInfo.razorpay_payment_id': razorpay_payment_id,
        'paymentInfo.razorpay_signature': razorpay_signature,
        'paymentInfo.status': 'paid',
      });
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/payment/key
// @desc    Get Razorpay key
// @access  Private
router.get('/key', protect, (req, res) => {
  res.json({ success: true, key: process.env.RAZORPAY_KEY_ID });
});

module.exports = router;
