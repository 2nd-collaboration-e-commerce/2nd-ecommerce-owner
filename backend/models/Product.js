const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  originalPrice: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Electronics',
      'Fashion',
      'Home & Furniture',
      'Appliances',
      'Beauty',
      'Toys',
      'Sports',
      'Books',
      'Grocery',
      'Other',
    ],
  },
  brand: { type: String, default: '' },
  images: [{ type: String }],
  stock: {
    type: Number,
    required: [true, 'Stock is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0,
  },
  ratings: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  reviews: [reviewSchema],
  seller: { type: String, default: 'Flipkart Seller' },
  highlights: [{ type: String }],
  specifications: [
    {
      key: String,
      value: String,
    },
  ],
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);
