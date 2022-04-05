const JWT = require('jsonwebtoken');

const createToken = (id) => {
  return new Promise((resolve, reject) => {
    JWT.sign({ id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 60 * 60 * 24 }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    })
  });
};

module.exports = {
  createToken: createToken
};