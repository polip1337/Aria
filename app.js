var express = require('express');
var path = require('path');
var favicon = require ('serve-favicon')
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var https = require('https');
var fs = require('fs');
var gm = require('googlemaps');
var util = require('util');
var morgan = require('morgan');


var passport = require('passport');
var expressSession = require('express-session');

var app = express();


//=============== setup the logger ===============
app.use(morgan('combined', {stream: accessLogStream}))
//=============== view engine setup ===============

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));





//=============== create a write stream (in append mode)===============
var accessLogStream = fs.createWriteStream('./logs/mainlogs.log', {flags: 'a'})

//=============== DATABASE ===============
var mongoose = require('mongoose')
var connect = function () {
    var options = {server: {socketOptions: {keepAlive: 1}}};
    mongoose.connect("mongodb://heroku_app37690449:is1s2vl84k9qiq0kfu428p9j1@ds053320.mongolab.com:53320/heroku_app37690449", options);
};
connect();
mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);



/*
var mongoose = require('mongoose');



var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } };

var mongodbUri = 'mongodb://heroku_app37690449:is1s2vl84k9qiq0kfu428p9j1@ds053320.mongolab.com:53320/heroku_app37690449';


mongoose.connect(mongodbUri, options);

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
*/
//=============== PASSPORT ===============

// Configuring Passport
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());


var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);


//=============== ROUTES ===============

//var routes = require('./routes/index');
var routes = require('./routes/index')(passport);
app.use('/', routes);
var users = require('./routes/users');
var data = require('./routes/data');



//===============  Make our db accessible to our router/* ===============

app.use(function (req, res, next) {
    //req.db = db;
    next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/data', data);
/// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//=============== Https setup ===============

var options = {
    key: fs.readFileSync('unencripted.key'),
    cert: fs.readFileSync('cert.pem')
};

//=============== Create an HTTPS service identical to the HTTP service. ===============

https.createServer(options, app).listen(process.env.PORT || 1337, "0.0.0.0");

//=============== ERROR HANDLERS ===============

//=============== development error handler will print stacktrace===============
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

//=============== production error handler, no stacktraces leaked to user===============
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;