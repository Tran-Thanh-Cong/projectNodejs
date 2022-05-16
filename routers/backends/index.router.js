const express = require('express');
const router = express.Router();
const home = require('../../controllers/backends/home.controller');
const login = require('../../controllers/backends/login.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const upload = require('../../helpers/uploadImage');
const user = require('../../controllers/backends/user.controller');
const logout = require('../../controllers/backends/logout.controller');
const product = require('../../controllers/backends/product.controller');
const admin = require('../../controllers/backends/admin.controller');
const category = require('../../controllers/backends/category.controller');
const detailCategory = require('../../controllers/backends/detalCategory.controller');
const order = require('../../controllers/backends/order.controller');

// home router
router.get('/', authMiddleware.authAdmin, home.index);

//login router
router.get('/login', login.login_get);
router.post('/login', login.login_post);

//logout router
router.get('/logout', logout.logout);

//products router
router.get('/products', authMiddleware.authAdmin, product.index);
router.get('/products/create', authMiddleware.authAdmin, product.create);
router.post('/products/create', authMiddleware.authAdmin, upload.single('image'), product.store);
router.get('/products/edit/:id', authMiddleware.authAdmin, product.edit);
router.get('/products/detail/:id', authMiddleware.authAdmin, product.detail);
router.put('/products/edit/:id', authMiddleware.authAdmin, upload.single('image'), product.update);
router.delete('/products/delete/:id', authMiddleware.authAdmin, product.delete);

//categories router
router.get('/category', authMiddleware.authAdmin, category.index);
router.get('/category/create', authMiddleware.authAdmin, category.create);
router.post('/category/create', authMiddleware.authAdmin, category.store);
router.get('/category/edit/:id', authMiddleware.authAdmin, category.edit);
router.put('/category/edit/:id', authMiddleware.authAdmin, category.update);
router.delete('/category/delete/:id', authMiddleware.authAdmin, category.delete);

//detailCategory router
router.get('/detailCategory', authMiddleware.authAdmin, detailCategory.index)
router.get('/detailCategory/create', authMiddleware.authAdmin, detailCategory.create);
router.post('/detailCategory/create', authMiddleware.authAdmin, detailCategory.store);
router.get('/detailCategory/detail/:id', authMiddleware.authAdmin, detailCategory.detail);
router.get('/detailCategory/edit/:id', authMiddleware.authAdmin, detailCategory.edit);
router.put('/detailCategory/edit/:id', authMiddleware.authAdmin, detailCategory.update);
router.delete('/detailCategory/delete/:id', authMiddleware.authAdmin, detailCategory.delete);

//users router
router.get('/users', authMiddleware.authAdmin, user.index);
router.get('/users/detail/:id', authMiddleware.authAdmin, user.detail);
router.delete('/users/delete/:id', authMiddleware.authAdmin, user.delete);

//orders router
router.get('/orders', authMiddleware.authAdmin, order.index);
router.get('/order/detail/:id', authMiddleware.authAdmin, order.detail);

//admins router
router.get('/employees', authMiddleware.authAdmin, admin.index);
router.get('/employees/create', authMiddleware.authAdmin, admin.create);
router.post('/employees/create', authMiddleware.authAdmin, admin.store);
router.get('/employees/detail/:id', authMiddleware.authAdmin, admin.detail);
router.delete('/employees/delete/:id', authMiddleware.authAdmin, admin.delete);


module.exports = router;