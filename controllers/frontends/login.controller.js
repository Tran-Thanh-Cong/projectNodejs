class LoginController {
  index(req, res) {
    return res.render('./frontends/loginView.pug');
  }
}

module.exports = new LoginController;