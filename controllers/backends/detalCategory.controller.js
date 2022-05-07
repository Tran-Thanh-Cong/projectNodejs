const DetailCategory_Model = require('../../models/detailCategory.model');
const { mutipleMongooseToObject, mongooseToObject } = require('../../helpers/convertDataToObject');
const { escapeRegex } = require('../../helpers/escapeRegex');
const Category_Model = require('../../models/category.model');

class DetailCategoryController {
  async index(req, res) {
    const pageNumber = req.query.page || 1;
    const perPage = 8;
    try {
      if (req.query.search) {
        const [detailCategories, totalDetailCategories] = await Promise.all([
          DetailCategory_Model.find({
            name: new RegExp(escapeRegex(req.query.search), 'gi')
          }).populate({ path: 'category' }).limit(perPage).skip((pageNumber - 1) * perPage),
          DetailCategory_Model.find({
            name: new RegExp(escapeRegex(req.query.search), 'gi')
          }).populate({ path: 'category' })
        ]);
        return res.render('./backends/detailCategories/detailCategoriesView', {
          datas: mutipleMongooseToObject(detailCategories),
          pages: Math.ceil(totalDetailCategories.length / perPage),
          current: pageNumber
        })
      } else {
        const [detailCategories, totalDetailCategories] = await Promise.all([
          DetailCategory_Model.find({}).populate({ path: 'category' }).limit(perPage).skip((pageNumber - 1) * perPage),
          DetailCategory_Model.find({}).populate({ path: 'category' })
        ]);
        return res.render('./backends/detailCategories/detailcategoriesView', {
          datas: mutipleMongooseToObject(detailCategories),
          pages: Math.ceil(totalDetailCategories.length / perPage),
          current: pageNumber
        })
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async create(req, res) {
    try {
      const categories = await Category_Model.find({});
      return res.render('./backends/detailCategories/createDetailCategoryView', {
        categories: mutipleMongooseToObject(categories)
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async store(req, res) {
    try {
      await DetailCategory_Model.insertMany({
        name: req.body.name,
        category: req.body.category_id
      });
      return res.redirect('/admin/detailCategory');
    } catch (error) {
      console.log(error.message);
    }
  }

  async detail(req, res) {
    try {
      const detailCategory = await DetailCategory_Model.findById(req.params.id).populate({ path: 'category' });
      return res.render('./backends/detailCategories/detailCategoryView', {
        datas: mongooseToObject(detailCategory)
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  async edit(req, res) {
    try {
      const [detailCategory, categories] = await Promise.all([
        DetailCategory_Model.findById(req.params.id).populate({ path: 'category' }),
        Category_Model.find({})
      ]);
      return res.render('./backends/detailCategories/updateDetailCategoryView', {
        datas: mongooseToObject(detailCategory),
        categories: mutipleMongooseToObject(categories)
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  async update(req, res) {
    try {
      await DetailCategory_Model.updateOne({ _id: req.params.id }, {
        name: req.body.name,
        category: req.body.category_id
      })
      return res.redirect('/admin/detailCategory');
    } catch (error) {
      console.log(error.message);
    }
  }

  async delete(req, res) {
    try {
      await DetailCategory_Model.deleteOne({ _id: req.params.id });
      return res.redirect('/admin/detailCategory');
    } catch (error) {
      console.log(error.message);
    }
  }
}

module.exports = new DetailCategoryController;