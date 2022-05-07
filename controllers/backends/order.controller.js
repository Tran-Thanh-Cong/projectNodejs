const Order_Model = require('../../models/order.model');
const { mutipleMongooseToObject, mongooseToObject } = require('../../helpers/convertDataToObject');
const { escapeRegex } = require('../../helpers/escapeRegex');
class OrderController {
  async index(req, res) {
    const pageNumber = req.query.page || 1;
    const perPage = 5;
    try {
      if (req.query.search) {
        const [order, totalOrders] = await Promise.all([
          Order_Model.find({ email: new RegExp(escapeRegex(req.query.search), 'gi') }).populate({ path: 'user_id' }).limit(perPage).skip((pageNumber - 1) * perPage),
          Order_Model.find({ email: new RegExp(escapeRegex(req.query.search), 'gi') })
        ]);
        const datas = order.filter((data) => {
          return data.products.length > 0
        })
        return res.render('./backends/orders/ordersView', {
          datas: datas ? mutipleMongooseToObject(datas) : null,
          pages: Math.ceil(totalOrders.length / perPage),
          current: pageNumber
        });
      } else {
        const [order, totalOrders] = await Promise.all([
          Order_Model.find({}).populate({ path: 'user_id' }).limit(perPage).skip((pageNumber - 1) * perPage),
          Order_Model.countDocuments()
        ]);
        const datas = order.filter((data) => {
          return data.products.length > 0
        })
        return res.render('./backends/orders/ordersView', {
          datas: datas ? mutipleMongooseToObject(datas) : null,
          pages: Math.ceil(totalOrders / perPage),
          current: pageNumber
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async detail(req, res) {
    try {
      const data = await Order_Model.findById(req.params.id).populate({ path: 'user_id' });
      return res.render('./backends/orders/orderDetailView', {
        data: data,
        products: data.products.length > 0 ? mutipleMongooseToObject(data.products) : null
      })
    } catch (error) {
      console.log(error);
    }
  }

}
module.exports = new OrderController;