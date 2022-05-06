class HomeController {
  index(req, res) {
    const date = new Date('yyyy-mm-dd');
    console.log(date);
    return res.render('./backends/homeView', {
      date: date.getDay()
    });
  }
}

module.exports = new HomeController;