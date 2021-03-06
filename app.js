var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var util = require('util');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var session = require('express-session');
var flash = require('connect-flash');
var routes = require('./routes/index');
var users = require('./routes/users');
var MongoStore = require('connect-mongo')(session);
var settings = require('./settings');
var app = express();

//console.log(MongoStore.toString());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(flash());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
//app.use(express.methodOverride());
app.use(cookieParser());
app.use(session({
  secret: settings.cookieSecret,
  store: new MongoStore({
    db: settings.db
  })
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials());

app.use(function(req, res, next) {
  res.locals.headers = req.headers;
  res.locals.user = req.session.user;
  //res.locals.success = req.session.success;
  res.locals.success = req.flash('success');
  if (res.locals.success.length == 0) res.locals.success = null;
  res.locals.error = req.flash('error');
  if (res.locals.error.length == 0) res.locals.error = null;
  console.log(res.locals.success);
  next();
});

app.use('/', routes);
app.use('/users', users);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//app.helpers({
  //inspect: function(obj) {
    //return util.inspect(obj, true);
  //}
//});

//app.dynamicHelpers({
  //headers: function(req, res) {
    //return req.headers;
  //}
//});

module.exports = app;
