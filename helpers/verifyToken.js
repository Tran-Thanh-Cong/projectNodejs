const JWT = require('jsonwebtoken');

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
      if (err) {
        reject(err);
      } else {
        resolve(decodedToken);
      }
    })
  });
};

module.exports = {
  verifyToken: verifyToken
};