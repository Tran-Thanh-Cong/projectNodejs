const mongoose = require('mongoose');

module.exports = {
  connect: async function() {
    const URL = 'mongodb://localhost/nodejs_express';
    try {
      await mongoose.connect(URL);
      console.log('Connect to mongdb successfully');
    } catch (error) {
      console.log(error.message);
    }
  }
}