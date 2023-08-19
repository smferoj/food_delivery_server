const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  addressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrderAddress',
    required: true,
  },
  orderType: {
    type: String,
    enum: ['delivery', 'takeaway'],
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['cash_on_delivery', 'credit_card', 'paypal', 'other'],
    required: true,
  },
  discountAmount: {
    type: Number,
    default: 0,
  },
  orderAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: [
      'Pending',
      'Accepted',
      'Preparing',
      'OnTheWay',
      'Delivered',
      'Cancelled',
    ],
    default: 'Pending',
  },
  orderNote: String,
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
