const User_Model = require('../../models/user.model');
const { mutipleMongooseToObject, mongooseToObject } = require('../../helpers/convertDataToObject');
const { escapeRegex } = require('../../helpers/escapeRegex');

class UserController {
  async index(req, res) {
    const pageNumber = req.query.page || 1;
    const perPage = 5;
    try {
      if (req.query.search) {
        const [users, totalUsers] = await Promise.all([
          User_Model.find({
            username: new RegExp(escapeRegex(req.query.search), 'gi')
          }).limit(perPage).skip((pageNumber - 1) * perPage),
          User_Model.find({
            username: new RegExp(escapeRegex(req.query.search), 'gi')
          })
        ]);
        return res.render('./backends/users/usersView', {
          datas: mutipleMongooseToObject(users),
          pages: Math.ceil(totalUsers.length / perPage),
          current: pageNumber
        });
      } else {
        const [users, totalUsers] = await Promise.all([
          User_Model.find({}).limit(perPage).skip((pageNumber - 1) * perPage),
          User_Model.countDocuments()
        ]);
        return res.render('./backends/users/usersView', {
          datas: mutipleMongooseToObject(users),
          pages: Math.ceil(totalUsers / perPage),
          current: pageNumber
        });
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  async detail(req, res) {
    try {
      const user = await User_Model.findById(req.params.id);
      return res.render('./backends/users/userDetailView', {
        datas: mongooseToObject(user)
      });
    } catch (error) {
      console.log(error.message)
    }
  }

  async delete(req, res) {
    try {
      await User_Model.deleteOne({ _id: req.params.id });
      return res.redirect('/admin/users');
    } catch (error) {
      console.log(error.message)
    }
  }
}

module.exports = new UserController;