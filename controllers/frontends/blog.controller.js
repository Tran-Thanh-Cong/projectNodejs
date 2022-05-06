const Cart_Model = require('../../models/cart.model');
const { verifyToken } = require('../../helpers/verifyToken');
class BlogController {
  async index(req, res) {
    try {
      if (req.cookies.token) {
        const decodedToken = await verifyToken(req.cookies.token);
        const cartProduct = await Cart_Model.find({ user_id: decodedToken.id });
        if (cartProduct.length > 0) {
          res.locals.cart = cartProduct[0];
          res.locals.cartProduct = cartProduct[0].products
        } else {
          res.locals.cart = null;
          res.locals.cartProduct = null;
        }
      }
      return res.render('./frontends/blogView');
    } catch (error) {
      console.log(error.message);
    }
  }
}

module.exports = new BlogController