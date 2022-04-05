class RegisterController {
  index(req, res) {
    return res.render('./frontends/registerView');
  }
}

module.exports = new RegisterController;