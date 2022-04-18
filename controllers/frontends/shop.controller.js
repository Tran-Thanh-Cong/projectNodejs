class ShopController {
  async index(req, res) {
    const pageNumber = req.query.page
    const perPage = 10
    try {
      return res.render('./frontends/shopView.pug');
    } catch (error) {
      console.log(error.message);
    }
  }
}

module.exports = new ShopController;