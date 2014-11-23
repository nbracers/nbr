/**
 * Created by jeremyt on 15/09/14.
 */

var Racer =     require('../models/racer');
var Season =    require('../models/season');
var Result =    require('../models/result');
var mongoose = require('mongoose');

exports.getAllRacers = function() {

    return function (req, res) {
        var query = Racer.find();
        query.exec(function(err, results) {
            if (err) {
                res.status(400).end();
            }

            res.status(200).json(results);
        });
    };
};

exports.getRacersBySeason = function() {
    return function (req, res) {

        var id = req.params.seasonId;
        if (id == null || id == '') {
            res.status(400).end();
        }

        var query = Racer.find();
        query.where({season: id});
        query.sort('-total');
        query.exec(function(err, results) {
            if (err) {
                res.status(400).end();
            }

            res.status(200).json(results);
        });
    };
};

exports.getRacersByCompetition = function() {
    return function (req, res) {

        var competitionId = req.params.competitionId;
        if (competitionId == null || competitionId == '') {
            res.status(400).end();
        }

        var query = Racer.find();
        query.populate('results');
        query.populate('season');
        query.exec(function(err, results) {
            if (err) {
                res.status(400).end();
            }

            if(results != null && results.length > 0) {
                var cleanedResults = [];

                results.forEach(function(racer) {
                    console.log('--> racer: '+racer._id);
                    racer.results.forEach(function(result) {
                        var customRacer = {};
                        var a = mongoose.Types.ObjectId(result.competition.id).toString();
                        var b = mongoose.Types.ObjectId(competitionId).toString();

                        if(a == b) {
                            customRacer.name = racer.name;
                            customRacer.point = result.point;
                            customRacer.rank = result.rank;
                            customRacer.time = result.time;
                            cleanedResults.push(customRacer);
                        }

                    });
                });

                res.status(200).json(cleanedResults);
            }
            else {
                res.status(400).end();
            }

        });
    };
};

exports.getRacerPodiumBySeason  = function() {
    return function (req, res) {

        var id = req.params.seasonId;
        if (id == null || id == '') {
            res.status(400).end();
        }

        var query = Racer.find();
        query.where({season: id});
        query.limit(3);
        query.sort('-total');
        query.exec(function(err, results) {
            if (err) {
                res.status(400).end();
            }

            res.status(200).json(results);
        });
    };
};

exports.createRacer = function() {

    return function (req, res) {
        var name = req.body.name || '';
        var seasonId = req.body.seasonId || '';
        if (name == '' || seasonId == '') {
            res.status(400).end();
        }

        var query = Season.findOne({_id: seasonId});
        query.exec(function(err, season) {
            if (err) {
                res.status(400).end();
            }

            if (season != null) {
                var racer = new Racer();
                racer.name = name;
                racer.season = season._id;
                racer.save(function(err, racer) {
                    if (err) {
                        res.status(500).end();
                    }

                    res.status(200).json(racer);
                });


            } else {
                res.status(400).end();
            }
        });
    };
};

exports.addResultToRacer = function() {
    return function(req, res) {
        var id = req.params.id;
        if (id == null || id == '') {
            res.status(400).end();
        }

        var resultId = req.body.resultId || '';
        if (resultId == '') {
            res.status(400).end();
        }

        var query = Result.findOne({_id: resultId});
        query.exec(function(err, result) {
            if (err) {
                res.status(400).end();
            }

            if (result != null) {
                var query = Racer.findOne({_id: id});
                query.exec(function(err, racer) {
                    if (err) {
                        res.status(400).end();
                    }

                    if (racer != null) {
                        racer.results.push(result._id);
                        racer.total = racer.total + result.point;
                        racer.save(function(err, racer) {
                            if (err) {
                                res.status(500).end();
                            }

                            res.status(200).json(racer);
                        });
                    } else {
                        res.status(400).end();
                    }
                });

            } else {
                res.status(400).end();
            }
        });
    };
};

exports.removeResultFromRacer = function() {
    return function(req, res) {
        var id = req.params.id;
        if (id == null || id == '') {
            res.status(400).end();
        }

        var resultId = req.body.resultId || '';
        if (resultId == '') {
            res.status(400).end();
        }

        var query = Result.findOne({_id: resultId});
        query.exec(function(err, result) {
            if (err) {
                res.status(400).end();
            }

            if (result != null) {
                Racer.update({_id: id}, {$pull: {results: result._id}}, function(err, racer) {
                    if (err) {
                        console.log(err);
                        return res.status(500).end();
                    }
                    return res.status(200).json(racer);
                });

            } else {
                res.status(400).end();
            }
        });
    };
};

exports.updateRacer = function() {

    return function (req, res) {
        var name = req.body.name || '';
        var id = req.body._id || '';
        if (name == '' || id == '') {
            return res.status(400).end();
        }

        Racer.update({_id: id}, {name: name}, function(err) {
            if (err) {
                res.status(500).end();
            }

            console.log('--> racer ('+id+') updated');
            res.status(200).end();
        });
    };
};

exports.deleteRacer = function() {
    return function (req, res) {

        var id = req.params.id;
        if (id == null || id == '') {
            res.status(400).end();
        }

        var query = Racer.findOne({_id: id});
        query.exec(function(err, result) {
            if (err) {
                res.status(400).end();
            }

            if (result != null) {
                result.remove();
                console.log('--> racer ('+id+') deleted');
                res.status(200).end();
            }
            else {
                res.status(400).end();
            }

        });
    };
};