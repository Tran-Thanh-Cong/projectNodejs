const Cart_Model = require('../../models/cart.model');
const Order_Model = require('../../models/order.model');
const { verifyToken } = require('../../helpers/verifyToken');

class OrderController {
  async index(req, res) {
    try {
      const decodedToken = await verifyToken(req.cookies.token);
      const cart = await Cart_Model.findOne({ user_id: decodedToken.id });
      if (cart && cart.products.length > 0) {
        await Order_Model.insertMany({
          user_id: cart.user_id,
          products: cart.products,
          totalItems: cart.totalItems,
          totalPrice: cart.totalPrice
        });
        await Cart_Model.deleteOne({ user_id: decodedToken.id });
      }
      return res.redirect('/');
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new OrderController;