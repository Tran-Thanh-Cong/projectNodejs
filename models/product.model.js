const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String
  },
  price: {
    type: Number
  },
  discount: {
    type: Number
  },
  amount: {
    type: Number
  },
  images: {
    type: String
  }
}, {
  collection: 'products',
  timestamps: true
});

module.exports = mongoose.model('products', productSchema);