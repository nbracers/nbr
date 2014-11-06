/**
 * Created by jeremyt on 10/09/14.
 */
//this is needed to read environment vars locally
//variables needed for the app are: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, REDISTOGO_URL, SECRET_TOKEN
var dotenv = require('dotenv');
dotenv.load();

// This is needed if the app is run on heroku:
var port = process.env.PORT;

var express = require('express');
var app = express();
var jwt = require('express-jwt');
var bodyParser = require('body-parser'); //bodyparser + json + urlencoder
var morgan  = require('morgan'); // logger
//var db = require('./config/mongo_database');
var secret = require('./config/secret');
var path = require('path');

var auth = function (req, res, next) {

    if ( req.headers.authorization == "Bearer camenbert")
     next();
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));    // set the static files location (css, js, etc..)
app.all('*', function(req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Credentials', true);
    res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
    res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
    if ('OPTIONS' == req.method) return res.status(200).end();
    next();
});

/********* start the server *********/
var server = app.listen(port);

/********* routes *********/
var routes = {};
routes.default =     require('./routes/default.js');

app.get('/te', auth, routes.default.testEnc());

console.log('NBR services is starting on port '+port);