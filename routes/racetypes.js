/**
 * Created by jeremyt on 15/09/14.
 */

var Racetype = require('../models/racetype');

exports.getAllRacetypes = function() {

    return function (req, res) {
        var query = Racetype.find();
        query.exec(function(err, results) {
            if (err) {
                res.status(400).end();
            }

            res.status(200).json(results);
        });
    };
};

exports.createRacetype = function() {

    return function (req, res) {
        var label = (req.body.label || '').toUpperCase();
        if (label == '' ) {
            res.status(400).end();
        }

        var query = Racetype.findOne({label: label});
        query.exec(function(err, result) {
            if (err) {
                res.status(400).end();
            }

            if (result == null) {
                var racetype = new Racetype();
                racetype.label = label;
                racetype.save(function(err, result) {
                    if (err) {
                        res.status(500).end();
                    }

                    console.log('--> racetype ('+result.label+') created');
                    res.status(200).json(result);
                });


            } else {
                res.status(400).end();
            }
        });
    };
};

exports.updateRacetype = function() {

    return function (req, res) {
        var label = (req.body.label || '').toUpperCase();
        var id = req.body._id || '';
        if (label == '' || id == '') {
            return res.status(400).end();
        }

        Racetype.update({_id: id}, {label: label}, function(err) {
            if (err) {
                res.status(500).end();
            }

            console.log('--> racetype ('+id+') updated');
            res.status(200).end();
        });
    };
};

exports.deleteRacetype = function() {
    return function (req, res) {

        var id = req.params.id;
        if (id == null || id == '') {
            res.status(400).end();
        }

        var query = Racetype.findOne({_id: id});
        query.exec(function(err, result) {
            if (err) {
                res.status(400).end();
            }

            if (result != null) {
                result.remove();
                console.log('--> racetype ('+id+') deleted');
                res.status(200).end();
            }
            else {
                res.status(400).end();
            }

        });
    };
};