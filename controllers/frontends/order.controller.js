const Cart_Model = require('../../models/cart.model');
const Order_Model = require('../../models/order.model');
const { verifyToken } = require('../../helpers/verifyToken');
const Product_Model = require('../../models/product.model');
const stripe = require('stripe')('sk_test_51L0d6gAUryGVlVIUru3FU9Cg8QE3bGw6WAYVKfCnDvzb88DK1n45tdLEFaqLGGg1E5nvMX3equp6ivq6qeXJpobH00e6vLljy1');
const User_Model = require('../../models/user.model');
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

  async payment(req, res) {
    try {
      const decodedToken = await verifyToken(req.cookies.token);
      const [user, cart] = await Promise.all([
        User_Model.findById(decodedToken.id),
        Cart_Model.findOne({ user_id: decodedToken.id })
      ]);
      stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: user.username,
        address: {
          line1: 'Ngoc Lu - Binh Luc - Han Nam',
          postal_code: '110092',
          city: 'Ha Nam',
          state: '',
          country: 'Vietnamese',
        }
      }).then((customer) => {
        return stripe.charges.create({
          amount: +cart.totalPrice,
          description: 'Mua hang tai cua hang Thanh Cong',
          currency: 'USD',
          customer: customer.id
        }).then((charge) => {
          return res.redirect('/shop');
        }).catch((err) => {
          console.log(err);
        })
      });
      if (cart && cart.products.length > 0) {
        await Order_Model.insertMany({
          user_id: cart.user_id,
          email: req.body.stripeEmail,
          address: 'Ngoc Lu - Binh Luc - Han Nam',
          phonenumber: '1111111',
          comments: 'Mua hang tai cua hang Thanh Cong',
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
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new OrderController;