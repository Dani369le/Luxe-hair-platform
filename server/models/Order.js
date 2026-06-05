const mongoose = require('mongoose');

/**
 * Order Schema - Stores order information and transaction details
 * @typedef {Object} Order
 * @property {ObjectId} userId - Reference to User
 * @property {Array} items - Array of order items
 * @property {number} totalAmount - Total order amount
 * @property {number} taxAmount - Tax amount
 * @property {number} shippingCost - Shipping cost
 * @property {string} paymentStatus - Payment status
 * @property {string} orderStatus - Order fulfillment status
 * @property {string} paymentMethod - Payment method used
 * @property {Object} shippingAddress - Delivery address
 * @property {Object} billingAddress - Billing address
 * @property {string} trackingNumber - Shipping tracking number
 * @property {Date} createdAt - Order creation timestamp
 * @property {Date} updatedAt - Order update timestamp
 */

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    price: Number,
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  taxAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  shippingCost: {
    type: Number,
    default: 0,
    min: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal', 'stripe'],
    required: true
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  billingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  trackingNumber: String,
  notes: String,
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
 * Calculate order subtotal
 * @returns {number} Subtotal of items
 */
orderSchema.methods.calculateSubtotal = function() {
  return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

module.exports = mongoose.model('Order', orderSchema);
