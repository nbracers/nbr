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
routes.coordinates =    require('./routes/coordinates.js');
routes.members =        require('./routes/members.js');
routes.messages =       require('./routes/messages.js');
routes.racers =         require('./routes/racers.js');
routes.racetypes =      require('./routes/racetypes.js');
routes.results =        require('./routes/results.js');
routes.seasons =        require('./routes/seasons.js');

/********* competition routes *********/
app.get('/competition',                             routes.competitions.getAllCompetitions());
app.get('/competition/:seasonId',                   routes.competitions.getCompetitionsWithSeasonId());
app.get('/competition/full/:seasonId',              routes.competitions.getFullCompetitionsWithSeasonId());
app.post('/competition',                    auth,   routes.competitions.createCompetition());
app.delete('/competition/:id',              auth,   routes.competitions.deleteCompetition());

/********* coordinate routes *********/
app.get('/presidentCoordinates',                    routes.coordinates.getCoordinates());
app.put('/presidentCoordinates',            auth,   routes.coordinates.updateCoordinates());

/********* member routes *********/
app.get('/member',                                  routes.members.getAllMembers());
app.post('/member',                         auth,   routes.members.createMember());
app.put('/member',                          auth,   routes.members.addRacerToMember());
app.put('/member/:id/addRacer',             auth,   routes.members.addRacerToMember());
app.put('/member/:id/removeRacer',          auth,   routes.members.removeRacerFromMember());
app.delete('/member/:id',                   auth,   routes.members.deleteMember());

/********* message routes *********/
app.get('/message',                                 routes.messages.getAllMessages());
app.get('/message/latest',                          routes.messages.getLatestMessages());
app.post('/message',                        auth,   routes.messages.createMessage());
app.delete('/message/:id',                  auth,   routes.messages.deleteMessage());

/********* racer routes *********/
app.get('/racer',                                   routes.racers.getAllRacers());
app.get('/racer/:seasonId',                         routes.racers.getRacersBySeason());
app.get('/racer/full/:seasonId',                         routes.racers.getFullRacersBySeason());
app.get('/racer/competition/:competitionId',        routes.racers.getRacersByCompetition());
app.get('/racer/podium/:seasonId',                  routes.racers.getRacerPodiumBySeason());
app.post('/racer',                          auth,   routes.racers.createRacer());
app.put('/racer',                           auth,   routes.racers.updateRacer());
app.put('/racer/:id/addResult',             auth,   routes.racers.addResultToRacer());
app.put('/racer/:id/removeResult',          auth,   routes.racers.removeResultFromRacer());
app.delete('/racer/:id',                    auth,   routes.racers.deleteRacer());

/********* racetype routes *********/
app.get('/racetype',                                routes.racetypes.getAllRacetypes());
app.post('/racetype',                       auth,   routes.racetypes.createRacetype());
app.put('/racetype',                        auth,   routes.racetypes.updateRacetype());
app.delete('/racetype/:id',                 auth,   routes.racetypes.deleteRacetype());

/********* result routes *********/
app.get('/result',                                  routes.results.getAllResults());
app.get('/result/:id',                              routes.results.getResultById());
app.post('/result',                         auth,   routes.results.createResult());
app.delete('/result/:id',                   auth,   routes.results.deleteResult());

/********* season routes *********/
app.get('/season',                                  routes.seasons.getAllSeasons());
app.post('/season',                         auth,   routes.seasons.createSeason());
app.put('/season',                          auth,   routes.seasons.updateSeason());
app.delete('/season/:id',                   auth,   routes.seasons.deleteSeason());

/********* start the server *********/
var server = app.listen(port);
console.log('NBR services is starting on port '+port);