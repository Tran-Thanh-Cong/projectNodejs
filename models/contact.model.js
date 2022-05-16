const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  name: {
    type: 'string'
  },
  email: {
    type: 'string'
  },
  phone: {
    type: 'string'
  },
  question: {
    type: 'string'
  }
}, {
  collection: 'contact',
  timestamps: true,
});

module.exports = mongoose.model('contact', contactSchema);