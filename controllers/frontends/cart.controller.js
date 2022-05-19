const Cart_Model = require('../../models/cart.model');
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
      const cartProduct = await Cart_Model.findOne({ user_id: decodedToken.id });
      if (cartProduct) {
        if (cartProduct.products) {
          res.locals.cart = cartProduct;
          res.locals.cartProduct = cartProduct.products;
          return res.render('./frontends/cartCheckoutView', {
            datas: mutipleMongooseToObject(cartProduct.products),
            cart: mongooseToObject(cartProduct)
          });
        } else {
          res.locals.cart = null;
          res.locals.cartProduct = null;
          return res.render('./frontends/cartCheckoutView', {
            datas: null,
            cart: null
          })
        }
      } else {
        res.locals.cart = null;
        res.locals.cartProduct = null;
        return res.render('./frontends/cartCheckoutView', {
          datas: null,
          cart: null
        })
      }
    } catch (error) {
      console.log(error);
    }
  }

  async removeProductCart(req, res) {
    try {
      const decodedToken = await verifyToken(req.cookies.token);
      let cart = await Cart_Model.findOne({ user_id: decodedToken.id });
      if (cart) {
        const itemIndex = cart.products.findIndex(p => p._id.toString() === req.params.id);
        if (itemIndex > -1) {
          let productItem = cart.products[itemIndex];
          cart.totalPrice -= productItem.price * productItem.quantity;
          cart.totalItems -= productItem.quantity
          cart.products.splice(itemIndex, 1);
        }
        cart = await cart.save();
      }
      return res.redirect('/shop');
    } catch (error) {
      console.log(error.message)
    }
  }

  async delete(req, res) {
    try {
      const decodedToken = await verifyToken(req.cookies.token);
      await Cart_Model.deleteOne({ user_id: decodedToken.id });
      return res.redirect('/shop');
    } catch (error) {
      console.log(error.message)
    }
  }

  async expressCheckoutCart(req, res) {
    try {
      const decodedToken = await verifyToken(req.cookies.token);
      const cartProduct = await Cart_Model.find({ user_id: decodedToken.id });
      if (cartProduct.length > 0) {
        res.locals.cart = cartProduct[0];
        res.locals.cartProduct = cartProduct[0].products;
      } else {
        res.locals.cart = null;
        res.locals.cartProduct = null;
      }
      return res.render('./frontends/expressCheckoutCartView', {
        key: 'pk_test_51L0d6gAUryGVlVIUDEPQlxnr1u5ajYDsSV5yHJbV35Rry9GnqtwNLWWh7c6JTOCSKNkuCG8Cxsf7Iu78wkYUZfbA00ZDUBSBpd'
      });
    } catch (error) {
      console.log(error.message)
    }
  }

  async addProduct(req, res) {
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
          productItem.quantity += 1;
          cart.products[itemIndex] = productItem;
          cart.totalPrice += productItem.price * 1;
          cart.totalItems += 1;
        } else {
          //product does not exists in cart, add new item
          cart.products.push({
            productID: product._id,
            quantity: 1,
            name: product.name,
            images: product.images,
            price: product.price * (1 - product.discount * 0.01),
            discount: product.discount
          })
          cart.totalPrice += 1 * product.price * (1 - product.discount * 0.01);
          cart.totalItems += 1
        }
        cart = await cart.save();
        return res.redirect('/');
      } else {
        //no cart for user, create a new cart
        await Cart_Model.insertMany({
          user_id: decodedToken.id,
          products: [{
            productID: product._id,
            quantity: 1,
            name: product.name,
            images: product.images,
            price: product.price * (1 - product.discount * 0.01),
            discount: product.discount
          }],
          totalItems: 1,
          totalPrice: (product.price * (1 - product.discount * 0.01)) * 1
        });
        return res.redirect('/');
      }
    } catch (error) {
      console.log(error)
    }
  }
}
module.exports = new CartController