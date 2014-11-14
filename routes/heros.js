/**
 * Created by jeremyt on 15/09/14.
 */
var Promise = require('promise');

var Hero = require('../models/hero');
var Season = require('../models/season');
var Competition = require('../models/competition');
var Racetype = require('../models/racetype');

exports.getAllHeros = function() {

    return function (req, res) {
        var query = Hero.find();
        query.exec(function(err, heros) {
            if (err) {
                res.status(400).end();
            }

            var expandedHerosPromise = [];

            heros.forEach(function(hero) {
                expandedHerosPromise.push(getExpandedCompetition(hero))
            });

            Promise.all(expandedHerosPromise).then(function(herosArray) {
                return res.status(200).json(herosArray);
            }).catch(function(err) {
                //something went wrong with the promises, return 400
                console.log('heros all promise error: '+err);
                return res.status(400).end();
            });
        });
    };
};

function getExpandedCompetition(hero) {
    return new Promise(function(resolve, reject) {
        var query = Hero.findOne({_id: hero._id});
        query.populate({
            path: 'season',
            model: Season
        });
        query.populate({
            path: 'competitions',
            model: Competition
        });
        query.exec(function (err, popHero) {

            if (err) {
                reject(err);
            }

            var competitionPromise = getPopulatedCompetitions(popHero);
            competitionPromise.then(function(finishedPopulatedHero) {
                resolve(finishedPopulatedHero);
            }).catch(function(err) {
                //something went wrong with the promises, return 400
                reject(err);
            });;
        });
    })
};

function getPopulatedCompetitions(popHero) {
    return new Promise(function(resolve, reject) {
            Hero.populate(popHero, {
                path: 'competitions.racetype',
                model: Racetype
            }, function(err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            })
        }
    );
};



exports.getHeroWithSeasonId = function() {
    return function (req, res) {

        var sid = req.params.seasonId;
        if (sid == null || sid == '') {
            res.status(400).end();
        }

        var query = Hero.findOne();
        query.where({season: sid});
        query.populate({
            path: 'season',
            model: Season
        });
        query.populate({
            path: 'competitions',
            model: Competition
        });
        query.exec(function (err, popHero) {

            if (err) {
                reject(err);
            }

            var competitionPromise = getPopulatedCompetitions(popHero);
            competitionPromise.then(function(finishedPopulatedHero) {
                res.status(200).json(finishedPopulatedHero);
            }).catch(function(err) {
                //something went wrong with the promises, return 400
                res.status(400).end();
            });;
        });
    };
};

exports.createHero = function() {

    return function (req, res) {
        var seasonId = req.body.seasonId || '';

        if (seasonId == '' ) {
            res.status(400).end();
        }

        var query = Season.findOne({_id: seasonId});
        query.exec(function(err, result) {
            if (err) {
                res.status(400).end();
            }

            if (result != null) {

                Hero.findOne()
                    .where({season: result._id})
                    .exec(function(err, hero) {
                        if (err) {
                            res.status(400).end();
                        }

                        if (hero == null) {
                            var hero = new Hero();
                            hero.season = result._id;
                            hero.save(function(err, newHero) {
                                if (err) {
                                    res.status(500).end();
                                }

                                console.log('--> hero ('+newHero._id+') created');
                                res.status(200).json(newHero);
                            });

                        }
                        else {
                            res.status(400).end();
                        }
                    });

            } else {
                res.status(400).end();
            }
        });
    };
};

exports.addCompetitionToHero = function() {
    return function(req, res) {
        var id = req.params.id;
        if (id == null || id == '') {
            return res.status(400).end();
        }

        var competitionId = req.body.competitionId || '';

        if (competitionId == '' ) {
            res.status(400).end();
        }

        Hero.findOne({_id: id})
            .exec(function(err, hero) {
                if (err) {
                    res.status(400).end();
                }

                if (hero != null) {

                    var query = Competition.findOne({_id: competitionId});
                    query.exec(function(err, competition) {
                        if (err) {
                            res.status(400).end();
                        }

                        if (competition != null) {

                            Hero.update({_id: hero._id}, {$addToSet: {competitions: competition}}, function(err, updatedHero) {
                                if (err) {
                                    console.log(err);
                                    return res.status(500).end();
                                }
                                return res.status(200).json(updatedHero);
                            });


                        } else {
                            res.status(400).end();
                        }
                    });

                }
                else {
                    res.status(400).end();
                }

            });
    };
};

exports.removeCompetitionFromHero = function() {
    return function(req, res) {
        var id = req.params.id;
        if (id == null || id == '') {
            return res.status(400).end();
        }

        var competitionId = req.body.competitionId || '';

        if (competitionId == '' ) {
            res.status(400).end();
        }

        Hero.findOne({_id: id})
            .exec(function(err, hero) {
                if (err) {
                    res.status(400).end();
                }

                if (hero != null) {

                    var query = Competition.findOne({_id: competitionId});
                    query.exec(function(err, competition) {
                        if (err) {
                            res.status(400).end();
                        }

                        if (competition != null) {

                            Hero.update({_id: hero._id}, {$pull: {competitions: competition}}, function(err, updatedHero) {
                                if (err) {
                                    console.log(err);
                                    return res.status(500).end();
                                }

                                return res.status(200).json(updatedHero);
                            });


                        } else {
                            res.status(400).end();
                        }
                    });

                }
                else {
                    res.status(400).end();
                }

            });
    };
};

exports.deleteHero = function() {
    return function (req, res) {

        var id = req.params.id;
        if (id == null || id == '') {
            return res.status(400).end();
        }

        var query = Hero.findOne({_id: id});
        query.exec(function(err, result) {
            if (err) {
                res.status(400).end();
            }

            if (result != null) {
                result.remove();
                console.log('--> hero ('+id+') deleted');
                res.status(200).end();
            }
            else {
                res.status(400).end();
            }

        });
    };
};