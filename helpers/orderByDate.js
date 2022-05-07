const Order_Model = require('../models/order.model');

function OrderByDate(date1, date2) {
  return new Promise((resolve, reject) => {
    Order_Model.find({
      createdAt: {
        $gte: date1,
        $lt: date2
      }
    }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  })
}

module.exports = {
  OrderByDate: OrderByDate
};