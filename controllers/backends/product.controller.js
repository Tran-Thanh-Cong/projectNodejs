const Product_Model = require('../../models/product.model');
const { mutipleMongooseToObject, mongooseToObject } = require('../../helpers/convertDataToObject');
const { escapeRegex } = require('../../helpers/escapeRegex');
const DetailCategory_Model = require('../../models/detailCategory.model');
class ProductController {
  async index(req, res) {
    const pageNumber = req.query.page || 1;
    const perPage = 10;
    try {
      if (req.query.search) {
        const [products, totalProducts] = await Promise.all([
          Product_Model.find({
            name: new RegExp(escapeRegex(req.query.search), 'gi') //search by name
          }).limit(perPage).skip((pageNumber - 1) * perPage),
          Product_Model.find({
            name: new RegExp(escapeRegex(req.query.search), 'gi') //search by name
          })
        ]);
        return res.render('./backends/products/productsView', {
          datas: mutipleMongooseToObject(products),
          pages: Math.ceil(totalProducts.length / perPage),
          current: pageNumber
        })
      }
      const [products, totalProducts] = await Promise.all([
        Product_Model.find().limit(perPage).skip((pageNumber - 1) * perPage),
        Product_Model.countDocuments()
      ]);
      return res.render('./backends/products/productsView', {
        datas: mutipleMongooseToObject(products),
        pages: Math.ceil(totalProducts / perPage),
        current: pageNumber
      })
    } catch (err) {
      console.log(err.message);
    }
  }

  async create(req, res) {
    try {
      const categories = await DetailCategory_Model.find({});
      return res.render('./backends/products/createProductView', {
        categories: mutipleMongooseToObject(categories)
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async store(req, res) {
    try {
      await Product_Model.insertMany({
        name: req.body.name,
        price: req.body.price,
        discount: req.body.discount,
        amount: req.body.amount,
        images: req.file.filename,
        detailCategory: req.body.category_id,
      });
      return res.redirect('/admin/products');
    } catch (err) {
      console.log(err.message);
    }
  }

  async detail(req, res) {
    try {
      const data = await Product_Model.findById(req.params.id).populate({ path: 'detailCategory', populate: 'category' });
      return res.render('./backends/products/productDetailView', {
        datas: mongooseToObject(data)
      })
    } catch (err) {
      console.log(err.message);
    }
  }

  async edit(req, res) {
    try {
      const [product, categories] = await Promise.all([
        Product_Model.findById(req.params.id).populate({ path: 'detailCategory', populate: 'category' }),
        DetailCategory_Model.find({})
      ])
      return res.render('./backends/products/updateProductView', {
        datas: mongooseToObject(product),
        categories: mutipleMongooseToObject(categories)
      });
    } catch (err) {
      console.log(err.message);
    }
  }

  async update(req, res) {
    try {
      var data;
      if (req.file) {
        data = {
          name: req.body.name,
          price: req.body.price,
          discount: req.body.discount,
          amount: req.body.amount,
          images: req.file.filename,
          detailCategory: req.body.category_id
        }
      } else {
        data = {
          name: req.body.name,
          price: req.body.price,
          discount: req.body.discount,
          amount: req.body.amount,
          detailCategory: req.body.category_id
        }
      }
      await Product_Model.updateOne({ _id: req.params.id }, data);
      return res.redirect('/admin/products');
    } catch (err) {
      console.log(err.message);
    }
  }

  async delete(req, res) {
    try {
      await Product_Model.deleteOne({ _id: req.params.id });
      return res.redirect('/admin/products');
    } catch (err) {
      console.log(err.message);
    }
  }
}

module.exports = new ProductController;