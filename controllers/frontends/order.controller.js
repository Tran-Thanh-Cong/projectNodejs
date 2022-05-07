const Cart_Model = require('../../models/cart.model');
const Order_Model = require('../../models/order.model');
const { verifyToken } = require('../../helpers/verifyToken');
const Product_Model = require('../../models/product.model');
class OrderController {
  async index(req, res) {
    try {
      const decodedToken = await verifyToken(req.cookies.token);
      const cart = await Cart_Model.findOne({ user_id: decodedToken.id });
      if (cart && cart.products.length > 0) {
        await Order_Model.insertMany({
          user_id: cart.user_id,
          email: req.body.email,
          address: req.body.address,
          phonenumber: req.body.phonenumber,
          comments: req.body.comment,
          products: cart.products,
          totalItems: cart.totalItems,
          totalPrice: cart.totalPrice
        });
        for (let i = 0; i < cart.products.length; i++) {
          const amountProduct = await Product_Model.findById(cart.products[i].productID)
          await Product_Model.updateOne({ _id: amountProduct._id }, { amount: amountProduct.amount - cart.products[i].quantity })
        }
        await Cart_Model.deleteOne({ user_id: decodedToken.id });
      }
      return res.redirect('/');
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new OrderController;