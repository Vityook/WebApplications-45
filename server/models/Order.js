const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  products: [{ 
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number
  }],
  totalAmount: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);