/**
 * Created by jeremyt on 15/09/14.
 */

var Competition = require('../models/competition');
var Racetype = require('../models/racetype');

exports.getAllCompetitions = function() {

    return function (req, res) {
        var query = Competition.find();
        query.populate({
            path: 'racetype',
            model: Racetype
        });
        query.exec(function(err, results) {
            if (err) {
                res.status(400).end();
            }

            res.status(200).json(results);
        });
    };
};

exports.createCompetition = function() {

    return function (req, res) {
        var description = req.body.description || '';
        var racetypeId = req.body.racetypeId || '';
        var dato = req.body.dato || '';         //ex: "December 1, 2014 20:00:00"

        if (description == '' || racetypeId == '' || dato == '') {
            res.status(400).end();
        }

        var query = Racetype.findOne({_id: racetypeId});
        query.exec(function(err, result) {
            if (err) {
                res.status(400).end();
            }

            if (result != null) {

                var d = new Date(dato);
                Competition.findOne()
                    .where({competition_date: d})
                    .where({racetype: result._id})
                    .exec(function(err, comp) {
                        if (err) {
                            res.status(400).end();
                        }

                        if (comp == null) {
                            var competition = new Competition();
                            competition.racetype = result._id;
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
            return res.status(400).end();
        }

        var query = Competition.findOne({_id: id});
        query.exec(function(err, result) {
            if (err) {
                return res.status(400).end();
            }

            if (result != null) {
                result.remove();
                console.log('--> competition ('+id+') deleted');
                return res.status(200).end();
            }
            else {
                return res.status(400).end();
            }

        });
    };
};