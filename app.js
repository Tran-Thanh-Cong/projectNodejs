const express = require('express');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const { connect } = require('./config/connect');
const Router = require('./routers/app.router');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const PORT = process.env.PORT || 3000;

//middleware
app.use(express.static(path.join(__dirname, './public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('_method'));

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