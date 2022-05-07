const Admin_Model = require('../../models/admin.model');
const { mutipleMongooseToObject, mongooseToObject } = require('../../helpers/convertDataToObject');
const { escapeRegex } = require('../../helpers/escapeRegex');
const bcrypt = require('bcrypt');
const validator = require('email-validator');


class AdminController {
  async index(req, res) {
    try {
      const pageNumber = req.query.page || 1;
      const perPage = 5;
      if (req.query.search) {
        const [admins, totalAdmins] = await Promise.all([
          Admin_Model.find({
            name: new RegExp(escapeRegex(req.query.search), 'gi')
          }).limit(perPage).skip((pageNumber - 1) * perPage),
          Admin_Model.find({
            name: new RegExp(escapeRegex(req.query.search), 'gi')
          })
        ]);
        return res.render('./backends/admins/adminsView', {
          datas: mutipleMongooseToObject(admins),
          pages: Math.ceil(totalAdmins.length / perPage),
          current: pageNumber
        });
      } else {
        const [admins, totalAdmins] = await Promise.all([
          Admin_Model.find({}).limit(perPage).skip((pageNumber - 1) * perPage),
          Admin_Model.countDocuments()
        ]);
        return res.render('./backends/admins/adminsView', {
          datas: mutipleMongooseToObject(admins),
          pages: Math.ceil(totalAdmins / perPage),
          current: pageNumber
        })
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async detail(req, res) {
    try {
      const datas = await Admin_Model.findById(req.params.id);
      return res.render('./backends/admins/adminDetailView', {
        datas: mongooseToObject(datas),
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  create(req, res) {
    return res.render('./backends/admins/createAdminView');
  }


  async store(req, res) {
    try {
      const admin = await Admin_Model.findOne({ email: req.body.email });
      if (admin) {
        return res.render('./backends/admins/createAdminView', {
          email: req.body.email,
          name: req.body.name,
          errEmail: 'Email already exists'
        });
      }
      if (!validator.validate(req.body.email)) {
        return res.render('./backends/admins/createAdminView', {
          name: req.body.name,
          email: req.body.email,
          errEmail: 'Email not correct'
        });
      }
      if (req.body.password !== req.body.confirm_password) {
        return res.render('./backends/admins/createAdminView', {
          email: req.body.email,
          name: req.body.name,
          errPassword: 'Password not match'
        });
      }
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(req.body.password, salt);
      await Admin_Model.insertMany({
        name: req.body.name,
        email: req.body.email,
        password: passwordHash
      });
      return res.redirect('/admin/employees')
    } catch (error) {
      console.log(error.message);
    }
  }

  async delete(req, res) {
    try {
      await Admin_Model.deleteOne({ _id: req.params.id });
      return res.redirect('/admin/employees');
    } catch (error) {
      console.log(error.message);
    }
  }
}

module.exports = new AdminController;