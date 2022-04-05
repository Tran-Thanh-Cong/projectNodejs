class BlogController {
  index(req, res) {
    return res.render('./frontends/blogView');
  }
}

module.exports = new BlogController