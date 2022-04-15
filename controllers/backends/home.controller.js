class HomeController {
  index(req, res) {
    return res.render('./backends/homeView');
  }
}

module.exports = new HomeController;