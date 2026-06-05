const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, isAdmin } = require('../middleware/auth');

const router = express.Router();

/**
 * Create new order
 * POST /api/orders
 * @param {Array} items - Order items array
 * @param {Object} shippingAddress - Shipping address
 * @param {string} paymentMethod - Payment method
 * @returns {Object} Created order object
 */
router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, billingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain items' });
    }

    // Calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity
      });

      // Reduce product stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Calculate tax (10%) and shipping ($10)
    const taxAmount = totalAmount * 0.1;
    const shippingCost = 10;
    const finalTotal = totalAmount + taxAmount + shippingCost;

    const order = new Order({
      userId: req.userId,
      items: orderItems,
      totalAmount: finalTotal,
      taxAmount,
      shippingCost,
      shippingAddress,
      billingAddress,
      paymentMethod,
      paymentStatus: 'pending'
    });

    await order.save();

    res.status(201).json({
      message: 'Order created successfully',
      order,
      breakdown: {
        subtotal: totalAmount,
        tax: taxAmount,
        shipping: shippingCost,
        total: finalTotal
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
});

/**
 * Get user's orders
 * GET /api/orders
 * @returns {Array} User's orders
 */
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).populate('items.productId');
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

/**
 * Get single order by ID
 * GET /api/orders/:id
 * @param {string} id - Order ID
 * @returns {Object} Order object
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.productId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check authorization
    if (order.userId.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order', error: error.message });
  }
});

/**
 * Update order status (admin only)
 * PUT /api/orders/:id
 * @param {string} id - Order ID
 * @param {string} orderStatus - New order status
 * @returns {Object} Updated order object
 */
router.put('/:id', protect, isAdmin, async (req, res) => {
  try {
    const { orderStatus, paymentStatus, trackingNumber } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        orderStatus: orderStatus || order.orderStatus,
        paymentStatus: paymentStatus || order.paymentStatus,
        trackingNumber: trackingNumber || order.trackingNumber,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order', error: error.message });
  }
});

module.exports = router;
