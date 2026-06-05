const mongoose = require('mongoose');

/**
 * Product Schema - Stores hair product information for the catalog
 * @typedef {Object} Product
 * @property {string} name - Product name
 * @property {string} description - Detailed product description
 * @property {number} price - Product price
 * @property {number} discountPrice - Discounted price
 * @property {number} stock - Available quantity
 * @property {Array} images - Array of image URLs
 * @property {string} category - Product category
 * @property {Array} tags - Product tags for filtering
 * @property {number} rating - Average rating (0-5)
 * @property {Array} reviews - Array of review objects
 * @property {boolean} featured - Whether product is featured
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Update timestamp
 */

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discountPrice: {
    type: Number,
    default: null
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  images: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    required: true,
    enum: ['straight', 'wavy', 'curly', 'coily', 'bundles', 'closures', 'frontals']
  },
  tags: [String],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{
    userId: mongoose.Schema.Types.ObjectId,
    userName: String,
    rating: Number,
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Calculate average rating from reviews
 * @returns {number} Average rating
 */
productSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) return 0;
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  return (totalRating / this.reviews.length).toFixed(1);
};

module.exports = mongoose.model('Product', productSchema);
