const Category_Model = require('../../models/category.model');
const DetailCategory_Model = require('../../models/detailCategory.model');
const { filterData } = require('../../helpers/listCategory');
const Product_Model = require('../../models/product.model');
const { mutipleMongooseToObject, mongooseToObject } = require('../../helpers/convertDataToObject');
const { filterCategory } = require('../../helpers/filterCategory');
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
      const product = await Product_Model.findById(req.params.id).populate({ path: 'detailCategory', populate: 'category' });
      return res.render('./frontends/detailProductView', {
        datas: mongooseToObject(product),
      })
    } catch (error) {
      console.log(error.message);
    }
  }

}

module.exports = new HomeController;