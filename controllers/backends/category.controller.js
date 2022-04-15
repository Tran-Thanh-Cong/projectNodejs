const Category_Model = require('../../models/category.model');
const DetailCategory_Model = require('../../models/detailCategory.model');
const { mutipleMongooseToObject, mongooseToObject } = require('../../helpers/convertDataToObject');
const { escapeRegex } = require('../../helpers/escapeRegex');

class CategoryController {
  async index(req, res) {
    const pageNumber = req.query.page;
    const perPage = 5;
    try {
      if (req.query.search) {
        const [categories, totalCategories] = await Promise.all([
          Category_Model.find({
            name: new RegExp(escapeRegex(req.query.search), 'gi')
          }).limit(perPage).skip((pageNumber - 1) * perPage),
          Category_Model.countDocuments()
        ]);
        const pages = [];
        const totalPages = Math.ceil(totalCategories / perPage);
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i)
        }
        return res.render('./backends/categories/categoriesView', {
          datas: mutipleMongooseToObject(categories),
          pages: pages
        });
      } else {
        const [categories, totalCategories] = await Promise.all([
          Category_Model.find({}).limit(perPage).skip((pageNumber - 1) * perPage),
          Category_Model.countDocuments()
        ]);
        const pages = [];
        const totalPages = Math.ceil(totalCategories / perPage);
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i)
        }
        return res.render('./backends/categories/categoriesView', {
          datas: mutipleMongooseToObject(categories),
          pages: pages
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
}

module.exports = new CategoryController;