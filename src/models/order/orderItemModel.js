const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order', // Reference the Order model
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Reference the Product model for the ordered product
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
}, { timestamps: true });

const OrderItem = mongoose.model('OrderItem', orderItemSchema);

module.exports = OrderItem;
