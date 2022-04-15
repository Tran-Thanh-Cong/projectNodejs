const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  name: {
    type: 'string',
  },
  email: {
    type: 'string',
  },
  password: {
    type: 'string',
  }
}, {
  collection: 'admins',
  timestamps: true,
});

module.exports = mongoose.model('admins', adminSchema);