const DetailCategory_Model = require('../../models/detailCategory.model');
const { mutipleMongooseToObject, mongooseToObject } = require('../../helpers/convertDataToObject');
const { escapeRegex } = require('../../helpers/escapeRegex');
const Category_Model = require('../../models/category.model');

class DetailCategoryController {
  async index(req, res) {
    const pageNumber = req.params.page;
    const perPage = 5;
    try {
      if (req.query.search) {
        const [detailCategories, totalDetailCategories] = await Promise.all([
          DetailCategory_Model.find({
            name: new RegExp(escapeRegex(req.query.search), 'gi')
          }).limit(perPage).skip((pageNumber - 1) * perPage),
          DetailCategory_Model.countDocuments()
        ]);
        const pages = [];
        const totalPages = Math.ceil(totalDetailCategories / perPage);
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
        return res.render('./backends/detailCategories/detailCategoriesView', {
          datas: mutipleMongooseToObject(detailCategories),
          pages: pages,
        })
      } else {
        const [detailCategories, totalDetailCategories] = await Promise.all([
          DetailCategory_Model.find({}).limit(perPage).skip((pageNumber - 1) * perPage),
          DetailCategory_Model.countDocuments()
        ]);
        const pages = [];
        const totalPages = Math.ceil(totalDetailCategories / perPage);
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
        return res.render('./backends/detailCategories/detailcategoriesView', {
          datas: mutipleMongooseToObject(detailCategories),
          pages: pages,
        })
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  create(req, res) {
    return res.render('./backends/detailCategories/createDetailCategoryView');
  }

  async store(req, res) {
    try {

    } catch (error) {
      console.log(error.message);
    }
  }
}

module.exports = new DetailCategoryController;