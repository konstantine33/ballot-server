'use strict';
var _ = require('lodash');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var cookieParser = require('cookie-parser');
var passport = require('passport');
var Promise = require('bluebird');
var mongoose = Promise.promisifyAll(require('mongoose'));
var BError = require('helpers/BError');

mongoose.connect(require('config/mongo').getUrl());

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log('Connected to MongoDB');
});

//walks through and registers models by requiring all files except the helpers directory
require('require-directory')(module, 'models', /helpers/);

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    store: new RedisStore(
        {
            TTL: 60*60*24*14
        }
    ),
    secret: 'monkey12345',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
require('config/passport')(passport);

// Development logging & playground
if (app.get('env') !== 'production') {
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
    app.use(morgan('dev'));
    app.set('views', 'playground');
    app.use('/playground/static', express.static('playground/static'));
    app.get('/playground', function (req, res, next) {
        res.render('index');
    });
}

// API Routing
app.use('/auth', require('routers/auth_router'));
app.use('/*', function(req,res,next){
    if(!req.user){
       return next(BError(400, "Not logged into server."))
    }
    next()
});

app.use('/ballot', require('routers/ballot_router'));

//Renders invalid api error catching
app.get('/*', function (req, res, next) {
    next(BError(404, "Invalid API Address"))
});

//Error handler
app.use(function (err, req, res, next) {
    var error = err.cause || err;

    if (error.name === "MongoError" && (error.code === 11000 || error.code === 11001)) {
        console.log(error);
        return res.send(400, error.err);
    } else if (error.name === "ValidationError") {
        console.log(error);
        var message = '';
        _.forIn(error.errors, function (e) {
            message += e.message;
        });
        return res.send(400, message);
    } else if (error.name === "BallotError") {
        console.log(error);
        return res.send(error.status || 400, error.message);
    }

    next(err);
});

app.use(function (err, req, res, next) {
    console.error(err, err.stack);
    res.send(500, err.message || err);
});

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port') + ' in ' + app.get('env') + ' mode.');
});