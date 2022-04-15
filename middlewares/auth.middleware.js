const User_Model = require('../models/user.model');
const Admin_Model = require('../models/admin.model');
const { verifyToken } = require('../helpers/verifyToken');

class AuthMiddleware {
  async checkUser(req, res, next) {
    try {
      const token = req.cookies.token;
      if (!token) {
        res.locals.user = null;
        return next();
      }
      const decodedToken = await verifyToken(token);
      const user = await User_Model.findById(decodedToken.id);
      if (!user) {
        res.locals.user = null;
        return next();
      }
      res.locals.user = user;
      return next();
    } catch (error) {
      console.log(error.message);
    }
  }

  async checkAdmin(req, res, next) {
    try {
      const tokenAdmin = req.cookies.tokenAdmin;
      if (tokenAdmin) {
        const decodedTokenAdmin = await verifyToken(tokenAdmin);
        const admin = await Admin_Model.findById(decodedTokenAdmin.id);
        req.admin = admin;
        res.locals.admin = admin;
        return next();
      } else {
        return next();
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async authAdmin(req, res, next) {
    try {
      const tokenAdmin = req.cookies.tokenAdmin;
      if (!tokenAdmin) {
        return res.redirect('/admin/login');
      } else {
        const decodedTokenAdmin = await verifyToken(tokenAdmin);
        const admin = await Admin_Model.findById(decodedTokenAdmin.id);
        if (admin) {
          req.admin = admin;
          return next();
        } else {
          return res.redirect('/admin/login');
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async authUser(req, res, next) {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.redirect('/login');
      } else {
        const decodedToken = await verifyToken(token);
        const user = await User_Model.findById(decodedToken.id);
        if (user) {
          req.user = user;
          return next();
        } else {
          return res.redirect('/login');
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }
}

module.exports = new AuthMiddleware;