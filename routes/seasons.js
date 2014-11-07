/**
 * Created by jeremyt on 15/09/14.
 */

var Season = require('../models/season');

exports.getAllSeasons = function() {

    return function (req, res) {
        var query = Season.find();
        query.exec(function(err, results) {
            if (err) {
                res.status(400).end();
            }

            res.status(200).json(results);
        });
    };
};

exports.createSeason = function() {

    return function (req, res) {
        var label = (req.body.label || '').toUpperCase();
        var year = req.body.year || '';
        if (label == '' || year == '') {
            res.status(400).end();
        }

        var query = Season.findOne({start_year: year});
        query.exec(function(err, result) {
            if (err) {
                res.status(400).end();
            }

            if (result == null) {
                var season = new Season();
                season.label = label;
                season.start_year = year;
                season.save(function(err, result) {
                    if (err) {
                        res.status(500).end();
                    }

                    console.log('--> season ('+result.label+') created');
                    res.status(200).json(result);
                });


            } else {
                res.status(400).end();
            }
        });
    };
};

exports.updateSeason = function() {

    return function (req, res) {
        var label = (req.body.label || '').toUpperCase();
        var year = req.body.year || '';

        var id = req.body._id || '';
        if ((label == '' && year == '') || id == '') {
            return res.status(400).end();
        }

        var query = Season.findOne({_id: id});
        query.exec(function(err, result) {
            if (err) {
                res.status(400).end();
            }

            if (result != null) {

                if(label != '') {
                    result.label = label;
                }

                if(year != '') {
                    result.start_year = year;
                }

                result.save(function(err, result) {
                    if (err) {
                        res.status(500).end();
                    }

                    console.log('--> season ('+result._id+') updated');
                    res.status(200).json(result);
                });
            } else {
                res.status(400).end();
            }
        });
    };
};

exports.deleteSeason = function() {
    return function (req, res) {

        var id = req.params.id;
        if (id == null || id == '') {
            res.status(400).end();
        }

        var query = Season.findOne({_id: id});
        query.exec(function(err, result) {
            if (err) {
                res.status(400).end();
            }

            if (result != null) {
                result.remove();
                console.log('--> season ('+id+') deleted');
                res.status(200).end();
            }
            else {
                res.status(400).end();
            }

        });
    };
};