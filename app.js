var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nconf = require('nconf');
var mongoose = require('mongoose');

// Load config file.
nconf.argv().env().file({file: path.join(__dirname, '/config_backend.json')});

// Check that the required configuration is present.
var requiredConfig = ['EAT_DB_URI'];
requiredConfig.forEach(function(key) {
    if (nconf.get(key) == null && process.env[key] == null) {
        throw new Error(key + ' is not defined. Ensure that you set it in an ENV var or in config.json');
    }
});

// Persistence layer connection.
mongoose.connect(process.env.EAT_DB_URI || nconf.get('EAT_DB_URI'));

// Init the app.
var app = express();

// Routes to components.
var download = require('./routes/download');

var index = require('./routes/index');
var login = require('./routes/login');
var users = require('./routes/users');
var locations = require('./routes/locations');
var locationSubscriptions = require('./routes/locationSubscriptions');
var dishes = require('./routes/dishes');
var meals = require('./routes/meals');

app.use(favicon());
app.use(logger('dev'));

// Increasing request size as the image comes with the dish data.
app.use(bodyParser.json({
    limit : '3mb'
}));

app.use(bodyParser.urlencoded());
app.use(cookieParser());

// Response headers.
app.use('/api', function(req, res, next) {

    // Accept different origins than the same domain.
    var origin = (req.headers.origin || "*");
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Content-Length, X-Requested-With');
    next();
});

// Default route.
app.use('/', index);

app.use('/download', download);

app.use('/api', index);
app.use('/api/login', login);
app.use('/api/users', users);
app.use('/api/locations', locations);
app.use('/api/location-subscriptions', locationSubscriptions);
app.use('/api/dishes', dishes);
app.use('/api/meals', meals);

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
