const User_Model = require('../../models/user.model');
const bcrypt = require('bcrypt');
const { sendMail } = require('../../mail/sendMail');
const { createToken } = require('../../helpers/createToken');
const validator = require("email-validator");
class RegisterController {
  register_get(req, res) {
    return res.render('./frontends/registerView');
  }

  async register_post(req, res) {
    try {
      if (await User_Model.findOne({ email: req.body.email })) {
        return res.render('./frontends/registerView', {
          errEmail: "Email already exists",
          email: req.body.email,
          username: req.body.username
        });
      }

      if (!validator.validate(req.body.email)) {
        return res.render('./frontends/registerView', {
          errEmail: 'Email not correct',
          email: req.body.email,
          username: req.body.username
        });
      }

      if (req.body.password !== req.body.confirm_password) {
        return res.render('./frontends/registerView', {
          errPassword: 'Password not match',
          email: req.body.email,
          username: req.body.username
        });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(req.body.password, salt);
      const user = await User_Model.insertMany({
        username: req.body.username,
        email: req.body.email,
        password: passwordHash
      });
      const token = await createToken(user[0]._id);
      const subject = 'verify your email';
      const content = `<h2>${user[0].email}! thank your register on our website</h2>
                      <h4>Please your verify email to continue....</h4>,
                      <a href="http://localhost:5000/verify-email?token=${token}">Verify email</a>`
      sendMail(user[0].email, subject, content);
      return res.redirect('/wait');

    } catch (error) {
      console.log(error.message);
    }
  }
}

module.exports = new RegisterController;