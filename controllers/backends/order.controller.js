const Order_Model = require('../../models/order.model');
const { mutipleMongooseToObject, mongooseToObject } = require('../../helpers/convertDataToObject');
const { escapeRegex } = require('../../helpers/escapeRegex');
class OrderController {
  async index(req, res) {
    const pageNumber = req.query.page || 1;
    const perPage = 5;
    try {
      const [order, totalOrders] = await Promise.all([
        Order_Model.find({}).populate({ path: 'user_id' }).limit(perPage).skip((pageNumber - 1) * perPage),
        Order_Model.countDocuments()
      ]);
      const pages = [];
      const totalPages = Math.ceil(totalOrders / perPage);
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
      return res.render('./backends/orders/ordersView', {
        datas: mutipleMongooseToObject(order),
        pages: pages
      });
    } catch (error) {
      console.log(error);
    }
  }

}
module.exports = new OrderController;