var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sessions = require('express-session');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config/database');
var flash = require('connect-flash');
var validator = require('express-validator');

mongoose.connect(config.database);
var db = mongoose.connection;

//check connection
db.once('open',function(){
    console.log('Connected to mongodb');
});

//check db error
db.on('error',function(err){
    console.log(err);
});

var home = require('./routes/home');
var shop = require('./routes/shop');
var cart = require('./routes/cart');

var app = express();

//passport config
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});
require('./config/passportFacebook')(passport);
require('./config/passport')(passport);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(sessions({secret: 'ssshhhhh',resave:true, saveUninitialized:true}));
//passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req,res,next){
    res.locals.loggedin = req.isAuthenticated();
    res.locals.user = req.user || null;
    res.locals.error = null;
    res.locals.message = null;
    res.locals.messages = require('express-messages')(req,res);
    next();
});

app.use('/', home);
app.use('/shop', shop);
app.use('/cart', cart);
app.use('/myStyle',express.static(__dirname+'/public/stylesheets/style.css'));

// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//  var err = new Error('Not Found');
//  err.status = 404;
//  next(err);
//});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



app.listen(3000,function(){
    console.log('server active');
});

module.exports = app;
