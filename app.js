const express = require('express');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const { connect } = require('./config/connect');
const Router = require('./routers/app.router');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const PORT = process.env.PORT || 5000;

//middleware
app.use(express.static(path.join(__dirname, './public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(session({
  secret: 'mysupersecret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: 'mongodb://localhost/nodejs_express',
    ttl: 14 * 24 * 60 * 60
  })
}));

app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});

//view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


//use environment variables
dotenv.config();

//connect mongodb
connect();

//router application
Router(app);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});