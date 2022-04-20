const Product_Model = require('../../models/product.model');
const { mutipleMongooseToObject, mongooseToObject } = require('../../helpers/convertDataToObject');
class ShopController {
  async index(req, res) {
    const pageNumber = req.query.page;
    const perPage = 12;
    try {
      if (req.query.price) {
        const priceString = req.query.price.split('-');
        const price = priceString.map((i) => Number(i));
        const proPrice = await Product_Model.find({
          price: {
            $gte: price[0],
            $lt: price[1]
          }
        }).limit(perPage).skip((pageNumber - 1) * perPage);
        const pages = [];
        const totalPages = Math.ceil(proPrice.length / perPage);
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
        return res.render('./frontends/shopView', {
          datas: mutipleMongooseToObject(proPrice),
          pages: pages
        });
      } else {
        const [products, totalProducts] = await Promise.all([
          Product_Model.find({}).limit(perPage).skip((pageNumber - 1) * perPage),
          Product_Model.countDocuments()
        ]);
        const pages = [];
        const totalPages = Math.ceil(totalProducts / perPage);
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
        return res.render('./frontends/shopView', {
          datas: mutipleMongooseToObject(products),
          pages: pages
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  }
}

module.exports = new ShopController;