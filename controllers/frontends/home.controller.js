class HomeController {
  async index(req, res) {
    try {
      return res.render('./frontends/homeView')
    } catch (err) {
      console.log(err.message);
    }
  }
}

module.exports = new HomeController;