const Category_Model = require('../../models/category.model');
const DetailCategory_Model = require('../../models/detailCategory.model');
const { filterData } = require('../../helpers/listCategory');
const Product_Model = require('../../models/product.model');
const { mutipleMongooseToObject, mongooseToObject } = require('../../helpers/convertDataToObject');
const { filterCategory } = require('../../helpers/filterCategory');
const { filterProductsCategory } = require('../../helpers/filterProducts');
const Cart_Model = require('../../models/cart.model');
const { verifyToken } = require('../../helpers/verifyToken');
const Review_Model = require('../../models/review.model');
const moment = require('moment');
class HomeController {
  async index(req, res) {
    try {
      const [
        category, detailCategory,
        productMaxSales,
        randomProducts,
        productsSale36,
        hotProducts,
        newProducts, todayProducts,
        product1, product2,
        productGalaxy1, productGalaxy2, productIpad1,
        productMacBook1, productMacBook2, productAppleWatch1, productAppleWatch2,
        featureProducts1, featureProducts2,
      ] = await Promise.all([
        Category_Model.find({}),
        DetailCategory_Model.find({}).populate({ path: 'category' }),
        Product_Model.find({}).sort({ discount: -1 }).limit(3),
        Product_Model.find({}).limit(4),
        Product_Model.find({
          discount: {
            $gte: 36
          }
        }).limit(3),
        Product_Model.find({
          createdAt: {
            $gte: new Date(2020, 4, 17),
            $lt: new Date()
          }
        }).populate({ path: 'detailCategory', populate: 'category' }).sort({ createdAt: -1 }).limit(6 * 7),
        Product_Model.find({
          createdAt: {
            $gte: new Date(2020, 4, 17),
            $lt: new Date()
          }
        }).sort({ createdAt: -1 }).limit(4),
        Product_Model.find({
          createdAt: {
            $gte: new Date(2020, 4, 17),
            $lt: new Date()
          }
        }).limit(3),
        Product_Model.find({}).limit(5),
        Product_Model.find({}).limit(5).skip(5),
        Product_Model.find({ name: { $regex: 'Samsung Galaxy', $options: 'i' } }).limit(3),
        Product_Model.find({ name: { $regex: 'Samsung Galaxy', $options: 'i' } }).limit(3).skip(3),
        Product_Model.find({ name: { $regex: 'iPad', $options: 'i' } }).limit(3),
        Product_Model.find({ name: { $regex: 'Macbook', $options: 'i' } }).limit(3),
        Product_Model.find({ name: { $regex: 'Macbook', $options: 'i' } }).limit(3).skip(4),
        Product_Model.find({ name: { $regex: 'Apple Watch', $options: 'i' } }).limit(3),
        Product_Model.find({ name: { $regex: 'Apple Watch', $options: 'i' } }).limit(3).skip(2),
        Product_Model.find({ name: { $regex: 'Samsung', $options: 'i' } }).limit(4),
        Product_Model.find({ name: { $regex: 'Bluetooth', $options: 'i' } }).limit(4),
      ]);
      const datas = category.map((data) => {
        return {
          _id: data._id,
          name: data.name,
          listCategory: filterData(detailCategory, data.name),
          __v: data.__v,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        };
      });
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
      res.locals.datas = datas;
      return res.render('./frontends/homeView', {
        bestSales: mutipleMongooseToObject(productMaxSales),
        randomProducts: mutipleMongooseToObject(randomProducts),
        productsSale36: mutipleMongooseToObject(productsSale36),
        hotSmartPhone: mutipleMongooseToObject(filterCategory(hotProducts, 'Smart Phone')),
        hotSmartWatch: mutipleMongooseToObject(filterCategory(hotProducts, 'Smart Watch')),
        hotTablet: mutipleMongooseToObject(filterCategory(hotProducts, 'Tablet')),
        hotLaptop: mutipleMongooseToObject(filterCategory(hotProducts, 'Laptops')),
        hotTainghe: mutipleMongooseToObject(filterCategory(hotProducts, 'Tai nghe')),
        hotMouse: mutipleMongooseToObject(filterCategory(hotProducts, 'Mouse')),
        newProducts: mutipleMongooseToObject(newProducts),
        todayProducts: mutipleMongooseToObject((todayProducts)),
        product1: mutipleMongooseToObject(product1),
        product2: mutipleMongooseToObject(product2),
        productGalaxy1: mutipleMongooseToObject(productGalaxy1),
        productGalaxy2: mutipleMongooseToObject(productGalaxy2),
        productIpad1: mutipleMongooseToObject(productIpad1),
        productMacBook1: mutipleMongooseToObject(productMacBook1),
        productMacBook2: mutipleMongooseToObject(productMacBook2),
        productAppleWatch1: mutipleMongooseToObject(productAppleWatch1),
        productAppleWatch2: mutipleMongooseToObject(productAppleWatch2),
        featureProducts1: mutipleMongooseToObject(featureProducts1),
        featureProducts2: mutipleMongooseToObject(featureProducts2)
      })
    } catch (err) {
      console.log(err.message);
    }
  }

  async detail(req, res) {
    try {
      const [product, relatedProduct, reviewProduct] = await Promise.all([
        Product_Model.findById(req.params.id).populate({ path: 'detailCategory', populate: 'category' }),
        Product_Model.find().populate({ path: 'detailCategory', populate: 'category' }),
        Review_Model.find().populate({ path: 'user_id' }).populate({ path: 'product_id' })
      ]);
      const review = reviewProduct.filter((data) => {
        return data.product_id._id.toString() === req.params.id
      });
      const datas = review.map((data) => {
        return {
          _id: data._id,
          user_id: {
            _id: data.user_id._id,
            username: data.user_id.username,
            email: data.user_id.email,
          },
          product_id: {
            _id: data.product_id._id,
            name: data.product_id.name
          },
          summary: data.summary,
          review: data.review,
          createdAt: moment(data.createdAt).format('DD-MM-YYYY')
        }
      })
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
        relatedProduct: mutipleMongooseToObject(filterProductsCategory(relatedProduct, product.detailCategory.category.name)),
        review: review.length > 0 ? mutipleMongooseToObject(review) : null,
        date: datas
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  async detailcategory(req, res) {
    try {
      const [category, products] = await Promise.all([
        Category_Model.findById(req.params.id),
        Product_Model.find({}).populate({ path: 'detailCategory', populate: 'category' })
      ]);
      return res.render('./frontends/shopView', {
        datas: mutipleMongooseToObject(filterProductsCategory(products, category.name))
      })
    } catch (error) {
      console.log(error.message)
    }
  }
}

module.exports = new HomeController;