const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const detailCategorySchema = new Schema({
  name: {
    type: 'string',
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'categories'
  },
}, {
  collection: 'detailCategories',
  timestamps: true,
});

module.exports = mongoose.model('detailCategories', detailCategorySchema);