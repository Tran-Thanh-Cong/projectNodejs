const Admin_Model = require('../../models/admin.model');
const { createToken } = require('../../helpers/createToken');
const bcrypt = require('bcrypt');

class LoginController {
  login_get(req, res) {
    return res.render('./backends/loginView');
  }

  async login_post(req, res) {
    try {
      const admin = await Admin_Model.findOne({ email: req.body.email });
      if (!admin) {
        return res.render('./backends/loginView', {
          errEmail: 'Email not found',
        });
      }
      if (!await bcrypt.compare(req.body.password, admin.password)) {
        return res.render('./backends/loginView', {
          errPassword: 'Incorrect password',
          email: req.body.email
        });
      }
      const tokenAdmin = await createToken(admin._id);
      res.cookie('tokenAdmin', tokenAdmin);
      return res.redirect('/admin');
    } catch (error) {
      console.log(error.message);
    }
  }
}

module.exports = new LoginController;