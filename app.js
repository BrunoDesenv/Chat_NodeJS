const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const users = require('./routes/users');
const index = require('./routes/index');

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

require('./auth')(passport);

app.use(session({  
  store: new MongoStore({
    //url: 'mongodb://localhost:27017/chatdemo',
    db: global.db,
    ttl: 30 * 60 // = 30 minutos de sessão
  }),
  secret: '123',//configure um segredo seu aqui
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

module.exports = app;
