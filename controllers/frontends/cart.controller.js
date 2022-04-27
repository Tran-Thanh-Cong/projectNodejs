const Cart_Model = require('../../models/Cart.model');
const { verifyToken } = require('../../helpers/verifyToken');
const Product_Model = require('../../models/product.model');
const { mutipleMongooseToObject, mongooseToObject } = require('../../helpers/convertDataToObject');
class CartController {
  async addToCart(req, res) {
    try {
      const [decodedToken, product] = await Promise.all([
        verifyToken(req.cookies.token),
        Product_Model.findById(req.params.id)
      ]);
      let cart = await Cart_Model.findOne({ user_id: decodedToken.id });
      if (cart) {
        //product exists in the cart, update the quantity
        let itemIndex = cart.products.findIndex(p => p.productID == req.params.id);
        if (itemIndex > -1) {
          let productItem = cart.products[itemIndex];
          productItem.quantity += Number(req.body.add_product);
          cart.products[itemIndex] = productItem;
          cart.totalPrice += productItem.price * Number(req.body.add_product);
          cart.totalItems += Number(req.body.add_product);
        } else {
          //product does not exists in cart, add new item
          cart.products.push({
            productID: product._id,
            quantity: Number(req.body.add_product),
            name: product.name,
            images: product.images,
            price: product.price * (1 - product.discount * 0.01),
            discount: product.discount
          })
          cart.totalPrice += Number(req.body.add_product) * product.price * (1 - product.discount * 0.01);
        }
        cart.totalItems += Number(req.body.add_product)
        cart = await cart.save();
        return res.redirect('/shop');
      } else {
        //no cart for user, create a new cart
        await Cart_Model.insertMany({
          user_id: decodedToken.id,
          products: [{
            productID: product._id,
            quantity: Number(req.body.add_product),
            name: product.name,
            images: product.images,
            price: product.price * (1 - product.discount * 0.01),
            discount: product.discount
          }],
          totalItems: Number(req.body.add_product),
          totalPrice: (product.price * (1 - product.discount * 0.01)) * Number(req.body.add_product)
        });
        return res.redirect('/shop');
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async cartCheckout(req, res) {
    try {
      const decodedToken = await verifyToken(req.cookies.token);
      const cart = await Cart_Model.findOne({ user_id: decodedToken.id });
      if (req.cookies.token) {
        const decodedToken = await verifyToken(req.cookies.token);
        const cartProduct = await Cart_Model.find({ user_id: decodedToken.id });
        if (cartProduct) {
          res.locals.cart = cartProduct[0];
          res.locals.cartProduct = cartProduct[0].products
        }
      }
      return res.render('./frontends/cartCheckoutView', {
        datas: mutipleMongooseToObject(cart.products) ? mutipleMongooseToObject(cart.products) : {},
        cart: cart
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async removeProductCart(req, res) {
    try {

    } catch (error) {
      console.log(error.message)
    }
  }
}
module.exports = new CartController