const Product_Model = require('../../models/product.model');
const { mutipleMongooseToObject, mongooseToObject } = require('../../helpers/convertDataToObject');
const { escapeRegex } = require('../../helpers/escapeRegex');
const { filterProductsCategory, filterProductsDetailCategory } = require('../../helpers/filterProducts');
const Cart_Model = require('../../models/Cart.model');
const { verifyToken } = require('../../helpers/verifyToken');
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

  async addToCart(req, res) {
    try {
      const [decodedToken, product] = await Promise.all([
        verifyToken(req.cookies.token),
        Product_Model.findById(req.params.id)
      ]);
      let cart = await Cart_Model.findOne({ user_id: decodedToken.id });
      if (cart) {
        //product exists in the cart, update the quantity
        let itemIndex = cart.products.findIndex(p => p.productID == req.params.id);
        if (itemIndex > -1) {
          debugger
          let productItem = cart.products[itemIndex];
          productItem.quantity += Number(req.body.add_product);
          cart.products[itemIndex] = productItem;
          cart.totalPrice += productItem.price * Number(req.body.add_product);
          cart.totalItems += Number(req.body.add_product);
        } else {
          //product does not exists in cart, add new item
          cart.products.push({
            productID: product._id,
            quantity: Number(req.body.add_product),
            name: product.name,
            images: product.images,
            price: product.price * (1 - product.discount * 0.01)
          })
          cart.totalPrice += Number(req.body.add_product) * product.price * (1 - product.discount * 0.01);
        }
        cart.totalItems += Number(req.body.add_product)
        cart = await cart.save();
        const datas = await Cart_Model.findOne({ user_id: decodedToken.id });
        res.locals.shop = datas;
        res.locals.addtoCart = mutipleMongooseToObject(datas.products)
        return res.redirect('/shop');
      } else {
        //no cart for user, create a new cart
        let cart = await Cart_Model.insertMany({
          user_id: decodedToken.id,
          products: [{
            productID: product._id,
            quantity: Number(req.body.add_product),
            name: product.name,
            images: product.images,
            price: product.price * (1 - product.discount * 0.01)
          }],
          totalItems: Number(req.body.add_product),
          totalPrice: (product.price * (1 - product.discount * 0.01)) * Number(req.body.add_product)
        });
        const datas = await Cart_Model.findOne({ user_id: decodedToken.id });
        res.locals.shop = datas;
        res.locals.addtoCart = mutipleMongooseToObject(datas.products)
        return res.redirect('/shop');
      }
    } catch (error) {
      console.log(error.message);
    }
  }

}

module.exports = new ShopController;