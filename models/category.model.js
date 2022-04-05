const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
    type: 'string',
  }
}, {
  collection: 'categories',
  timestamps: true
});

module.exports = mongoose.model('categories', categorySchema);