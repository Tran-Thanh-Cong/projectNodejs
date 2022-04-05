const express = require('express');
const router = express.Router();
const home = require('../../controllers/frontends/home.controller');
const login = require('../../controllers/frontends/login.controller');
const register = require('../../controllers/frontends/register.controller');
const shop = require('../../controllers/frontends/shop.controller');
const blog = require('../../controllers/frontends/blog.controller');
const contact = require('../../controllers/frontends/contact.controller');

// home router
router.get('/', home.index);

// login router
router.get('/login', login.index);

//register routes
router.get('/register', register.index);

// shop router
router.get('/shop', shop.index);

// blog router
router.get('/blog', blog.index);

//contact router
router.get('/contact', contact.index);

module.exports = router;