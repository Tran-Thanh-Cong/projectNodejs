const users = require('./frontends/index.router');
const admins = require('./backends/index.router');
const authMiddleware = require('../middlewares/auth.middleware');

function Router(app) {
  app.use('/', authMiddleware.checkUser, users);
  app.use('/admin', authMiddleware.checkAdmin, admins);
}

module.exports = Router;