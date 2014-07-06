var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nconf = require('nconf');
var mongoose = require('mongoose');

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

// Load config file.
nconf.argv().env().file({file: path.join(__dirname, '/config.json')});

// Check that the required configuration is present.
var requiredConfig = ['DB_HOST', 'DB_PORT', 'DB_NAME'];
requiredConfig.forEach(function(key) {
    if (nconf.get(key) == null) {
        throw new Error(key + ' is not defined. Ensure that you set it in config.json');
    }
});

// Persistence layer connection.
mongoose.connect(
    'mongodb://' +
    nconf.get('DB_HOST') + ':' +
    nconf.get('DB_PORT') + '/' +
    nconf.get('DB_NAME')
);

// Init the app.
var app = express();

// Routes to components.
var index = require('./routes/index');
var dishes = require('./routes/dishes');
var meals = require('./routes/meals');
var login = require('./routes/login');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

// API calls returned in JSON.
app.use('/api', function(req, res, next) {

    // Accept different origins than the same domain.
    var origin = (req.headers.origin || "*");
    res.setHeader("access-control-allow-origin", origin);
    next();
});

// Default route.
app.use('/', index);

app.use('/api', index);
app.use('/api/dishes', dishes);
app.use('/api/meals', meals);
app.use('/api/login', login);

/// catch 404 and forward to error handler
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
        res.send(err.message);
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
});

module.exports = app;
