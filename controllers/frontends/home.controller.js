const Category_Model = require('../../models/category.model');
const DetailCategory_Model = require('../../models/detailCategory.model');
const { filterData } = require('../../helpers/listCategory');
const Product_Model = require('../../models/product.model');
const { mutipleMongooseToObject, mongooseToObject } = require('../../helpers/convertDataToObject');
const { filterCategory } = require('../../helpers/filterCategory');
const { listProducts } = require('../../helpers/listProducts');
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
        product1, product2
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
        product2: mutipleMongooseToObject(product2)
      })
    } catch (err) {
      console.log(err.message);
    }
  }
}

module.exports = new HomeController;