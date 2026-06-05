const express = require('express');
const Product = require('../models/Product');
const { protect, isAdmin } = require('../middleware/auth');

const router = express.Router();

/**
 * Get all products with filtering and pagination
 * GET /api/products?category=straight&page=1&limit=10
 * @query {string} category - Filter by category
 * @query {number} page - Page number
 * @query {number} limit - Items per page
 * @returns {Object} Products array and pagination info
 */
router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 10, search } = req.query;
    const query = {};

    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };

    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    res.json({
      products,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
});

/**
 * Get single product by ID
 * GET /api/products/:id
 * @param {string} id - Product ID
 * @returns {Object} Product object
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
});

/**
 * Create new product (admin only)
 * POST /api/products
 * @param {Object} productData - Product information
 * @returns {Object} Created product object
 */
router.post('/', protect, isAdmin, async (req, res) => {
  try {
    const { name, description, price, discountPrice, stock, images, category, tags } = req.body;

    if (!name || !description || !price || !stock || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      stock,
      images,
      category,
      tags
    });

    await product.save();
    res.status(201).json({ message: 'Product created', product });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
});

/**
 * Update product (admin only)
 * PUT /api/products/:id
 * @param {string} id - Product ID
 * @param {Object} updates - Fields to update
 * @returns {Object} Updated product object
 */
router.put('/:id', protect, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product updated', product });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
});

/**
 * Delete product (admin only)
 * DELETE /api/products/:id
 * @param {string} id - Product ID
 * @returns {Object} Confirmation message
 */
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
});

module.exports = router;
