class ShopController {
  index(req, res) {
    return res.render('./frontends/shopView.pug');
  }
}

module.exports = new ShopController;