/**
 * Created by jeremyt on 15/09/14.
 */
var Promise = require('promise');

var Result =        require('../models/result');
var Competition =   require('../models/competition');
var Racetype =      require('../models/racetype');
var moment =        require('moment');

exports.getAllResults = function() {

    return function (req, res) {
        var query = Result.find();
        query.populate({
            path: 'competition',
            model: Competition
        });
        query.exec(function(err, results) {
            if (err) {
                res.status(400).end();
            }

            var expandedResultsPromise = [];

            results.forEach(function(result) {
                expandedResultsPromise.push(getExpandedResult(result));
               // must "lean" the mongoose doc to make it stringify the new property
               // expandedResultsPromise.push(addTotalRankedToResult(result));
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

function getExpandedResult(result) {
    return new Promise(function(resolve, reject) {
        var query = Competition.findOne({_id: result.competition._id});
        query.populate({
            path: 'racetype',
            model: Racetype
        });
        query.exec(function (err, comp) {
            if (err) {
                reject(err);
            }
            else {
                result.competition = comp;
                resolve(result);
            }

        })
    })
}

function addTotalRankedToResult(result) {
    return new Promise(function(resolve, reject) {
        result.totalRanked(function(err, totalRanked){
            if(err){
                reject(err);
            }
            else{

                result.ranked =  totalRanked;
                console.log("--> result.ranked: " + result.ranked);
                resolve(result);    
            };
            
        });
    })
}

exports.getResultById = function() {
    return function (req, res) {

        var id = req.params.id;
        if (id == null || id == '') {
            res.status(400).end();
        }

        var query = Result.findOne({_id: id});
        query.populate({
            path: 'competition',
            model: Competition
        });
        query.exec(function(err, result) {
            if (err) {
                res.status(400).end();
            }

               getExpandedResult(result)
                .then(addTotalRankedToResult(result))
                .then(function(expandedResult) {
                    // make it an object to stringify the new property
                    r = expandedResult.toObject();
                    r.ranked = expandedResult.ranked;
                    res.status(200).json(r);
                })
                .catch(function(err) {
                    res.status(400).end();
                });

        });
    };
};

exports.createResult = function() {

    return function (req, res) {
        var competitionId = req.body.competitionId || '';
        var point = req.body.point || '';
        var rank = req.body.rank || '';
        var hour = req.body.hour || '';
        var minute = req.body.minute || '';
        var second = req.body.second || '';
        if (competitionId == '' || point == '' || hour == '' || minute == '' || second == '' || rank == '') {
            res.status(400).end();
        }

        /*

         {
             "competitionId" : "54652351f1f12a49e570df57",
             "point": "1030",
             "rank": "2",
             "hour":	"0",
             "minute":"44",
             "second":"05"
         }


         */

        var m = moment.duration({seconds: second, minutes: minute, hours: hour});
        console.log(m.humanize()+' - in ms: '+m.asMilliseconds());

        var query = Competition.findOne({_id: competitionId});
        query.exec(function(err, comp) {
            if (err) {
                res.status(400).end();
            }

            if (comp != null) {
                var result = new Result();
                result.competition = comp;
                result.point = point;
                result.rank = rank;
                result.time = m.asMilliseconds();
                result.save(function(err, newComp) {
                    if (err) {
                        res.status(500).end();
                    }

                    console.log('--> result ('+newComp._id+') created');
                    res.status(200).json(newComp);
                });


            } else {
                res.status(400).end();
            }
        });
    };
};


exports.deleteResult = function() {
    return function (req, res) {

        var id = req.params.id;
        if (id == null || id == '') {
            res.status(400).end();
        }

        var query = Result.findOne({_id: id});
        query.exec(function(err, result) {
            if (err) {
                res.status(400).end();
            }

            if (result != null) {
                result.remove();
                console.log('--> result ('+id+') deleted');
                res.status(200).end();
            }
            else {
                res.status(400).end();
            }

        });
    };
};