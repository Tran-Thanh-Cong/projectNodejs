const Product_Model = require('../../models/product.model');
const { mutipleMongooseToObject, mongooseToObject } = require('../../helpers/convertDataToObject');
const Cart = require('../../models/Cart.model');
const { escapeRegex } = require('../../helpers/escapeRegex');
const { filterProductsCategory, filterProductsDetailCategory } = require('../../helpers/filterProducts');
const Category_Model = require('../../models/category.model');
class ShopController {
  async index(req, res) {
    const pageNumber = req.query.page;
    const perPage = 8;
    try {

      if (req.query.search) {
        const [products, categories] = await Promise.all([
          Product_Model.find({ name: new RegExp(escapeRegex(req.query.search), 'gi') }).limit(perPage).skip((pageNumber - 1) * perPage),
          Category_Model.find({}),
        ]);
        const pages = [];
        const totalPages = Math.ceil(products.length / perPage);
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
        return res.render('./frontends/shopView', {
          datas: mutipleMongooseToObject(products),
          pages: pages,
          categories: mutipleMongooseToObject(categories)
        });
      }

      if (req.query.price) {
        const priceString = req.query.price.split('-');
        const price = priceString.map((i) => Number(i));
        const [proPrice, categories] = await Promise.all([
          Product_Model.find({
            price: {
              $gte: price[0],
              $lt: price[1]
            }
          }).limit(perPage).skip((pageNumber - 1) * perPage),
          Category_Model.find({})
        ]);
        const pages = [];
        const totalPages = Math.ceil(proPrice.length / perPage);
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
        return res.render('./frontends/shopView', {
          datas: mutipleMongooseToObject(proPrice),
          pages: pages,
          categories: mutipleMongooseToObject(categories),
        });
      }

      const [products, totalProducts, categories] = await Promise.all([
        Product_Model.find({}).limit(perPage).skip((pageNumber - 1) * perPage),
        Product_Model.countDocuments(),
        Category_Model.find({})
      ]);
      const pages = [];
      const totalPages = Math.ceil(totalProducts / perPage);
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return res.render('./frontends/shopView', {
        datas: mutipleMongooseToObject(products),
        pages: pages,
        categories: mutipleMongooseToObject(categories)
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async detailProduct(req, res) {
    try {
      const [product, relatedProduct] = await Promise.all([
        Product_Model.findById(req.params.id).populate({ path: 'detailCategory', populate: 'category' }),
        Product_Model.find().populate({ path: 'detailCategory', populate: 'category' })
      ]);
      return res.render('./frontends/detailProductView', {
        datas: mongooseToObject(product),
        relatedProduct: mutipleMongooseToObject(filterProductsCategory(relatedProduct, product.detailCategory.category.name))
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  addToCart(req, res) {
    const cart = new Cart(req.session.cart ? req.session.cart : {});
    Product_Model.findById(req.params.id, (err, product) => {
      if (err) {
        console.log(err.message);
      }
      cart.add(product, product.id, Number(req.body.add_product));
      req.session.cart = cart;
      return res.redirect('/');
    })
  }
}

module.exports = new ShopController;