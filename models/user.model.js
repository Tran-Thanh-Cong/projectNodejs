const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: 'string',
    require: true,
  },
  email: {
    type: 'string',
    unique: true,
  },
  password: {
    type: 'string',
  },
  isVerified: {
    type: 'boolean',
    default: false
  }
}, {
  collection: 'users',
  timestamps: true
});

module.exports = mongoose.model('users', userSchema);