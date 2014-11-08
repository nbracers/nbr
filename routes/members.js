/**
 * Created by jeremyt on 15/09/14.
 */
var Promise = require('promise');

var Member = require('../models/member');
var Season = require('../models/season');
var Competition = require('../models/competition');
var Racetype = require('../models/racetype');
var Racer =     require('../models/racer');

exports.getAllMembers = function() {

    return function (req, res) {
        var query = Member.find();
        query.exec(function(err, members) {
            if (err) {
                res.status(400).end();
            }

            res.status(200).json(members);
        });
    };
};

exports.createMember = function() {

    return function (req, res) {
        var email = req.body.email || '';
        var firstname = (req.body.firstname || '').toLowerCase();
        var lastname = (req.body.lastname || '').toLowerCase();
        var dob = req.body.dob || '';

        if (email == '' || firstname == '' || lastname == '' || dob == '') {
            res.status(400).end();
        }

        var d = new Date(dob);

        var member = new Member();
        member.email = email;
        member.firstname = firstname;
        member.lastname = lastname;
        member.dob = d;
        member.save(function(err, newMember) {
            if (err) {
                res.status(500).end();
            }

            console.log('--> member ('+newMember._id+') created');
            res.status(200).json(newMember);
        });
    };
};

exports.updateMember = function() {

    return function (req, res) {
        var email = req.body.email || '';
        var firstname = (req.body.firstname || '').toLowerCase();
        var lastname = (req.body.lastname || '').toLowerCase();
        var dob = req.body.dob || '';

        var id = req.body._id || '';
        if (name == '' || id == '') {
            return res.status(400).end();
        }

        var query = Member.findOne({_id: id});
        query.exec(function(err, member) {
            if (err) {
                res.status(400).end();
            }

            if(email != '') {
                member.email = email;
            }

            if(firstname != '') {
                member.firstname = firstname;
            }

            if(lastname != '') {
                member.lastname = lastname;
            }

            if(dob != '') {
                var d = new Date(dob);
                member.dob = d;
            }

            member.save(function (err, newMember) {
                if (err) {
                    res.status(500).end();
                }

                console.log('--> hero (' + newMember._id + ') updated');
                res.status(200).json(newMember);
            });
        });

    };
};

exports.addRacerToMember = function() {
    return function(req, res) {
        var id = req.params.id;
        if (id == null || id == '') {
            return res.status(400).end();
        }

        var racerId = req.body.racerId || '';

        if (racerId == '' ) {
            res.status(400).end();
        }

        Member.findOne({_id: id})
            .exec(function(err, member) {
                if (err) {
                    res.status(400).end();
                }

                if (member != null) {

                    var query = Racer.findOne({_id: racerId});
                    query.exec(function(err, racer) {
                        if (err) {
                            res.status(400).end();
                        }

                        if (racer != null) {

                            Member.update({_id: member._id}, {$addToSet: {racer: racer}}, function(err, updatedMember) {
                                if (err) {
                                    console.log(err);
                                    return res.status(500).end();
                                }
                                return res.status(200).json(updatedMember);
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

exports.removeRacerFromMember = function() {
    return function(req, res) {
        var id = req.params.id;
        if (id == null || id == '') {
            return res.status(400).end();
        }

        var racerId = req.body.racerId || '';

        if (racerId == '' ) {
            res.status(400).end();
        }

        Member.findOne({_id: id})
            .exec(function(err, member) {
                if (err) {
                    res.status(400).end();
                }

                if (member != null) {

                    var query = Racer.findOne({_id: racerId});
                    query.exec(function(err, racer) {
                        if (err) {
                            res.status(400).end();
                        }

                        if (racer != null) {

                            Member.update({_id: member._id}, {$pull: {racer: racer}}, function(err, updatedMember) {
                                if (err) {
                                    console.log(err);
                                    return res.status(500).end();
                                }
                                return res.status(200).json(updatedMember);
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

exports.deleteMember = function() {
    return function (req, res) {

        var id = req.params.id;
        if (id == null || id == '') {
            return res.status(400).end();
        }

        var query = Member.findOne({_id: id});
        query.exec(function(err, result) {
            if (err) {
                res.status(400).end();
            }

            if (result != null) {
                result.remove();
                console.log('--> member ('+id+') deleted');
                res.status(200).end();
            }
            else {
                res.status(400).end();
            }

        });
    };
};