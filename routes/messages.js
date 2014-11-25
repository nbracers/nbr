/**
 * Created by jeremyt on 15/09/14.
 */
var Promise = require('promise');

var Message = require('../models/message');
var moment = require('moment');

exports.getAllMessages = function() {

    return function (req, res) {
        var query = Message.find();
        query.exec(function(err, members) {
            if (err) {
                res.status(400).end();
            }

            res.status(200).json(members);
        });
    };
};

exports.getLatestMessages = function() {

    return function (req, res) {
        var nu = Date.now();

        var query = Message.find();
        query.where('publish_date').lt(nu);
        query.sort('-publish_date');
        query.limit(3);
        query.exec(function(err, messages) {
            if (err) {
                res.status(400).end();
            }

            res.status(200).json(messages);
        });
    };
};

exports.createMessage = function() {

    return function (req, res) {
        var content = req.body.content || '';
        var author = req.body.author || '';
        var dob = req.body.dop || '';

        if (content == '' || author == '' || dob == '') {
            res.status(400).end();
        }

        var d = new Date(dob);

        var message = new Message();
        message.content = content;
        message.author = author;
        message.publish_date = d;
        message.save(function(err, newMessage) {
            if (err) {
                res.status(500).end();
            }

            console.log('--> message ('+newMessage._id+') created');
            res.status(200).json(newMessage);
        });
    };
};

exports.deleteMessage = function() {
    return function (req, res) {

        var id = req.params.id;
        if (id == null || id == '') {
            return res.status(400).end();
        }

        var query = Message.findOne({_id: id});
        query.exec(function(err, result) {
            if (err) {
                res.status(400).end();
            }

            if (result != null) {
                result.remove();
                console.log('--> message ('+id+') deleted');
                res.status(200).end();
            }
            else {
                res.status(400).end();
            }

        });
    };
};