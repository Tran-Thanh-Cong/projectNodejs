const Product_Model = require('../../models/product.model');
const { mutipleMongooseToObject, mongooseToObject } = require('../../helpers/convertDataToObject');
const { escapeRegex } = require('../../helpers/escapeRegex');

class ProductController {
  async index(req, res) {
    const pageNumber = req.query.page;
    const perPage = 5;
    try {
      if (req.query.search) {
        const [products, totalProducts] = await Promise.all([
          Product_Model.find({
            name: new RegExp(escapeRegex(req.query.search), 'gi') //search by name
          }).limit(perPage).skip((pageNumber - 1) * perPage),
          Product_Model.countDocuments()
        ]);
        const pages = [];
        const totalPages = Math.ceil(totalProducts / perPage);
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
        return res.render('./backends/products/productsView', {
          datas: mutipleMongooseToObject(products),
          pages: pages,
        })
      }
      const [products, totalProducts] = await Promise.all([
        Product_Model.find().limit(perPage).skip((pageNumber - 1) * perPage),
        Product_Model.countDocuments()
      ]);
      const pages = [];
      const totalPages = Math.ceil(totalProducts / perPage);
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return res.render('./backends/products/productsView', {
        datas: mutipleMongooseToObject(products),
        pages: pages,
      })
    } catch (err) {
      console.log(err.message);
    }
    return res.render('./backends/products/productsView');
  }

  create(req, res) {
    return res.render('./backends/products/createProductView');
  }

  async detail(req, res) {
    try {
      const data = await Product_Model.findById(req.params.id);
      return res.render('./backends/products/productDetailView', {
        datas: mongooseToObject(data)
      })
    } catch (err) {
      console.log(err.message);
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
      });
      return res.redirect('/admin/products');
    } catch (err) {
      console.log(err.message);
    }
  }

  async edit(req, res) {
    try {
      const data = await Product_Model.findById(req.params.id);
      return res.render('./backends/products/updateProductView', {
        datas: mongooseToObject(data),
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
          images: req.file.filename
        }
      } else {
        data = {
          name: req.body.name,
          price: req.body.price,
          discount: req.body.discount,
          amount: req.body.amount,
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