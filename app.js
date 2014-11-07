/**
 * Created by jeremyt on 07/11/14.
 */
//this is needed to read environment vars locally
var dotenv = require('dotenv');
dotenv.load();

// This is needed if the app is run on heroku:
var port = process.env.PORT;

var express = require('express');
var app = express();
var jwt = require('express-jwt');
var bodyParser = require('body-parser'); //bodyparser + json + urlencoder
var morgan  = require('morgan'); // logger
var db = require('./config/mongo_database');
var secret = require('./config/secret');
var path = require('path');

var auth = function (req, res, next) {
    if ( req.headers.authorization == "Bearer "+secret.secretToken) {
        next();
    }
    else {
        res.status(401).end();
    }
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


/********* routes *********/
var routes = {};
routes.competitions =   require('./routes/competitions.js');
routes.racetypes =      require('./routes/racetypes.js');
routes.seasons =        require('./routes/seasons.js');

/********* competition routes *********/
app.get('/competition',         auth,   routes.competitions.getAllCompetitions());
app.post('/competition',        auth,   routes.competitions.createCompetition());
app.delete('/competition/:id',  auth,   routes.competitions.deleteCompetition());

/********* racetype routes *********/
app.get('/racetype',            auth,   routes.racetypes.getAllRacetypes());
app.post('/racetype',           auth,   routes.racetypes.createRacetype());
app.put('/racetype',            auth,   routes.racetypes.updateRacetype());
app.delete('/racetype/:id',     auth,   routes.racetypes.deleteRacetype());

/********* season routes *********/
app.get('/season',              auth,   routes.seasons.getAllSeasons());
app.post('/season',             auth,   routes.seasons.createSeason());
app.put('/season',              auth,   routes.seasons.updateSeason());
app.delete('/season/:id',       auth,   routes.seasons.deleteSeason());

/********* start the server *********/
var server = app.listen(port);
console.log('NBR services is starting on port '+port);