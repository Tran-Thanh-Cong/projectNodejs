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
const cart = require('../../controllers/frontends/cart.controller');
const order = require('../../controllers/frontends/order.controller');

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
router.get('/wait', verifyEmail.index);
// logout router
router.get('/logout', logout.logout);

//product
router.get('/product/:id', home.detail);

// shop router
router.get('/shop', shop.index);
router.get('/shop/product/:id', shop.detailProduct);
router.post('/shop/product/:id', authMiddleware.authUser, cart.addToCart);

//cart router
router.post('/product/:id', authMiddleware.authUser, cart.addToCart);
router.get('/cart-checkout', authMiddleware.authUser, cart.cartCheckout);
router.get('/express-checkout', authMiddleware.authUser, cart.expressCheckoutCart);
router.get('/clear-cart', authMiddleware.authUser, cart.delete);
router.get('/remove-product-cart/:id', authMiddleware.authUser, cart.removeProductCart);
router.get('/add-to-cart/:id', authMiddleware.authUser, cart.addProduct);

//order router
router.post('/express-checkout', authMiddleware.authUser, order.index);
router.post('/payment', authMiddleware.authUser, order.payment);

// blog router
router.get('/blog', blog.index);

//contact router
router.get('/contact', contact.index);
router.post('/contact', authMiddleware.authUser, contact.contact);

module.exports = router;