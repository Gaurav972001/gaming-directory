const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const passport = require('passport');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser')


const app = express();

//body-parser
app.use(express.urlencoded({ limit: '16mb', extended: false }));
app.use(express.json());

// Method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

//Load config
dotenv.config({ path: './config/config.env' });

//sessions
app.use(cookieParser('keyboard cat'));
let today = new Date();
let milliseconds = today.getMilliseconds();
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  secure: false,
  saveUninitialized: false,
  cookie: {
    maxAge: (milliseconds + 86400000), //24 hours
    expires: new Date(Date.now() + 86400000), //24 hours
  },
  store: MongoStore.create({ mongoUrl: process.env.URI })
}))

//flash message middleware
app.use((req, res, next)=>{
  res.locals.message = req.session.message
  delete req.session.message
  next()
})

//mongoose error fix
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

//passport config
require('./config/passport')(passport);

//connect database
connectDB();

//logger
app.use(morgan('dev'));


//handlebars helper
const { formatDate, truncate, select, editIcon } = require('./helpers/hbs');

//handlebars
app.engine('.hbs', exphbs(
  {
    helpers:
      { formatDate, truncate, select, editIcon },
    defaultLayout: 'main', extname: '.hbs'
  }));
app.set('view engine', '.hbs');

//passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Set global var
app.use(function (req, res, next) {
  res.locals.user = req.user || null
  next()
})

//static 
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/games', require('./routes/games'));

const PORT = process.env.PORT || 4000;

app.listen(PORT, console.log(`Server is running on http://localhost:${PORT}`));
