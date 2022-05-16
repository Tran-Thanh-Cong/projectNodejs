const User_Model = require('../../models/user.model');
const { verifyToken } = require('../../helpers/verifyToken');

class VerifyEmailController {
  index(req, res) {
    return res.render('./frontends/waitVerifyEmailView');
  }
  async verifyEmail(req, res) {
    try {
      const _id = await verifyToken(req.query.token);
      if (await User_Model.findById(_id.id)) {
        await User_Model.updateOne({ _id: _id.id }, { isVerified: true });
        return res.redirect('/login');
      }
      return res.render('./frontend/loginView', {
        errVerifyEmail: 'Email not verify'
      });
    } catch (error) {
      console.log(error.message);
    }
  }
}

module.exports = new VerifyEmailController;