const Cart_Model = require('../../models/Cart.model');
const { verifyToken } = require('../../helpers/verifyToken');
class ContactController {
  async index(req, res) {
    try {
      if (req.cookies.token) {
        const decodedToken = await verifyToken(req.cookies.token);
        const cartProduct = await Cart_Model.find({ user_id: decodedToken.id });
        if (cartProduct) {
          res.locals.cart = cartProduct[0];
          res.locals.cartProduct = cartProduct[0].products
        }
        return res.render('./frontends/contactView');
      }
    } catch (error) {
      console.log(error.message);
    }
  }
}

module.exports = new ContactController;