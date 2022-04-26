const Product_Model = require('../../models/product.model');
const { mutipleMongooseToObject, mongooseToObject } = require('../../helpers/convertDataToObject');
const { escapeRegex } = require('../../helpers/escapeRegex');
const { filterProductsCategory, filterProductsDetailCategory } = require('../../helpers/filterProducts');
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