const User_Model = require('../../models/user.model');
const bcrypt = require('bcrypt');
const { createToken } = require('../../helpers/createToken');
class LoginController {
  login_get(req, res) {
    return res.render('./frontends/loginView.pug');
  }

  async login_post(req, res) {
    try {
      const user = await User_Model.findOne({ email: req.body.email });
      if (!user) {
        return res.render('./frontends/loginView', {
          errEmail: 'Email not found'
        });
      }
      if (user.isVerified === false) {
        return res.render('./frontends/loginView', {
          errVerified: "Please verify your email",
          email: user.email
        });
      }
      if (!await bcrypt.compare(req.body.password, user.password)) {
        return res.render('./frontends/loginView', {
          errPassword: 'Password not correct',
          email: user.email
        });
      }
      const token = await createToken(user._id);
      res.cookie('token', token, {
        httpOnly: true
      });
      return res.redirect('/');
    } catch (errror) {
      console.log(errror.message);
    }
  }
}

module.exports = new LoginController;