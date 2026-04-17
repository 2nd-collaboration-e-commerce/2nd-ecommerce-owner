const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, isAdmin } = require('../middleware/auth');

// @route   GET /api/products
// @desc    Get all products with filter/search/pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, page = 1, limit = 12, sort } = req.query;

    const query = {};

    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { brand: { $regex: keyword, $options: 'i' } },
      ];
    }

    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption = {};
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { ratings: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };
    else sortOption = { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query).sort(sortOption).skip(skip).limit(Number(limit));

    res.json({
      success: true,
      products,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/products/featured
// @desc    Get featured products
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true }).limit(8);
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/products
// @desc    Create product (Admin)
// @access  Private/Admin
router.post('/', protect, isAdmin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product (Admin)
// @access  Private/Admin
router.put('/:id', protect, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product (Admin)
// @access  Private/Admin
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/products/:id/review
// @desc    Add product review
// @access  Private
router.post('/:id/review', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'Product already reviewed' });
    }

    product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(rating), comment });
    product.numReviews = product.reviews.length;
    product.ratings = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
    await product.save();

    res.status(201).json({ success: true, message: 'Review added' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
