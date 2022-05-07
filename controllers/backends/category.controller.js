const Category_Model = require('../../models/category.model');
const { mutipleMongooseToObject, mongooseToObject } = require('../../helpers/convertDataToObject');
const { escapeRegex } = require('../../helpers/escapeRegex');

class CategoryController {
  async index(req, res) {
    const pageNumber = req.query.page || 1;
    const perPage = 5;
    try {
      if (req.query.search) {
        const [categories, totalCategories] = await Promise.all([
          Category_Model.find({
            name: new RegExp(escapeRegex(req.query.search), 'gi')
          }).limit(perPage).skip((pageNumber - 1) * perPage),
          Category_Model.find({
            name: new RegExp(escapeRegex(req.query.search), 'gi')
          })
        ]);
        return res.render('./backends/categories/categoriesView', {
          datas: mutipleMongooseToObject(categories),
          pages: Math.ceil(totalCategories.length / perPage),
          current: pageNumber
        });
      } else {
        const [categories, totalCategories] = await Promise.all([
          Category_Model.find({}).limit(perPage).skip((pageNumber - 1) * perPage),
          Category_Model.countDocuments()
        ]);
        return res.render('./backends/categories/categoriesView', {
          datas: mutipleMongooseToObject(categories),
          pages: Math.ceil(totalCategories / perPage),
          current: pageNumber
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  create(req, res) {
    return res.render('./backends/categories/createCategoryView');
  }

  async store(req, res) {
    try {
      const category = await Category_Model.findOne({ name: req.body.name });
      if (category) {
        return res.render('./backends/categories/createCategoryView', {
          name: req.body.name,
          errName: 'category already exists'
        });
      } else {
        await Category_Model.insertMany({ name: req.body.name });
        return res.redirect('/admin/category')
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async edit(req, res) {
    try {
      const category = await Category_Model.findById(req.params.id);
      return res.render('./backends/categories/updateCategoryView', {
        datas: mongooseToObject(category)
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async update(req, res) {
    try {
      const category = await Category_Model.findOne({ name: req.body.name });
      if (category) {
        return res.render('./backends/categories/updateCategoryView', {
          errCategory: 'Category already exists',
          datas: mongooseToObject(category)
        })
      } else {
        await Category_Model.updateOne({ _id: req.params.id }, { name: req.body.name })
        return res.redirect('/admin/category')
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async delete(req, res) {
    try {
      await Category_Model.deleteOne({ _id: req.params.id });
      return res.redirect('/admin/category');
    } catch (error) {
      console.log(error.message);
    }
  }
}

module.exports = new CategoryController;