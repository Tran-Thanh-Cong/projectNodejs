const Product_Model = require('../../models/product.model');
const { mutipleMongooseToObject, mongooseToObject } = require('../../helpers/convertDataToObject');
const { escapeRegex } = require('../../helpers/escapeRegex');
const { filterProductsCategory } = require('../../helpers/filterProducts');
const Cart_Model = require('../../models/cart.model');
const { verifyToken } = require('../../helpers/verifyToken');
const Review_Model = require('../../models/review.model');
class ShopController {
  async index(req, res) {
    const pageNumber = req.query.page || 1;
    const perPage = 8;
    try {
      if (req.query.search) {
        const [products, totalProducts] = await Promise.all([
          Product_Model.find({ name: new RegExp(escapeRegex(req.query.search), 'gi') }).limit(perPage).skip((pageNumber - 1) * perPage),
          Product_Model.find({ name: new RegExp(escapeRegex(req.query.search), 'gi') })
        ]);
        return res.render('./frontends/shopView', {
          datas: mutipleMongooseToObject(products),
          pages: Math.ceil(totalProducts.length / perPage),
          current: pageNumber
        });
      }
      if (req.query.price) {
        const priceString = req.query.price.split('-');
        const price = priceString.map((i) => Number(i));
        const [proPrice, totalProPri] = await Promise.all([
          Product_Model.find({
            price: {
              $gte: price[0],
              $lt: price[1]
            }
          }).limit(perPage).skip((pageNumber - 1) * perPage),
          Product_Model.find({
            price: {
              $gte: price[0],
              $lt: price[1]
            }
          })
        ]);
        return res.render('./frontends/shopView', {
          datas: mutipleMongooseToObject(proPrice),
          pages: Math.ceil(totalProPri.length / perPage),
          current: pageNumber
        });
      }
      if (req.query.sortName) {
        const [productSortName, totalProducts] = await Promise.all([
          Product_Model.find({}, null, { sort: { name: 1 } }).limit(perPage).skip((pageNumber - 1) * perPage),
          Product_Model.countDocuments()
        ]);
        return res.render('./frontends/shopView', {
          datas: mutipleMongooseToObject(productSortName),
          pages: Math.ceil(totalProducts / perPage),
          current: pageNumber
        })
      }
      if (req.query.sortPrice) {
        const [productSortPrice, totalProducts] = await Promise.all([
          Product_Model.find({}).sort({ price: -1 }).limit(perPage).skip((pageNumber - 1) * perPage),
          Product_Model.countDocuments()
        ]);
        return res.render('./frontends/shopView', {
          datas: mutipleMongooseToObject(productSortPrice),
          pages: Math.ceil(totalProducts / perPage),
          current: pageNumber
        })
      }
      const [products, totalProducts] = await Promise.all([
        Product_Model.find({}).limit(perPage).skip((pageNumber - 1) * perPage),
        Product_Model.countDocuments(),
      ]);
      if (req.cookies.token) {
        const decodedToken = await verifyToken(req.cookies.token);
        const cartProduct = await Cart_Model.find({ user_id: decodedToken.id });
        if (cartProduct.length > 0) {
          res.locals.cart = cartProduct[0];
          res.locals.cartProduct = cartProduct[0].products
        } else {
          res.locals.cart = null;
          res.locals.cartProduct = null;
        }
      }
      return res.render('./frontends/shopView', {
        datas: mutipleMongooseToObject(products),
        pages: Math.ceil(totalProducts / perPage),
        current: pageNumber
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

      if (req.cookies.token) {
        const decodedToken = await verifyToken(req.cookies.token);
        const cartProduct = await Cart_Model.find({ user_id: decodedToken.id });
        if (cartProduct.length > 0) {
          res.locals.cart = cartProduct[0];
          res.locals.cartProduct = cartProduct[0].products
        } else {
          res.locals.cart = null;
          res.locals.cartProduct = null;
        }
      }

      if (req.cookies.token) {
        const decodedToken = await verifyToken(req.cookies.token);
        if (req.query.reviews && req.query.summary) {
          await Review_Model.insertMany({
            user_id: decodedToken.id,
            summary: req.query.summary,
            review: req.query.reviews,
            product_id: req.params.id
          });
          return res.redirect('/shop');
        }
      }
      return res.render('./frontends/detailProductView', {
        datas: mongooseToObject(product),
        relatedProduct: mutipleMongooseToObject(filterProductsCategory(relatedProduct, product.detailCategory.category.name))
      })
    } catch (error) {
      console.log(error.message);
    }
  }
}

module.exports = new ShopController;