'use strict';
var _ = require('lodash');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var cookieParser = require('cookie-parser');
var passport = require('passport');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(bodyParser());
app.use(cookieParser());
app.use(session({
    store: new RedisStore(
        {
            TTL: 60*60*24*14
        }
    ),
    secret: 'monkey12345'
}));

app.use(passport.initialize());
app.use(passport.session());

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

//Renders invalid api error catching
app.get('/*', function (req, res, next) {
    res.send(200, {value: true});
});

//Error handler
app.use(function (err, req, res, next) {
    console.log(err);
    console.log(err.stack);
    res.send(500, err);
});

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port') + ' in ' + app.get('env') + ' mode.');
});