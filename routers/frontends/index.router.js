const express = require('express');
const router = express.Router();
const home = require('../../controllers/frontends/home.controller');
const login = require('../../controllers/frontends/login.controller');
const register = require('../../controllers/frontends/register.controller');
const shop = require('../../controllers/frontends/shop.controller');
const blog = require('../../controllers/frontends/blog.controller');
const contact = require('../../controllers/frontends/contact.controller');
const logout = require('../../controllers/frontends/logout.controller');
const verifyEmail = require('../../controllers/frontends/verifyEmail.controller');
const authMiddleware = require('../../middlewares/auth.middleware')

// home router
router.get('/', home.index);
router.get('/shop/:id', home.detailcategory);

// login router
router.get('/login', login.login_get);
router.post('/login', login.login_post);

//register router
router.get('/register', register.register_get);
router.post('/register', register.register_post);

//verify-email routes
router.get('/verify-email', verifyEmail.verifyEmail)

// logout router
router.get('/logout', logout.logout);

//product
router.get('/product/:id', home.detail);
router.post('/product/:id', authMiddleware.authUser, shop.addToCart);

// shop router
router.get('/shop', shop.index);
router.get('/shop/product/:id', shop.detailProduct);
// blog router
router.get('/blog', blog.index);

//contact router
router.get('/contact', contact.index);

module.exports = router;