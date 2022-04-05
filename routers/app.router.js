const users = require('./frontends/index.router');

function Router(app) {
  app.use('/', users);
}

module.exports = Router;