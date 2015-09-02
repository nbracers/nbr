/**
 * Created by jeremyt on 15/09/14.
 */
var Promise = require('promise');

var Competition = require('../models/competition');
var Racetype = require('../models/racetype');
var Season = require('../models/season');
var Racer =     require('../models/racer');
var mongoose = require('mongoose');

exports.getAllCompetitions = function() {

    return function (req, res) {
        var query = Competition.find();
        query.populate({
            path: 'racetype',
            model: Racetype
        });
        query.populate({
            path: 'season',
            model: Season
        });
        query.exec(function(err, results) {
            if (err) {
                res.status(400).end();
            }

            res.status(200).json(results);
        });
    };
};

exports.getCompetitionsWithSeasonId = function() {
    return function (req, res) {

        var sid = req.params.seasonId;
        if (sid == null || sid == '') {
            res.status(400).end();
        }

        var query = Competition.find();
        query.where({season: sid});
        query.populate({
            path: 'season',
            model: Season
        });
        query.populate({
            path: 'racetype',
            model: Racetype
        });
        query.exec(function (err, popCompetitions) {

            if (err) {
                reject(err);
            }

            res.status(200).json(popCompetitions);
        });
    };
};

exports.getFullCompetitionsWithSeasonId = function() {
    return function (req, res) {

        var sid = req.params.seasonId;
        if (sid == null || sid == '') {
            res.status(400).end();
        }

        var query = Competition.find();
        query.where({season: sid});
        query.populate({
            path: 'season',
            model: Season
        });
        query.populate({
            path: 'racetype',
            model: Racetype
        });
        query.exec(function (err, popCompetitions) {

            if (err) {
                reject(err);
            }

            var expandedResultsPromise = [];

            popCompetitions.forEach(function(competition) {
                expandedResultsPromise.push(populateRacerResults(competition));
            });

            Promise.all(expandedResultsPromise).then(function(resultsArray) {
                return res.status(200).json(resultsArray);
            }).catch(function(err) {
                //something went wrong with the promises, return 400
                return res.status(400).end();
            });
        });
    };





};

function populateRacerResults (competition) {

    return new Promise(function(resolve, reject) {
        var query = Racer.find().where({season: competition.season._id});
        query.populate('results');
        //query.populate('season');
        query.exec(function(err, results) {
            if (err) {
                reject(err);
            }

            //if(results != null && results.length > 0) {
                competition.racers = [];

                results.forEach(function(racer) {
                    console.log('--> racer: '+racer._id);
                    racer.results.forEach(function(result) {
                        var customRacer = {};
                        var a = mongoose.Types.ObjectId(result.competition.id).toString();
                        var b = mongoose.Types.ObjectId(competition.id).toString();

                        if(a == b) {
                            customRacer.name = racer.name;
                            customRacer.point = result.point;
                            customRacer.rank = result.rank;
                            customRacer.time = result.time;
                            console.log('--> pusking racer: '+racer._id);
                            competition.racers.push(customRacer);
                        }

                    });
                });

                resolve(competition);
            /*}
            else {
                reject();
            }*/

        })
    })
};


exports.createCompetition = function() {

    return function (req, res) {
        var description = req.body.description || '';
        var racetypeId = req.body.racetypeId || '';
        var seasonId = req.body.seasonId || '';
        var dato = req.body.dato || '';         //ex: "December 1, 2014 20:00:00"

        if (description == '' || racetypeId == '' || dato == '' || seasonId == '') {
            res.status(400).end();
        }

        var racequery = Racetype.findOne({_id: racetypeId});
        racequery.exec(function(err, raceresult) {
            if (err) {
                res.status(400).end();
            }

            if (raceresult != null) {

                var seasonquery = Season.findOne({_id: seasonId});
                seasonquery.exec(function(err, seasonresult) {
                    if (err) {
                        res.status(400).end();
                    }

                    if (seasonresult != null) {

                        var d = new Date(dato);
                        Competition.findOne()
                            .where({competition_date: d})
                            .where({racetype: raceresult._id})
                            .where({season: seasonresult._id})
                            .exec(function(err, comp) {
                                if (err) {
                                    res.status(400).end();
                                }

                                if (comp == null) {
                                    var competition = new Competition();
                                    competition.racetype = raceresult._id;
                                    competition.season = seasonresult._id;
                                    competition.competition_date = d;
                                    competition.description = description;
                                    competition.save(function(err, newComp) {
                                        if (err) {
                                            res.status(500).end();
                                        }

                                        console.log('--> competition ('+newComp._id+') created');
                                        res.status(200).json(newComp);
                                    });

                                }
                                else {
                                    res.status(400).end();
                                }
                            });
                    }
                });








            } else {
                res.status(400).end();
            }
        });
    };
};

exports.deleteCompetition = function() {
    return function (req, res) {

        var id = req.params.id;
        if (id == null || id == '') {
            res.status(400).end();
        }

        var query = Competition.findOne({_id: id});
        query.exec(function(err, result) {
            if (err) {
                res.status(400).end();
            }

            if (result != null) {
                result.remove();
                console.log('--> competition ('+id+') deleted');
                res.status(200).end();
            }
            else {
                res.status(400).end();
            }

        });
    };
};