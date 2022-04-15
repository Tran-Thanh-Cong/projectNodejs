class LogoutController {
  logout(req, res) {
    res.clearCookie('token');
    return res.redirect('/');
  }
}

module.exports = new LogoutController;