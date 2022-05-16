const Cart_Model = require('../../models/cart.model');
const { verifyToken } = require('../../helpers/verifyToken');
const { sendMail } = require('../../mail/sendMail');
const User_Model = require('../../models/user.model');
const Contact_Model = require('../../models/contact.model');
const validator = require("email-validator");
class ContactController {
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
      return res.render('./frontends/contactView');
    } catch (error) {
      console.log(error);
    }
  }
  async contact(req, res) {
    try {
      const decodedToken = await verifyToken(req.cookies.token);
      if (!validator.validate(req.body.email)) {
        return res.render('./frontends/contactView', {
          errEmail: 'Email not correct',
          email: req.body.email,
          name: req.body.name
        });
      }
      const [user, contact] = await Promise.all([
        User_Model.findById(decodedToken.id),
        Contact_Model.insertMany({
          user_id: decodedToken.id,
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone_number,
          question: req.body.question
        })
      ]);
      const subject = 'Contact your website';
      const content = `<h2>${req.body.email}! Cảm ơn bạn đã gửi câu hỏi cho trang web của chúng tôi</h2>`;
      sendMail(user.email, subject, content);
      return res.redirect('/');
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new ContactController;