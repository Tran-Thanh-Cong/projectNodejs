const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  products: [{
    productID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products'
    },
    quantity: {
      type: 'number'
    },
    name: {
      type: 'string'
    },
    images: {
      type: 'string'
    },
    price: {
      type: 'number'
    },
    discount: {
      type: 'number'
    }
  }],
  totalItems: {
    type: 'number'
  },
  totalPrice: {
    type: 'number'
  }
}, {
  collection: 'orders',
  timestamps: true
});

module.exports = mongoose.model('orders', orderSchema);