class ContactController {
  index(req, res) {
    return res.render('./frontends/contactView');
  }
}

module.exports = new ContactController;