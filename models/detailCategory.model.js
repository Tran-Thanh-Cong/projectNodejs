const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const detailCategorySchema = new Schema({
  name: {
    type: 'string',
  },
  detailCategory: {
    type: Schema.Types.ObjectId,
    ref: 'categories'
  },
  category: {
    type: 'string',
  }
}, {
  collection: 'detailCategories',
  timestamps: true,
});

module.exports = mongoose.model('detailCategories', detailCategorySchema);